import React from 'react'

const Map = (props) => {
    const {center, zoom} = props
    const mapRef = React.useRef()

    React.useEffect(() => {
        const map = new window.google.maps.Map(mapRef.current, { // init map
            center: center,
            zoom: zoom
        })
        new window.google.maps.Marker({position: center, map: map}) // place marker
    },[center, zoom])

    return (<div ref={mapRef}></div>)
}

export default Map