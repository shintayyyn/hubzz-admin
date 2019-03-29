<template>
  <div class="h-full w-full flex flex-col overflow-auto xl:justify-center">

    <div class="flex justify-center items-start" style="height: 600px;">

      <div class="flex flex-col px-10 py-6 m-4 rounded-lg shadow-lg" style="width: 600px; background-color: #55565A;">
        <div class="relative">
          <label class="text-white">Email address</label>
          <span v-show="emailErrorMessage && !showEmailFocus" class="text-white bg-red absolute pin-r p-1 text-xs">{{ emailErrorMessage }}</span>
        </div>
        <input class="bg-transparent text-white py-2 mt-2 mb-8 outline-none border-b" v-model="email" @keyup.enter="login" :class="showEmailFocus ? 'border-yellow-dark' : emailErrorMessage ? 'border-red' : 'border-white-dark'" @focus="showEmailFocus = true" @blur="showEmailFocus = false, checkEmail()">

        <div class="relative">
          <label class="text-white">Password</label>
          <span v-show="passwordErrorMessage && !showPasswordFocus" class="text-white bg-red absolute pin-r p-1 text-xs">{{ passwordErrorMessage }}</span>
        </div>
        <input class="bg-transparent text-white py-2 mt-2 mb-8 outline-none border-b" v-model="password" @keyup.enter="login" :class="showPasswordFocus ? 'border-yellow-dark' : passwordErrorMessage ? 'border-red' : 'border-white-dark'" @focus="showPasswordFocus = true" @blur="showPasswordFocus = false, checkPassword()">

        <button @click="login" class="self-center rounded-lg p-5 font-bold" style="background-color: #FFDA3A;">Sign In</button>
      </div>

    </div>

  </div>
</template>

<script>
	export default {
		data() {
			return {
				loggingIn: false,

				email: '',
				password: '',

				showEmailFocus: false,
				showPasswordFocus: false,

				emailErrorMessage: '',
				passwordErrorMessage: '',
			}
		},

		methods: {
			checkEmail() {
				if (this.email.trim() === '') {
					this.emailErrorMessage = 'Required'
				} else {
					this.emailErrorMessage = ''
				}
			},

			checkPassword() {
				if (this.password.trim() === '') {
					this.passwordErrorMessage = 'Required'
				} else {
					this.passwordErrorMessage = ''
				}
			},

			login() {
				const data = {
					email: this.email,
					password: this.password
				}

				this.loggingIn = true

	      this.$axios.post('/api/v1/login', data).then((response) => {
	        const token = response.data.data.token.token

	        this.$axios.setToken(token, 'Bearer')

	        this.$auth.$storage.setUniversal('_token.local', 'Bearer ' + token)

	        this.$auth.fetchUser().then(() => {
	          this.$router.push('/')
	        })
	      }).catch((err) => {
					console.log('login err', err.response || err)

					let errMessage = 'Something went wrong!'

					if (err && err.response && err.response.data && err.response.data.message) {
						errMessage = err.response.data.message
					}

					console.log('errMessage', errMessage)
					// this.$swal('Failed', errMessage, 'error')
	      }).finally(() => {
       		this.loggingIn = false
	      })
			}
		}
	}
</script>