<template>
  <div class="w-screen h-screen relative flex flex-col">

  	<!-- LOGOUT MODAL -->
  	<div class="h-full w-full flex flex-col absolute" :style="`z-index: ${showLogoutModal ? 100 : -100}; opacity: ${showLogoutModal ? 1 : 0};`" style="opacity: .5; transition: .8s;">
	  	<div class="flex flex-col self-center py-2 px-24 rounded-lg" style="background-color: #FFDA3A;">
	  		<div>
	  			<span class="text-sm p-2">Proceed to sign-out?</span>
	  		</div>
	  		<div class="flex">
	  			<button class="p-2 text-xs rounded-lg border border-white mx-1 shadow" @click="logout">Yes</button>
	  			<button class="p-2 text-xs rounded-lg border border-white mx-1 shadow" @click="showLogoutModal = false">Cancel</button>
	  		</div>
	  	</div>
  	</div>
  	<!-- LOGOUT MODAL -->

  	<div class="w-full flex-1 flex">

  		<!-- SIDEBAR -->
  		<div class="flex flex-col pt-16 h-full" style="background-color: #2C2F38; transition: .8s;" :style="`width: ${sideBarOpen ? 'auto' : '0'}; min-width: ${sideBarOpen ? '180px' : '0'}`">
  			<nuxt-link class="text-xs px-6 py-4 no-underline border-l-4" style="transition: .4s;" :class="`${activeTab === 'dashboard' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`" to="/">Dashboard</nuxt-link>
  			<nuxt-link class="text-xs px-6 py-4 no-underline border-l-4" style="transition: .4s;" :class="`${activeTab === 'roles' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`" to="/roles">Roles</nuxt-link>
  			<button class="text-xs px-6 py-4 border-l-4 text-white border-transparent flex whitespace-no-wrap" @click="showLogoutModal = true">Sign out</button>
  		</div>
  		<!-- SIDEBAR -->

  		<div class="flex-1 flex flex-col" style="background-color: #505561;">
  			<!-- HEADER -->
  			<div class="flex justify-between text-sm text-white p-2">
  				<button class="text-white" @click="toggleSideBar">
						<img src="~/assets/images/hbg.png">
  				</button>

					<img src="~/assets/images/hubzz-icon-transparent.png">

					<div class="p-2 text-xs" v-if="$auth.loggedIn">
						<span>{{ $auth.user.email }}</span>
					</div>
  			</div>
  			<!-- HEADER -->

  			<!-- PAGE -->
		    <nuxt/>
  			<!-- PAGE -->
  		</div>

  	</div>
 
  </div>
</template>

<script>
	export default {
		data() {
			return {
				sideBarOpen: true,
				showLogoutModal: false
			}
		},

		computed: {
			activeTab() {

				if (this.$route.name.includes('roles')) {
					return 'roles'
				}

				if (this.$route.name.includes('index')) {
					return 'dashboard'
				}
			}
		},

		methods: {
			toggleSideBar() {
				console.log('toggleSideBar')
				this.sideBarOpen = !this.sideBarOpen
			},

      logout() {
      	this.showLogoutModal = false

        this.$axios.post('/api/v1/logout').finally(() => {
          this.$auth.logout().then(() => {
            this.$router.push('/sign-in')
          })
        })
      }
		}
	}
</script>

<style>
	.page-enter-active, .page-leave-active {
	  transition: .5s ease;
	}

	.page-enter, .page-leave-to {
		transform: translateX(100px);
	  opacity: 0;
	}
</style>