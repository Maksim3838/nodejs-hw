import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(express.json());
app.use(pinoHttp());

app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;

  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

// Тестовий маршрут для перевірки обробки помилок
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// Middleware для неіснуючих маршрутів
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

// Middleware для обробки помилок
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
