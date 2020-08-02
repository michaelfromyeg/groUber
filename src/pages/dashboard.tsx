import React, { useState } from 'react';
import * as firebase from 'firebase';
import { Event } from '../_types/event';
import { useParams, useHistory } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Map from '../components/Map';
import ListView from '../components/PeopleList';
import useEventPeople from 'src/hooks/useEventPeople';
import Header from '../components/Header';
import { Hidden, Drawer } from '@material-ui/core';

//eslint-disable-next-line
const globalAny: any = global

const Dashboard = () => {
    const { eventId } = useParams();
    const history = useHistory();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // const [eventCoord, setEventCoord] = useState({
    //     lat: 0.0,
    //     lng: 0.0,
    // });

    const [event, loading] = useDocumentData<Event>(firebase.firestore().collection('events').doc(eventId), {
        snapshotListenOptions: {
            includeMetadataChanges: true,
        },
    });

    const people = useEventPeople(event);

    if (!loading && !event) {
        globalAny.setNotification('error', 'Event not found.');
        history.push('/');
    }

    // useEffect(() => {
    //     const showPosition = (position: any) => {
    //         const lat = position.coords.latitude;
    //         const lng = position.coords.longitude;
    //         console.log(lat, lng);
    //         setCoord({
    //             lat: lat,
    //             lng: lng,
    //         });
    //     };

    // Get the location of event

    // useEffect(() => {
    //     for (let i = 0; i < people.length; i++) {
    //         if (people[i].isHost) {
    //             const host = people[i];
    //             people.splice(i, 1);
    //             setEventCoord(host.location.latlng);
    //         }
    //     }
    // }, []);

    return (
        <>
            <Header setSidebarOpen={setSidebarOpen} />
            <div style={{ display: 'flex' }}>
                <Drawer
                    variant="temporary"
                    anchor="left"
                    open={sidebarOpen}
                    onClose={() => {
                        setSidebarOpen(false);
                    }}
                >
                    <ListView setSidebarOpen={setSidebarOpen} members={people} />
                </Drawer>
                {/* <Hidden mdDown></Hidden> */}
                <Map center={event ? event.destination.latlng : { lat: 0, lng: 0 }} />
            </div>
        </>
    );
};

export default Dashboard;
