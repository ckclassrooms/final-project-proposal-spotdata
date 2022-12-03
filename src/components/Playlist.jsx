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
        
        for ( const a of get_result.data){ // a is an artist
            // sample_geojson.features.push();
            const outter_obj1 = { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": []}};
            const outter_obj2 = { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": []}};
            const outter_obj3 = { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": []}};
            const outter_obj4 = { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": []}};
            const outter_obj5 = { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": []}};
    
            outter_obj1.geometry.coordinates.push(a.city1_lng);
            outter_obj1.geometry.coordinates.push(a.city1_lat);
            outter_obj2.geometry.coordinates.push(a.city2_lng);
            outter_obj2.geometry.coordinates.push(a.city2_lat);
            outter_obj3.geometry.coordinates.push(a.city3_lng);
            outter_obj3.geometry.coordinates.push(a.city3_lat);
            outter_obj4.geometry.coordinates.push(a.city4_lng);
            outter_obj4.geometry.coordinates.push(a.city4_lat);
            outter_obj5.geometry.coordinates.push(a.city5_lng);
            outter_obj5.geometry.coordinates.push(a.city5_lat);
            outter_obj1.properties['number'] = a.city1_num;
            outter_obj2.properties['number'] = a.city2_num;
            outter_obj3.properties['number'] = a.city3_num;
            outter_obj4.properties['number'] = a.city4_num;
            outter_obj5.properties['number'] = a.city5_num;
    
            sample_geojson.features.push(outter_obj1);
            sample_geojson.features.push(outter_obj2);
            sample_geojson.features.push(outter_obj3);
            sample_geojson.features.push(outter_obj4);
            sample_geojson.features.push(outter_obj5);
    
            // console.log("a", a);
        }
        
        // num/1000000 * 100
        // console.log(sample_geojson);
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
