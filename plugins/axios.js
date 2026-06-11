export default function({ $axios, app }) {
  const CACHE_PREFIX = 'axios_cache_global_'
  const TTL = 1000 * 60 * 60

  const CACHE_SAFE_POST_ROUTES = ['/api/v1/postcode-to-coordinates']

  const NEVER_CACHE_ROUTES = ['/api/v1/postcode-to-coordinates']

  const memoryCache = new Map()
  const pending = new Map()

  const now = () => Date.now()

  const isCacheSafePost = url => CACHE_SAFE_POST_ROUTES.some(route => url?.includes(route))

  const isNeverCache = url => NEVER_CACHE_ROUTES.some(route => url?.includes(route))

  const isGenerateKeyRoute = url => url?.includes('generate-key')

  const shouldCacheRequest = config => {
    const method = (config.method || 'get').toLowerCase()
    const url = config.url || ''

    return method === 'get' || isGenerateKeyRoute(url)
  }

  const makeKey = config => {
    const url = config.url || ''
    const params = config.params || {}

    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key]
        return acc
      }, {})

    let body = ''

    try {
      body = typeof config.data === 'string' ? config.data : JSON.stringify(config.data || {})
    } catch {
      body = ''
    }

    return `${url}|${JSON.stringify(sortedParams)}|${body}`
  }

  const getPersisted = key => {
    try {
      const raw = localStorage.getItem(CACHE_PREFIX + key)

      if (!raw) {
        return null
      }

      const parsed = JSON.parse(raw)

      if (!parsed?.timestamp) {
        return null
      }

      if (now() - parsed.timestamp > TTL) {
        localStorage.removeItem(CACHE_PREFIX + key)
        return null
      }

      return parsed.data
    } catch {
      return null
    }
  }

  const setPersisted = (key, data) => {
    try {
      localStorage.setItem(
        CACHE_PREFIX + key,
        JSON.stringify({
          timestamp: now(),
          data
        })
      )
    } catch (e) {
      console.error('Error clearing cache:', e)
    }
  }

  const clearCache = (specificKey = null) => {
    if (specificKey) {
      memoryCache.delete(specificKey)
      pending.delete(specificKey)

      try {
        localStorage.removeItem(CACHE_PREFIX + specificKey)
      } catch (e) {
        console.error('Error clearing cache:', e)
      }

      return
    }

    memoryCache.clear()
    pending.clear()

    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (e) {
      console.error('Error clearing cache:', e)
    }
  }

  $axios.onResponseError(err => {
    if (err?.response?.status === 401) {
      clearCache()

      app.$auth.logout().finally(() => {
        app.$auth.$storage.setUniversal('_token.local', '')
        app.$loggedOutBroadcastChannel?.postMessage?.()
      })
    }

    return Promise.reject(err)
  })

  $axios.interceptors.request.use(config => {
    const method = (config.method || 'get').toLowerCase()
    const url = config.url || ''

    if (['post', 'put', 'patch', 'delete'].includes(method) && !isCacheSafePost(url) && !isGenerateKeyRoute(url)) {
      clearCache()
    }

    const cacheable = shouldCacheRequest(config)

    if (!cacheable) {
      return config
    }

    if (isNeverCache(url)) {
      return config
    }

    if (config.skipCache) {
      return config
    }

    const key = makeKey(config)

    const memoryHit = memoryCache.get(key)

    if (memoryHit) {
      config.adapter = () => Promise.resolve(memoryHit)
      return config
    }

    const persistedHit = getPersisted(key)

    if (persistedHit) {
      memoryCache.set(key, persistedHit)

      config.adapter = () => Promise.resolve(persistedHit)

      return config
    }

    if (pending.has(key)) {
      config.adapter = () => pending.get(key)
      return config
    }

    const request = new Promise(resolve => {
      config._resolvePending = resolve
    })

    pending.set(key, request)

    return config
  })

  $axios.interceptors.response.use(
    response => {
      const config = response.config || {}
      const url = config.url || ''

      const cacheable = shouldCacheRequest(config)

      if (!cacheable || isNeverCache(url)) {
        return response
      }

      const key = makeKey(config)

      const cachedResponse = {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: response.config,
        request: response.request
      }

      memoryCache.set(key, cachedResponse)
      setPersisted(key, cachedResponse)

      if (config._resolvePending) {
        config._resolvePending(cachedResponse)
      }

      pending.delete(key)

      return response
    },
    error => {
      const config = error?.config

      if (config) {
        pending.delete(makeKey(config))
      }

      return Promise.reject(error)
    }
  )
}
