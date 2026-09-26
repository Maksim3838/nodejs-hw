import { Router } from 'express'

import { celebrate } from 'celebrate'

import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js'

import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
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

router.post('/refresh', refreshUserSession)

router.post('/logout', logoutUser)

export default router