function idToLatLngFunc(members) {
    const res = {};
    for (const member of members) {
        res[member.id] = member.location.latlng;
    }
    return res;
}

export default idToLatLngFunc;
