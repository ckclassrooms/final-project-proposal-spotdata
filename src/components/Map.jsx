import React, { useRef, useEffect, useState } from 'react';
import { mapboxClient } from '../mapboxClient';
import 'mapbox-gl/dist/mapbox-gl.css';
import Playlist from './Playlist';
import { Link } from "react-router-dom";
import axios from 'axios';
import Cat from '../assets/logo-spotify-256.png';


function Map({jsonData, session, setSession, supabase}) {
   
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(25.1);
    const [lat, setLat] = useState(25.1);
    const [zoom, setZoom] = useState(1.7);

    // console.log('The geo json data:', jsonData);

    const imageCat = new Image();
    imageCat.src = Cat;


    useEffect(() => {

        if (map.current) return; // initialize map only once
        map.current = new mapboxClient.Map({
            container: mapContainer.current,
            projection: 'mercator',
            style: 'mapbox://styles/mpashe2/clb8i4wkf000z14qrfwu0jdrz',
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
                data: jsonData,
                cluster: true,
                clusterMaxZoom: 10, // Max zoom to cluster points on
                clusterRadius: 5, // Radius of each cluster when clustering points (defaults to 50)
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
                        '#df1af5',
                        20,
                        '#f27815',
                        50,
                        '#f7ec17',
                        70,
                        '#44fa02',
                    ],
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'], 20, // all points : raidus 50
                        50, 30,  // points avobe x : radius y....ect.
                        70, 50
                    ],
                    'circle-blur': 1,
                    'circle-opacity': 0.8
                    },
            }); 
                
            // Text numbers to vizualize the number of points in each cluster
            // map.current.addLayer({
            //     id: 'cluster-count',
            //     type: 'symbol',
            //     source: 'artists_popularity',
            //     filter: ['has', 'point_count'],
            //     layout: {
            //         'text-field': '{point_count_abbreviated}',
            //         // "text-field": ["get", "sum"],
            //         'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            //         'text-size': 12,
            //     },
            //     'paint': {
            //         'text-color': '#fff',
            //         // 'text-halo-color': '#fff',
            //         // 'text-halo-width': 2
            //     }
            // });

            
            map.current.addImage('spotify-logo', imageCat);
            map.current.addSource('point', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-123.31364010942333, -47.23786323721275] // [-77.4144, 25.0759]
                            }
                        }
                    ]
                }
            });

            map.current.addLayer({
                'id': 'points',
                'type': 'symbol',
                'source': 'point', // reference the data source
                'layout': {
                    'icon-image': 'spotify-logo', // reference the image
                    'icon-size': 0.60
                    }
            });
        
        
            // map.current.addLayer({
            //     id: 'unclustered-point',
            //     type: 'circle',
            //     source: 'artists_popularity',
            //     filter: ['!', ['has', 'point_count']],
            //     paint: {
            //     'circle-color': '#11b4da',
            //     'circle-radius': 4,
            //     'circle-stroke-width': 1,
            //     'circle-stroke-color': '#fff',
            //     }
            // });
                
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
                {/* <button onClick={() => generateMap()}>
                        Get Map
                </button> */}
                <p className='header-style'>Which cities share your music taste? </p>
                <div ref={mapContainer} className="map-container" /> 
                    <div>
                    {/* <button id='tryAgain' >
                        <Link to={-1}>Try Again</Link>
                    </button>        */}
                    {/* <button onClick={() => generateInfo()}>
                        Get Playlists
                    </button> */}
                    </div>
                </div>
              
            <p className="read-the-docs">
                &#127881; Get a map of the people around the world who share your music taste! &#127881;
            </p>
        </div>
    )
}

export default Map;
