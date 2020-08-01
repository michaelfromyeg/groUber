import * as functions from 'firebase-functions';
import { Event } from '../../src/_types/event'
import { People } from '../../src/_types/people'

const { priorityQueue } = require('./priorityQueue')



// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

const DISTANCE = 0;


// export const runAlgo = functions.https.onRequest((request: { body: { event: Event; }; }, response: any) => {
//   const event : Event = request.body.event;
//   const peopleArray = []
//   for(let i = 0; i < event.people.length ; i++){
//     peopleArray.push(event.people[i]);
//   }

//   let eventLoc = request.body.event.destination.latlng;

//   let dividedPeople = seperatePeople(peopleArray, eventLoc);
//   let optimalPath = calcOptimalPath(dividedPeople.drivers, dividedPeople.peopleList, eventLoc);

  
// });










// 













