import firebase from 'firebase';
import { useState, useEffect } from 'react';
import { Event } from 'src/_types/event';
import { People } from 'src/_types/people';

export default function useEventPeople(event: Event): People[] {
    const [people, setPeople] = useState([]);

    useEffect(() => {
        if (event) {
            Promise.all(
                ((event.people as unknown) as firebase.firestore.DocumentReference[]).map(
                    async (person: firebase.firestore.DocumentReference) => {
                        const personRef = await person.get();
                        return {
                            id: personRef.id,
                            ...personRef.data(),
                        };
                    },
                ),
            ).then((result) => {
                setPeople(result);
            });
        }
    }, [event]);

    return people;
}
