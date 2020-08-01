import { Address } from './address'

export interface People {
  [x: string]: any;
  name: string,
  canDrive: boolean;
  seats: number;
  address: Address;
}


