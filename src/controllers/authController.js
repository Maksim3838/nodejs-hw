import jwt from 'jsonwebtoken'
import Handlebars from 'handlebars'
import fs from 'node:fs/promises'
import path from 'node:path'
import bcrypt from 'bcrypt'

import createHttpError from 'http-errors'

import { User } from '../models/user.js'
import { sendEmail } from '../utils/sendMail.js'
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

export const requestResetEmail = async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    return res.status(200).json({
      message: 'Password reset email sent successfully',
    })
  }

  const token = jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '15m',
    },
  )

  const resetLink = `${process.env.FRONTEND_DOMAIN}/reset-password?token=${token}`

  const templatePath = path.resolve(
    'src/templates/reset-password-email.html',
  )

  const template = await fs.readFile(templatePath, 'utf-8')

  const templateCompiler = Handlebars.compile(template)

  const html = templateCompiler({
    name: user.username,
    resetLink,
  })

  try {
    await sendEmail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: 'Password reset',
      html,
    })
  } catch (error) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    )
  }

  res.status(200).json({
    message: 'Password reset email sent successfully',
  })
}

export const resetPassword = async (req, res) => {
  const { token, password } = req.body

  let payload

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    throw createHttpError(401, 'Invalid or expired token')
  }

  const user = await User.findOne({
    _id: payload.sub,
    email: payload.email,
  })

  if (!user) {
    throw createHttpError(404, 'User not found')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  user.password = hashedPassword

  await user.save()

  res.status(200).json({
    message: 'Password reset successfully',
  })
}