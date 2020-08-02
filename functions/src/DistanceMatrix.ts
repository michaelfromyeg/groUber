import { People } from "../../src/_types/people";
import axios from "axios";

export interface Location {
  latitude: number,
  longitude: number
}

export class DistanceMatrix {
  people: People[]
  data: CustomMap<CustomMap<number>> = new CustomMap() // number is the distance
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
    const apiData = await this.grabMatrixDataFromRadar(this.people);
    const origins = apiData.origins;
    const destinations = apiData.destinations;
    const matrix = apiData.matrix;
   
    for (let i = 0; i < origins.length; i++){
      let distances: CustomMap<number> = new CustomMap()

      let startLoc: Location = {
        latitude: this.people[i].location.latlng.lat,
        longitude: this.people[i].location.latlng.lng,
      }
      for (let j = 0; j < destinations.length; j++){
        let endLoc: Location = {
          latitude: this.people[j].location.latlng.lat,
          longitude: this.people[j].location.latlng.lng,
        }
        distances.set(endLoc, matrix[i][j].distance.value);      
      }
      this.data.set(startLoc, distances)
    } 
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
        units: "metric"
      },
      headers: {
        'Authorization': `prj_live_pk_7a9bbe078da0cfa051f77e2c9d9d0f929b9e5955`
      }
    })

    return result.data;
  }
}

export class CustomMap<B> {
  // fields go here
  // id: string

  keys: Array<Location> = []
  values: Array<B> = [];

  set(key: Location, value:B) {
    var index = this.findIndex(key);
    if(index == -1) {
      this.keys.push(key);
      this.values.push(value);
    }
    else {
      this.values[index] = value;
    }
  }

  get(key: Location) {
    return this.values[this.findIndex(key)];
  }

  findIndex(key: Location): number {
    for(let i=0; i<this.keys.length; i++) {
      let item = this.keys[i];
      if (item.latitude === key.latitude && item.longitude === key.longitude) {
        return i;
      }
    }
    return -1;
  }
}