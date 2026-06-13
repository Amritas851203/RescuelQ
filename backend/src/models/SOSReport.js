import mongoose from 'mongoose';

const sosReportSchema = new mongoose.Schema(
  {
    reporter_name: {
      type: String,
      default: 'Anonymous'
    },
    location_lat: {
      type: Number,
      required: true
    },
    location_lng: {
      type: Number,
      required: true
    },
    message: {
      type: String,
      default: ''
    },
    severity: {
      type: String,
      default: 'pending'
    },
    affected_people: {
      type: Number,
      default: 1
    },
    risk_level: {
      type: Number,
      default: 5
    },
    status: {
      type: String,
      enum: ['Pending', 'Team Assigned', 'In Progress', 'Resolved'],
      default: 'Pending'
    },
    type: {
      type: String,
      default: 'Emergency'
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

const SOSReport = mongoose.model('SOSReport', sosReportSchema);

export default SOSReport;
