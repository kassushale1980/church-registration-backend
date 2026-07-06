import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import memberRoutes from "./routes/members.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Church Registration Backend is Running");
});

app.use("/api/members", memberRoutes);
app.use("/api/auth", authRoutes);
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});