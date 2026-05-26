<template>
  <div class="relative w-full flex justify-center md:h-full md:items-center px-4 md:px-0 py-12 md:py-0">
    <AppNotification />

    <RateLimiter :limit="5" :windowMs="60000" message="Too many login attempts. Please wait a minute." @submit="login">
      <div
        class="w-full md:w-2/3 lg:w-4/5 xl:w-1/2 flex flex-col items-start p-4 md:px-10 md:py-6 sm:mx-12 md:mx-0 rounded-lg shadow-lg text-white"
        style="background-color: #55565A;"
      >
        <AppInput
          v-model="email"
          label="Email Address"
          type="email"
          class="w-full"
          :error="formError.find(e => e.field === 'email')"
          @blur="CheckEmptyField(email, 'email')"
        />

        <AppInput
          v-model="password"
          label="Password"
          type="password"
          class="w-full"
          :error="formError.find(e => e.field === 'password')"
          @blur="CheckEmptyField(password, 'password')"
          @submit="login"
        />

        <nuxt-link to="/forgot-password" class="ml-auto text-sm text-right hover:underline mb-2 -mt-4 text-white">
          Forgot Password?
        </nuxt-link>

        <AppButton :label="loggingIn ? 'Loading...' : 'Sign-in'" class="self-center text-black" @click="login" />
      </div>
    </RateLimiter>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import AppInput from '@/components/Base/AppInput'
import AppButton from '@/components/Base/AppButton'
import AppNotification from '@/components/AppNotification'
import RateLimiter from '@/components/Base/RateLimiter.vue'
import RateLimiterMixin from '@/components/Base/RateLimiterMixin'

export default {
  layout: 'auth',

  components: {
    AppInput,
    AppButton,
    AppNotification,
    RateLimiter
  },

  mixins: [RateLimiterMixin],

  data() {
    return {
      email: '',
      password: '',
      formError: [],
      loggingIn: false
    }
  },

  watch: {
    email(val) {
      const index = this.formError.findIndex(e => e.field === 'email')

      if (val && index > -1) this.formError.splice(index, 1)
      if (!val && index === -1) {
        this.formError.push({
          field: 'email',
          message: 'Email is required.',
          validation: 'required'
        })
      }
    },

    password(val) {
      const index = this.formError.findIndex(e => e.field === 'password')

      if (val && index > -1) this.formError.splice(index, 1)
      if (!val && index === -1) {
        this.formError.push({
          field: 'password',
          message: 'Password is required.',
          validation: 'required'
        })
      }
    }
  },

  async asyncData({ store, redirect }) {
    try {
      if (store?.$auth?.loggedIn) {
        return redirect('/')
      }
    } catch (e) {
      console.log('asyncData error:', e)
    }
  },

  mounted() {
    this.$loggedInBroadcastChannel && this.$loggedInBroadcastChannel.addEventListener('message', this.loggedInHandler)
  },

  beforeDestroy() {
    if (this.$loggedInBroadcastChannel) {
      this.$loggedInBroadcastChannel.removeEventListener('message', this.loggedInHandler)
    }
  },

  methods: {
    onRateBlocked(payload) {
      const countdown = payload && payload.countdownSeconds

      const text = countdown ? `Too many login attempts. Please wait ${countdown}s.` : 'Too many login attempts. Please wait a minute.'

      this.$store.commit('SET_NOTIFICATION', {
        enabled: true,
        status: 'error',
        text
      })
    },

    login: debounce(async function() {
      if (!this.checkRate()) {
        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'error',
          text: this.rateLimit.message
        })
        return
      }

      if (this.loggingIn || this.$auth.loggedIn) return

      try {
        const payload = {
          email: this.email,
          password: this.password
        }

        this.formError = await this.$validator(
          payload,
          {
            email: 'required|email',
            password: 'required|string'
          },
          {
            'email.required': 'Email is required.',
            'email.email': 'Invalid email.',
            'password.required': 'Password is required.',
            'password.string': 'Invalid password.'
          }
        )
          .then(() => [])
          .catch(err => err)

        if (this.formError.length) return

        this.loggingIn = true

        const res = await this.$axios.post('/api/v1/admin/login', payload)

        const token = res && res.data && res.data.data && res.data.data.token && res.data.data.token.token

        if (!token) throw new Error('Token missing in response')

        await this.loggedInHandler(token)

        this.$loggedInBroadcastChannel && this.$loggedInBroadcastChannel.postMessage(token)
      } catch (err) {
        const res = err && err.response

        let message = null

        if (res && res.status === 400 && res.data && res.data.error_messages) {
          this.formError = res.data.error_messages
        } else {
          message = (res && res.data && res.data.message) || (err && err.message) || 'Something went wrong!'
        }

        if (message) {
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'danger',
            text: message
          })
        }
      } finally {
        this.loggingIn = false
      }
    }, 100),

    async loggedInHandler(token) {
      try {
        this.$axios.setToken(token, 'Bearer')

        this.$auth.$storage.setUniversal('_token.local', 'Bearer ' + token)

        await this.$auth.fetchUser()

        this.$router.push('/')

        if (this.$socket && this.$socket.connected) {
          await this.$axios.post('/api/v1/socket/login', {
            socket_id: this.$socket.id
          })
        }

        if (this.$store.dispatch) {
          await this.$store.dispatch('one-signal/setOneSignalUser')
        }
      } catch (err) {
        console.log('loggedInHandler error:', err)
      }
    }
  }
}
</script>
