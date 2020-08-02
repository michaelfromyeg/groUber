import { Address } from './address';

export interface People {
    id: string;
    name: string;
    email: string;
    profilePicture: string;
    userId: string;
    canDrive: boolean;
    seats: number;
    isHost?: boolean;
    event?: Event | firebase.firestore.DocumentReference;
    location: {
        address: Address;
        latlng: {
            lat: number;
            lng: number;
        };
    };
}
