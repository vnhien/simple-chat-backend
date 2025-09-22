import http from "node:http";
import {} from "node:https";
import { Server } from "socket.io";
dns.setDefaultResultOrder("ipv4first");
import { initChatSockets } from "./chat.sockets";
import webpush from "web-push";
import dns from "dns";

//INIT WEBPUSH
webpush.setVapidDetails(
  "mailto:example@yourdomain.org",
  process.env.VAPID_PUBLIC || "",
  process.env.VAPID_PRIVATE || ""
);
//END INIT WEB PUSH
export function initSocketServices(server: http.Server) {
  const io = new Server(server, {
    path: "/app-socket",
    cors: {
      origin: ["http://localhost:3000", "https://chat-hehe.vercel.app", "chat-hehe.vercel.app"],
    },
    connectionStateRecovery: {
      // the backup duration of the sessions and the packets
      maxDisconnectionDuration: 2 * 60 * 1000,
      // whether to skip middlewares upon successful recovery
      skipMiddlewares: true,
    },
  });
  io.on("connection", () => {
    console.log("🚀 ~ client connected");
  });

  io.on("disconnect", () => {
    console.log("🚀 ~ client disconnected");
  });

  initChatSockets(io);
}
