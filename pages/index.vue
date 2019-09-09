<template>
  <div class="flex-1 flex overflow-hidden flex-col">
    <nuxt-child/>
  </div>
</template>

<script>
export default {
  layout: 'authenticated',

  async asyncData({ app, store, redirect }) {
    try {
      if (!app.$auth.loggedIn) {
        return redirect('/sign-in')
      }
    } catch (err) {
      console.log('index asyncData pages index err', err)
    }
  }
}
</script>
