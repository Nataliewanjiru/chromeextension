import React from 'react'
import Appnavbar from './Navbar'
import People from './People'
import { useEffect } from 'react';
import { jwtDecode } from "jwt-decode";


function Register() {

  function handleCallbackResponse(response){
    console.log("Encoded JWT ID TOKEN: " + JSON.stringify(response))
    var userObject =jwtDecode(response.credential);
    console.log(userObject)
  }

useEffect(() => {
  google.accounts.id.initialize({
    client_id: '698809988358-6h22jroa48an0jdaoqm2sc51mjsmffmo.apps.googleusercontent.com',
   callback: handleCallbackResponse
  });

  google.accounts.id.renderButton(
    document.getElementById("signInDiv"),
    { theme: "outline",size: "large" }, 
  )
    
  }, [google.accounts.id, handleCallbackResponse]); 


  return (
    <>
    <Appnavbar/>
   
    <div id="signInDiv" data-onsuccess="onSignIn"> Sign in with Google
    </div>
    </>
  )
}

export default Register