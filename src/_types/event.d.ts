import { People } from './people';

export interface Event {
    id?: string;
    name?: string;
    date?: Date;
    host?: People | firebase.firestore.DocumentReference;
    people?: People[] | firebase.firestore.DocumentReference[];
    destination?: {
        address?: string;
        latlng?: {
            lat?: double;
            lng?: double;
        };
    };
    path?: any; // TODO:
}
