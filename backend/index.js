import express from "express";
import cors from "cors";
import connectDB from "./utils/db.js";
import pinsRouter from "./routes/pins.js";
import commentsRouter from "./routes/comments.js";
import boardsRouter from "./routes/boards.js";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import notificationsRouter from "./routes/notifications.js";
import messagesRouter from "./routes/messages.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/pins", pinsRouter);
app.use("/comments", commentsRouter);
app.use("/boards", boardsRouter);
app.use('/auth', authRouter);
app.use("/users", usersRouter);
app.use("/notifications", notificationsRouter);
app.use("/messages", messagesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
