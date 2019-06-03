export const state = () => ({

})

export const getters = {
}

export const mutations = {
}

export const actions = {
  async login ({ getters, commit, dispatch }, { email, password }) {
    const oneSignalId = await new Promise((resolve, reject) => {
      this.$OneSignal.push(async () => {
        try {
          resolve(await this.$OneSignal.getUserId())
        } catch (err) {
          reject(err)
        }
      })
    })

    const response = await this.$axios.post('/api/v1/admin/login', {
      email,
      password,
      socket_id: this.$socket.id,
      one_signal_id: oneSignalId,
    })

    const token = response.data.data.token.token

    this.$axios.setToken(token, 'Bearer')

    this.$auth.$storage.setUniversal('_token.local', 'Bearer ' + token)

    await this.$auth.fetchUser()

    this.$router.push('/')

    console.log('Socket Logged In')

    console.log('One Signal Logged In')
  },

  async logout ({ getters, commit, dispatch }) {
    await this.$axios.post('/api/v1/logout')

    await this.$auth.logout()

    this.$router.push('/sign-in')

    console.log('Socket Logged Out')

    console.log('One Signal Logged Out')
  }
}