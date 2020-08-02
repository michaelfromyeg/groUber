import React, { ReactElement, useState, useEffect } from 'react';
// import Event from '../_types/event';
import styles from '../styles/App.module.scss';
import EventForm from '../components/EventForm';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventList from '../components/EventList';
import Typography from '@material-ui/core/Typography';
import * as firebase from 'firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { People } from 'src/_types/people';
import { Event } from 'src/_types/event';

const Home = (): ReactElement => {
    const [events, setEvents] = useState(null);

    const [eventSnapshot, loading] = useCollectionData<People>(
        firebase
            .firestore()
            .collection('people')
            .where('userId', '==', firebase.auth().currentUser.uid)
            .where('isHost', '==', true),
        {
            idField: 'id',
            snapshotListenOptions: {
                includeMetadataChanges: true,
            },
        },
    );

    const fetchEvents = async () => {
        if (eventSnapshot) {
            const events: Event[] = [];
            await Promise.all(
                eventSnapshot?.map(async (doc) => {
                    const eventRef = doc.event as firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
                    const event = await eventRef?.get();
                    if (event) events.push({ id: event.id, ...event.data() });
                }),
            );
            setEvents(events);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [eventSnapshot]);

    return (
        <div className={styles.app}>
            <Header />
            <EventForm />
            {events == null || loading ? (
                <Typography variant="body1">Loading...</Typography>
            ) : (
                <EventList eventList={events} />
            )}
            <Footer />
        </div>
    );
};

export default Home;
