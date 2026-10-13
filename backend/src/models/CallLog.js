import mongoose from 'mongoose';

const callLogSchema = new mongoose.Schema(
  {
    call_sid: {
      type: String,
      default: () => `CALL-${Math.floor(100000 + Math.random() * 900000)}`
    },
    incident_id: {
      type: String,
      ref: 'SOSReport'
    },
    contact_name: {
      type: String,
      required: true
    },
    contact_phone: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Initiating', 'Calling', 'Ringing', 'Connected', 'Completed', 'Failed', 'No Answer', 'Busy'],
      default: 'Initiating'
    },
    department: {
      type: String,
      default: 'Medical'
    },
    recording_url: {
      type: String
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

const CallLog = mongoose.models.CallLog || mongoose.model('CallLog', callLogSchema);

export default CallLog;
