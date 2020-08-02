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
        this.data = new CustomMap();
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
    async grabMatrixDataFromRadar(people) {
        let locations = people.map((person) => {
            return `${person.location.latlng.lat},${person.location.latlng.lng}`;
        });
        let result = await axios_1.default.get('https://api.radar.io/v1/route/matrix', {
            params: {
                origins: locations.join('|'),
                destinations: locations.join('|'),
                mode: "car",
                units: "imperial"
            },
            headers: {
                'Authorization': `prj_live_pk_7a9bbe078da0cfa051f77e2c9d9d0f929b9e5955`
            }
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
        var index = this.keys.indexOf(key);
        if (index == -1) {
            this.keys.push(key);
            this.values.push(value);
        }
        else {
            this.values[index] = value;
        }
    }
    get(key) {
        return this.values[this.keys.indexOf(key)];
    }
}
exports.CustomMap = CustomMap;
//# sourceMappingURL=DistanceMatrix.js.map