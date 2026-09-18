
import createHttpError from 'http-errors'
import Note from '../models/note.js'

export const getAllNotes = async (req, res) => {
  const notes = await Note.find()

  res.status(200).json(notes)
}

export const getNoteById = async (req, res) => {
  const { noteId } = req.params

  const note = await Note.findById(noteId)

  if (!note) {
    throw createHttpError(404, 'Note not found')
  }

  res.status(200).json(note)
}

export const createNote = async (req, res) => {
  const note = await Note.create(req.body)

  res.status(201).json(note)
}

export const deleteNote = async (req, res) => {
  const { noteId } = req.params

  const note = await Note.findByIdAndDelete(noteId)

  if (!note) {
    throw createHttpError(404, 'Note not found')
  }

  res.status(200).json(note)
}

export const updateNote = async (req, res) => {
  const { noteId } = req.params

  const note = await Note.findByIdAndUpdate(noteId, req.body, {
    returnDocument: 'after' 
  })

  if (!note) {
    throw createHttpError(404, 'Note not found')
  }

  res.status(200).json(note)
}
