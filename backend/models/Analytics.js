import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      default: 'anonymous',
    },
    userAgent: {
      type: String,
    },
    browser: {
      type: String,
      default: 'Unknown',
    },
    os: {
      type: String,
      default: 'Unknown',
    },
    device: {
      type: String,
      enum: ['Desktop', 'Tablet', 'Mobile', 'Unknown'],
      default: 'Unknown',
    },
    referrer: {
      type: String,
      default: 'Direct',
    },
  },
  {
    timestamps: true,
  }
);

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;
