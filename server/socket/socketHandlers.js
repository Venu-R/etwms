const jwt = require('jsonwebtoken');

const initSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.query.token || socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const { userId, role } = socket.user;
    console.log(`Socket connected: userId=${userId} role=${role}`);

    socket.join(`user:${userId}`);

    socket.on('join:project', (projectId) => {
      socket.join(`project:${projectId}`);
    });

    socket.on('leave:project', (projectId) => {
      socket.leave(`project:${projectId}`);
    });

    socket.on('join:team', (teamId) => {
      socket.join(`team:${teamId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: userId=${userId}`);
    });
  });
};

module.exports = { initSocket };
