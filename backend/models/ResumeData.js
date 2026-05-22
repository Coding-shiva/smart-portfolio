import mongoose from 'mongoose';

const resumeDataSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String,
      required: true,
    },
    atsScore: {
      type: Number,
      default: 0,
    },
    analysis: {
      skillsIdentified: [String],
      missingKeywords: [String],
      improvements: [String],
      rawGeminiFeedback: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const ResumeData = mongoose.model('ResumeData', resumeDataSchema);
export default ResumeData;
