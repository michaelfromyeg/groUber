import { Dictionary } from 'lodash';

interface LatLng {
    lat: number;
    lng: number;
}
function idToLatLngFunc(members: any) {
    const res: { [id: string]: LatLng } = {};
    for (const member of members) {
        // console.log(member);
        res[member.id] = member.location.latlng;
    }
    return res;
}

export default idToLatLngFunc;
