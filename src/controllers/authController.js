import bcrypt from 'bcrypt'

import createHttpError from 'http-errors'

import { User } from '../models/user.js'

import { createSession, setSessionCookies } from '../services/auth.js'

import { Session } from '../models/session.js'

export const registerUser = async (req, res) => {
  const { email, password } = req.body

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    throw createHttpError(400, 'Email in use')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    email,
    password: hashedPassword,
  })

  const session = await createSession(user._id)

  setSessionCookies(res, session)

  res.status(201).json(user)
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    throw createHttpError(401, 'Invalid credentials')
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    throw createHttpError(401, 'Invalid credentials')
  }

  await Session.deleteMany({ userId: user._id })

  const session = await createSession(user._id)

  setSessionCookies(res, session)

  res.status(200).json(user)
}

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies

  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  })

  if (!session) {
    throw createHttpError(401, 'Session not found')
  }

  if (session.refreshTokenValidUntil < new Date()) {
    await Session.deleteOne({ _id: session._id })

    res.clearCookie('sessionId')
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    throw createHttpError(401, 'Session token expired')
  }

  await Session.deleteOne({ _id: session._id })

  const newSession = await createSession(session.userId)

  setSessionCookies(res, newSession)

  res.status(200).json({
    message: 'Session refreshed',
  })
}

export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId })
  }

  res.clearCookie('sessionId')
  res.clearCookie('accessToken')
  res.clearCookie('refreshToken')

  res.status(204).send()
}