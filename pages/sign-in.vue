<template>
  <div class="flex flex-col h-full md:flex-row overflow-auto w-full xl:justify-center">
    <div class="flex flex-col h-full items-center md:flex-row md:h-full w-full">
      <div
        class="bg-logo flex lg:w-auto md:h-full overflow-hidden w-full p-4 md:p-8"
        :style="{ backgroundImage: `url(${backgroundUrl})` }"
      >
        <img class="mx-auto md:my-auto" src="~/assets/images/hubzz-logo.png" />
      </div>

      <div class="lg:mx-auto lg:w-auto md:h-full py-10 w-full">
        <div class="relative w-full flex justify-center md:h-full md:items-center px-4 md:px-0">
          <div
            class="form w-full flex flex-col p-4 md:px-10 md:py-6 rounded-lg shadow-lg"
            style="background-color: #55565A;"
          >
            <div
              v-if="loginErrorMessage"
              class="rounded-lg bg-red-600 -mt-10 m-2 p-2 flex items-center justify-between"
              style="width: 100%;"
            >
              <div class="flex-1 flex justify-center items-center">
                <svgicon
                  name="exclamation-circle-solid"
                  height="24"
                  width="24"
                  class="text-white fill-current"
                />
                <span class="text-white px-4">{{ loginErrorMessage }}</span>
              </div>
              <button class="text-white p-2" @click="loginErrorMessage = ''">
                <svgicon name="times-solid" height="24" width="24" class="text-white fill-current" />
              </button>
            </div>
            <div class="flex flex-wrap justify-between items-center py-1">
              <label class="text-white text-sm">Email address</label>
              <div class="flex justify-end">
                <span
                  class="text-xs bg-red-600 px-2 py-1 text-white rounded-lg flex items-center"
                  v-if="emailErrorMessage && !showEmailFocus"
                >{{ emailErrorMessage }}</span>
              </div>
            </div>
            <input
              class="bg-transparent text-white py-2  mb-4 outline-none border-b"
              v-model="email"
              @keyup.enter="login"
              :class="showEmailFocus ? 'border-yellow-500' : emailErrorMessage ? 'border-red' : 'border-white-dark'"
              @focus="showEmailFocus = true"
              @blur="showEmailFocus = false, checkEmail()"
            />

            <div class="flex flex-wrap justify-between items-center py-1">
              <label class="text-white text-sm">Password</label>
              <div class="flex justify-end">
                <span
                  class="text-xs bg-red-600 px-2 py-1 text-white rounded-lg flex items-center"
                  v-if="passwordErrorMessage && !showPasswordFocus"
                >{{ passwordErrorMessage }}</span>
              </div>
            </div>
            
            <div class="relative w-full mb-4">
              <input
                class="w-full bg-transparent text-white py-2 outline-none border-b pr-6"
                v-model="password"
                :type="togglePassword()"
                @keyup.enter="login"
                :class="showPasswordFocus ? 'border-yellow-500' : passwordErrorMessage ? 'border-red' : 'border-white-dark'"
                @focus="showPasswordFocus = true"
                @blur="showPasswordFocus = false, checkPassword()"
              />
              <button @click="passwordToggle = !passwordToggle" class="absolute right-0 h-full" v-if="password">
                <svgicon v-if="togglePassword() === 'password'" name="eye" width="20" height="20" class="text-white hover:text-gray-500 fill-current"/>
                <svgicon v-else name="hide-eye" width="20" height="20" class="text-white hover:text-gray-500 fill-current"/>
              </button>
            </div>

            <button
              @click="login"
              class="self-center rounded-lg px-6 py-4 font-bold bg-sunglow"
              v-if="!loggingIn"
            >Sign-in</button>
            <button
              @click="login"
              class="self-center rounded-lg px-6 py-4 font-bold bg-sunglow"
              v-if="loggingIn"
            >Loading...</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import backgroundUrl from "~/assets/images/hubzz-bg.png";
import isEmail from "validator/lib/isEmail";
import debounce from 'lodash.debounce'

export default {
  async asyncData({ store, redirect }) {
    try {
      if (store.$auth.loggedIn) {
        redirect("/");

        return;
      }
    } catch (err) {
      console.log("sign-in asyncData err", err);
    }
  },

  data() {
    return {
      backgroundUrl,
      loggingIn: false,

      loginErrorMessage: "",

      email: "",
      password: "",

      showEmailFocus: false,
      showPasswordFocus: false,

      emailErrorMessage: "",
      passwordErrorMessage: "",

      passwordToggle: false
    };
  },

methods: {
    togglePassword(){
      if (this.passwordToggle) {
        return 'text'
      }else{
        return 'password'
      }
    },
    checkEmail() {
      if (!this.email) {
        this.emailErrorMessage = "Required";
      } else if (!isEmail(this.email)) {
        this.emailErrorMessage = "Please enter a valid email address.";
      } else {
        this.emailErrorMessage = "";
      }
    },

    checkPassword() {
      if (this.password.trim() === "") {
        this.passwordErrorMessage = "Required";
      } else {
        this.passwordErrorMessage = "";
      }
    },

    login: debounce(function () {
      if (this.loggingIn) {
        return
      }

      this.checkEmail();

      this.checkPassword();

      if (this.emailErrorMessage || this.passwordErrorMessage) {
        return;
      }

      this.loggingIn = true;

      this.$store
        .dispatch("login", {
          email: this.email,
          password: this.password
        })
        .then(res => {})
        .catch(err => {
          let loginErrorMessage = "Something Went Wrong";

          if (err && err.message) {
            loginErrorMessage = err.message;
          }

          if (
            err &&
            err.response &&
            err.response.data &&
            err.response.data.message
          ) {
            loginErrorMessage = err.response.data.message;
          }

          if (
            err &&
            err.response &&
            err.response.data &&
            err.response.data.data &&
            err.response.data.data.message
          ) {
            loginErrorMessage = err.response.data.data.message;
          }

          this.loginErrorMessage = loginErrorMessage;
        })
        .finally(() => {
          this.loggingIn = false;
        });
    }, 10),
  }
};
</script>
<style scoped>
.bg-logo {
  /* flex: 0 0 25%; */
  background-size: 175%;
  background-position: top right;
  background-repeat: no-repeat;
}

.bg-logo img {
  height: 100%;
}

@media screen and (max-width: 320px) {
  .bg-logo img {
    width: 100%;
    height: auto;
  }
}

@media (min-width: 768px) {
  .form {
    width: 50vw;
  }
  .bg-logo {
    flex: 0 0 40%;
  }

  .bg-logo img {
    height: auto;
    width: auto;
  }
}
@media (min-width: 992px) {
  .form {
    width: 580px;
  }
}
</style>
