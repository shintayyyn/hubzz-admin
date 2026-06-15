export default function({ $axios, app }) {
  // =========================================================
  // STATE FLAGS
  // =========================================================
  let isSignedOut = false
  let isInitialized = false

  // =========================================================
  // CONFIG
  // =========================================================
  const CACHE_PREFIX = 'axios_cache_global_'
  const READONLY_PREFIX = 'axios_cache_readonly_'
  const TTL = 1000 * 60 * 10 // 10 minutes
  const MUTATION_INVALIDATION_DELAY = 100

  const memoryCache = new Map()
  const pending = new Map()
  const readOnlyCache = new Map()
  const readOnlyPending = new Map()
  const mutationTimestamps = new Map()

  const now = () => Date.now()

  // =========================================================
  // CRITICAL ENDPOINTS
  // =========================================================
  const SIGNOUT_HARD_RESET_URLS = ['/api/v1/admin/me']
  const isIdentityRequest = url => SIGNOUT_HARD_RESET_URLS.some(x => url?.includes(x))

  // =========================================================
  // MUTATION + READONLY ROUTES
  // =========================================================
  const CACHE_EXEMPT_URLS = ['/generate-key']
  const READONLY_URL_PATTERNS = ['/generate-key', '/postcode-to-coordinates', '/postcode-coordinates']

  const isCacheExempt = url => CACHE_EXEMPT_URLS.some(x => url?.includes(x))
  const isReadOnly = url => READONLY_URL_PATTERNS.some(x => url?.includes(x))
  const isMutation = method => ['post', 'put', 'patch', 'delete'].includes((method || '').toLowerCase())

  // =========================================================
  // 🔴 FIX: EXPLICIT RESOURCE RELATIONSHIP MAPPING
  // =========================================================
  const resourceRelationships = {
    // When mutation happens on locum-user-compliances, invalidate related locum-compliance-documents
    '/api/v1/admin/locum-user-compliances': ['/api/v1/admin/locum-compliance-documents'],
    // Add other relationships as needed
    '/api/v1/admin/locum-compliance-documents': ['/api/v1/admin/locum-user-compliances'],
    '/api/v1/admin/users': ['/api/v1/admin/users', '/api/v1/admin/user-profiles'],
    '/api/v1/admin/companies': ['/api/v1/admin/companies', '/api/v1/admin/company-users']
  }

  // =========================================================
  // URL NORMALIZATION
  // =========================================================
  const normalizeUrl = url => (url || '').split('?')[0]

  const getBaseResourcePath = url => {
    const normalized = normalizeUrl(url)
    // Extract pattern like /api/v1/admin/resource-name
    const match = normalized.match(/^(.*\/api\/v1\/admin\/[^\/]+)/)
    if (match) return match[1]

    // Fallback: remove IDs
    const parts = normalized.split('/')
    return parts.filter(part => !/^\d+$/.test(part) && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(part)).join('/')
  }

  // =========================================================
  // KEY BUILDERS
  // =========================================================
  const makeKey = config => {
    const url = config.url || ''
    const params = config.params || {}
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((a, k) => {
        a[k] = params[k]
        return a
      }, {})
    return `${url}?${JSON.stringify(sortedParams)}`
  }

  const makeReadOnlyKey = config =>
    JSON.stringify({
      url: config.url || '',
      params: config.params || {},
      data: config.data || null
    })

  // =========================================================
  // STORAGE HELPERS WITH VERSIONING
  // =========================================================
  const CACHE_VERSION = 'v3' // Increment to bust cache on deploy

  const readStorage = (prefix, key) => {
    try {
      const raw = localStorage.getItem(prefix + key)
      if (!raw) return null

      const parsed = JSON.parse(raw)

      if (parsed.version !== CACHE_VERSION) {
        localStorage.removeItem(prefix + key)
        return null
      }

      if (!parsed?.timestamp) return null

      if (now() - parsed.timestamp > TTL) {
        localStorage.removeItem(prefix + key)
        return null
      }

      return parsed.data
    } catch {
      return null
    }
  }

  const writeStorage = (prefix, key, data) => {
    try {
      localStorage.setItem(
        prefix + key,
        JSON.stringify({
          timestamp: now(),
          data,
          version: CACHE_VERSION
        })
      )
    } catch {}
  }

  const clearStorageByPrefix = prefix => {
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith(prefix)) localStorage.removeItem(k)
      })
    } catch {}
  }

  const getPersisted = key => readStorage(CACHE_PREFIX, key)
  const setPersisted = (key, data) => writeStorage(CACHE_PREFIX, key, data)

  const getReadOnlyStored = key => readStorage(READONLY_PREFIX, key)
  const setReadOnlyStored = (key, data) => writeStorage(READONLY_PREFIX, key, data)

  // =========================================================
  // 🔴 FIX: ENHANCED INVALIDATION WITH RELATIONSHIPS
  // =========================================================
  const invalidateRelatedCache = mutationUrl => {
    const normalizedMutationUrl = normalizeUrl(mutationUrl)
    const mutationBase = getBaseResourcePath(normalizedMutationUrl)
    const mutationTimestamp = now()

    // Store mutation timestamp
    mutationTimestamps.set(mutationBase, mutationTimestamp)

    // Get all paths to invalidate (including relationships)
    const pathsToInvalidate = new Set([mutationBase])

    // Add related resource paths from mapping
    for (const [resource, relatedResources] of Object.entries(resourceRelationships)) {
      if (mutationBase.includes(resource)) {
        relatedResources.forEach(related => pathsToInvalidate.add(related))
      }
      // Also check if mutation is related to any resource
      for (const [baseResource, relatedResources] of Object.entries(resourceRelationships)) {
        if (relatedResources.some(related => mutationBase.includes(related))) {
          pathsToInvalidate.add(baseResource)
          relatedResources.forEach(related => pathsToInvalidate.add(related))
        }
      }
    }

    // Also invalidate by pattern matching for IDs
    // e.g., /locum-user-compliances/20 should invalidate /locum-compliance-documents
    const idMatch = normalizedMutationUrl.match(/\/(\w+)\/(\d+)$/)
    if (idMatch) {
      const resourceType = idMatch[1]
      const resourceId = idMatch[2]

      // Add related resource patterns
      if (resourceType === 'locum-user-compliances') {
        pathsToInvalidate.add('/api/v1/admin/locum-compliance-documents')
      }
    }

    // Clear cache for all related paths
    for (const cacheKey of memoryCache.keys()) {
      const keyUrl = cacheKey.split('?')[0]

      for (const pathToInvalidate of pathsToInvalidate) {
        if (keyUrl.includes(pathToInvalidate)) {
          memoryCache.delete(cacheKey)
          localStorage.removeItem(CACHE_PREFIX + cacheKey)
          break
        }
      }
    }

    // Clear pending requests
    for (const [key, pendingReq] of pending.entries()) {
      for (const pathToInvalidate of pathsToInvalidate) {
        if (key.includes(pathToInvalidate)) {
          pendingReq.reject(new Error('Invalidated by mutation'))
          pending.delete(key)
          break
        }
      }
    }

    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Cache] Invalidated ${pathsToInvalidate.size} paths due to mutation on ${mutationUrl}`)
    }
  }

  // =========================================================
  // CLEAR CACHE
  // =========================================================
  const clearCache = () => {
    memoryCache.clear()
    readOnlyCache.clear()
    mutationTimestamps.clear()

    pending.forEach(p => p.reject(new Error('Cache cleared')))
    pending.clear()

    readOnlyPending.forEach(p => p.reject(new Error('Cache cleared')))
    readOnlyPending.clear()

    clearStorageByPrefix(CACHE_PREFIX)
    clearStorageByPrefix(READONLY_PREFIX)

    try {
      for (const url of SIGNOUT_HARD_RESET_URLS) {
        for (const k of Object.keys(localStorage)) {
          if (k.includes(url)) localStorage.removeItem(k)
        }
      }
    } catch {}
  }

  // =========================================================
  // CHECK IF CACHE IS STALE
  // =========================================================
  const isCacheStale = (key, url) => {
    const resourceBase = getBaseResourcePath(url)
    const lastMutation = mutationTimestamps.get(resourceBase)

    if (!lastMutation) return false

    let cacheTimestamp = null
    try {
      const raw = localStorage.getItem(CACHE_PREFIX + key)
      if (raw) {
        const parsed = JSON.parse(raw)
        cacheTimestamp = parsed.timestamp
      }
    } catch {}

    return cacheTimestamp && lastMutation > cacheTimestamp
  }

  // =========================================================
  // BOOTSTRAP REHYDRATION
  // =========================================================
  const rehydrateCache = () => {
    if (isSignedOut) return

    try {
      memoryCache.clear()
      readOnlyCache.clear()

      Object.keys(localStorage).forEach(k => {
        if (k.startsWith(CACHE_PREFIX)) {
          const key = k.slice(CACHE_PREFIX.length)
          const data = getPersisted(key)
          if (data) {
            const url = key.split('?')[0]
            if (!isCacheStale(key, url)) {
              memoryCache.set(key, data)
            } else {
              localStorage.removeItem(k)
            }
          } else {
            localStorage.removeItem(k)
          }
        }

        if (k.startsWith(READONLY_PREFIX)) {
          const key = k.slice(READONLY_PREFIX.length)
          const data = getReadOnlyStored(key)
          if (data) {
            readOnlyCache.set(key, data)
          } else {
            localStorage.removeItem(k)
          }
        }
      })
    } catch (e) {
      console.warn('Cache rehydration failed:', e)
    }
  }

  // Rehydrate immediately
  rehydrateCache()
  isInitialized = true

  // =========================================================
  // 401 HANDLER
  // =========================================================
  $axios.onResponseError(err => {
    if (err?.response?.status === 401 && !isSignedOut) {
      isSignedOut = true

      app.$auth.logout().finally(() => {
        app.$auth.$storage.setUniversal('_token.local', '')
        app.$loggedOutBroadcastChannel?.postMessage?.()
        clearCache()
        isSignedOut = false
      })
    }
  })

  // =========================================================
  // REQUEST INTERCEPTOR
  // =========================================================
  $axios.interceptors.request.use(config => {
    const method = (config.method || 'get').toLowerCase()
    const url = config.url || ''

    if (isSignedOut) {
      config.skipCache = true
    }

    const identity = isIdentityRequest(url)

    // 🔴 FIX: Mutation invalidation with delay
    if (isMutation(method) && !isCacheExempt(url)) {
      setTimeout(() => invalidateRelatedCache(url), MUTATION_INVALIDATION_DELAY)
    }

    // Handle read-only cache
    if (isReadOnly(url)) {
      const key = makeReadOnlyKey(config)

      if (readOnlyCache.has(key)) {
        config.adapter = () => Promise.resolve(readOnlyCache.get(key))
        return config
      }

      if (readOnlyPending.has(key)) {
        config.adapter = () => readOnlyPending.get(key).promise
        return config
      }

      let resolve, reject
      const promise = new Promise((res, rej) => {
        resolve = res
        reject = rej
      })

      readOnlyPending.set(key, { promise, resolve, reject })
      config._readOnlyKey = key

      return config
    }

    // Handle GET cache
    if (method !== 'get') return config
    if (config.skipCache) return config

    const key = makeKey(config)

    if (identity || isSignedOut) {
      config.skipCache = true
    }

    if (!config.skipCache) {
      // Check memory cache
      if (memoryCache.has(key)) {
        if (!isCacheStale(key, url)) {
          config.adapter = () => Promise.resolve(memoryCache.get(key))
          return config
        } else {
          memoryCache.delete(key)
          localStorage.removeItem(CACHE_PREFIX + key)
        }
      }

      // Check persisted cache
      const persisted = getPersisted(key)
      if (persisted && !isCacheStale(key, url)) {
        memoryCache.set(key, persisted)
        config.adapter = () => Promise.resolve(persisted)
        return config
      }

      // Handle pending requests
      if (pending.has(key)) {
        config.adapter = () => pending.get(key).promise
        return config
      }
    }

    // Create new pending request
    let resolve, reject
    const promise = new Promise((res, rej) => {
      resolve = res
      reject = rej
    })

    pending.set(key, { promise, resolve, reject })
    config._cacheKey = key

    return config
  })

  // =========================================================
  // RESPONSE INTERCEPTOR
  // =========================================================
  $axios.interceptors.response.use(
    response => {
      const config = response.config
      const url = config.url || ''
      const status = response.status
      const isSuccess = status >= 200 && status < 300

      // Handle read-only responses
      const readOnlyKey = config._readOnlyKey
      if (readOnlyKey) {
        if (isSuccess) {
          readOnlyCache.set(readOnlyKey, response)
          setReadOnlyStored(readOnlyKey, response)
        }

        if (readOnlyPending.has(readOnlyKey)) {
          readOnlyPending.get(readOnlyKey).resolve(response)
          readOnlyPending.delete(readOnlyKey)
        }

        return response
      }

      // Handle GET responses
      const method = (config.method || 'get').toLowerCase()
      if (method !== 'get') return response

      const key = config._cacheKey || makeKey(config)
      const identity = isIdentityRequest(url)

      if (!isSignedOut && !identity && !config.skipCache && isSuccess) {
        memoryCache.set(key, response)
        setPersisted(key, response)
      }

      if (pending.has(key)) {
        pending.get(key).resolve(response)
        pending.delete(key)
      }

      return response
    },
    error => {
      const config = error?.config
      if (!config) return Promise.reject(error)

      const url = config.url || ''

      // Handle read-only errors
      if (isReadOnly(url)) {
        const key = config._readOnlyKey
        if (key && readOnlyPending.has(key)) {
          readOnlyPending.get(key).reject(error)
          readOnlyPending.delete(key)
        }
        return Promise.reject(error)
      }

      // Handle GET errors
      const method = (config.method || 'get').toLowerCase()
      if (method === 'get') {
        const key = config._cacheKey || makeKey(config)
        if (pending.has(key)) {
          pending.get(key).reject(error)
          pending.delete(key)
        }
      }

      return Promise.reject(error)
    }
  )
}
