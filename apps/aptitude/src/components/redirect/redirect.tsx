import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useLocalStorage from '../../hooks/use-local-storage/use-local-storage';
import './redirect.css';

export function Redirect() {
  const search = useLocation().search;
  let navigate = useNavigate();
  const [currentUser, setCurrentUser] = useLocalStorage('user', '');
  const code = new URLSearchParams(search).get('code');

  useEffect(() => {
    (async () => {
      const url = new URL('http://localhost:3333/auth/callback');
      const queries = { code };
      url.search = new URLSearchParams(queries).toString();
      const res = await fetch(url.toString());
      const data = await res.json();
      console.log('yay', data);
      setCurrentUser(data);
      navigate('/');
    })();
  }, []);

  return (
    <div className="Redirect">
      <p>Authenticating...</p>
    </div>
  );
}

export default Redirect;
