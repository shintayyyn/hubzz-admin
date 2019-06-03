export const state = () => ({

})

export const getters = {
}

export const mutations = {
}

export const actions = {
  async login ({ getters, commit, dispatch }, { email, password }) {

    console.log('before oneSignalId')
    const oneSignalId = await new Promise((resolve, reject) => {
      this.$OneSignal.push(() => {
        try {
          console.log('before resolve')
          this.$OneSignal.getUserId().then((oneSignalId) => {
            resolve(oneSignalId)
          })
          console.log('after resolve')
        } catch (err) {
          console.log('before reject')
          reject(err)
          console.log('after reject')
        }
        console.log('end callback')
      })
      console.log('after push')
    })
    console.log('after oneSignalId')

    console.log('One Signal ID:', oneSignalId)

    const socketId = this.$socket.id

    const response = await this.$axios.post('/api/v1/admin/login', {
      email,
      password,
      socket_id: socketId,
      one_signal_id: oneSignalId,
    })

    const token = response.data.data.token.token

    this.$axios.setToken(token, 'Bearer')

    this.$auth.$storage.setUniversal('_token.local', 'Bearer ' + token)

    await this.$auth.fetchUser()

    this.$router.push('/')

    if (socketId) {
      console.log('Socket Logged In')
    }

    if (oneSignalId) {
      console.log('One Signal Logged In')
    }
  },

  async logout ({ getters, commit, dispatch }) {
    await this.$axios.post('/api/v1/logout')

    await this.$auth.logout()

    this.$router.push('/sign-in')

    console.log('Socket Logged Out')

    console.log('One Signal Logged Out')
  }
}