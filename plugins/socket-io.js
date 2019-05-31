import io from 'socket.io-client'

export default (ctx, inject) => {
  const API_URL = process.env.API_URL

  console.log('API_URL', API_URL)

  const socket = io(API_URL, {
    transports: [ 'websocket' ]
  })

  socket.on('connect', () => {
    console.log('socket connected, socket id:', socket.id)
  })

  socket.on('disconnect', reason => {
    console.log('socket disconnected, reason:', reason)

    if (reason === 'io server disconnect') {
      socket.connect()
    }
  })

  ctx.$socket = socket

  inject('socket', socket)

  ctx.store.dispatch('socket/init')
}
