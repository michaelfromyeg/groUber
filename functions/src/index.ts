import * as functions from 'firebase-functions';
import { Event } from '../../src/_types/event'
import { People } from '../../src/_types/people'
import haversine from 'haversine';

// import { PriorityQueue, Node } from './PriorityQueue'
import PriorityQueue from 'priorityqueue';



// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const solve = functions.https.onRequest((request: any, response: any) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.json(solveCarpoolProblem(request.body.event));
});

/** 
 * Solves the carpool problem. Given an event (containing a list of people)
 * return a hashmap where the key is a driver id, and the value is a list of
 * passsenger ids that driver can drive
 * 
 * @param  {Event} event
 * @returns Map<string, Array<string>>
 */
function solveCarpoolProblem(event: Event): Map<string, Array<string>> {
  const people = event.people;
  let remainingDrivers = getDrivers(people);
  let remainingPassengers = getPassengers(people);

  const solution = new Map<string, Array<string>>();

  while (!isDone(remainingDrivers, remainingPassengers)) {
    // const distances = calculatePassengerDistances(remainingDrivers, remainingPassengers);

    const closestDriverToPassengers = new Map<string, [string, number]>();

    for(let passenger of remainingPassengers) {
      let minDriverDistance = Infinity;
      let minDriverId = "";
      for(let driver of remainingDrivers) {
        const distance = haversine({
          latitude: driver.location.latlng.lat,
          longitude: driver.location.latlng.lng,
        }, {
          latitude: passenger.location.latlng.lat,
          longitude: passenger.location.latlng.lng,
        }, {unit: 'meter'})

        if(distance < minDriverDistance) {
          minDriverDistance = distance;
          minDriverId = driver.id;
        }
      }

      closestDriverToPassengers.set(passenger.id, [minDriverId, minDriverDistance]);
    }

    const numericCompare = (a:number, b:number) => (a > b ? 1 : a < b ? -1 : 0);

    const comparator = (a: any, b: any) => {
      return numericCompare(a.minDriverDistance, b.minDriverDistance);
    };

    let pq = new PriorityQueue({comparator});

    for(let passenger of remainingPassengers) {
      const array = closestDriverToPassengers.get(passenger.id);
      if (!array) continue;
      const [minDriverId, minDriverDistance] = array;
      
      let node = {
        passengerId: passenger.id,
        minDriverId,
        minDriverDistance,
      }

      pq.enqueue(node);
    }

    const nextPassengerNode: any = pq.dequeue();
    if(!nextPassengerNode) continue;
    const nextPassenger = getPersonById(people, nextPassengerNode.value.passengerId)
    const minDriver = getPersonById(people, nextPassengerNode.value.minDriverId);

    if(!nextPassenger || !minDriver) continue;

    minDriver.location.latlng = {
      lat: nextPassenger?.location.latlng.lat,
      lng: nextPassenger?.location.latlng.lng
    }

    const passengerIds: string[] = solution.get(minDriver.id) || [];
    passengerIds.push(nextPassenger.id)
    solution.set(minDriver.id, passengerIds);

    minDriver.seats--;
    if(minDriver.seats === 0) {
      remainingDrivers = removePerson(remainingDrivers, minDriver.id);
    }
    remainingPassengers = removePerson(remainingPassengers, nextPassenger.id);
    // TODO add to database for visualization of this algorithm

    // no more remaining passengers but still have drivers
    if(remainingPassengers.length===0) {
      let driverToBeConverted = getSomeoneDrivingNoOne(remainingDrivers, solution);
      if (driverToBeConverted) {
        // exists
        remainingPassengers.push(driverToBeConverted);
        removePerson(remainingDrivers, driverToBeConverted.id)
      } else {
        break;
      }
    }
  }

  return solution;
}

function getSomeoneDrivingNoOne(drivers: People[], solution: Map<string, Array<string>>): People | undefined {
  for(let driver of drivers) {
    if(solution.has(driver.id)) {
      return driver;
    }
  }
  return undefined;
}

function removePerson(people : People[], id: string) : People[] {
  for(let i=0; i<people.length; i++) {
    let driver = people[i];
    if (driver.id === id) {
      people.splice(i, 1);
    }
  }
  return people;
}

function getPersonById(people:People[], id:string): People | undefined {
  for(const person of people) {
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
function isDone(drivers: People[], passengers: People[]) : boolean {
  return drivers.length === 0 || passengers.length === 0;
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
  })
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
  })
}

