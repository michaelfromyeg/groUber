import { Address } from './address'

export interface People {
  name: string;
  email: string;
  canDrive: boolean;
  seats: number;
  location: {
    address: Address;
    latlng: {
      lat: double;
      lng: double;
    }
  }
}


