export const state = () => ({
})

export const getters = {
}

export const mutations = {
}

export const actions = {
  async setOneSignalUser () {
    console.log('[OneSignal] setOneSignalUser (admin)')

    const OneSignal = window.OneSignal

    if (!OneSignal) {
      console.log('[OneSignal] SDK not ready yet (admin)')
      return
    }

    const getIsPushSupported = async () => {
      // OneSignal Web SDK API differs across versions; support multiple.
      if (typeof OneSignal.isPushSupported === 'function') return await OneSignal.isPushSupported()
      if (OneSignal.Notifications && typeof OneSignal.Notifications.isPushSupported === 'function') {
        return await OneSignal.Notifications.isPushSupported()
      }
      if (typeof OneSignal.isPushNotificationsSupported === 'function') {
        return !!OneSignal.isPushNotificationsSupported()
      }
      return false
    }

    const isPushSupported = await getIsPushSupported()
    console.log('[OneSignal] isPushSupported (admin)', isPushSupported, {
      isPushSupportedType: typeof OneSignal.isPushSupported,
      notificationsIsPushSupportedType: typeof OneSignal.Notifications?.isPushSupported,
      isPushNotificationsSupportedType: typeof OneSignal.isPushNotificationsSupported,
    })

    if (!isPushSupported) return

    const subscriptionId = OneSignal.User?.PushSubscription?.id || null
    const optedIn = OneSignal.User?.PushSubscription?.optedIn || false
    const token = OneSignal.User?.PushSubscription?.token || null

    console.log('[OneSignal] optedIn (admin)', optedIn)
    console.log('[OneSignal] subscriptionId (admin)', subscriptionId)
    console.log('[OneSignal] tokenExists (admin)', !!token)
    console.log('[OneSignal] loggedIn (admin)', this.$auth.loggedIn)

    if (subscriptionId) {
      if (this.$auth.loggedIn && optedIn) {
        await this.$axios.post('/api/v1/one-signal/login', {
          one_signal_id: subscriptionId,
        })
        console.log('[OneSignal] backend login saved (admin)')
      }

      // If logged-in but opted-out, remove mapping so email fallback can work.
      if (this.$auth.loggedIn && !optedIn) {
        await this.$axios.post('/api/v1/one-signal/logout', {
          one_signal_id: subscriptionId,
        })
        console.log('[OneSignal] backend logout saved (admin, not opted-in)')
      }

      if (!this.$auth.loggedIn) {
        await this.$axios.post('/api/v1/one-signal/logout', {
          one_signal_id: subscriptionId,
        })
        console.log('[OneSignal] backend logout saved (admin)')
      }
    }
  },
}
