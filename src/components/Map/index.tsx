import React, { ReactElement } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import theme from './theme';
import useEventPeople from '../../hooks/useEventPeople'
import { useParams } from 'react-router-dom';
import { useDocument } from 'react-firebase-hooks/firestore';
import firebase from 'firebase';

const MapContainer = ({ google, center }: { google: any; center: google.maps.LatLngLiteral }): ReactElement => {
    const { eventId } = useParams();
    const [eventData, loading, error] = useDocument(firebase.firestore().collection('events').doc(eventId), {
        snapshotListenOptions: {
            includeMetadataChanges: true,
        },
    });
    const members = useEventPeople(eventData)
    return (
        <Map
            google={google}
            zoom={13}
            styles={theme}
            initialCenter={center}
            containerStyle={{ height: 'calc(100vh - 64px)', width: '82.5vw' }}
        >
        {members.map((person) => {
            return (
                <Marker
                    label = {person.name}
                    position = {person.location.latlng}
                >
                </Marker>
            )
        })}
        </Map>
    );
};

export default GoogleApiWrapper((props) => ({
    ...props,
    apiKey: 'AIzaSyD2mfMm4KHPGErUYWr3bNFwALDVP-EKkXc',
}))(MapContainer);
