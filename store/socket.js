export const state = () => ({

})

export const getters = {
}

export const mutations = {
}

export const actions = {
	async init ({ getters, commit, dispatch }) {
		console.log('socket init')

    this.$socket.on('connect', () => {
      console.log('socket connected')
      if (this.$auth.loggedIn) {
        let token = this.$auth.$storage.getUniversal('_token.local')

        if (token) {
          token = token.replace('Bearer ', '')

          this.dispatch('socket/login', { token })
        }
      }
    })
	},

	async login ({ getters, commit, dispatch }, { token }) {
    const response = await new Promise((resolve) => {
      this.$socket.emit('login', { token }, resolve)
    })

    if (response && response.status !== 200) {
      throw new Error(response.message || 'Something Went Wrong')
    }

    if (response && response.message) {
      console.log(response.message)
    }

    console.log('socket loggedIn')
	},

  async logout ({ getters, commit, dispatch }) {
    const response = await new Promise((resolve) => {
      this.$socket.emit('logout', {}, resolve)
    })

    if (response && response.status !== 200) {
      throw new Error(response.message || 'Something Went Wrong')
    }

    if (response && response.message) {
      console.log(response.message)
    }

    console.log('socket loggedOut')
  }
}