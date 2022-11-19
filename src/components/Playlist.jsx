import React from 'react'
import reactLogo from '../assets/planet.webp';
import { useState, useEffect } from "react";
import axios from 'axios';

function Playlist({ session, setSession, supabase}) {

    const [playlist, setPlaylist] = useState([])
    const [user, setUser] = useState([])

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


    console.log('user:', user);

    const renderUser = () => {
        return (
            <div key={user.id}>
                <h3> Profile name is: {user.display_name}</h3>
                <h3> Profile country is: {user.country}</h3>
                <h3> Profile email is: {user.email}</h3>
            </div>
        )
    }

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
            </div>
            {renderUser()}
        <p className="read-the-docs">
            &#127881; Get a map of the people around the world who share your music taste! &#127881;
        </p>
        </div>
    )
    
}

export default Playlist;