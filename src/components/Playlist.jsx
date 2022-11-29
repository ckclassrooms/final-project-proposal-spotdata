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

    // console.log(session);

    const getUserInfo = async () => {
        // e.preventDefault() search up
        const {data, error} = await axios.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${session.provider_token}`
            }
            // params: {
            //     q: searchKey,
            //     type: "artist"
            // }
        })
        setUser(data);
    }

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

    const renderUser = () => {
        return (
            <div key={user.id}>
                <h3> Profile name is: {user.display_name}</h3>
                <h3> Profile country is: {user.country}</h3>
                <h3> Profile email is: {user.email}</h3>
            </div>
        )
    }

    const toggleComplete = (index) => {
        console.log(index);
        setMapState(true);
    }

    // const renderPlaylist = () => {
    //     return (<p> something </p>
    //     )
    // }

    function ListItem(props) {
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
            {/* <li>{props.value}</li> */}
            </div>
        );
      }
      
    function NumberList(props) {
        console.log("props", props);
        console.log("props", props.playlists);


        const allPlaylists = props.playlists;

        return (
            <div className='playlist-shadow'>
            <ul>
              {allPlaylists.map((aPlaylist, index) =>
                <ListItem key={index}
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
            // <ul className="nav nav-pills navbar-expand navbar-light bg-light">
            //     <li className="nav-item ms-auto"><button className="btn btn-primary m-1" id='logoutSubmit' onClick={()=>logoutSubmit()}>Logout</button></li>       
            // </ul>
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

                    <button id='getUserInfo' onClick={() => getUserInfo()}>
                    Get User Info
                    </button>

                    <button id='signInWithSpotify' onClick={() => setMapState(true)}>
                    Show Map
                    </button>

                    <button className='button-41 'id='signInWithSpotify' onClick={() => getPlaylists()}>
                    Get Playlists
                    </button>
                </div>
                {renderUser()}
                <div className='outer-playlist-border'>
                    {NumberList({playlists})}
                </div>
            <p className="read-the-docs">
                &#127881; Get a map of the people around the world who share your music taste! &#127881;
            </p>
            </div>
        )
    }
    
}

export default Playlist;
