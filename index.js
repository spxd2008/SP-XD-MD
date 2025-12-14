const { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const config = require("./config");

const startSock = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("auth");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    printQRInTerminal: true,
    auth: state,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    if (!messages[0].message) return;
    const m = messages[0];
    const from = m.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    const sender = m.key.participant || m.key.remoteJid;
    const body = m.message.conversation || m.message.extendedTextMessage?.text || "";

    const args = body.trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === ".gdesc") {
      const metadata = await sock.groupMetadata(from);
      const isBotAdmins = metadata.participants.find(p => p.id === sock.user.id)?.admin !== null;
      const isAdmins = metadata.participants.find(p => p.id === sender)?.admin !== null;

      const text = args.join(" ");
      if (!isGroup) return sock.sendMessage(from, { text: "❌ Group only command." });
      if (!isAdmins) return sock.sendMessage(from, { text: "❌ Only admins can use this." });
      if (!isBotAdmins) return sock.sendMessage(from, { text: "❌ I need to be admin." });
      if (!text) return sock.sendMessage(from, { text: "❌ Provide new group description." });

      await sock.groupUpdateDescription(from, text);
      sock.sendMessage(from, { text: "✅ Group description updated!" });
    }
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect = (lastDisconnect.error = new Boom(lastDisconnect?.error))?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("Connection closed. Reconnecting...", shouldReconnect);
      if (shouldReconnect) startSock();
    } else if (connection === "open") {
      console.log("✅ Connected");
    }
  });
};

startSock();
