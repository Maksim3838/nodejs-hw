import mongoose from 'mongoose'
import { Schema, model } from 'mongoose'
import { TAGS } from '../constants/tags.js'

const noteSchema = new Schema(
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
      index: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model('Note', noteSchema)