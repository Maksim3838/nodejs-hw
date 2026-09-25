import createHttpError from 'http-errors'

import { Note } from '../models/note.js'

export const getAllNotes = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      tag,
      search,
    } = req.query

    const pageNumber = Number(page)
    const perPageNumber = Number(perPage)

    const myQuery = Note.find({
      userId: req.user._id,
    })

    if (tag) {
      myQuery.where({ tag })
    }

    if (search) {
      myQuery.where({
        $or: [
          {
            title: {
              $regex: search,
              $options: 'i',
            },
          },
          {
            content: {
              $regex: search,
              $options: 'i',
            },
          },
        ],
      })
    }

    const totalNotes = await Note.countDocuments(myQuery.getFilter())

    const totalPages = Math.ceil(totalNotes / perPageNumber)

    const notes = await myQuery
      .skip((pageNumber - 1) * perPageNumber)
      .limit(perPageNumber)
      .exec()

    res.status(200).json({
      page: pageNumber,
      perPage: perPageNumber,
      totalNotes,
      totalPages,
      notes,
    })
  } catch (error) {
    next(error)
  }
}

export const getNoteById = async (req, res) => {
  const { noteId } = req.params

  const note = await Note.findOne({
    _id: noteId,
    userId: req.user._id,
  })

  if (!note) {
    throw createHttpError(404, 'Note not found')
  }

  res.status(200).json(note)
}

export const createNote = async (req, res) => {
  const note = await Note.create({
    ...req.body,
    userId: req.user._id,
  })

  res.status(201).json(note)
}

export const deleteNote = async (req, res) => {
  const { noteId } = req.params

  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  })

  if (!note) {
    throw createHttpError(404, 'Note not found')
  }

  res.status(200).json(note)
}

export const updateNote = async (req, res) => {
  const { noteId } = req.params

  const note = await Note.findOneAndUpdate(
    {
      _id: noteId,
      userId: req.user._id,
    },
    req.body,
    {
      returnDocument: 'after',
    },
  )

  if (!note) {
    throw createHttpError(404, 'Note not found')
  }

  res.status(200).json(note)
}