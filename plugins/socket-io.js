import io from 'socket.io-client'

export default (ctx, inject) => {
  const API_URL = process.env.API_URL

  console.log('API_URL', API_URL)

  const socket = io(API_URL, {
    transports: [ 'websocket' ]
  })

  socket.on('connect', () => {
    console.log('Socket Connected')
    console.log('Socket ID:', socket.id)
    ctx.store.commit('SET_SOCKET',socket.id)

    ctx.store.commit("SET_NOTIFICATION", {
      enabled: false,
      status: '',
      text: "",
    });

  })

  socket.on('connect_error', reason => {
    ctx.store.commit("SET_NOTIFICATION", {
      enabled: true,
      status: "danger",
      text: 'Server Offline',
    });
  })

  socket.on('disconnect', reason => {
    console.log('Socket Disconnected')
    console.log('Reason:', reason)

    if (reason === 'io server disconnect') {
      socket.connect()
    }

    if (reason === 'transport close') {
      ctx.store.commit("SET_NOTIFICATION", {
        enabled: true,
        status: "danger",
        text: 'Server Shut Down',
      });
    }
  })

  ctx.$socket = socket
  inject('socket', socket)
  ctx.store.dispatch('socket/init')
  ctx.store.dispatch('adminusers/initializeAdminTransactionListener')
  ctx.store.dispatch('locums/initializeLocumTransactionListener')
  ctx.store.dispatch('practices/initializePracticeTransactionListener')
  ctx.store.dispatch('faqs/initializeFaqTransactionListener')
  ctx.store.dispatch('jobs/initializeAdminJobTransactionListener')
}
