import * as functions from 'firebase-functions';
import { Event } from '../../src/_types/event';
import { People } from '../../src/_types/people';

import { DistanceMatrix } from './DistanceMatrix';
import * as firebase from 'firebase';
import * as admin from 'firebase-admin';
import PriorityQueue from 'priorityqueue';
import 'firebase/firestore';
import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors')();

const firebaseConfig = {
    apiKey: 'AIzaSyDvCT-243TWt9Dwb9ChTOgfkFMUhIjTlRc',
    authDomain: 'find-my-carpool.firebaseapp.com',
    databaseURL: 'https://find-my-carpool.firebaseio.com',
    projectId: 'find-my-carpool',
    storageBucket: 'find-my-carpool.appspot.com',
    messagingSenderId: '470237283855',
    appId: '1:470237283855:web:d3aa289ca316787e4a457a',
    measurementId: 'G-YSVSBWXT23',
};
firebase.initializeApp(firebaseConfig);

admin.initializeApp(firebaseConfig);

export const directions = functions.https.onRequest(async (request: any, response: any) => {
    cors(request, response, async () => {
        response.set('Access-Control-Allow-Origin', '*');
        const key = functions.config().directions.key;
        if (request.method !== 'POST') {
            response.status(405).json({ message: 'Method Not Allowed.' });
            return;
        } else if (!request.get('Access-Token')) {
            response.status(401).json({ message: 'Unauthorized.' });
            return;
        } else if (!key) {
            response.status(403).json({ message: 'Service Unavailable' });
            return;
        } else {
            try {
                const verify = await admin.auth().verifyIdToken(request.get('Access-Token'));
                if (!verify.uid) {
                    response.status(403).json({ message: 'Service Unavailable' });
                    return;
                } else {
                    console.log(request.body);
                    const axiosResult = await axios({
                        method: 'GET',
                        url: `https://maps.googleapis.com/maps/api/directions/json?destination=${request.body.destination}&key=${key}&origin=${request.body.origin}`,
                    });
                    response.json(axiosResult.data);
                    return;
                }
            } catch (err) {
                response.status(401).json({ message: err.message });
                return;
            }
        }
    });
});

export const solve = functions.https.onRequest(async (request: any, response: any) => {
    response.set('Access-Control-Allow-Origin', '*');
    functions.logger.info('Hello logs!', { structuredData: true });

    // grab event first
    const result = await firebase.firestore().collection('events').doc(request.query.eventId).get();

    const event = result.data();

    if (!event) {
        response.json('error couldnt find event');
        return;
    }

    const people = await Promise.all(
        event.people.map(async (person: firebase.firestore.DocumentReference) => {
            const personRef = await person.get();
            return {
                id: person.id,
                ...personRef.data(),
            };
        }),
    );

    event.people = people;

    response.json(await solveCarpoolProblem(event as Event));
});

/**
 * Solves the carpool problem. Given an event (containing a list of people)
 * return a hashmap where the key is a driver id, and the value is a list of
 * passsenger ids that driver can drive
 *
 * @param  {Event} event
 * @returns Map<string, Array<string>>
 */
async function solveCarpoolProblem(event: Event): Promise<Map<string, Array<string>>> {
    const people = event.people;
    let remainingDrivers = getDrivers(people as People[]);
    let remainingPassengers = getPassengers(people as People[]);
    const distanceMatrix: DistanceMatrix = new DistanceMatrix(people as People[]);
    await distanceMatrix.init();

    const solution = new Map<string, Array<string>>();

    while (!isDone(remainingDrivers, remainingPassengers)) {
        if (remainingPassengers.length > 0 && remainingDrivers.length === 0) break;
        // const distances = calculatePassengerDistances(remainingDrivers, remainingPassengers);

        if (remainingPassengers.length > 0) {
            const closestDriverToPassengers = new Map<string, [string, number]>();

            for (const passenger of remainingPassengers) {
                let minDriverDistance = Infinity;
                let minDriverId = '';
                for (const driver of remainingDrivers) {
                    //   // calc distance between driver and passenger
                    //   console.log("this shit ran")
                    //   console.log(distanceMatrix.data.keys, distanceMatrix.data.values)

                    //   console.log("this is the key were trying to get", {
                    //     latitude: driver.location.latlng.lat,
                    //     longitude: driver.location.latlng.lng
                    // })

                    const distanceMap = distanceMatrix.data.get({
                        latitude: driver.location.latlng.lat,
                        longitude: driver.location.latlng.lng,
                    });

                    const distance = distanceMap.get({
                        latitude: passenger.location.latlng.lat,
                        longitude: passenger.location.latlng.lng,
                    });

                    console.log(distance, ' from ', passenger.name, driver.name);

                    // const distance = haversine({
                    //   latitude: driver.location.latlng.lat,
                    //   longitude: driver.location.latlng.lng,
                    // }, {
                    //   latitude: passenger.location.latlng.lat,
                    //   longitude: passenger.location.latlng.lng,
                    // }, {unit: 'meter'})

                    if (distance < minDriverDistance) {
                        minDriverDistance = distance;
                        minDriverId = driver.id;
                    }
                }

                closestDriverToPassengers.set(passenger.id, [minDriverId, minDriverDistance]);
            }

            const numericCompare = (a: number, b: number) => (a < b ? 1 : a > b ? -1 : 0);

            const comparator = (a: any, b: any) => {
                return numericCompare(a.minDriverDistance, b.minDriverDistance);
            };

            const pq = new PriorityQueue({ comparator });

            for (const passenger of remainingPassengers) {
                const array = closestDriverToPassengers.get(passenger.id);
                if (!array) continue;
                const [minDriverId, minDriverDistance] = array;

                const node = {
                    passengerId: passenger.id,
                    minDriverId,
                    minDriverDistance,
                };

                pq.enqueue(node);
            }

            const nextPassengerNode: any = pq.dequeue();
            if (!nextPassengerNode) continue;
            const nextPassenger = getPersonById(people as People[], nextPassengerNode.passengerId);
            const minDriver = getPersonById(people as People[], nextPassengerNode.minDriverId);

            if (!nextPassenger || !minDriver) continue;

            minDriver.location.latlng = {
                lat: nextPassenger?.location.latlng.lat,
                lng: nextPassenger?.location.latlng.lng,
            };

            const passengerIds: string[] = solution.get(minDriver.id) || [];
            passengerIds.push(nextPassenger.id);
            solution.set(minDriver.id, passengerIds);

            minDriver.seats--;
            if (minDriver.seats === 0) {
                remainingDrivers = removePerson(remainingDrivers, minDriver.id);
            }
            remainingPassengers = removePerson(remainingPassengers, nextPassenger.id);
            // TODO add to database for visualization of this algorithm
        }
        // no more remaining passengers but still have drivers
        if (remainingDrivers.length === 1 && remainingPassengers.length === 0) {
            if (!solution.has(remainingDrivers[0].id)) solution.set(remainingDrivers[0].id, []);
            remainingDrivers = removePerson(remainingDrivers, remainingDrivers[0].id);
        }

        if (remainingPassengers.length === 0) {
            const driverToBeConverted = getSomeoneDrivingNoOne(remainingDrivers, solution);
            if (driverToBeConverted) {
                // exists
                remainingPassengers.push(driverToBeConverted);
                removePerson(remainingDrivers, driverToBeConverted.id);
            } else {
                break;
            }
        }
    }
    return strMapToObj(solution);
}

function strMapToObj(strMap: any): any {
    const obj = Object.create(null);
    for (const [k, v] of strMap) {
        // We don’t escape the key '__proto__'
        // which can cause problems on older engines
        obj[k] = v;
    }
    return obj;
}

function getSomeoneDrivingNoOne(drivers: People[], solution: Map<string, Array<string>>): People | undefined {
    for (const driver of drivers) {
        if (!solution.has(driver.id)) {
            return driver;
        }
    }
    return undefined;
}

function removePerson(people: People[], id: string): People[] {
    for (let i = 0; i < people.length; i++) {
        const driver = people[i];
        if (driver.id === id) {
            people.splice(i, 1);
        }
    }
    return people;
}

function getPersonById(people: People[], id: string): People | undefined {
    for (const person of people) {
        if (person.id === id) {
            return person;
        }
    }
    return undefined;
}

/**
 * returns whether the solution contains all the people in an event
 *
 * @param  {People} people
 * @param  { Map<string, Array<string>>} solution
 * @returns boolean
 */
function isDone(drivers: People[], passengers: People[]): boolean {
    return drivers.length === 0 && passengers.length === 0;
}

/**
 * Return all drivers from a list of people
 *
 * @param  {People[]} people
 * @returns People[]
 */
function getDrivers(people: People[]): People[] {
    return people.filter((person) => {
        return person.canDrive;
    });
}

/**
 * Return all passengers from a list of people
 *
 * @param  {People[]} people
 * @returns People[]
 */
function getPassengers(people: People[]): People[] {
    return people.filter((person) => {
        return !person.canDrive;
    });
}

// export const getEncoding = functions.https.onRequest(async (request: any, response: any) => {
//     const { route } = request.body
//     await Axios.get(
//         `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&${waypoint}&key=${key}`,
//     );
//     const origin = route[0];
//     const destination = route[route.length - 1];
//             if (route.length > 3) {
//                 let waypoint = 'waypoints=';
//                 // , === %2C
//                 // | seperate locations
//                 for (let i = 1; i < route.length - 1; i++) {
//                     if (i == route.length - 2) {
//                         waypoint = waypoint + route[i].lat + '%2C' + route[i].lat;
//                     } else {
//                         waypoint = waypoint + route[i].lat + '%2C' + route[i].lat + '|';
//                     }
//                 }

//                 const response = await axios.get(
//                     `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&${waypoint}&key=${key}`,
//                 );
//                 // console.log(response);
//             } else {
//                 // const response = await axios.get(
//                 //     `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${key}`,
//                 // );
//                 // console.log(response);
//             }
// }
