import { Segments, Joi } from 'celebrate'
import { isValidObjectId } from 'mongoose'

import { TAGS } from '../constants/tags.js'

const objectIdValidation = Joi.string().custom((value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.message('Invalid note ID')
  }

  return value
})

const noteFieldsSchema = {
  title: Joi.string().min(1),
  content: Joi.string(),
  tag: Joi.string().valid(...TAGS),
}

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),
    search: Joi.string().allow('').optional(),
  }),
}

export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: objectIdValidation.required(),
  }),
}

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().allow('').optional(),
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),
  }),
}

export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: objectIdValidation.required(),
  }),

  [Segments.BODY]: Joi.object(noteFieldsSchema).or(
    'title',
    'content',
    'tag',
  ),
}