export default {
  props: {
    rateLimit: {
      type: Object,
      default: () => ({
        limit: 5,
        windowMs: 60000,
        message: 'Too many submissions. Please wait before trying again.',
        storageKey: 'rateLimiter'
      })
    }
  },
  data() {
    return {
      rateTimestamps: [],
      now: Date.now(),
      intervalId: null
    }
  },
  computed: {
    cleanedRateTimestamps() {
      const now = this.now
      return this.rateTimestamps.filter(ts => now - ts < this.rateLimit.windowMs)
    },
    isRateBlocked() {
      return this.cleanedRateTimestamps.length >= this.rateLimit.limit
    },
    remainingMs() {
      if (!this.isRateBlocked) return 0
      const oldest = Math.min(...this.cleanedRateTimestamps)
      const expiresAt = oldest + this.rateLimit.windowMs
      return Math.max(0, expiresAt - this.now)
    },
    countdownSeconds() {
      return Math.ceil(this.remainingMs / 1000)
    }
  },
  mounted() {
    this.loadRateTimestamps()

    this.intervalId = setInterval(() => {
      this.now = Date.now()
      this.persistCleanedRateTimestamps()
    }, 250)
  },
  beforeDestroy() {
    if (this.intervalId) clearInterval(this.intervalId)
  },
  methods: {
    loadRateTimestamps() {
      const stored = localStorage.getItem(this.rateLimit.storageKey)
      if (stored) {
        try {
          this.rateTimestamps = JSON.parse(stored)
        } catch (e) {
          this.rateTimestamps = []
        }
      }
    },
    saveRateTimestamps() {
      localStorage.setItem(this.rateLimit.storageKey, JSON.stringify(this.rateTimestamps))
    },
    persistCleanedRateTimestamps() {
      const cleaned = this.cleanedRateTimestamps
      if (cleaned.length !== this.rateTimestamps.length) {
        this.rateTimestamps = cleaned
        this.saveRateTimestamps()
      }
    },
    checkRate() {
      this.persistCleanedRateTimestamps()

      const now = Date.now()

      if (this.rateTimestamps.length < this.rateLimit.limit) {
        this.rateTimestamps.push(now)
        this.saveRateTimestamps()
        this.now = now
        return true
      }

      this.now = now
      return false
    },
    getBlockedMessageWithCountdown() {
      if (!this.isRateBlocked) return this.rateLimit.message
      return `${this.rateLimit.message} (${this.countdownSeconds}s)`
    },
    rateLimitedAction(action, ...args) {
      if (this.checkRate()) {
        return action.apply(this, args)
      }

      const blockedMessage = this.getBlockedMessageWithCountdown()
      this.$emit('rate-blocked', blockedMessage)
      if (this.$notify) {
        this.$notify.error(blockedMessage)
      }
      return false
    }
  }
}
