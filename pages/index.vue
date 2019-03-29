<template>
	<div>
		<h1>Index</h1>
    <button @click="logout" class="self-center rounded-lg p-2 font-bold" style="background-color: #FFDA3A;">Sign Out</button>
	</div>
</template>

<script>
  export default {
    layout: 'authenticated',

    async asyncData({ store, redirect }) {
      try {
        if (!store.$auth.loggedIn) {
          redirect('/sign-in')
          return
        }
      } catch (err) {
        console.log('index asyncData pages index err', err)
      }
    },

    methods: {
      logout() {
        this.$axios.post('/api/v1/logout').finally(() => {
          this.$auth.logout().then(() => {
            this.$router.push('/sign-in')
          })
        })
      }
    }
  }
</script>
