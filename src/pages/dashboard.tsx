import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';
import { Event } from '../_types/event';
import { useParams, useHistory } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Map from '../components/Map';
import ListView from '../components/PeopleList';
import useEventPeople from 'src/hooks/useEventPeople';
import Header from '../components/Header';

//eslint-disable-next-line
const globalAny: any = global

const Dashboard = () => {
    const { eventId } = useParams();
    const history = useHistory();
    const [coord, setCoord] = useState({
        lat: 0.0,
        lng: 0.0,
    });

    const [event, loading] = useDocumentData<Event>(firebase.firestore().collection('events').doc(eventId), {
        snapshotListenOptions: {
            includeMetadataChanges: true,
        },
    });

    const people = useEventPeople(event);
    console.log(people);

    if (!loading && !event) {
        globalAny.setNotification('error', 'Event not found.');
        history.push('/');
    }

    useEffect(() => {
        const showPosition = (position: any) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            console.log(lat, lng);
            setCoord({
                lat: lat,
                lng: lng,
            });
        };

        // get user current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            alert(`Your browser doesn't support maps. Sorry about that :(`);
        }
    }, []);

    return (
        <>
            <Header />

            {/* Load map */}
            {/* Load side-menu */}
            <div style={{ display: 'flex' }}>
                <ListView members={people} />
                <Map center={coord} />
            </div>
        </>
    );
};

export default Dashboard;
