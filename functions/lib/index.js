"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.solve = void 0;
const functions = __importStar(require("firebase-functions"));
const haversine_1 = __importDefault(require("haversine"));
// import { PriorityQueue, Node } from './PriorityQueue'
const priorityqueue_1 = __importDefault(require("priorityqueue"));
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
exports.solve = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
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
function solveCarpoolProblem(event) {
    const people = event.people;
    let remainingDrivers = getDrivers(people);
    let remainingPassengers = getPassengers(people);
    const solution = new Map();
    while (!isDone(remainingDrivers, remainingPassengers)) {
        // const distances = calculatePassengerDistances(remainingDrivers, remainingPassengers);
        const closestDriverToPassengers = new Map();
        for (let passenger of remainingPassengers) {
            let minDriverDistance = Infinity;
            let minDriverId = "";
            for (let driver of remainingDrivers) {
                const distance = haversine_1.default({
                    latitude: driver.location.latlng.lat,
                    longitude: driver.location.latlng.lng,
                }, {
                    latitude: passenger.location.latlng.lat,
                    longitude: passenger.location.latlng.lng,
                }, { unit: 'meter' });
                if (distance < minDriverDistance) {
                    minDriverDistance = distance;
                    minDriverId = driver.id;
                }
            }
            closestDriverToPassengers.set(passenger.id, [minDriverId, minDriverDistance]);
        }
        const numericCompare = (a, b) => (a > b ? 1 : a < b ? -1 : 0);
        const comparator = (a, b) => {
            return numericCompare(a.minDriverDistance, b.minDriverDistance);
        };
        let pq = new priorityqueue_1.default({ comparator });
        for (let passenger of remainingPassengers) {
            const array = closestDriverToPassengers.get(passenger.id);
            if (!array)
                continue;
            const [minDriverId, minDriverDistance] = array;
            let node = {
                passengerId: passenger.id,
                minDriverId,
                minDriverDistance,
            };
            pq.enqueue(node);
        }
        const nextPassengerNode = pq.dequeue();
        if (!nextPassengerNode)
            continue;
        const nextPassenger = getPersonById(people, nextPassengerNode.value.passengerId);
        const minDriver = getPersonById(people, nextPassengerNode.value.minDriverId);
        if (!nextPassenger || !minDriver)
            continue;
        minDriver.location.latlng = {
            lat: nextPassenger === null || nextPassenger === void 0 ? void 0 : nextPassenger.location.latlng.lat,
            lng: nextPassenger === null || nextPassenger === void 0 ? void 0 : nextPassenger.location.latlng.lng
        };
        const passengerIds = solution.get(minDriver.id) || [];
        passengerIds.push(nextPassenger.id);
        solution.set(minDriver.id, passengerIds);
        minDriver.seats--;
        if (minDriver.seats === 0) {
            remainingDrivers = removePerson(remainingDrivers, minDriver.id);
        }
        remainingPassengers = removePerson(remainingPassengers, nextPassenger.id);
        // TODO add to database for visualization of this algorithm
        // no more remaining passengers but still have drivers
        if (remainingPassengers.length === 0) {
            let driverToBeConverted = getSomeoneDrivingNoOne(remainingDrivers, solution);
            if (driverToBeConverted) {
                // exists
                remainingPassengers.push(driverToBeConverted);
                removePerson(remainingDrivers, driverToBeConverted.id);
            }
            else {
                break;
            }
        }
    }
    return solution;
}
function getSomeoneDrivingNoOne(drivers, solution) {
    for (let driver of drivers) {
        if (solution.has(driver.id)) {
            return driver;
        }
    }
    return undefined;
}
function removePerson(people, id) {
    for (let i = 0; i < people.length; i++) {
        let driver = people[i];
        if (driver.id === id) {
            people.splice(i, 1);
        }
    }
    return people;
}
function getPersonById(people, id) {
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
function isDone(drivers, passengers) {
    return drivers.length === 0 || passengers.length === 0;
}
/**
 * Return all drivers from a list of people
 *
 * @param  {People[]} people
 * @returns People[]
 */
function getDrivers(people) {
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
function getPassengers(people) {
    return people.filter((person) => {
        return !person.canDrive;
    });
}
//# sourceMappingURL=index.js.map