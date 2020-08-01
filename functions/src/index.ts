import * as functions from 'firebase-functions';
import {Event} from '../../src/_types/event';
import { People } from '../../src/_types/people';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request: any, response: any) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
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
  // TODO:
  return new Map();
}

/** 
 * Return all drivers from a list of people
 * 
 * @param  {People[]} people
 * @returns People[]
 */
function getDrivers(people: People[]): People[] {
  return [];
}

/** 
 * Return all passengers from a list of people
 * 
 * @param  {People[]} people
 * @returns People[]
 */
function getPassengers(people: People[]): People[] {
  return [];
}

/**
 * Return a dict where the key is a driver id, and the value associated
 * is a dict with passenger id and distance to that passenger
 * 
 * @param  {People[]} drivers
 * @param  {People[]} passengers
 * @returns Map<string, Map<string, number>>
 */
function calculateDriverDistances(drivers: People[], passengers: People[])
  : Map<string, Map<string, number>> {
  return null;
}

/**
 * Return a dict where the key is a passenger id, and the value associated
 * is a dict with driver id and distance to that driver
 * 
 * @param  {People[]} drivers
 * @param  {People[]} passengers
 * @returns Map<string, Map<string, number>>
 */
function calculatePassengerDistances(drivers: People[], passengers: People[])
  : Map<string, Map<string, number>> {
  return null;
}
// function findNextPassenger(): People

function updateDriversAndPassengers(drivers: People[], passengers: People[], driver, passenger)

// function 


/** Returns the person that is the farthest away from the middle point of all availalbe drivers
 * @param  {People[]} people
 * @returns People
 */
function findFarthestFromMiddle(people: People[]): People {
  return null;
}


