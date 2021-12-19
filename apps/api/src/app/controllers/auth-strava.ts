import { Request, Response, Router } from 'express';
import { authenticateToken } from '@aptitude/auth-jwt';

import StravaService from '../services/strava';

export default class AuthStrava {
  private router: Router;
  private stravaService: StravaService;

  public constructor(stravaService: StravaService) {
    this.router = Router();
    this.stravaService = stravaService;

    this.router.get('/', this.redirectOAuth.bind(this));
    this.router.get('/callback', this.oAuthCallback.bind(this));
    this.router.post(
      '/disconnect',
      authenticateToken,
      this.disconectApp.bind(this)
    );
  }

  public async redirectOAuth(req: Request, res: Response) {
    const authUrl = await this.stravaService.redirectOAuth();
    res.send({ authUrl });
  }

  public async oAuthCallback(req: Request, res: Response) {
    const code = req.query.code as string;
    const loggedInData = await this.stravaService.oAuthCallback(code);
    res.send(loggedInData);
  }

  public async disconectApp(req: any, res: Response) {
    const uId = req.user;
    try {
      const deAuthRes = await this.stravaService.disConnectApp(uId);
      res.send({ status: 'disconnected' });
    } catch (err) {
      res.sendStatus(400);
    }
  }

  getRouter() {
    return this.router;
  }
}
