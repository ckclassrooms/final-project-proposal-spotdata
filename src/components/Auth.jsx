import React from 'react'
import { useState, useEffect } from "react";
import reactLogo from '../assets/planet.webp';
import Playlist from './Playlist';

function Auth({session, setSession, supabase}) {

    const signInWithSpotify = async ()=>
    {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'spotify',
            options: {
                scopes: ['playlist-read-private','user-read-private']
            }
        });  
    }

    if (session != null){
        return ( 
            <Playlist session={session} setSession={setSession} supabase={supabase} />
        )
    }
    else {
    return ( 
        // <ul className="nav nav-pills navbar-expand navbar-light bg-light">
        //     <li className="nav-item "><NavLink className={({ isActive }) => "nav-link " + (isActive ? " active" : "")}
        //         to="/" end>Home</NavLink></li> 
        //         <div className="ms-auto" style={{display:"flex"}}>
        //         <li className="nav-item ms-auto"><button className="btn btn-primary m-1" id='loginSubmit' onClick={()=>loginSubmit()}>Login</button></li>
        //         </div>              
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

                <button id='signInWithSpotify' onClick={() => signInWithSpotify()}>
                Sign in with Spotify
                </button>
            </div>
        <p className="read-the-docs">
            &#127881; Get a map of the people around the world who share your music taste! &#127881;
        </p>
        </div>
    )
    }
}

export default Auth;