import express from 'express';
import cors from 'cors';
import connectDB from './utils/db.js';
import pinsRouter from './routes/pins.js';
import commentsRouter from './routes/comments.js';
import boardsRouter from './routes/boards.js';
import usersRouter from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/pins', pinsRouter);
app.use('/comments', commentsRouter);
app.use('/boards', boardsRouter);
app.use('/users', usersRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});