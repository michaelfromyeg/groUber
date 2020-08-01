import React, { ReactElement, useState, useEffect } from 'react';
// import Event from '../_types/event';
import styles from '../styles/App.module.scss';
import EventForm from '../components/EventForm';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventList from '../components/EventList';
import Typography from '@material-ui/core/Typography';
import * as firebase from 'firebase';

const Home = (): ReactElement => {
    const [events, setEvents] = useState(null);

    const fetchEvents = async () => {
        const events: any = [];
        const eventSnapshot = await firebase
            .firestore()
            .collection('events')
            .where('organizerUid', '==', firebase.auth().currentUser.uid)
            .get();
        eventSnapshot.forEach((doc) => {
            events.push({ id: doc.id, ...doc.data() });
        });
        console.log(events);
        setEvents(events);
    };

    useEffect(() => {
        const getEvents = async () => {
            await fetchEvents();
        };
        getEvents();
    }, []);

    return (
        <div className={styles.app}>
            <Header />
            <EventForm />
            {events == null ? <Typography variant="body1">Loading...</Typography> : <EventList eventList={events} />}
            <Footer />
        </div>
    );
};

export default Home;
