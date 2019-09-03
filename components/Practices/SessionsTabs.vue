<template>
  <div class="flex flex-row flex-wrap justify-start">
      <nuxt-link 
        :to="getRoute('session_available')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.session_tab === 'session_available' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Available</nuxt-link>
      <nuxt-link
        :to="getRoute('session_applied')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.session_tab === 'session_applied' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Applied</nuxt-link>
      <nuxt-link
        :to="getRoute('session_current')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.session_tab === 'session_current' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Current</nuxt-link>
      <nuxt-link 
        :to="getRoute('session_completed')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.session_tab === 'session_completed' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Completed</nuxt-link>
      <nuxt-link
        :to="getRoute('session_unfilled')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.session_tab === 'session_unfilled' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Unfilled</nuxt-link>
      <nuxt-link
        :to="getRoute('session_cancelled')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.session_tab === 'session_cancelled' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Cancelled</nuxt-link>
      <nuxt-link
        :to="getRoute('session_declined')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.session_tab === 'session_declined' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Declined</nuxt-link>
  </div>
</template>
<script>
export default {
  props:['practice'],
  created(){
    console.log(this.$route.query.session_tab)
  },
  computed:{
    getRoute(){
      return(tab) =>{
        const query = {
          ...this.$route.query,
          session_tab:tab
        }
        return{
          path: `/practices/${this.practice.id}/practice-sessions`,
          query
        }
      }
    }
  },
}
</script>