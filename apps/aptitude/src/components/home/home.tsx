import './home.css';
import { useState } from 'react';
import useLocalStorage from '../../hooks/use-local-storage/use-local-storage';

export function Home() {
  const [currentUser, setCurrentUser] = useLocalStorage('user', null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const connect = async () => {
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3333/auth');
      const data = await res.json();
      console.log('yay', data);

      window.location.assign(data.authUrl);
    } catch (err) {
      console.error(err);
      let errorMessage = 'Failed to connect';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setCurrentUser('');
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    setLoading(true);

    try {
      const a = await fetch('http://localhost:3333/auth/disconnect', {
        method: 'POST',
        headers: {
          authorization: currentUser.token,
          'Content-Type': 'application/json',
        },
      });
      console.log('disconnec', a);

      setCurrentUser(null);
    } catch (err) {
      let errorMessage = 'Failed to connect';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="Home">
        <p>Loading ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="Home">
        <p>There is some error: {error}</p>
      </div>
    );
  }

  return (
    <div className="Home">
      <img
        src="https://cdn.worldvectorlogo.com/logos/strava-2.svg"
        alt="strava-logo"
      />

      <p>Strava</p>
      {currentUser && (
        <a href={`https://www.strava.com/athletes/${currentUser?.athlete?.id}`}>
          https://www.strava.com/athletes/{currentUser?.athlete?.id}
        </a>
      )}
      {currentUser ? (
        <button className="dis" onClick={disconnect}>
          Disconnect
        </button>
      ) : (
        <button className="con" onClick={connect}>
          Connect
        </button>
      )}
    </div>
  );
}

export default Home;
