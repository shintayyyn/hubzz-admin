<template>
  <form class="rate-limited-form relative w-full flex justify-center md:h-full md:items-center" @submit.prevent="onSubmit">
    <slot />

    <div class="rate-limit-message absolute -bottom-6 left-0 right-0 text-center text-red-400 text-sm">
      <span v-if="isBlocked">
        {{ message }}
        <span class="ml-2">({{ countdownSeconds }}s)</span>
      </span>
    </div>
  </form>
</template>

<script>
export default {
  name: 'RateLimiter',
  props: {
    limit: {
      type: Number,
      default: 5
    },
    windowMs: {
      type: Number,
      default: 60000
    },
    message: {
      type: String,
      default: 'Too many submissions. Please wait before trying again.'
    },
    storageKey: {
      type: String,
      default: 'rateLimiter'
    }
  },
  data() {
    return {
      timestamps: [],
      now: Date.now(),
      intervalId: null
    }
  },
  computed: {
    cleanedTimestamps() {
      const now = this.now
      return this.timestamps.filter(ts => now - ts < this.windowMs)
    },
    isBlocked() {
      return this.cleanedTimestamps.length >= this.limit
    },
    remainingMs() {
      if (!this.isBlocked) return 0

      const oldest = Math.min(...this.cleanedTimestamps)
      const expiresAt = oldest + this.windowMs
      return Math.max(0, expiresAt - this.now)
    },
    countdownSeconds() {
      return Math.ceil(this.remainingMs / 1000)
    }
  },
  mounted() {
    this.loadTimestamps()

    this.intervalId = setInterval(() => {
      this.now = Date.now()
      this.persistCleanedTimestamps()
    }, 250)
  },
  beforeDestroy() {
    if (this.intervalId) clearInterval(this.intervalId)
  },
  methods: {
    loadTimestamps() {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        try {
          this.timestamps = JSON.parse(stored)
        } catch (e) {
          this.timestamps = []
        }
      }
    },
    saveTimestamps() {
      localStorage.setItem(this.storageKey, JSON.stringify(this.timestamps))
    },
    persistCleanedTimestamps() {
      const cleaned = this.cleanedTimestamps
      if (cleaned.length !== this.timestamps.length) {
        this.timestamps = cleaned
        this.saveTimestamps()
      }
    },
    checkRate() {
      this.persistCleanedTimestamps()

      const now = Date.now()

      if (this.timestamps.length < this.limit) {
        this.timestamps.push(now)
        this.saveTimestamps()

        this.now = now
        return true
      }

      this.now = now
      return false
    },
    onSubmit(event) {
      if (this.checkRate()) {
        this.$emit('submit', event)
      } else {
        this.$emit('blocked', {
          message: this.message,
          countdownSeconds: this.countdownSeconds
        })
      }
    }
  }
}
</script>
