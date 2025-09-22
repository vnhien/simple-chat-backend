import { Server, Socket } from "socket.io";
import { globalStorage } from "../models/GlobalStorage";
import { TChatPrivate } from "./type";
import { PushSubscription, sendNotification } from "web-push";
import { SubScriptionModel } from "../models/user/subscription.user.model";

type MemoryCacheSubscription = { [userId: string]: PushSubscription };
export function initChatSockets(io: Server) {
  io.on("connection", async (socket) => {
    globalStorage.connected[socket.handshake.query.userId as string] = socket.id;
    globalStorage.status[socket.handshake.query.userId as string] = "online";
    // load subsctiption model from db to memory state
    const dbSub = await SubScriptionModel.find();
    let cacheSubScription: MemoryCacheSubscription = Object.fromEntries(
      dbSub?.map((s) => [s.userId, s.subscription as PushSubscription]) || []
    );
    console.log("🚀 ~ initChatSockets ~ cacheSubScription:", cacheSubScription);
    initSocketServices(socket, io, cacheSubScription);
    socket.on("disconnect", () => {
      console.log("client disconnected: ", socket.handshake.query.userId);
      delete globalStorage.connected[socket.handshake.query.userId as string];
      delete globalStorage.status[socket.handshake.query.userId as string];
    });
  });
}

export async function initSocketServices(
  socket: Socket,
  io: Server,
  subObj: MemoryCacheSubscription
) {
  socket.on("chat:private", async (msg: TChatPrivate) => {
    const sendNotiMessage = async () => {
      const cachedSub = subObj[msg.to];
      if (cachedSub) {
        sendNotification(cachedSub, JSON.stringify(msg));
        return;
      } else {
        const dbSub = await SubScriptionModel.findOne({ userId: msg.to });
        if (dbSub) {
          sendNotification(dbSub.subscription as PushSubscription, JSON.stringify(msg));
          subObj[msg.to] = dbSub.subscription as PushSubscription;
        }
        return;
      }
    };
    try {
      const socketId = globalStorage.connected[msg.to] || "";
      console.log(
        "🚀 ~ initSocketServices ~ globalStorage.status[msg.to]:",
        globalStorage.status[msg.to]
      );
      if (globalStorage.status[msg.to] === "online") {
        io.to(socketId).emit("chat:private", msg);
      } else {
        await sendNotiMessage();
      }
    } catch (error) {
      console.log("🚀 ~ chat:private ~ error:", error);
    }
  });
}
