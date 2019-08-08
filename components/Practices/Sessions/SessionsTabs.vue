<template>
  <div class="flex flex-row flex-wrap justify-start">
      <div 
        @click.prevent="goTo('session_available')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.session_tab === 'session_available' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Available</div>
      <div
        @click.prevent="goTo('session_applied')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.session_tab === 'session_applied' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Applied</div>
      <div
        @click.prevent="goTo('session_current')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.session_tab === 'session_current' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Current</div>
      <div 
        @click.prevent="goTo('session_completed')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.session_tab === 'session_completed' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Completed</div>
      <div
        @click.prevent="goTo('session_unfilled')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.session_tab === 'session_unfilled' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Unfilled</div>
      <div
        @click.prevent="goTo('session_cancelled')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.session_tab === 'session_cancelled' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Cancelled</div>
      <div
        @click.prevent="goTo('session_declined')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.session_tab === 'session_declined' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Declined</div>
  </div>
</template>
<script>
export default {
  created(){
    console.log(this.$route.query.session_tab)
  },
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query,
        session_tab: type
      }
      this.$router.push({ query })
    }
  }
}
</script>