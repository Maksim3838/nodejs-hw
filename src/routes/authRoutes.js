import { Router } from 'express'
import { celebrate } from 'celebrate'

import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validations/authValidation.js'

import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  requestResetEmail,
  resetPassword,
} from '../controllers/authController.js'

const router = Router()

router.post(
  '/register',
  celebrate({
    body: registerUserSchema,
  }),
  registerUser,
)

router.post(
  '/login',
  celebrate({
    body: loginUserSchema,
  }),
  loginUser,
)

router.post(
  '/request-reset-email',
  celebrate({
    body: requestResetEmailSchema,
  }),
  requestResetEmail,
)

router.post(
  '/reset-password',
  celebrate({
    body: resetPasswordSchema,
  }),
  resetPassword,
)

router.post('/refresh', refreshUserSession)

router.post('/logout', logoutUser)

export default router