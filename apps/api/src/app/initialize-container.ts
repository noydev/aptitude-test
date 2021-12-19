import strava from 'strava-v3';
import AuthStrava from './controllers/auth-strava';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import connect from 'libs/api/db-connect/src/lib/api-db-connect';
import AthleteService from './services/athlete';
import StravaService from './services/strava';

export const initializeContainer = async () => {
  const MONGO_USER = process.env.MONGO_USER;
  const MONGO_PWD = process.env.MONGO_PWD;
  const mongoUri = `mongodb://${MONGO_USER}:${MONGO_PWD}@127.0.0.1:27017/`;

  const db = connect(mongoUri);

  const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
  const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
  strava.config({
    access_token: '',
    client_id: STRAVA_CLIENT_ID,
    client_secret: STRAVA_CLIENT_SECRET,
    redirect_uri: 'http://127.0.0.1:4200/redirect',
  });

  const athleteService = new AthleteService();
  const stravaService = new StravaService(strava, athleteService);
  const authStrava = new AuthStrava(stravaService);

  return {
    authStrava,
  };
};
