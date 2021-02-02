<template>
  <div class="relative w-full flex justify-center md:h-full md:items-center px-4 md:px-0 py-12 md:py-0">
    <AppNotification />
    <div
      class="w-full md:w-2/3 lg:w-4/5 xl:w-1/2 flex flex-col items-start p-4 md:px-10 md:py-6 sm:mx-12 md:mx-0 rounded-lg shadow-lg text-white"
      style="background-color: #55565A;"
    >
      <AppInput
        v-model="email"
        label="Email Address"
        type="email"
        class="w-full"
        :error="formErrors.find(formError => formError.field === 'email')"
        @blur="CheckEmptyField(email, 'email')"
      />
      <AppInput
        v-model="password"
        label="Password"
        type="password"
        class="w-full"
        :error="formErrors.find(formError => formError.field === 'password')"
        @blur="CheckEmptyField(password, 'password')"
        @submit="login"
      />

      <nuxt-link
        to="/forgot-password"
        class="ml-auto text-sm text-right hover:underline mb-2 -mt-4 text-white"
      >
        Forgot Password?
      </nuxt-link>

      <AppButton :label="loggingIn ? 'Loading...' : 'Sign-in'" class="self-center" @click="login" />

      <!-- <button
				@click="login"
				class="self-center rounded-lg px-6 py-4 font-bold bg-sunglow hover:bg-sunglow-dark transition-hover"
				v-if="!loggingIn"
			>{{loggingIn ? 'Loading...' : 'Sign-in'}}</button>-->
    </div>
  </div>
</template>

<script>
  import backgroundUrl from "~/assets/images/hubzz-bg.png"
  import debounce from "lodash.debounce"
  import AppInput from "@/components/Base/AppInput"
  import AppButton from "@/components/Base/AppButton"
  import AppNotification from "@/components/AppNotification"

  export default {
    layout: 'auth',

    components: {
      AppInput,
      AppButton,
      AppNotification,
    },

    data () {
      return {
        email: '',
        password: '',
        formErrors: [],
        backgroundUrl,
        loggingIn: false,
      }
    },

    watch: {
      email () {
        const index = this.formErrors.findIndex((formError) => formError.field === 'email')

        if (this.email) {
          if (index > -1) {
            this.formErrors.splice(index, 1)
          }
        } else {
          if (index === -1) {
            this.formErrors.push({
              field: 'email',
              message: 'Email is required.',
              validation: 'required',
            })
          }
        }
      },

      password () {
        const index = this.formErrors.findIndex((formError) => formError.field === 'password')

        if (this.password) {
          if (index > -1) {
            this.formErrors.splice(index, 1)
          }
        } else {
          if (index === -1) {
            this.formErrors.push({
              field: 'password',
              message: 'Password is required.',
              validation: 'required',
            })
          }
        }
      },
    },

    async asyncData ({ store, redirect }) {
      try {
        if (store.$auth.loggedIn) {
          redirect('/')

          return
        }
      } catch (err) {
        console.log('sign-in err', err)
      }
    },

    mounted () {
      this.$loggedInBroadcastChannel.addEventListener('message', this.loggedInHandler)
    },

    destroyed () {
      this.$loggedInBroadcastChannel.removeEventListener('message', this.loggedInHandler)
    },

    methods: {

      login: debounce(async function () {
        try {
          if (this.loggingIn || this.$auth.loggedIn) {
            return
          }

          const data = {
            email: this.email,
            password: this.password,
          }

          this.formErrors = await this.$validator(data, {
            email: 'required|email',
            password: 'required|string',
          }, {
            'email.required': 'Email is required.',
            'email.email': 'Invalid email.',
            'password.required': 'Password is required.',
            'password.string': 'Invalid password.',
          }).then(() => []).catch((errors) => errors)

          if (this.formErrors.length) {
            return
          }

          this.loggingIn = true

          const response = await this.$axios.post('/api/v1/admin/login', data)

          const token = response.data.data.token.token

          await this.loggedInHandler(token)

          await this.$loggedInBroadcastChannel.postMessage(token)

          this.loggingIn = false
        } catch (err) {
          console.log('err', err.response || err)

          let message = null

          if (err.response) {
            if (err.response.status === 400 && err.response.data.error_messages) {
              this.formErrors = err.response.data.error_messages
            } else {
              message = err.response.data.message
            }
          } else if (err.request) {
            message = 'Something went wrong!'
          } else {
            message = err.message
          }

          if (message) {
            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'danger',
              text: message,
            })
          }

          this.loggingIn = false
        }
      }, 10),


      async loggedInHandler (token) {
        try {
          this.$axios.setToken(token, 'Bearer')

          this.$auth.$storage.setUniversal('_token.local', 'Bearer ' + token)

          await this.$auth.fetchUser()

          this.$router.push('/')

          if (this.$socket.connected) {
            await this.$axios.post('/api/v1/socket/login', {
              socket_id: this.$socket.id
            })

            console.log('Socket Logged In')
          }

          await this.$store.dispatch('one-signal/setOneSignalUser')
        } catch (err) {
          console.log('err', err)
        }
      },

    },

  }
</script>
