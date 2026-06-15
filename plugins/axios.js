export default function({ $axios, app }) {
  $axios.onResponseError(err => {
    if (err?.response?.status === 401) {
      app.$auth.logout().finally(() => {
        app.$auth.$storage.setUniversal('_token.local', '')
        app.$loggedOutBroadcastChannel?.postMessage?.()
      })
    }

    return Promise.reject(err)
  })
}
