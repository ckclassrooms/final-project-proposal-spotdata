import React from 'react'
import { NavLink } from 'react-router-dom'
import reactLogo from '../assets/react.svg';

function Auth({session, setSession, supabase}) {

    const signInWithSpotify = async ()=>{
        // Todo - Add logic to login via Spotify Oauth
        const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'spotify',
    });   
    }

    const signOutWithSpotify = async ()=>{
        const { error } = await supabase.auth.signOut();
        setSession(null);
    }

    if (session != null){
        return ( 
        
        // <ul className="nav nav-pills navbar-expand navbar-light bg-light">
        //     <li className="nav-item ms-auto"><button className="btn btn-primary m-1" id='logoutSubmit' onClick={()=>logoutSubmit()}>Logout</button></li>       
        // </ul>
        <div className="App">
            <div>
                <a href="https://vitejs.dev" target="_blank">
                <img src="/vite.svg" className="logo" alt="Vite logo" />
                </a>
                <a href="https://reactjs.org" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                {/* <button onClick={() => setCount((count) => count + 1)}> */}

                <button id='signInWithSpotify' onClick={() => signOutWithSpotify()}>
                Logout with Spotify
                </button>
            </div>
        <p className="read-the-docs">
            Click on the Vite and React logos to learn more
        </p>
        </div>
        
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
                <a href="https://vitejs.dev" target="_blank">
                <img src="/vite.svg" className="logo" alt="Vite logo" />
                </a>
                <a href="https://reactjs.org" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                {/* <button onClick={() => setCount((count) => count + 1)}> */}

                <button id='signInWithSpotify' onClick={() => signInWithSpotify()}>
                Sign in with Spotify
                </button>
            </div>
        <p className="read-the-docs">
            Click on the Vite and React logos to learn more
        </p>
        </div>
    )
    }
}

export default Auth;