import AthleteModel from '../entities/athlete';
import { StravaTokenSet } from './strava';

export interface IAthleteService {
  findById(id: string): Promise<any>;
  findByStravaId(stravaId: string): Promise<any>;
  createAthlete(athlete: any): Promise<any>;
  deactivateAthlete(athleteId: string);
  updateStravaToken(athleteId: string, stravaTokenSet: StravaTokenSet);
}

export default class AthleteService implements IAthleteService {
  async findById(stravaId: string) {
    return AthleteModel.findById(stravaId);
  }
  async findByStravaId(stravaId: string) {
    return AthleteModel.findOne({ strava_id: stravaId });
  }
  async createAthlete(athleteAtribute: any) {
    const toBeSaved = new AthleteModel(athleteAtribute);
    return toBeSaved.save();
  }
  async deactivateAthlete(athleteId: string) {
    return AthleteModel.findByIdAndUpdate(athleteId, {
      status: AthleteStatus.DEACTIVATED,
    });
  }
  async updateStravaToken(athleteId: string, stravaTokenSet: StravaTokenSet) {
    return AthleteModel.findByIdAndUpdate(athleteId, {
      status: AthleteStatus.ACTIVE,
      strava_token: stravaTokenSet,
    });
  }
}

export enum AthleteStatus {
  ACTIVE = 'active',
  DEACTIVATED = 'deactivated',
}
