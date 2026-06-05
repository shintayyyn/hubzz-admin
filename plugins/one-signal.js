export default (ctx) => {
  const appId = process.env.ONE_SIGNAL_APP_ID_ADMIN

  console.log('ONE_SIGNAL_APP_ID_ADMIN', appId)

  if (!appId) {
    console.log('[OneSignal] Missing ONE_SIGNAL_APP_ID_ADMIN')
    return
  }

  // OneSignal Web SDK v16 uses `OneSignalDeferred`
  window.OneSignalDeferred = window.OneSignalDeferred || []

  window.OneSignalDeferred.push(async function OneSignalInit (OneSignal) {
    try {
      console.log('[OneSignal] Initialize (admin)')

      // Make SDK available for store actions/debugging
      window.OneSignal = OneSignal

      await OneSignal.init({
        appId,
        allowLocalhostAsSecureOrigin: true,
        notifyButton: {
          enable: true,
        },
        welcomeNotification: {
          disable: true,
        },
        serviceWorkerPath: '/OneSignalSDKWorker.js',
        serviceWorkerParam: { scope: '/' },
      })

      const getIsPushSupported = async () => {
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

      // Push subscription change listener (v16)
      if (OneSignal.User?.PushSubscription?.addEventListener) {
        OneSignal.User.PushSubscription.addEventListener('change', (event) => {
          console.log('[OneSignal] PushSubscription change (admin)', event)
          ctx.store.dispatch('one-signal/setOneSignalUser')
        })
      }

      // Initial sync
      ctx.store.dispatch('one-signal/setOneSignalUser')

      // Ensure backend mapping is updated on login/logout
      if (ctx.store && typeof ctx.store.watch === 'function') {
        ctx.store.watch(
          (state) => state?.auth?.loggedIn,
          (loggedIn) => {
            console.log('[OneSignal] auth.loggedIn changed (admin)', loggedIn)
            ctx.store.dispatch('one-signal/setOneSignalUser')
          }
        )
      }
    } catch (e) {
      console.log('[OneSignal] init error (admin)', e)
    }
  })
}
