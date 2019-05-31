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

          this.$axios.post('/api/v1/socket/login', {
            socket_id: this.$socket.id,
          }).then(() => {
            console.log('socket loggedIn')
          })
        }
      }
    })
	},
}