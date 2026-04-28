export const state = () => ({})

export const getters = {}

export const mutations = {}

export const actions = {
  async init() {
    console.log('Socket Initialize')

    this.$socket.on('connect', () => {
      try {
        // attempt to login this socket if there's a stored token
        let token = null
        if (this.$auth && this.$auth.$storage) {
          token = this.$auth.$storage.getUniversal('_token.local')
        } else if (this.$auth && this.$auth.strategy && this.$auth.strategy.token) {
          // fallback: try to read token if available
          token = this.$auth.$storage && this.$auth.$storage.getUniversal ? this.$auth.$storage.getUniversal('_token.local') : null
        }

        if (token) {
          this.$axios
            .post('/api/v1/socket/login', { socket_id: this.$socket.id })
            .then(() => console.log('Socket Logged In'))
            .catch(err => console.log('Socket login failed', err.response || err))
        } else {
          console.log('Socket connected but no token found; will not attempt socket login')
        }
      } catch (e) {
        console.log('socket connect handler error', e)
      }
    })
  }
}
