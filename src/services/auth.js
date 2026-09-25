import { randomBytes } from 'node:crypto'

import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js'
import { Session } from '../models/session.js'

export const createSession = async (userId) => {
  const accessToken = randomBytes(30).toString('hex')
  const refreshToken = randomBytes(30).toString('hex')

  const accessTokenValidUntil = new Date(
    Date.now() + FIFTEEN_MINUTES,
  )

  const refreshTokenValidUntil = new Date(Date.now() + ONE_DAY)

  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  })

  return session
}

export const setSessionCookies = (res, session) => {
  res.cookie('accessToken', session.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: FIFTEEN_MINUTES,
  })

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ONE_DAY,
  })

  res.cookie('sessionId', session._id.toString(), {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ONE_DAY,
  })
}