
import { HttpError } from 'http-errors'

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message,
    })
  }

  res.status(500).json({
    message: err.message,
  })
}
