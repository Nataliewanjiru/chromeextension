import { useEffect, useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom';
import Home from './Home'
import Login from './Login';
import Register from './Register';
import Helpcenter from './Helpcenter';


function App() {


  return (
    <>
    <Home/>
    <Routes>
      <Route path="/login" exact="true" element={<Login/>}/>
      <Route path="/register"  exact="true" element={<Register/>}/>
      <Route path="/help-center"  exact="true" element={<Helpcenter/>}/>
    </Routes>
    </>
  )
}

export default App
