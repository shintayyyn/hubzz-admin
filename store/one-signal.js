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
      this.$OneSignal.push(() => {
        console.log('start callback')
        try {
          console.log('before resolve')
          resolve(this.$OneSignal.isPushNotificationsSupported())
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

    console.log('before isPushNotificationsEnabled')
    let isPushNotificationsEnabled = await new Promise((resolve, reject) => {
      console.log('before push')

      this.$OneSignal.push(() => {
        console.log('start callback')
        try {
          this.$OneSignal.isPushNotificationsEnabled().then((isPushNotificationsEnabled) => {
            if (!isPushNotificationsEnabled) {
              return this.$OneSignal.isOptedOut()
            }
            return false
          }).then((isOptedOut) => {
            if (!isOptedOut) {
              return this.$OneSignal.registerForPushNotifications()
            }
            return this.$OneSignal.setSubscription(true)
          }).then(() => {
            return this.$OneSignal.isPushNotificationsEnabled()
          }).then((isPushNotificationsEnabled) => {
            console.log('before resolve')
            resolve(isPushNotificationsEnabled)
            console.log('after resolve')
          })
        } catch (err) {
          console.log('before reject')
          reject(err)
          console.log('after reject')
        }
        console.log('end callback')
      })
      console.log('after push')
    })
    console.log('after isPushNotificationsEnabled')

    console.log('isPushNotificationsEnabled', isPushNotificationsEnabled)

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