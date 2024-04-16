import React, { useEffect, useState } from 'react';

const People = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [connections, setConnections] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = 'https://apis.google.com/js/api.js';
    script1.async = true;
    script1.onload = gapiLoaded;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://accounts.google.com/gsi/client';
    script2.async = true;
    script2.onload = gisLoaded;
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  const gapiLoaded = () => {
    window.gapi.load('client', initializeGapiClient);
  };

  const initializeGapiClient = async () => {
    await window.gapi.client.init({
      apiKey: 'AIzaSyAJTR5X0TL4jMc58oTxyCL7K4EImphDLyk',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/people/v1/rest'],
    });
    maybeEnableButtons();
  };

  const gisLoaded = () => {
    window.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: '698809988358-6h22jroa48an0jdaoqm2sc51mjsmffmo.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/contacts.readonly',
      callback: '',
    });
    maybeEnableButtons();
  };

  const maybeEnableButtons = () => {
    setIsSignedIn(true);
  };

  const handleAuthClick = async () => {
    window.tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      await listConnectionNames();
    };

    if (window.gapi.client.getToken() === null) {
      window.tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      window.tokenClient.requestAccessToken({ prompt: '' });
    }
  };

  const handleSignoutClick = () => {
    const token = window.gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken('');
      setConnections([]);
    }
  };

  const listConnectionNames = async () => {
    try {
      const response = await window.gapi.client.people.people.connections.list({
        resourceName: 'people/me',
        pageSize: 10,
        personFields: 'names,emailAddresses',
      });
      const connectionsData = response.result.connections;
      if (!connectionsData || connectionsData.length === 0) {
        setErrorMessage('No connections found.');
      } else {
        setConnections(connectionsData.map((person) => person.names ? person.names[0].displayName : 'Missing display name'));
      }
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div>
      <p>People API Quickstart</p>
      <button onClick={handleAuthClick} disabled={!isSignedIn}>Authorize</button>
      <button onClick={handleSignoutClick} disabled={!isSignedIn}>Sign Out</button>
      {errorMessage && <p>{errorMessage}</p>}
      <pre>{connections.join('\n')}</pre>
    </div>
  );
};

export default People;
