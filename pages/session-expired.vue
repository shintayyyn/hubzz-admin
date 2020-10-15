<template>
	<div class="px-4 md:px-8">
		<div class="m-32 px-8">
      <h1 class="font-bold text-white">Session Expired. Please Log In again.</h1>
      <nuxt-link class="text-white underline text-sm" to="/sign-in">Go Home</nuxt-link>
    </div>
	</div>
</template>
<script>
export default {
	layout: "auth",
	mounted () {
		this.logOut()
	},

	// destroyed () {
	// 	this.$loggedOutBroadcastChannel.removeEventListener('message', this.loggedOutHandler)
	// },


	methods: {
		logOut () {
			this.$loggedOutBroadcastChannel.postMessage()
			return this.loggedOutHandler()
		},
		loggedOutHandler () {
			return this.$auth.logout().finally(() => {
				this.$auth.$storage.setUniversal('_token.local', '')
			})
		},
	}
}
</script>