<template>
  <div class="flex flex-col h-full md:flex-row overflow-auto w-full xl:justify-center">
	<div class="flex flex-col h-full items-center md:flex-row md:h-full w-full" >

		<div class="bg-logo flex lg:w-auto md:h-full overflow-hidden w-full p-8 sm:p-5 md:p4" :style="{ backgroundImage: `url(${backgroundUrl})` }">
			<img class="m-auto" src="~/assets/images/hubzz-logo.png">
		</div>

		<div class="lg:mx-auto lg:w-auto md:h-full py-10 w-full">
			<div class="relative w-full flex justify-center md:h-full md:items-center px-4 md:px-0" >
				

				<div class="form w-full flex flex-col pt-16 px-10 py-6 rounded-lg shadow-lg" style="background-color: #55565A;">
					<div v-if="loginErrorMessage" class="rounded-lg bg-red -mt-10 m-2 p-2 flex items-center justify-between" style="width: 100%;">
						<div class="flex-1 flex justify-center items-center">
							<svgicon name="exclamation-circle-solid" height="24" width="24" class="text-white fill-current"/>
							<span class="text-white px-4">{{ loginErrorMessage }}</span>
						</div>
						<button class="text-white p-2" @click="loginErrorMessage = ''">
							<svgicon name="times-solid" height="24" width="24" class="text-white fill-current"/>
						</button>
					</div>
					<div class="flex flex-wrap justify-between">
					<label class="text-white text-sm my-1 py-1">Email address</label>
					<div class="m-1 flex-auto flex justify-end">
						<span class="text-xs bg-red p-1 text-white" v-if="emailErrorMessage && !showEmailFocus">{{ emailErrorMessage }}</span>
					</div>
					</div>
					<input
					class="bg-transparent text-white py-2 mt-2 mb-8 outline-none border-b"
					v-model="email"
					@keyup.enter="login"
					:class="showEmailFocus ? 'border-yellow-dark' : emailErrorMessage ? 'border-red' : 'border-white-dark'"
					@focus="showEmailFocus = true"
					@blur="showEmailFocus = false, checkEmail()"
					>

					<div class="flex flex-wrap justify-between">
						<label class="text-white text-sm my-1 py-1">Password</label>
						<div class="m-1 flex-auto flex justify-end">
							<span class="text-xs bg-red p-1 text-white" v-if="passwordErrorMessage && !showPasswordFocus">{{ passwordErrorMessage }}</span>
						</div>
					</div>
					<input class="bg-transparent text-white py-2 mt-2 mb-8 outline-none border-b" v-model="password" type="password" keyup.enter="login" :class="showPasswordFocus ? 'border-yellow-dark' : passwordErrorMessage ? 'border-red' : 'border-white-dark'" @focus="showPasswordFocus = true" @blur="showPasswordFocus = false, checkPassword()">

					<button @click="login" class="self-center rounded-lg p-5 font-bold" style="background-color: #FFDA3A;" v-if="!loggingIn">Sign-in</button>
					<button @click="login" class="self-center rounded-lg p-5 font-bold" style="background-color: #FFDA3A;" v-if="loggingIn">Loading...</button>
				</div>
			</div>
		</div>

	</div>
 
  </div>
</template>

<script>
  import backgroundUrl from '~/assets/images/hubzz-bg.png'
  import isEmail from 'validator/lib/isEmail'

	export default {
    async asyncData({ store, redirect }) {
      try {
        if (store.$auth.loggedIn) {
          redirect('/')
          
          return
        }
      } catch (err) {
        console.log('sign-in asyncData err', err)
      }
    },

	data() {
		return {
			backgroundUrl,
			loggingIn: false,

			loginErrorMessage: '',

			email: 'admin@gmail.com',
			password: 'test1234567',

			showEmailFocus: false,
			showPasswordFocus: false,

			emailErrorMessage: '',
			passwordErrorMessage: '',
		}
	},

	methods: {
		checkEmail() {
			if (!this.email) {
				this.emailErrorMessage = 'Required'
			} else if (!isEmail(this.email)) {
				this.emailErrorMessage = 'Please enter a valid email address.'
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
			this.checkEmail()

			this.checkPassword()

			if (this.emailErrorMessage || this.passwordErrorMessage) {
				return
			}

			this.loggingIn = true

			this.$store.dispatch('login', {
				email: this.email,
				password: this.password
			}).then((res) => {
				console.log('hotdog')
			}).catch((err) => {
				let loginErrorMessage = 'Something Went Wrong'

				if (err && err.message) {
					loginErrorMessage = err.message
				}

				if (err && err.response && err.response.data && err.response.data.message) {
					loginErrorMessage = err.response.data.message
				}

				if (err && err.response && err.response.data && err.response.data.data && err.response.data.data.message) {
				loginErrorMessage = err.response.data.data.message
				}

			this.loginErrorMessage = loginErrorMessage
			}).finally(() => {
			this.loggingIn = false
			})
		}
	}
}
</script>
<style scoped>
.bg-logo{
	flex: 0 0 25%;
	background-size: 175%;
	background-position: top right;
	background-repeat: no-repeat;
}

.bg-logo img{
	height: 100%;
}

@media screen and (max-width: 320px) {
	.bg-logo img{
		width: 100%;
		height: auto;
	}
}

@media (min-width: 768px){
	.form{
		width: 50vw;
	}
	.bg-logo{
	flex: 0 0 40%;
	}

	.bg-logo img{
		height: auto;
		width: auto;
	}
}
@media (min-width: 992px){
	.form{
		width: 580px;
	}
}
</style>
