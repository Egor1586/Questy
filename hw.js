const io = io();
const userInRoom = 'Ту что-то через jinja наверное'

function computeUserIdFromHeaders(headers) {
}

io.on('connection', (socket) => {
  socket.on('join', (roomName) => {
    socket.join(roomName);
    const roomSize = io.sockets.adapter.rooms.get(roomName)?.size || 0;
    console.log(`Пользователь присоединился к комнате ${roomName}. кол-во пользователей: ${roomSize}`);
    io.to(roomName).emit('userCount', roomSize);
  });
});
