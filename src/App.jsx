import './App.css'
import React from "react";
import {
  Routes,
  Route
} from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from './supabaseClient';
import Auth from './components/Auth';

function App() {
  const [count, setCount] = useState(0)
  const [session, setSession] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

  }, [])


  return (
    <Routes>
      <Route path="/" element={<Auth session={session} setSession={setSession} supabase={supabase} />} />
    </Routes>
    // <div className="App">
    //   <div>
    //     <a href="https://vitejs.dev" target="_blank">
    //       <img src="/vite.svg" className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://reactjs.org" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     {/* <button onClick={() => setCount((count) => count + 1)}> */}
    //     <button id='signInWithSpotify' onClick={() => signInWithSpotify()}>
    //       Sign in with Spotify
    //     </button>
    //     <p>
    //       Edit <code>src/App.jsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    // </div>
  )
}

export default App
