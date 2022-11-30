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
  )
}

export default App
