import React, { ReactElement } from 'react';
import { Map, GoogleApiWrapper, Marker, Polyline } from 'google-maps-react';
import theme from './theme';
import useEventPeople from '../../hooks/useEventPeople';
import { useParams } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase';
import { People } from 'src/_types/people';
import idToLatLngFunc from './id-to-lat-lng';
import { Event } from 'src/_types/event';
import axios from 'axios';
import { useFetch } from 'src/hooks/UseFetch';
import { Client, Status } from '@googlemaps/google-maps-services-js';

const client = new Client({});
const key = 'AIzaSyD2mfMm4KHPGErUYWr3bNFwALDVP-EKkXc';

const MapContainer = ({ google, center }: { google: any; center: google.maps.LatLngLiteral }): ReactElement => {
    // each polyline represents a route for a driver.

    // const newPath = google.maps.geometry.encoding.decodePath(
    //     'a~l~Fjk~uOnzh@vlbBtc~@tsE`vnApw{A`dw@~w\\|tNtqf@l{Yd_Fblh@rxo@b}@xxSfytAblk@xxaBeJxlcBb~t@zbh@jc|Bx}C`rv@rw|@rlhA~dVzeo@vrSnc}Axf]fjz@xfFbw~@dz{A~d{A|zOxbrBbdUvpo@`cFp~xBc`Hk@nurDznmFfwMbwz@bbl@lq~@loPpxq@bw_@v|{CbtY~jGqeMb{iF|n\\~mbDzeVh_Wr|Efc\\x`Ij{kE}mAb~uF{cNd}xBjp]fulBiwJpgg@|kHntyArpb@bijCk_Kv~eGyqTj_|@`uV`k|DcsNdwxAott@r}q@_gc@nu`CnvHx`k@dse@j|p@zpiAp|gEicy@`omFvaErfo@igQxnlApqGze~AsyRzrjAb__@ftyB}pIlo_BflmA~yQftNboWzoAlzp@mz`@|}_@fda@jakEitAn{fB_a]lexClshBtmqAdmY_hLxiZd~XtaBndgC',
    // );

    // console.log(newPath);
    const { eventId } = useParams();
    const [eventData] = useDocumentData<Event>(firebase.firestore().collection('events').doc(eventId), {
        snapshotListenOptions: {
            includeMetadataChanges: true,
        },
    });
    const solution = useFetch(`https://us-central1-find-my-carpool.cloudfunctions.net/solve?eventId=${eventId}`);
    // (eventData);
    const members = useEventPeople(eventData);
    const idToLatLng = idToLatLngFunc(members);
    // console.log(idToLatLng, members);
    // console.log('members: ' + members);
    const answer: any = [];
    for (const driver in solution.data) {
        const path = [...solution.data[driver]];
        console.log(path);
        path.unshift(driver);
        const newPath = path.map((id) => idToLatLng[id]);
        answer.push(newPath);
    }
    console.log(answer, solution);
    /**
     * answer is
     * [ [{lat, lng}, {lat, lng} ...], [{lat, lng}, {lat, lng ...}]]
     *
     * encodedPaths should be
     * [
     *  ['String', 'String' ...], ['String', 'String' ...]
     * ]
     *
     */
    const newPath: any = [];
    /**
     * newPath SHOULD be [
     *  [{lat, lng}, {lat, lng} ... ], [{lat, lng}, {lat, lng} ... ]
     * ]
     */
    const generatePaths = async () => {
        // console.log('generate paths');
        for (const route of answer) {
            const destination = route[route.length - 1];
            const begin = route[0];
            let response;
            if (route.length > 3) {
                let waypoint = 'waypoints=';
                // , === %2C
                // | seperate locations
                for (let i = 1; i < route.length - 1; i++) {
                    if (i == route.length - 2) {
                        waypoint = waypoint + route[i].lat + '%2C' + route[i].lat;
                    } else {
                        waypoint = waypoint + route[i].lat + '%2C' + route[i].lat + '|';
                    }
                }
                // const response = await axios.get(
                //     `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&${waypoint}&key=${key}`,
                // );
                route.pop();
                route.unshift();

                response = await client.directions({
                    params: {
                        origin: begin,
                        destination: destination,
                        waypoints: route,
                        key,
                    },
                });

                // console.log(response);
            }
            if (route.length <= 1) {
            } else {
                // const response = await axios.get(
                //     `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${key}`,
                // );
                // console.log(response);
                console.log(origin, destination);
                response = await client.directions({
                    params: {
                        origin: begin,
                        destination: destination,
                        key,
                    },
                });
                console.log('response: ' + response);
            }

            newPath.push(google.maps.geometry.encoding.decodePath(response.data.routes[0].overview_polyline.points));
        }
    };

    // console.log(window.google);
    if (google.maps.geometry) {
        // generate an encoded response per route
        // for each route in answer
        // encode it
        generatePaths();
    }
    return (
        <Map
            google={google}
            zoom={13}
            styles={theme}
            initialCenter={center}
            containerStyle={{ height: 'calc(100vh - 64px)', width: '100vw' }}
        >
            <Marker position={center}></Marker>
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
            {newPath.map((path: any) => {
                const randomColor = Math.floor(Math.random() * 16777215).toString(16);
                return <Polyline key="" path={path} strokeColor={randomColor} strokeOpacity={1} strokeWeight={3} />;
            })}
        </Map>
    );
};

export default GoogleApiWrapper((props) => ({
    ...props,
    libraries: ['geometry'],
    apiKey: 'AIzaSyD2mfMm4KHPGErUYWr3bNFwALDVP-EKkXc',
}))(MapContainer);
