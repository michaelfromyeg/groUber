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
type Ans = Record<string, string[]>;
const DUMMY_ANSWER: Ans = {
    HcpIbf1pYDSeCXtN2cJOyT0Qs2V2: ['WDPbuiPTTkNmqraIi8Hnq2nrK503'],
};

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
    const members = useEventPeople(eventData);
    const idToLatLng = idToLatLngFunc(members);
    console.log('members: ' + members);
    const answer: any = [];
    for (const driver in DUMMY_ANSWER) {
        const path = [...DUMMY_ANSWER[driver]];
        path.unshift(driver);
        const newPath = path.map((id) => idToLatLng[id]);
        answer.push(newPath);
    }
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
    let newPath: any = [];
    /**
     * newPath SHOULD be [
     *  [{lat, lng}, {lat, lng} ... ], [{lat, lng}, {lat, lng} ... ]
     * ]
     */
    const generatePaths = async () => {
        for (const route of answer) {
            console.log(route);
            for (let i = 0; i < route.length - 1; i++) {
                const origin = route[i];
                const destination = route[i + 1];
                if (origin && destination) {
                    const response = await fetch(
                        `http://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`,
                    );
                    console.log(response);
                }
            }
        }

        newPath = google.maps.geometry.encoding.decodePath(
            'a~l~Fjk~uOnzh@vlbBtc~@tsE`vnApw{A`dw@~w\\|tNtqf@l{Yd_Fblh@rxo@b}@xxSfytAblk@xxaBeJxlcBb~t@zbh@jc|Bx}C`rv@rw|@rlhA~dVzeo@vrSnc}Axf]fjz@xfFbw~@dz{A~d{A|zOxbrBbdUvpo@`cFp~xBc`Hk@nurDznmFfwMbwz@bbl@lq~@loPpxq@bw_@v|{CbtY~jGqeMb{iF|n\\~mbDzeVh_Wr|Efc\\x`Ij{kE}mAb~uF{cNd}xBjp]fulBiwJpgg@|kHntyArpb@bijCk_Kv~eGyqTj_|@`uV`k|DcsNdwxAott@r}q@_gc@nu`CnvHx`k@dse@j|p@zpiAp|gEicy@`omFvaErfo@igQxnlApqGze~AsyRzrjAb__@ftyB}pIlo_BflmA~yQftNboWzoAlzp@mz`@|}_@fda@jakEitAn{fB_a]lexClshBtmqAdmY_hLxiZd~XtaBndgC',
        );
        console.log(newPath);
    };

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
            {answer.map((path: any) => {
                const randomColor = Math.floor(Math.random() * 16777215).toString(16);
                return <Polyline key="" path={newPath} strokeColor={randomColor} strokeOpacity={1} strokeWeight={3} />;
            })}
        </Map>
    );
};

export default GoogleApiWrapper((props) => ({
    ...props,
    apiKey: 'AIzaSyD2mfMm4KHPGErUYWr3bNFwALDVP-EKkXc',
}))(MapContainer);
