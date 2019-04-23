export const state = () => ({

})

export const getters = {
}

export const mutations = {
}

export const actions = {
  async login ({ getters, commit, dispatch }, { email, password }) {
    const response = await this.$axios.post('/api/v1/admin/login', { email, password })

    const token = response.data.data.token.token

    this.$axios.setToken(token, 'Bearer')

    this.$auth.$storage.setUniversal('_token.local', 'Bearer ' + token)

    await this.$auth.fetchUser()

    // await dispatch('socket/login', { token })

    this.$router.push('/')
  },

  async logout ({ getters, commit, dispatch }) {
    await this.$axios.post('/api/v1/logout')

    await this.$auth.logout()

    // await dispatch('socket/logout')

    this.$router.push('/sign-in')
  }
}