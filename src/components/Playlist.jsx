import React from 'react'
import reactLogo from '../assets/planet.webp';
import { useState, useEffect } from "react";
import axios from 'axios';
import Map from './Map.jsx';


function Playlist({ session, setSession, supabase}) {

    const [playlists, setPlaylists] = useState([])
    const [user, setUser] = useState([])
    const [mapState, setMapState] = useState(false);

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

    const toggleComplete = (index) => {
        setMapState(true);
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
        console.log("props", props);
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
        return ( 
            <Map session={session} setSession={setSession} supabase={supabase} />
        )
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

                    <button id='signInWithSpotify' onClick={() => setMapState(true)}>
                    Show Map
                    </button>

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
