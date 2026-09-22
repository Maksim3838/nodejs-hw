
import mongoose from 'mongoose'

import { TAGS } from '../constants/tags.js'

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
      trim: true,
    },
    tag: {
      type: String,
      enum: TAGS,
      default: 'Todo',
    },
  },
  {
    timestamps: true,
  },
)

noteSchema.index({ tag: 1 })

export default mongoose.model('Note', noteSchema)
