import React, { ReactElement } from 'react';
import { Map, GoogleApiWrapper, Marker, Polyline } from 'google-maps-react';
import theme from './theme';
import useEventPeople from '../../hooks/useEventPeople';
import { useParams } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase';
import { People } from 'src/_types/people';
import idToLatLngFunc from './id-to-lat-lng.js';
import { Event } from 'src/_types/event';

const MapContainer = ({ google, center }: { google: any; center: google.maps.LatLngLiteral }): ReactElement => {
    // each polyline represents a route for a driver.

    const { eventId } = useParams();
    const [eventData] = useDocumentData<Event>(firebase.firestore().collection('events').doc(eventId), {
        snapshotListenOptions: {
            includeMetadataChanges: true,
        },
    });
    const members = useEventPeople(eventData);
    const idToLatLng = idToLatLngFunc(members);
    console.log(idToLatLng);
    return (
        <Map
            google={google}
            zoom={13}
            styles={theme}
            initialCenter={center}
            containerStyle={{ height: 'calc(100vh - 64px)', width: '100vw' }}
        >
            <Marker label={'Destination'} position={center}></Marker>
            {members.map((person: People) => {
                return (
                    <Marker
                        key={person?.name}
                        label={!person?.profilePicture && person.name}
                        position={person.location.latlng}
                        icon={{
                            url: person.profilePicture,
                            scaledSize: new google.maps.Size(32, 32),
                        }}
                    />
                );
            })}
            <Polyline
                path={[
                    { lat: 25.774, lng: -80.19 },
                    { lat: 18.466, lng: -66.118 },
                    { lat: 32.321, lng: -64.757 },
                    { lat: 25.774, lng: -80.19 },
                ]}
                strokeColor="#0000FF"
                strokeOpacity={0.8}
                strokeWeight={2}
            />
        </Map>
    );
};

export default GoogleApiWrapper((props) => ({
    ...props,
    apiKey: 'AIzaSyD2mfMm4KHPGErUYWr3bNFwALDVP-EKkXc',
}))(MapContainer);
