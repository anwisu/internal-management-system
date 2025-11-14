import mongoose from 'mongoose';

const socialMediaSchema = new mongoose.Schema({
  instagram: {
    type: String,
    default: '',
  },
  twitter: {
    type: String,
    default: '',
  },
  youtube: {
    type: String,
    default: '',
  },
});

const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Artist name is required'],
      unique: true,
      trim: true,
    },
    bio: {
      type: String,
      default: '',
    },
    imageUrl: {
      public_id: {
        type: String,
        default: '',
      },
      url: {
        type: String,
        default: '',
      },
    },
    genre: {
      type: String,
      default: '',
    },
    contactEmail: {
      type: String,
      default: '',
    },
    contactPhone: {
      type: String,
      default: '',
    },
    socialMedia: {
      type: socialMediaSchema,
      default: {},
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
artistSchema.index({ name: 1 });
artistSchema.index({ status: 1 });

const Artist = mongoose.model('Artist', artistSchema);

export default Artist;

