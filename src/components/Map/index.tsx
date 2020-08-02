import React, { ReactElement } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import theme from './theme';
import useEventPeople from '../../hooks/useEventPeople';
import { useParams } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase';
import { People } from 'src/_types/people';
import { Event } from 'src/_types/event';

const MapContainer = ({ google, center }: { google: any; center: google.maps.LatLngLiteral }): ReactElement => {
    const { eventId } = useParams();
    const [eventData] = useDocumentData<Event>(firebase.firestore().collection('events').doc(eventId), {
        snapshotListenOptions: {
            includeMetadataChanges: true,
        },
    });
    const members = useEventPeople(eventData);
    console.log(members);
    return (
        <Map
            google={google}
            zoom={13}
            styles={theme}
            initialCenter={center}
            containerStyle={{ height: 'calc(100vh - 64px)', width: '82.5vw' }}
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
        </Map>
    );
};

export default GoogleApiWrapper((props) => ({
    ...props,
    apiKey: 'AIzaSyD2mfMm4KHPGErUYWr3bNFwALDVP-EKkXc',
}))(MapContainer);
