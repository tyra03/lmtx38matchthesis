import express from "express";
import cors from "cors";
import studentRouter from "./router/studentRouter";
import { sequelize } from "./model";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/students", studentRouter);

// Sync DB before starting server
sequelize.sync().then(() => {
  console.log("Database synced");
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
