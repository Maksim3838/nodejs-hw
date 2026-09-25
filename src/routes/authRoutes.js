import { Router } from 'express'
import { celebrate } from 'celebrate'

import {
  registerUser,
  refreshUserSession,
  logoutUser,
} from '../controllers/authController.js'

import { registerUserSchema } from '../validations/authValidation.js'

const router = Router()

router.post(
  '/register',
  celebrate({
    body: registerUserSchema,
  }),
  registerUser,
)

router.post('/refresh', refreshUserSession)

router.post('/logout', logoutUser)

export default router