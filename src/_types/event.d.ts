import { People } from './people'

export interface Event {
  _id?: string;
  name: string;
  organizerEmail: string;
  people: People[];
  destination: {
    address: string;
    latlng: {
      lat: double,
      lng: double,
    }
  };
  path?: any; // TODO:
}
