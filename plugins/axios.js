export default function({ $axios, app }) {
  const isServer = process.server
  const memoryCache = new Map(),
    pending = new Map(),
    readOnlyCache = new Map(),
    readOnlyPending = new Map(),
    mutationTimestamps = new Map(),
    revalidatedKeys = new Set()
  let isSignedOut = false,
    reconnectAttempts = 0,
    broadcastChannel = null,
    tabId = null
  var MAX_RECONNECT_ATTEMPTS = 5,
    CACHE_PREFIX = 'axios_cache_global_',
    READONLY_PREFIX = 'axios_cache_readonly_',
    TTL = 1000 * 60 * 10,
    MUTATION_INVALIDATION_DELAY = 0,
    CACHE_VERSION = 'v3'
  var now = function() {
    return Date.now()
  }
  var normalizeUrl = function(url) {
    return (url || '').split('?')[0]
  }
  var getBaseResourcePath = function(url) {
    var normalized = normalizeUrl(url)
    var match = normalized.match(/^(.*\/api\/v1\/[^]+)/)
    if (match) return match[1]
    return normalized
      .split('/')
      .filter(function(part) {
        return !/^\d+$/.test(part) && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(part)
      })
      .join('/')
  }
  var makeKey = function(config) {
    return (
      (config.url || '') +
      '?' +
      JSON.stringify(
        Object.keys(config.params || {})
          .sort()
          .reduce(function(a, k) {
            a[k] = config.params[k]
            return a
          }, {})
      )
    )
  }
  var makeReadOnlyKey = function(config) {
    return JSON.stringify({ url: config.url || '', params: config.params || {}, data: config.data || null })
  }
  var isIdentityRequest = function(url) {
    return ['/api/v1/admin/me'].some(function(x) {
      return url && url.includes(x)
    })
  }
  var isCacheExempt = function(url) {
    return ['/generate-key'].some(function(x) {
      return url && url.includes(x)
    })
  }
  var isReadOnly = function(url) {
    return ['/generate-key', '/postcode-to-coordinates', '/postcode-coordinates'].some(function(x) {
      return url && url.includes(x)
    })
  }
  var isMutation = function(method) {
    return ['post', 'put', 'patch', 'delete'].indexOf((method || '').toLowerCase()) !== -1
  }
  var readStorage = function(prefix, key) {
    if (isServer) return null
    try {
      var raw = localStorage.getItem(prefix + key)
      if (!raw) return null
      var parsed = JSON.parse(raw)
      if (parsed.version !== CACHE_VERSION || !parsed || !parsed.timestamp || now() - parsed.timestamp > TTL) {
        if (now() - parsed.timestamp > TTL) localStorage.removeItem(prefix + key)
        return null
      }
      return parsed.data
    } catch (e) {
      return null
    }
  }
  var writeStorage = function(prefix, key, data) {
    if (!isServer)
      try {
        localStorage.setItem(prefix + key, JSON.stringify({ timestamp: now(), data: data, version: CACHE_VERSION }))
      } catch (e) {
        console.error(e)
      }
  }
  var clearStorageByPrefix = function(prefix) {
    if (!isServer)
      try {
        var keys = Object.keys(localStorage)
        for (var i = 0; i < keys.length; i++) {
          if (keys[i].startsWith(prefix)) localStorage.removeItem(keys[i])
        }
      } catch (e) {
        console.error(e)
      }
  }
  var getPersisted = function(key) {
    return readStorage(CACHE_PREFIX, key)
  }
  var setPersisted = function(key, data) {
    writeStorage(CACHE_PREFIX, key, data)
  }
  var getReadOnlyStored = function(key) {
    return readStorage(READONLY_PREFIX, key)
  }
  var setReadOnlyStored = function(key, data) {
    writeStorage(READONLY_PREFIX, key, data)
  }
  var getSocket = function() {
    return app.$socket || (window.$nuxt && window.$nuxt.$socket) || window.$socket || null
  }
  var resourceRelationships = {
    '/api/v1/admin/locum-user-compliances': ['/api/v1/admin/locum-compliance-documents'],
    '/api/v1/admin/locum-compliance-documents': ['/api/v1/admin/locum-user-compliances'],
    '/api/v1/admin/users': ['/api/v1/admin/users', '/api/v1/admin/user-profiles'],
    '/api/v1/admin/companies': ['/api/v1/admin/companies', '/api/v1/admin/company-users']
  }

  var initBroadcastChannel = function() {
    if (isServer) return
    tabId =
      'tab_' +
      Date.now() +
      '_' +
      Math.random()
        .toString(36)
        .substr(2, 9)
    try {
      if (window.BroadcastChannel) {
        broadcastChannel = new BroadcastChannel('axios_cache_channel')
        broadcastChannel.onmessage = function(event) {
          var data = event.data
          var sourceTabId = data.sourceTabId
          if (sourceTabId === tabId) return
          var type = data.type
          var payload = data.payload
          var update = { type: type === 'CACHE_INVALIDATED' ? 'INVALIDATE_CACHE' : type === 'DATA_UPDATED' ? 'DATA_UPDATED' : 'REFRESH_REQUIRED' }
          for (var key in payload) {
            if (payload.hasOwnProperty(key)) update[key] = payload[key]
          }
          handleRealtimeUpdate(update)
        }
        return true
      }
      if (window.localStorage) {
        window.addEventListener('storage', function(event) {
          if (event.key && event.key.startsWith('cache_cross_tab_')) {
            try {
              var data = JSON.parse(event.newValue)
              if (data.sourceTabId === tabId) return
              var type = data.type
              var payload = data.payload
              var update = { type: type === 'CACHE_INVALIDATED' ? 'INVALIDATE_CACHE' : type === 'DATA_UPDATED' ? 'DATA_UPDATED' : 'REFRESH_REQUIRED' }
              for (var key in payload) {
                if (payload.hasOwnProperty(key)) update[key] = payload[key]
              }
              handleRealtimeUpdate(update)
            } catch (e) {
              console.error(e)
            }
          }
        })
        return true
      }
    } catch (e) {
      return false
    }
  }

  var broadcastCrossTab = function(type, payload) {
    if (isServer) return
    var message = { type: type, payload: payload, sourceTabId: tabId, timestamp: now() }
    try {
      if (broadcastChannel) {
        broadcastChannel.postMessage(message)
        return
      }
      if (window.localStorage) {
        var key =
          'cache_cross_tab_' +
          Date.now() +
          '_' +
          Math.random()
            .toString(36)
            .substr(2, 9)
        localStorage.setItem(key, JSON.stringify(message))
        setTimeout(function() {
          localStorage.removeItem(key)
        }, 1000)
      }
    } catch (e) {
      console.error(e)
    }
  }

  var clearCache = function() {
    memoryCache.clear()
    readOnlyCache.clear()
    mutationTimestamps.clear()
    revalidatedKeys.clear()
    pending.forEach(function(p) {
      p.reject(new Error('Cache cleared'))
    })
    pending.clear()
    readOnlyPending.forEach(function(p) {
      p.reject(new Error('Cache cleared'))
    })
    readOnlyPending.clear()
    clearStorageByPrefix(CACHE_PREFIX)
    clearStorageByPrefix(READONLY_PREFIX)
    try {
      var urls = ['/api/v1/admin/me']
      for (var i = 0; i < urls.length; i++) {
        var keys = Object.keys(localStorage)
        for (var j = 0; j < keys.length; j++) {
          if (keys[j].includes(urls[i])) localStorage.removeItem(keys[j])
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  var handleRealtimeUpdate = function(update) {
    if (isSignedOut) return
    var type = update.type
    if (type === 'INVALIDATE_CACHE') {
      var invalidateUrls = update.invalidateUrls
      if (invalidateUrls && invalidateUrls.length) {
        for (var i = 0; i < invalidateUrls.length; i++) {
          var url = invalidateUrls[i]
          var normalizedUrl = normalizeUrl(url)
          var memoryKeys = Array.from(memoryCache.keys())
          for (var j = 0; j < memoryKeys.length; j++) {
            if (memoryKeys[j].includes(normalizedUrl)) {
              memoryCache.delete(memoryKeys[j])
              localStorage.removeItem(CACHE_PREFIX + memoryKeys[j])
              revalidatedKeys.delete(memoryKeys[j])
            }
          }
          var readOnlyKeys = Array.from(readOnlyCache.keys())
          for (var k = 0; k < readOnlyKeys.length; k++) {
            try {
              if (JSON.parse(readOnlyKeys[k]).url.includes(normalizedUrl)) {
                readOnlyCache.delete(readOnlyKeys[k])
                localStorage.removeItem(READONLY_PREFIX + readOnlyKeys[k])
              }
            } catch (e) {
              console.warn('Invalid read-only cache key:', readOnlyKeys[k])
              readOnlyCache.delete(readOnlyKeys[k])
              localStorage.removeItem(READONLY_PREFIX + readOnlyKeys[k])
            }
          }
          mutationTimestamps.set(normalizedUrl, now())
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cache-invalidated', { detail: { resource: update.resource, urls: invalidateUrls } }))
        }
      }
    } else if (type === 'DATA_UPDATED') {
      var resource = update.resource
      var data = update.data
      if (resource && data) {
        var updatedResponse = { data: data, status: 200, statusText: 'OK', headers: {}, config: {} }
        var cacheUpdated = false
        var memoryEntries = Array.from(memoryCache.entries())
        for (var l = 0; l < memoryEntries.length; l++) {
          var entry = memoryEntries[l]
          if (entry[0].includes(resource)) {
            updatedResponse.config = entry[1].config || {}
            memoryCache.set(entry[0], updatedResponse)
            setPersisted(entry[0], updatedResponse)
            cacheUpdated = true
          }
        }
        var readOnlyEntries = Array.from(readOnlyCache.entries())
        for (var m = 0; m < readOnlyEntries.length; m++) {
          var roEntry = readOnlyEntries[m]
          try {
            if (JSON.parse(roEntry[0]).url.includes(resource)) {
              updatedResponse.config = roEntry[1].config || {}
              readOnlyCache.set(roEntry[0], updatedResponse)
              setReadOnlyStored(roEntry[0], updatedResponse)
              cacheUpdated = true
            }
          } catch (e) {
            if (roEntry[0].includes(resource)) {
              updatedResponse.config = roEntry[1].config || {}
              readOnlyCache.set(roEntry[0], updatedResponse)
              setReadOnlyStored(roEntry[0], updatedResponse)
              cacheUpdated = true
            }
          }
        }
        if (!cacheUpdated) {
          var basePath = getBaseResourcePath(resource)
          var memEntries = Array.from(memoryCache.entries())
          for (var n = 0; n < memEntries.length; n++) {
            if (memEntries[n][0].includes(basePath)) {
              updatedResponse.config = memEntries[n][1].config || {}
              memoryCache.set(memEntries[n][0], updatedResponse)
              setPersisted(memEntries[n][0], updatedResponse)
              cacheUpdated = true
            }
          }
        }
        if (!cacheUpdated) {
          try {
            localStorage.setItem(CACHE_PREFIX + resource + '?{}', JSON.stringify({ timestamp: now(), data: updatedResponse, version: CACHE_VERSION }))
          } catch (e) {
            localStorage.setItem(CACHE_PREFIX + resource + '?{}', JSON.stringify({ timestamp: now(), data: updatedResponse, version: CACHE_VERSION }))
          }
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('data-updated', { detail: { resource: resource, data: data } }))
          window.dispatchEvent(new CustomEvent('cache-refresh-needed', { detail: { resource: resource } }))
        }
      }
    } else if (type === 'REFRESH_REQUIRED') {
      clearCache()
      rehydrateCache()
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cache-refreshed', {}))
    }
  }

  var invalidateRelatedCache = function(mutationUrl) {
    if (isServer) return
    var normalizedMutationUrl = normalizeUrl(mutationUrl)
    var mutationBase = getBaseResourcePath(normalizedMutationUrl)
    mutationTimestamps.set(mutationBase, now())
    var pathsToInvalidate = new Set([mutationBase])
    var resourceKeys = Object.keys(resourceRelationships)
    for (var i = 0; i < resourceKeys.length; i++) {
      var resource = resourceKeys[i]
      var relatedResources = resourceRelationships[resource]
      if (mutationBase.includes(resource)) {
        for (var r = 0; r < relatedResources.length; r++) {
          pathsToInvalidate.add(relatedResources[r])
        }
      }
      var resourceKeys2 = Object.keys(resourceRelationships)
      for (var j = 0; j < resourceKeys2.length; j++) {
        var rels = resourceRelationships[resourceKeys2[j]]
        for (var k = 0; k < rels.length; k++) {
          if (mutationBase.includes(rels[k])) {
            pathsToInvalidate.add(resourceKeys2[j])
            for (var l = 0; l < rels.length; l++) {
              pathsToInvalidate.add(rels[l])
            }
          }
        }
      }
    }
    var idMatch = normalizedMutationUrl.match(/\/(\w+)\/(\d+)$/)
    if (idMatch && idMatch[1] === 'locum-user-compliances') pathsToInvalidate.add('/api/v1/admin/locum-compliance-documents')
    var pathArray = Array.from(pathsToInvalidate)
    var memoryKeys = Array.from(memoryCache.keys())
    for (var m = 0; m < memoryKeys.length; m++) {
      var keyUrl = memoryKeys[m].split('?')[0]
      for (var n = 0; n < pathArray.length; n++) {
        if (keyUrl.includes(pathArray[n])) {
          memoryCache.delete(memoryKeys[m])
          localStorage.removeItem(CACHE_PREFIX + memoryKeys[m])
          revalidatedKeys.delete(memoryKeys[m])
          break
        }
      }
    }
    var pendingKeys = Array.from(pending.keys())
    for (var o = 0; o < pendingKeys.length; o++) {
      for (var p = 0; p < pathArray.length; p++) {
        if (pendingKeys[o].includes(pathArray[p])) {
          pending.get(pendingKeys[o]).reject(new Error('Invalidated by mutation'))
          pending.delete(pendingKeys[o])
          break
        }
      }
    }
    broadcastCrossTab('MUTATION_OCCURRED', { mutationUrl: mutationUrl })
    try {
      var socket = getSocket()
      if (socket && socket.connected) {
        socket.emit('cache:invalidate', { invalidateUrls: pathArray, mutationUrl: mutationUrl, sourceTabId: tabId })
      }
    } catch (e) {
      console.error('Failed to broadcast cache invalidation:', e)
    }
  }

  var isCacheStale = function(key, url) {
    var lastMutation = mutationTimestamps.get(getBaseResourcePath(url))
    if (!lastMutation) return false
    try {
      var raw = localStorage.getItem(CACHE_PREFIX + key)
      if (raw) return lastMutation > JSON.parse(raw).timestamp
    } catch (e) {
      return false
    }
    return false
  }

  var revalidateInBackground = function(key, config) {
    if (isServer || isSignedOut || revalidatedKeys.has(key)) return
    revalidatedKeys.add(key)
    var freshConfig = {}
    for (var prop in config) {
      if (config.hasOwnProperty(prop) && prop !== 'adapter' && prop !== '_cacheKey') {
        freshConfig[prop] = config[prop]
      }
    }
    freshConfig.skipCache = true
    $axios
      .request(freshConfig)
      .then(function(freshResponse) {
        if (isSignedOut) return
        if (!(freshResponse && freshResponse.status >= 200 && freshResponse.status < 300)) return
        memoryCache.set(key, freshResponse)
        setPersisted(key, freshResponse)
        try {
          var socket = getSocket()
          if (socket && socket.connected) {
            socket.emit('cache:data-updated', { resource: key.split('?')[0], data: freshResponse.data, sourceTabId: tabId })
          }
        } catch (e) {
          console.log(e)
        }
      })
      .catch(function() {
        revalidatedKeys.delete(key)
      })
  }

  var rehydrateCache = function() {
    if (isSignedOut || isServer) return
    try {
      memoryCache.clear()
      readOnlyCache.clear()
      var keys = Object.keys(localStorage)
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i]
        if (k.startsWith(CACHE_PREFIX)) {
          var key = k.slice(CACHE_PREFIX.length)
          var data = getPersisted(key)
          if (data && !isCacheStale(key, key.split('?')[0])) {
            memoryCache.set(key, data)
          } else {
            localStorage.removeItem(k)
          }
        }
        if (k.startsWith(READONLY_PREFIX)) {
          var roKey = k.slice(READONLY_PREFIX.length)
          var roData = getReadOnlyStored(roKey)
          if (roData) readOnlyCache.set(roKey, roData)
          else localStorage.removeItem(k)
        }
      }
    } catch (e) {
      console.warn('Cache rehydration failed:', e)
    }
  }

  var setupRealtimeUpdates = function() {
    if (isServer || isSignedOut) return false
    try {
      var socket = getSocket()
      if (socket && socket.connected) {
        var handlers = ['cache:invalidate', 'cache:data-updated', 'cache:refresh']
        for (var i = 0; i < handlers.length; i++) {
          socket.off(handlers[i])
        }
        socket.on('cache:invalidate', function(data) {
          broadcastCrossTab('CACHE_INVALIDATED', data)
          var update = { type: 'INVALIDATE_CACHE' }
          for (var key in data) {
            if (data.hasOwnProperty(key)) update[key] = data[key]
          }
          handleRealtimeUpdate(update)
        })
        socket.on('cache:data-updated', function(data) {
          broadcastCrossTab('DATA_UPDATED', data)
          var update = { type: 'DATA_UPDATED' }
          for (var key in data) {
            if (data.hasOwnProperty(key)) update[key] = data[key]
          }
          handleRealtimeUpdate(update)
        })
        socket.on('cache:refresh', function(data) {
          broadcastCrossTab('CACHE_REFRESHED', data)
          var update = { type: 'REFRESH_REQUIRED' }
          for (var key in data) {
            if (data.hasOwnProperty(key)) update[key] = data[key]
          }
          handleRealtimeUpdate(update)
        })
        var userId =
          (app.$auth && app.$auth.user && app.$auth.user.id) ||
          (window.$nuxt && window.$nuxt.$auth && window.$nuxt.$auth.user && window.$nuxt.$auth.user.id)
        socket.emit('cache:join', { type: 'admin', userId: userId, tabId: tabId })
        reconnectAttempts = 0
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }

  var retryRealtimeSetup = function(delay) {
    delay = delay || 1000
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) return
    reconnectAttempts++
    var backoffDelay = delay * Math.pow(2, reconnectAttempts - 1)
    setTimeout(function() {
      var success = setupRealtimeUpdates()
      if (!success && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        retryRealtimeSetup(backoffDelay)
      }
    }, backoffDelay)
  }

  var disconnectRealtimeUpdates = function() {
    try {
      var socket = getSocket()
      if (socket) {
        socket.off('cache:invalidate')
        socket.off('cache:data-updated')
        socket.off('cache:refresh')
        socket.emit('cache:leave', { type: 'admin' })
      }
      if (broadcastChannel) {
        broadcastChannel.close()
        broadcastChannel = null
      }
    } catch (e) {
      console.log(e)
    }
  }

  var initializeRealtime = function() {
    var socket = getSocket()
    if (socket && socket.connected) {
      setupRealtimeUpdates()
    } else {
      setTimeout(function() {
        var s = getSocket()
        if (s && s.connected) {
          setupRealtimeUpdates()
        } else {
          retryRealtimeSetup(1000)
        }
      }, 500)
    }
  }

  rehydrateCache()
  if (!isServer) {
    initBroadcastChannel()
    initializeRealtime()
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden) {
        var socket = getSocket()
        if (socket && socket.connected) {
          var userId =
            (app.$auth && app.$auth.user && app.$auth.user.id) ||
            (window.$nuxt && window.$nuxt.$auth && window.$nuxt.$auth.user && window.$nuxt.$auth.user.id)
          socket.emit('cache:join', { type: 'admin', userId: userId, tabId: tabId })
        } else {
          initializeRealtime()
        }
      }
    })
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('online', function() {
      setTimeout(function() {
        initializeRealtime()
      }, 1000)
    })
  }

  $axios.onResponseError(function(err) {
    if (err && err.response && err.response.status === 401 && !isSignedOut) {
      isSignedOut = true
      disconnectRealtimeUpdates()
      app.$auth.logout().finally(function() {
        app.$auth.$storage.setUniversal('_token.local', '')
        if (app.$loggedOutBroadcastChannel && app.$loggedOutBroadcastChannel.postMessage) {
          app.$loggedOutBroadcastChannel.postMessage()
        }
        clearCache()
        isSignedOut = false
        setTimeout(function() {
          initializeRealtime()
        }, 1000)
      })
    }
  })

  $axios.interceptors.request.use(function(config) {
    var method = (config.method || 'get').toLowerCase()
    var url = config.url || ''
    if (isSignedOut) config.skipCache = true
    if (isMutation(method) && !isCacheExempt(url)) {
      setTimeout(function() {
        invalidateRelatedCache(url)
      }, MUTATION_INVALIDATION_DELAY)
    }
    if (isReadOnly(url)) {
      var key = makeReadOnlyKey(config)
      if (readOnlyCache.has(key)) {
        config.adapter = function() {
          return Promise.resolve(readOnlyCache.get(key))
        }
        return config
      }
      if (readOnlyPending.has(key)) {
        config.adapter = function() {
          return readOnlyPending.get(key).promise
        }
        return config
      }
      var resolve, reject
      var promise = new Promise(function(res, rej) {
        resolve = res
        reject = rej
      })
      readOnlyPending.set(key, { promise: promise, resolve: resolve, reject: reject })
      config._readOnlyKey = key
      return config
    }
    if (method !== 'get' || config.skipCache || isIdentityRequest(url) || isSignedOut) return config
    var cacheKey = makeKey(config)
    if (memoryCache.has(cacheKey) && !isCacheStale(cacheKey, url)) {
      config.adapter = function() {
        return Promise.resolve(memoryCache.get(cacheKey))
      }
      revalidateInBackground(cacheKey, config)
      return config
    }
    if (memoryCache.has(cacheKey)) {
      memoryCache.delete(cacheKey)
      localStorage.removeItem(CACHE_PREFIX + cacheKey)
      revalidatedKeys.delete(cacheKey)
    }
    var persisted = getPersisted(cacheKey)
    if (persisted && !isCacheStale(cacheKey, url)) {
      memoryCache.set(cacheKey, persisted)
      config.adapter = function() {
        return Promise.resolve(persisted)
      }
      revalidateInBackground(cacheKey, config)
      return config
    }
    if (pending.has(cacheKey)) {
      config.adapter = function() {
        return pending.get(cacheKey).promise
      }
      return config
    }
    var resolve2, reject2
    var promise2 = new Promise(function(res, rej) {
      resolve2 = res
      reject2 = rej
    })
    pending.set(cacheKey, { promise: promise2, resolve: resolve2, reject: reject2 })
    config._cacheKey = cacheKey
    return config
  })

  $axios.interceptors.response.use(
    function(response) {
      var config = response.config
      var url = config.url || ''
      var isSuccess = response.status >= 200 && response.status < 300
      if (config._readOnlyKey) {
        var key = config._readOnlyKey
        if (isSuccess) {
          readOnlyCache.set(key, response)
          setReadOnlyStored(key, response)
        }
        if (readOnlyPending.has(key)) {
          readOnlyPending.get(key).resolve(response)
          readOnlyPending.delete(key)
        }
        return response
      }
      var method = (config.method || 'get').toLowerCase()
      if (method !== 'get') return response
      var cacheKey = config._cacheKey || makeKey(config)
      if (!isSignedOut && !isIdentityRequest(url) && !config.skipCache && isSuccess) {
        memoryCache.set(cacheKey, response)
        setPersisted(cacheKey, response)
      }
      if (pending.has(cacheKey)) {
        pending.get(cacheKey).resolve(response)
        pending.delete(cacheKey)
      }
      return response
    },
    function(error) {
      var config = error && error.config
      if (!config) return Promise.reject(error)
      var url = config.url || ''
      if (isReadOnly(url)) {
        var key = config._readOnlyKey
        if (key && readOnlyPending.has(key)) {
          readOnlyPending.get(key).reject(error)
          readOnlyPending.delete(key)
        }
        return Promise.reject(error)
      }
      var method = (config.method || 'get').toLowerCase()
      if (method === 'get') {
        var cacheKey = config._cacheKey || makeKey(config)
        if (pending.has(cacheKey)) {
          pending.get(cacheKey).reject(error)
          pending.delete(cacheKey)
        }
      }
      return Promise.reject(error)
    }
  )

  if (typeof window !== 'undefined') {
    window.addEventListener('force-cache-refresh', function(event) {
      var resource = event.detail && event.detail.resource
      if (resource) {
        var keys = Array.from(memoryCache.keys())
        for (var i = 0; i < keys.length; i++) {
          if (keys[i].includes(resource)) {
            memoryCache.delete(keys[i])
            localStorage.removeItem(CACHE_PREFIX + keys[i])
            revalidatedKeys.delete(keys[i])
          }
        }
      }
    })
  }
}
