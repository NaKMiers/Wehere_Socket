require('dotenv').config()

const io = require('socket.io')(process.env.PORT, {
   cors: {
      origin: process.env.API_CLIENT,
   },
})

let users = []

const addUser = (userId, socketId) => {
   !users.some(user => user.userId === userId) && users.push({ userId, socketId })
}

const removeUser = socketId => {
   users = users.filter(user => user.socketId !== socketId)
}

const getUser = userId => users.find(user => user.userId === userId)

io.on('connection', socket => {
   // when connect
   console.log('a user connected')

   // take user and socketId from client
   socket.on('addUser', userId => {
      addUser(userId, socket.id)
   })

   // send and get messages
   socket.on('sendMessage', ({ senderId, receiverId, text }) => {
      const receiver = getUser(receiverId)
      io.to(receiver.socketId).emit('getMessage', { senderId, text })
   })

   // when disconnect
   socket.on('disconnect', () => {
      console.log('a user disconnected')
      removeUser(socket.id)
   })
})
