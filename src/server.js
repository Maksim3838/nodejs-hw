
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { errors } from 'celebrate'

import { connectMongoDB } from './db/connectMongoDB.js'

import { logger } from './middleware/logger.js'
import { notFoundHandler } from './middleware/notFoundHandler.js'
import { errorHandler } from './middleware/errorHandler.js'
import notesRouter from './routes/notesRoutes.js'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(logger)
app.use(express.json())
app.use(cors())

app.use(notesRouter)

app.use(errors())

app.use(notFoundHandler)
app.use(errorHandler)

await connectMongoDB()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
