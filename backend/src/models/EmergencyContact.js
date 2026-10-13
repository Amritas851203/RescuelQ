import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['Medical', 'Fire', 'Police', 'Disaster Management', 'Coast Guard', 'General'],
      default: 'Medical'
    },
    phone: {
      type: String,
      required: true
    },
    location: {
      type: String,
      default: 'Central District'
    },
    status: {
      type: String,
      enum: ['Available', 'Busy', 'Standby', 'Offline'],
      default: 'Available'
    },
    priority: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

const EmergencyContact = mongoose.models.EmergencyContact || mongoose.model('EmergencyContact', emergencyContactSchema);

export default EmergencyContact;
