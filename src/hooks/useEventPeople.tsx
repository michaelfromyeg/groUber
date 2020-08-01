import { useDocument } from "react-firebase-hooks/firestore";
import firebase from "firebase";
import { useState, useEffect } from "react";

export default function useEventPeople(eventData: firebase.firestore.DocumentData) {
  const [people, setPeople] = useState([]);

  const data = eventData?.data();
  
  useEffect(() => {
    if(data)
    Promise.all(data.people.map(async (person: firebase.firestore.DocumentReference) => {
      const personRef = await person.get();
      return personRef.data();
    }))
    .then(result =>
      setPeople(result)
    )
  }, [eventData])

  return people;
}