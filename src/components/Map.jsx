import React, { useRef, useEffect, useState } from 'react';
import { mapboxClient } from '../mapboxClient';
import 'mapbox-gl/dist/mapbox-gl.css';
import Playlist from './Playlist';
import { Link } from "react-router-dom";
import axios from 'axios';


function Map({currPlaylist, session, setSession, supabase}) {
   
    // console.log("currPlaylist", currPlaylist);

    const [artists, setArtists] = useState([]);
    const mapContainer = useRef(null);
    const map = useRef(null);
    // 47.08863246290623, 15.450041944651074
    const [lng, setLng] = useState(25.1);
    const [lat, setLat] = useState(35.1);
    const [zoom, setZoom] = useState(1.8);


    useEffect(() => {
        const fetchData = async () => {
            const {data, error} = await axios.get(currPlaylist.tracks['href'], {
                headers: {
                    Authorization: `Bearer ${session.provider_token}`
                },
                params: {
                    playlist_id: currPlaylist.id,
                    limit: 50,
                    offser: 0
                }
            });

            // Preventing copies of artists.
            const tempSet = new Set();
            for (const item of data.items) {
                // console.log("ID: ", item.track.artists[0].id, "Name: ", item.track.artists[0].name);
                tempSet.add(item.track.artists[0].id);
            }
            // Converting to arr for query lookup
            const tempArr = Array.from(tempSet);

            const get_result = await supabase
            .from('artists_poppularity')
            .select('*')
            .in('artitst_id',tempArr);

            // console.log("WHERE IS THE DATAAAA???", get_result.data);
            setArtists(get_result.data);
    }
          fetchData().catch(console.error)

    }, []);


    // console.log("artists", artists);


    // const sample_geojson = { "type": "FeatureCollection", "features": []};


    const sample_geojson = { "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {},                
                "geometry": 
                {
                    "type": "Point",
                    "coordinates": [-88.2239423012954,41.22254235869228]
                }    
            },
            {
                "type": "Feature",
                "properties": {},
                "geometry": 
                {
                    "type": "Point",
                    "coordinates": [-120.39190825529269,36.007423172126344]
                }    
            },
            {
                "type": "Feature",
                "properties": {},
                "geometry": 
                {
                    "type": "Point",
                    "coordinates":[23.748704216170623, 42.27169460571529]
                }    
            },
            {
                "type": "Feature",
                "properties": {},
                "geometry": 
                {
                    "type": "Point",
                    "coordinates": [-3.1458246961878067,51.92603935222418]
                }    
            },
            {
                "type": "Feature",
                "properties": {},
                "geometry": 
                {
                    "type": "Point",
                    "coordinates": [76.30729339783835,19.283244539409033]
                }    
            },
            {
                "type": "Feature",
                "properties": {},
                "geometry": 
                {
                    "type": "Point",
                    "coordinates":[10.037767907909473,50.60631648536987]
                }    
            }

        ]
    };

    // for ( const a of artists){
    //     // sample_geojson.features.push();
    //     console.log("a", typeof a.city1_coor);
    // }


    useEffect(() => {

        if (map.current) return; // initialize map only once
        map.current = new mapboxClient.Map({
          container: mapContainer.current,
          projection: 'mercator',
          style: 'mapbox://styles/mpashe2/clb2u2grw000i14mlc7217lsm',
          center: [lng, lat],
          zoom: zoom
        });
        
        map.current.addControl(new mapboxClient.FullscreenControl());


        map.current.on('load', () => {
            // Add a new source from our GeoJSON data and
            // set the 'cluster' option to true. GL-JS will
            // add the point_count property to your source data.
            map.current.addSource('artists_popularity', {
                type: 'geojson',
                // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
                // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
                // data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
                data: sample_geojson,
                cluster: true,
                clusterMaxZoom: 14, // Max zoom to cluster points on
                clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
            });
             
            map.current.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'artists_popularity',
                filter: ['has', 'point_count'],
                paint: {
                // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                // with three steps to implement three types of circles:
                //   * Blue, 20px circles when point count is less than 100
                //   * Yellow, 30px circles when point count is between 100 and 750
                //   * Pink, 40px circles when point count is greater than or equal to 750
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#51bbd6',
                    100,
                    '#f1f075',
                    750,
                    '#f28cb1'
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    20,
                    100,
                    30,
                    750,
                    40
                ],
                'circle-opacity': 0.6,
                }
            });
             
            map.current.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'artists_popularity',
                filter: ['has', 'point_count'],
                layout: {
                'text-field': '{point_count_abbreviated}',
                // "text-field": ["get", "sum"],
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
                }
            });
             
            map.current.addLayer({
                id: 'unclustered-point',
                type: 'circle',
                source: 'artists_popularity',
                filter: ['!', ['has', 'point_count']],
                paint: {
                'circle-color': '#11b4da',
                'circle-radius': 4,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff',
                // 'circle-opacity': 0.05,
                }
            });
             
            // inspect a cluster on click
            // map.current.on('click', 'clusters', (e) => {
            //     const features = map.current.queryRenderedFeatures(e.point, {
            //      layers: ['clusters']
            //     });
            //     const clusterId = features[0].properties.cluster_id;
            //     map.current.getSource('artists_popularity').getClusterExpansionZoom(
            //     clusterId,
            //     (err, zoom) => {
            //         if (err) return;
                
            //         map.current.easeTo({
            //         center: features[0].geometry.coordinates,
            //         zoom: zoom
            //     });
            //     }
            //     );
            // });
             
            // // When a click event occurs on a feature in
            // // the unclustered-point layer, open a popup at
            // // the location of the feature, with
            // // description HTML from its properties.
            // map.current.on('click', 'unclustered-point', (e) => {
            // const coordinates = e.features[0].geometry.coordinates.slice();
            // const mag = e.features[0].properties.mag;
            // const tsunami =
            // e.features[0].properties.tsunami === 1 ? 'yes' : 'no';
             
            // // Ensure that if the map is zoomed out such that
            // // multiple copies of the feature are visible, the
            // // popup appears over the copy being pointed to.
            // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            //      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            // }
             
            // new mapboxgl.Popup()
            //     .setLngLat(coordinates)
            //     .setHTML(
            //     `magnitude: ${mag}<br>Was there a tsunami?: ${tsunami}`
            //     )
            //     .addTo(map);
            // });
             
            map.current.on('mouseenter', 'clusters', () => {
                map.current.getCanvas().style.cursor = 'pointer';
            });
            map.current.on('mouseleave', 'clusters', () => {
                map.current.getCanvas().style.cursor = '';
            });
        });
    });


    return( 
        // <link href='https://api.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.css' rel='stylesheet' />
        <div className="App">

                <div className ="map-surrounding">
                <div ref={mapContainer} className="map-container" />
                <button id='tryAgain' >
                    <Link to={-1}>Try Again</Link>
                </button>
                </div>

            <p className="read-the-docs">
                &#127881; Get a map of the people around the world who share your music taste! &#127881;
            </p>
        </div>
    )
}

export default Map;
