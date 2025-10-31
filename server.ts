// server.ts — minimal Hedera backend for SUV (TypeScript, HCS demo)
import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import {
  Client,
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
} from "@hashgraph/sdk";

function getClient(): Client {
  const id = process.env.HEDERA_OPERATOR_ID;
  const key = process.env.HEDERA_OPERATOR_KEY;
  if (!id || !key) throw new Error("Set HEDERA_OPERATOR_ID and HEDERA_OPERATOR_KEY in a local .env (do NOT commit).");
  const client = Client.forTestnet();
  client.setOperator(id, PrivateKey.fromString(key));
  return client;
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_: Request, res: Response) => res.send("SUV Hedera TS backend up"));

// Create an HCS topic (run once, copy topicId for demo)
app.get("/api/admin/create-topic", async (_: Request, res: Response) => {
  try {
    const c = getClient();
    const tx = await new TopicCreateTransaction().setTopicMemo("SUV-Usage").execute(c);
    const rec = await tx.getReceipt(c);
    res.json({ ok: true, topicId: rec.topicId?.toString(), txId: tx.transactionId.toString() });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Submit a usage log to HCS (accepts ?topicId=... or uses TOPIC_ID from env)
app.get("/api/suv/hcs", async (req: Request, res: Response) => {
  try {
    const topicId = (req.query.topicId || process.env.TOPIC_ID || "").toString();
    if (!topicId) return res.status(400).json({ ok: false, error: "Provide topicId as query (?topicId=...) or set TOPIC_ID in .env" });
    const c = getClient();
    const payload = { routerId: "ROUTER-001", bytes: 1048576, ts: Date.now() };
    const tx = await new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(JSON.stringify(payload))
      .execute(c);
    await tx.getReceipt(c);
    res.json({ ok: true, txId: tx.transactionId.toString(), topicId });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`SUV TS backend on http://localhost:${PORT}`));
