import { useDocument } from "react-firebase-hooks/firestore";
import firebase from "firebase";
import { useState, useEffect } from "react";

export default function useEventPeople(eventId: string) {
  const [people, setPeople] = useState([]);
  const [value, loading, error] = useDocument(
    firebase.firestore().collection("events").doc(eventId),
    {
      snapshotListenOptions: {
        includeMetadataChanges: true
      }
    }
  );

  const data = value?.data();
  
  useEffect(() => {
    if(data)
    Promise.all(data.people.map(async (person: firebase.firestore.DocumentReference) => {
      const personRef = await person.get();
      return personRef.data();
    }))
    .then(result =>
      setPeople(result)
    )
  }, [value])

  return people;
}