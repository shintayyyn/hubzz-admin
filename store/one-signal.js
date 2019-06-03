export const state = () => ({

})

export const getters = {
}

export const mutations = {
}

export const actions = {
  async init ({ getters, commit, dispatch }) {
    console.log('One Signal Initialize')

    console.log('before isPushNotificationsSupported')
    const isPushNotificationsSupported = await new Promise((resolve, reject) => {
      console.log('before push')
      this.$OneSignal.push(async () => {
        console.log('start callback')
        try {
          console.log('before resolve')
          resolve(await this.$OneSignal.isPushNotificationsSupported())
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
    console.log('after isPushNotificationsSupported')

    if (!isPushNotificationsSupported) {
      console.log('Push Notifications Not Supported')
      return
    }

    let isPushNotificationsEnabled = await new Promise((resolve, reject) => {
      this.$OneSignal.push(async () => {
        try {
          if (!await this.$OneSignal.isPushNotificationsEnabled()) {
            if (!await this.$OneSignal.isOptedOut()) {
              await this.$OneSignal.registerForPushNotifications()
            } else {
              await this.$OneSignal.setSubscription(true)
            }
          }
          resolve(await this.$OneSignal.isPushNotificationsEnabled())
        } catch (err) {
          reject(err)
        }
      })
    })

    console.log('isPushNotificationsEnabled', isPushNotificationsEnabled)

    const oneSignalId = await new Promise((resolve, reject) => {
      this.$OneSignal.push(async () => {
        try {
          resolve(await this.$OneSignal.getUserId())
        } catch (err) {
          reject(err)
        }
      })
    })

    console.log('One Signal ID:', oneSignalId)

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
}