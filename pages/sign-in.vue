<template>
  <div
    class="relative w-full flex justify-center md:h-full md:items-center px-4 md:px-0 py-12 md:py-0"
  >
    <div
      class="w-full md:w-2/3 lg:w-4/5 xl:w-1/2 flex flex-col items-start p-4 md:px-10 md:py-6 sm:mx-12 md:mx-0 rounded-lg shadow-lg text-white"
      style="background-color: #55565A;"
    >
      <AppInput
        v-model="form.email"
        :label="'Email Address'"
        :type="'email'"
        :class="'w-full'"
        :error="formError.find(item => item.field === 'email')"
        @blur="CheckEmptyField(form.email, 'email')"
      />
      <AppInput
        v-model="form.password"
        :label="'Password'"
        :type="'password'"
        :class="'w-full'"
        :error="formError.find(item => item.field === 'password')"
        @blur="CheckEmptyField(form.password, 'password')"
        @submit="login"
      />
      <nuxt-link
        to="/forgot-password"
        class="ml-auto text-sm text-right hover:underline mb-2 -mt-4 text-white"
      >
        Forgot Password?
      </nuxt-link>

      <AppButton :label="loggingIn ? 'Loading...' : 'Sign-in'" :class="'self-center'" @click="login" />

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

  export default {
    layout: "auth",

    components: {
      AppInput,
      AppButton
    },

    data () {
      return {
        form: {
          email: "",
          password: ""
        },
        formError: [],
        backgroundUrl,
        loggingIn: false
      }
    },

    async asyncData ({ store, redirect }) {
      try {
        if (store.$auth.loggedIn) {
          redirect("/")

          return
        }
      } catch (err) {
        console.log("sign-in asyncData err", err)
      }
    },

    methods: {
      login: debounce(function () {
        this.formError = []
        this.Validate(this.form)
        if (!this.formError.length) {
          this.$store
            .dispatch("login", this.form)
            .catch(err => {
              if (
                err &&
                err.response &&
                err.response.data &&
                err.response.data.error_messages
              ) {
                this.formError = err.response.data.error_messages
              }
            })
            .finally(() => {
              this.loggingIn = false
            })
        }
      }, 10)
    }
  }
</script>
