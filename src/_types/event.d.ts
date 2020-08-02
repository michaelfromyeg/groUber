import { People } from './people';

export interface Event {
    _id?: string;
    name?: string;
    date?: Date;
    host?: People;
    people: People[];
    destination?: {
        address?: string;
        latlng?: {
            lat?: number;
            lng?: number;
        };
    };
    path?: any; // TODO:
}
