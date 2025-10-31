// scripts/hcs-demo.ts — Hedera HCS + HTS demo via GitHub Actions (TypeScript)
import {
  Client,
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
} from "@hashgraph/sdk";
import fs from "node:fs";

async function main() {
  const operatorId = process.env.HEDERA_OPERATOR_ID;
  const operatorKey = process.env.HEDERA_OPERATOR_KEY;

  if (!operatorId || !operatorKey) {
    throw new Error("Missing HEDERA_OPERATOR_ID or HEDERA_OPERATOR_KEY env vars");
  }

  const client = Client.forTestnet();
  client.setOperator(operatorId, PrivateKey.fromString(operatorKey));

  const hashscan = "https://hashscan.io/testnet";
  const lines: string[] = [];

  // 1) Create HCS Topic
  const topicTx = await new TopicCreateTransaction().setTopicMemo("SUV-Usage").execute(client);
  const topicRc = await topicTx.getReceipt(client);
  const topicId = topicRc.topicId?.toString();
  if (!topicId) throw new Error("No topicId in receipt");
  lines.push(`HCS Topic: ${hashscan}/topic/${topicId}`);
  lines.push(`HCS Topic Create TX: ${hashscan}/transaction/${topicTx.transactionId.toString()}`);

  // 2) Submit one HCS Message (router usage log)
  const payload = { routerId: "ROUTER-001", bytes: 1048576, ts: Date.now() };
  const msgTx = await new TopicMessageSubmitTransaction()
    .setTopicId(topicId)
    .setMessage(JSON.stringify(payload))
    .execute(client);
  await msgTx.getReceipt(client);
  lines.push(`HCS Message TX: ${hashscan}/transaction/${msgTx.transactionId.toString()}`);

  // 3) Create an HTS Token (SUVC) — shows HTS on-chain capability
  const supplyPubKey = PrivateKey.fromString(operatorKey).publicKey;
  const tokenCreate = await new TokenCreateTransaction()
    .setTokenName("SUV Bandwidth Credit")
    .setTokenSymbol("SUVC")
    .setTokenType(TokenType.FungibleCommon)
    .setDecimals(6)
    .setInitialSupply(0)
    .setTreasuryAccountId(operatorId)
    .setSupplyType(TokenSupplyType.Infinite)
    .setSupplyKey(supplyPubKey)
    .freezeWith(client)
    .sign(PrivateKey.fromString(operatorKey));
  const tokenSubmit = await tokenCreate.execute(client);
  const tokenRc = await tokenSubmit.getReceipt(client);
  const tokenId = tokenRc.tokenId?.toString();
  if (tokenId) {
    lines.push(`HTS Token (SUVC): ${hashscan}/token/${tokenId}`);
    lines.push(`HTS Token Create TX: ${hashscan}/transaction/${tokenSubmit.transactionId.toString()}`);
  }

  // Print to logs
  console.log("=== Hedera Demo Results ===");
  for (const l of lines) console.log(l);

  // Write a nice summary with clickable links in Actions “Summary”
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) {
    const md = [
      "## Hedera Demo Results",
      "",
      ...lines.map((l) => `- ${l.replace("https://", "[link](") + ")"}`),
    ].join("\n");
    fs.appendFileSync(summaryPath, md + "\n");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
