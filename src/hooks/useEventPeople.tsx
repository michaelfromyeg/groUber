import { useDocument } from 'react-firebase-hooks/firestore';
import firebase from 'firebase';
import { useState, useEffect } from 'react';

export default function useEventPeople(eventData: firebase.firestore.DocumentData): any[] {
    const [people, setPeople] = useState([]);
    let data: any = eventData?.data();
    useEffect(() => {
        if (data)
            Promise.all(
                data.people.map(async (person: firebase.firestore.DocumentReference) => {
                    const personRef = await person.get();
                    return personRef.data();
                }),
            ).then((result) => {
                console.log(result)
                return setPeople(result)
            });
    }, [eventData]);
    
    return people
}
