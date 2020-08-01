import { People } from './people';

export interface Event {
    _id?: string;
    name?: string;
    organizerEmail?: string; // TODO: deprecate
    organizerName?: string; // TODO: deprecate
    date?: Date;
    host?: People;
    people?: People[];
    destination?: {
        address?: string;
        latlng?: {
            lat?: double;
            lng?: double;
        };
    };
    path?: any; // TODO:
}
