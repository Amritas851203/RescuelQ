import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: [true, 'Please add a team name'],
      unique: true,
      trim: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    vehicle: {
      type: {
        type: String,
        enum: ['ambulance', 'fire-truck', 'police-car', 'helicopter', 'drone'],
      },
      id: String,
    },
    currentLocation: {
      lat: Number,
      lng: Number,
    },
    missionStatus: {
      type: String,
      enum: ['available', 'on-route', 'on-scene', 'returning', 'off-duty'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model('Team', teamSchema);

export default Team;
