import AthleteService, { AthleteStatus } from './athlete';
import { Strava } from 'strava-v3';
import { generateAccessToken, authenticateToken } from '@aptitude/auth-jwt';

export interface IStravaService {
  redirectOAuth(): Promise<string>;
  oAuthCallback(code: string): Promise<string>;
  disConnectApp(athleteId: string): Promise<any>;
}

export default class StravaService implements IStravaService {
  private strava: Strava;
  private athleteService: AthleteService;

  public constructor(strava: Strava, athleteService: AthleteService) {
    this.strava = strava;
    this.athleteService = athleteService;
  }

  public async redirectOAuth(): Promise<string> {
    return this.strava.oauth.getRequestAccessURL({
      scope: ['activity:read_all'],
    });
  }

  public async oAuthCallback(code: string): Promise<any> {
    const token = await this.strava.oauth.getToken(code);
    // Process token...
    const { token_type, expires_at, access_token, refresh_token, athlete } =
      token;
    let foundAthlete = await this.athleteService.findByStravaId(athlete.id);
    if (!foundAthlete) {
      foundAthlete = await this.athleteService.createAthlete({
        status: AthleteStatus.ACTIVE,
        strava_token: {
          token_type,
          expires_at,
          access_token,
          refresh_token,
        },
        ...athlete,
        strava_id: athlete.id,
      });
    } else {
      await this.athleteService.updateStravaToken(foundAthlete._id, {
        token_type,
        expires_at,
        access_token,
        refresh_token,
      });
    }

    const jwt = generateAccessToken(foundAthlete._id.toString());
    return {
      token: jwt,
      athlete,
    };
  }

  public async disConnectApp(stravaId: string) {
    const athlete = await this.athleteService.findById(stravaId);
    if (!athlete || athlete.status === AthleteStatus.DEACTIVATED) {
      throw new Error('Cant deactivate athelete');
    }
    const accessToken = await this.checkForToken(
      stravaId,
      athlete.strava_token
    );
    try {
      const deAuthRes = await this.strava.oauth.deauthorize({
        access_token: accessToken,
      });
      await this.athleteService.deactivateAthlete(athlete._id);
      return deAuthRes;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  private async checkForToken(
    stravaId: string,
    tokenSet: StravaTokenSet
  ): Promise<string> {
    if (Date.now() / 1000 < tokenSet.expires_at - 100) {
      return tokenSet.access_token;
    }

    const refreshToken = await this.strava.oauth.refreshToken(
      tokenSet.refresh_token
    );
    await this.athleteService.updateStravaToken(stravaId, refreshToken);

    return refreshToken.access_token;
  }

  private async getActivities() {
    const dateNow = new Date();
    dateNow.setDate(dateNow.getDate() - 3);
    const utime = dateNow.getTime();

    const gotActivities = await this.strava.activities.get({
      after: utime,
    });
    console.log(gotActivities);
  }
}

export interface StravaTokenSet {
  token_type: string;
  expires_at: number;
  refresh_token: string;
  access_token: string;
}
