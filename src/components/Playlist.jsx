import React from 'react'
import reactLogo from '../assets/planet.webp';
import { useState, useEffect } from "react";
import axios from 'axios';
import Map from './Map.jsx';


function Playlist({ session, setSession, supabase}) {

    const [playlists, setPlaylists] = useState([])
    // const [currPlaylist, setPlaylist] = useState(null)
    const [user, setUser] = useState([])
    const [mapState, setMapState] = useState(false);
    // const [jsonData, setJsonData] = useState({ "type": "FeatureCollection", "features": []});
    const [jsonData, setJsonData] = useState(null);

    const signOutWithSpotify = async ()=>{
        const { error } = await supabase.auth.signOut();
        setSession(null);
    }

    useEffect(() => {

        const fetchData = async () => {
            const {data, error} = await axios.get("https://api.spotify.com/v1/me", {
                headers: {
                    Authorization: `Bearer ${session.provider_token}`
                }
            });
            setUser(data);
          }
          fetchData().catch(console.error);
    }, []);


    const getPlaylists = async () => {
        // e.preventDefault() search up

        const {data, error} = await axios.get("https://api.spotify.com/v1/me/playlists", {
            headers: {
                Authorization: `Bearer ${session.provider_token}`
            },
            params: {
                limit: 50,
                offser: 0
            }
        })


        let currentPlaylists = [];
        for (const playlist of data.items) {
            if (playlist.owner.id === user.id) { // Get only lists that belong to the user
                playlist["isSelect"] = false;
                currentPlaylists.push(playlist);
            }
        }
        setPlaylists(currentPlaylists);
    }

    const generateData = async (currPlaylist) => {

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
    
        const sample_geojson = { "type": "FeatureCollection", "features": []};
        
        for (const item of get_result.data) {

            const cities_coor = [[item.city1_lng, item.city1_lat],[item.city2_lng, item.city2_lat], [item.city3_lng, item.city3_lat], [item.city4_lng, item.city4_lat], [item.city5_lng, item.city5_lat]];
            const cities_popularity = [item.city1_num, item.city2_num, item.city3_num, item.city4_num, item.city5_num];

            for (let i = 0; i < cities_popularity.length; i++) {
                const cluster_size = cities_popularity[i]/1000000 * 100;
                for (let j = 0 ; j < cluster_size; j++) {
                    sample_geojson.features.push({
                        "type": "Feature",
                        "properties": {
                            "popularity": cities_popularity[i],
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": cities_coor[i]
                        }
                    });
                }
            }
        }

        setJsonData(sample_geojson);        
    }


    const toggleComplete = async (index) => {
        // setPlaylist(playlists.at(index));
        await generateData(playlists.at(index)).then(setMapState(true));
        // setMapState(true);
    }

    function ListPlaylist(props) {
        // Correct! There is no need to specify the key here:
        const item = props.value;
        const index = props.index;
        return (
            <div className='highlight-playlist' onClick={() => toggleComplete(index)} >
            {item.isSelected ? (
					<>
						<span>{ item.name}</span>
					</>
				) : (
					<>
						<span>{item.name}</span>
					</>
            )}
            </div>
        );
    }
      
    function RenderPlaylist(props) {
        // console.log("props", props);
        // console.log("props", props.playlists);

        const allPlaylists = props.playlists;

        return (
            <div className='playlist-shadow'>
            <ul>
              {allPlaylists.map((aPlaylist, index) =>
                <ListPlaylist key={index}
                          index={index} value={aPlaylist}/>
              )}
            </ul>
            </div>
        );
    }

    if (mapState ===  true){
        if (jsonData === null) {
            return <>Still loading...</>;
        }else{
            return ( 
                <Map jsonData={jsonData} session={session} setSession={setSession} supabase={supabase} />
            )
        }
    }
    else {
        return (        
            <div className="App">
                <div>
                    <a href="" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                    </a>
                </div>
                <h1>Spodatify</h1>
                <div className="card">
                    {/* <button onClick={() => setCount((count) => count + 1)}> */}
                    <button id='signInWithSpotify' onClick={() => signOutWithSpotify()}>
                    Logout with Spotify
                    </button>

                    {/* <button id='signInWithSpotify' onClick={() => setMapState(true)}>
                    Show Map
                    </button> */}

                    <button className='button-41 'id='signInWithSpotify' onClick={() => getPlaylists()}>
                    Get Playlists
                    </button>
                </div>
                <div className='outer-playlist-border'>
                    {RenderPlaylist({playlists})}
                </div>
            <p className="read-the-docs">
                &#127881; Get a map of the people around the world who share your music taste! &#127881;
            </p>
            </div>
        )
    }
    
}

export default Playlist;
