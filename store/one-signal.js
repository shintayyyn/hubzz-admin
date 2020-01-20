export const state = () => ({
  oneSignalId: null,
})

export const getters = {
}

export const mutations = {
  setOneSignalId(state, oneSignalId) {
    console.log('setOneSignalId')  
    state.oneSignalId = oneSignalId
  }
}

export const actions = {
  async setOneSignalUser ({ state, commit }) {
    let oneSignalId = state.oneSignalId

    console.log("this.$OneSignal", this.$OneSignal)
    console.log("this.$OneSignal.getUserId", this.$OneSignal.getUserId)
    console.log("setOneSignalUser 1", oneSignalId)

    if (!state.oneSignalId) {
      oneSignalId = await new Promise(async (resolve, reject) => {
        try {
          this.$OneSignal.push(() => {
            this.$OneSignal.getUserId().then((oneSignalId) => {
              console.log('getUserId resolve', oneSignalId)
              resolve(oneSignalId)
            }).catch((err) => {
              console.log('getUserId err', err)
              reject(err)
            })
          })
        } catch (err) {
          console.log('getUserId catch err', err)
          reject(err)
        }
      })

      console.log('One Signal ID:', oneSignalId)

      commit('setOneSignalId', oneSignalId)
    }

    console.log("setOneSignalUser 2", oneSignalId)

    if (oneSignalId) {
      if (this.$auth.loggedIn) {
        await this.$axios.post('/api/v1/one-signal/login', {
          one_signal_id: oneSignalId
        })
        console.log('One Signal Logged In')
      } else {
        await this.$axios.post('/api/v1/one-signal/logout', {
          one_signal_id: oneSignalId
        })
        console.log('One Signal Logged Out')
      }
    }
  },

  async init ({ getters, commit, dispatch }) {
    console.log('One Signal Initialize')
    console.log('ONE_SIGNAL_APP_ID_ADMIN', process.env.ONE_SIGNAL_APP_ID_ADMIN)

    dispatch('setOneSignalUser')

    this.$OneSignal.push(() => {
      this.$OneSignal.on('subscriptionChange', (isSubscribed) => {
        console.log('subscriptionChange')
        dispatch('setOneSignalUser')
      })
    })
    
    this.$OneSignal.push(() => {
      this.$OneSignal.registerForPushNotifications()
    })
  },
}
