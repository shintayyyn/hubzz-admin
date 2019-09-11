export const state = () => ({
  socket_id: '',
  notification: {
    enabled: false,
    status: '',
    text: ''
  },
  toggled_sidebar: false,
  totalPages:0
})

export const getters = {}

export const mutations = {
  SET_SOCKET(state, payload){
    state.socket_id = payload
  },
  SET_NOTIFICATION(state, payload) {
    state.notification.enabled = payload.enabled
    state.notification.status = payload.status
    state.notification.text = payload.text
    console.log(state.notification)
  },
  TOGGLE_SIDEBAR(state, payload) {
    state.toggled_sidebar = payload
  },
}

export const actions = {
  async login({getters, commit, dispatch}, {email, password}) {
    const socketId = this.$socket.id

    const response = await this.$axios.post('/api/v1/admin/login', {
      email,
      password,
      socket_id: socketId
    })

    const token = response.data.data.token.token

    this.$axios.setToken(token, 'Bearer')

    this.$auth.$storage.setUniversal('_token.local', 'Bearer ' + token)

    await this.$auth.fetchUser()

    this.$router.push('/')

    if (socketId) {
      console.log('Socket Logged In')
    }

    dispatch('one-signal/setOneSignalUser')
  },

  async logout({getters, commit, dispatch}) {
    await this.$axios.post('/api/v1/logout')

    await this.$auth.logout()

    this.$router.push('/sign-in')

    console.log('Socket Logged Out')

    dispatch('one-signal/setOneSignalUser')
  },

  async joinRoom({dispatch}, payload){
    try{
      await this.$axios.$post('/api/v1/socket/join-room',{
        socket_id: payload.socket_id,
        room_name: payload.room_name
      })
    }catch(err){
      console.log('join room error!',err)
    }
  },

  async leaveRoom({},payload){
    await this.$axios.$post('api/v1/socket/leave-room', {
      socket_id: payload.socket_id,
      room_name: payload.room_name
    })
  }
}
