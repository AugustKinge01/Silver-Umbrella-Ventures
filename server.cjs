// server.cjs — minimal Hedera backend for SUV (HCS demo, no keys in browser)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {
  Client,
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
} = require("@hashgraph/sdk");

function getClient() {
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

app.get("/", (_, res) => res.send("SUV Hedera backend up"));

// Create an HCS topic (use this once, then copy topicId for demo)
app.get("/api/admin/create-topic", async (_, res) => {
  try {
    const c = getClient();
    const tx = await new TopicCreateTransaction().setTopicMemo("SUV-Usage").execute(c);
    const rec = await tx.getReceipt(c);
    res.json({ ok: true, topicId: rec.topicId.toString(), txId: tx.transactionId.toString() });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Submit a usage log to HCS (accepts ?topicId=... or uses TOPIC_ID from env)
app.get("/api/suv/hcs", async (req, res) => {
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
    res.json({
      ok: true,
      txId: tx.transactionId.toString(),
      topicId
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.listen(4000, () => console.log("SUV backend on http://localhost:4000"));
