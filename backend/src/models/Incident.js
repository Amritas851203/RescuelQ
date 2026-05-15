import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    severity: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    location: {
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    status: {
      type: String,
      enum: ['reported', 'dispatched', 'active', 'resolved', 'closed'],
      default: 'reported',
    },
    assignedTeams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
      },
    ],
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Incident = mongoose.model('Incident', incidentSchema);

export default Incident;
