import mongoose from 'mongoose';

//Define a schema
const Schema = mongoose.Schema;

const AthleteSchema = new Schema(
  {
    strava_token: {
      token_type: String,
      expires_at: Number,
      expires_in: Number,
      refresh_token: String,
      access_token: String,
    },
  },
  { strict: false }
);
const AthleteModel = mongoose.model('Athlete', AthleteSchema);
export default AthleteModel;
