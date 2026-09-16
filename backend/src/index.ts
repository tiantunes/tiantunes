import express from "express";
import cors from "cors";
import { leadsRouter } from "./routes/leads";
import { prospectingRouter } from "./routes/prospecting";
import { settingsRouter } from "./routes/settings";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/leads", leadsRouter);
app.use("/api/prospecting", prospectingRouter);
app.use("/api/settings", settingsRouter);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
