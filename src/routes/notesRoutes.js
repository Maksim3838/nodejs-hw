import { Router } from 'express'
import { celebrate } from 'celebrate'

import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js'

import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js'

import { authenticate } from '../middleware/authenticate.js'

const router = Router()

router.use(authenticate)

router.get('/notes', celebrate(getAllNotesSchema), getAllNotes)

router.get(
  '/notes/:noteId',
  celebrate(noteIdSchema),
  getNoteById,
)

router.post(
  '/notes',
  celebrate(createNoteSchema),
  createNote,
)

router.patch(
  '/notes/:noteId',
  celebrate(updateNoteSchema),
  updateNote,
)

router.delete(
  '/notes/:noteId',
  celebrate(noteIdSchema),
  deleteNote,
)

export default router