import { People } from './people'

export interface Event {
  _id: string;
  name?: string;
  people: People[];
  destination: string;
  path?: any; // TODO:
}
