export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // Join room by userId
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`👤 User joined room: ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};
