import express from "express";
import cors from "cors";
import studentRouter from "./router/studentRouter";
import exjobbAdRouter from "./router/exjobbAdRouter";
import { sequelize } from "./model";
import path from "path";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/students", studentRouter);
app.use("/api/ads", exjobbAdRouter);
app.use("/api/exjobbads", exjobbAdRouter);
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Sync DB before starting server
sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced");
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});