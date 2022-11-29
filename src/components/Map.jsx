import React, { useRef, useEffect, useState } from 'react';
import { mapboxClient } from '../mapboxClient';
import 'mapbox-gl/dist/mapbox-gl.css';

function Map({session, setSession, supabase}) {

   
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(3);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxClient.Map({
          container: mapContainer.current,
          projection: 'mercator',
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [lng, lat],
          zoom: zoom
        });
        
        map.current.addControl(new mapboxClient.FullscreenControl());
    });


    return( 
        // <link href='https://api.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.css' rel='stylesheet' />
        <div className="App">

                <div>
                <div ref={mapContainer} className="map-container" />
                </div>

            <p className="read-the-docs">
                &#127881; Get a map of the people around the world who share your music taste! &#127881;
            </p>
        </div>
    )
}

export default Map;