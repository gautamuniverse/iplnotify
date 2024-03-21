import mongoose from "mongoose";

const IplSchema = new mongoose.Schema({
  name: String,
  details: {
    captain: String,
    coach: String,
    home_ground: String,
    owner: String,
    team_logo: String,
  },
  players: [
    {
      name: String,
      role: String,
      nationality: String,
    },
  ],
}); 


export const IplModel = mongoose.model("IplTeams", IplSchema);