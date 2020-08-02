"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomMap = exports.DistanceMatrix = void 0;
const axios_1 = __importDefault(require("axios"));
class DistanceMatrix {
    /**
     * @param  {People[]} people
     * @example distanceMatrix = new DistanceMatrix(people)
     */
    constructor(people) {
        this.data = new CustomMap(); // number is the distance
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
        for (let i = 0; i < origins.length; i++) {
            const distances = new CustomMap();
            const startLoc = {
                latitude: this.people[i].location.latlng.lat,
                longitude: this.people[i].location.latlng.lng,
            };
            for (let j = 0; j < destinations.length; j++) {
                const endLoc = {
                    latitude: this.people[j].location.latlng.lat,
                    longitude: this.people[j].location.latlng.lng,
                };
                distances.set(endLoc, matrix[i][j].distance.value);
            }
            this.data.set(startLoc, distances);
        }
    }
    async grabMatrixDataFromRadar(people) {
        const locations = people.map((person) => {
            return `${person.location.latlng.lat},${person.location.latlng.lng}`;
        });
        const result = await axios_1.default.get('https://api.radar.io/v1/route/matrix', {
            params: {
                origins: locations.join('|'),
                destinations: locations.join('|'),
                mode: 'car',
                units: 'metric',
            },
            headers: {
                Authorization: `prj_live_pk_7a9bbe078da0cfa051f77e2c9d9d0f929b9e5955`,
            },
        });
        return result.data;
    }
}
exports.DistanceMatrix = DistanceMatrix;
class CustomMap {
    constructor() {
        // fields go here
        // id: string
        this.keys = [];
        this.values = [];
    }
    set(key, value) {
        const index = this.findIndex(key);
        if (index == -1) {
            this.keys.push(key);
            this.values.push(value);
        }
        else {
            this.values[index] = value;
        }
    }
    get(key) {
        return this.values[this.findIndex(key)];
    }
    findIndex(key) {
        for (let i = 0; i < this.keys.length; i++) {
            const item = this.keys[i];
            if (item.latitude === key.latitude && item.longitude === key.longitude) {
                return i;
            }
        }
        return -1;
    }
}
exports.CustomMap = CustomMap;
//# sourceMappingURL=DistanceMatrix.js.map