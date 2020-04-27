<template>
  <div class="relative flex flex-col bg-trout">
    <AppSideBar @modal="(value) => showLogoutModal = value" />
    
    <transition name="drop" mode="out-in">
      <SignOut v-if="showLogoutModal" @modal="(value) => showLogoutModal = value" @logout="logout" />
    </transition>
    
    <div v-if="showLogoutModal" class="signout-shield" @click="showLogoutModal = false" />
    
    <div v-if="$store.state.toggled_sidebar" class="sidebar-shield" @click="close" />
    
    <AppNotification />
    
    <PopUpNotification />
    
    <div class="content h-screen flex flex-col justify-between">
      <AppHeader />
      <nuxt class="overflow-y-auto" />
    </div>
  </div>
</template>

<script>
  import AppNotification from "~/components/AppNotification"
  import PopUpNotification from "@/components/PopUpNotification"
  import AppHeader from "~/components/AppHeader"
  import AppSideBar from "~/components/AppSideBar"
  import SignOut from "~/components/Auth/SignOut"

  export default {
    components: {
      AppNotification,
      PopUpNotification,
      AppHeader,
      AppSideBar,
      SignOut,
    },

    data () {
      return {
        showLogoutModal: false,
      }
    },

    mounted () {
      this.$loggedOutBroadcastChannel.addEventListener('message', this.loggedOutHandler)
    },

    destroyed () {
      this.$loggedOutBroadcastChannel.removeEventListener('message', this.loggedOutHandler)
    },

    methods: {
      logout () {
        this.$axios
          .post('/api/v1/admin/logout')
          .then(() => {
            console.log('Socket Logged Out')
            console.log('One Signal Logged Out')
          })
          .catch(err => {
            console.log('err', err.response || err)
            if (err.response.data.message) {
              this.$store.commit('SET_NOTIFICATION', {
                enabled: true,
                status: 'danger',
                text: [`${err.response.data.message}`]
              })
            }
          })
          .finally(() => {
            return this.loggedOutHandler()
          })
          .then(() => {
            this.$loggedOutBroadcastChannel.postMessage()
          })
          .catch(err => {
            console.log('err', err.response || err)
            if (err.response.data.message) {
              this.$store.commit('SET_NOTIFICATION', {
                enabled: true,
                status: 'danger',
                text: [`${err.response.data.message}`]
              })
            }
          })
      },

      loggedOutHandler () {
        return this.$auth.logout().finally(() => {
          this.$auth.$storage.setUniversal('_token.local', '')
          this.$router.push('/sign-in')
        })
      },

      close () {
        this.$store.commit('TOGGLE_SIDEBAR', false)
        document.body.style.overflow = 'auto'
      },

    },

  }
</script>

<style>
	.content {
		margin-left: 0;
		min-height: 100vh;
		max-height: 100%;
		overflow-x: hidden;
	}
	.sidebar-shield {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #31343d;
		opacity: 0.75;
		z-index: 499;
	}

	.signout-shield {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #333;
		opacity: 0.5;
		z-index: 511;
	}

	@media screen and (min-width: 1200px) {
		.content {
			margin-left: 200px;
		}

		.sidebar-shield {
			display: none;
		}
	}
</style>
