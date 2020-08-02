import { People } from "../../src/_types/people";
import axios from "axios";

export interface Location {
  latitude: number,
  longitude: number
}

export class DistanceMatrix {
  people: People[]
  data: CustomMap<Location, CustomMap<Location, number>> = new CustomMap()
  /**
   * @param  {People[]} people
   * @example distanceMatrix = new DistanceMatrix(people)
   */
  constructor(people: People[]) {
    this.people = people;
  }
  /** generates data which is our map given a list of people.
   * 
   * @example await distanceMatrix.init();
   */
  async init() {
    const data = await this.grabMatrixDataFromRadar(this.people);
    // use data here
    
  }

  async grabMatrixDataFromRadar(people: People[]): Promise<any> {
    let locations: string[] = people.map((person) => {
      return `${person.location.latlng.lat},${person.location.latlng.lng}`;
    })

    let result = await axios.get('https://api.radar.io/v1/route/matrix', {
      params: {
        origins: locations.join('|'),
        destinations: locations.join('|'),
        mode: "car",
        units: "imperial"
      },
      headers: {
        'Authorization': `prj_live_pk_7a9bbe078da0cfa051f77e2c9d9d0f929b9e5955`
      }
    })

    return result.data;
  }
}

export class CustomMap<A, B> {
  // fields go here
  // id: string

  keys: Array<A> = []
  values: Array<B> = [];

  set(key: A, value:B) {
    var index = this.keys.indexOf(key);
    if(index == -1) {
      this.keys.push(key);
      this.values.push(value);
    }
    else {
      this.values[index] = value;
    }
  }

  get(key: A) {
    return this.values[this.keys.indexOf(key)];
  }
}