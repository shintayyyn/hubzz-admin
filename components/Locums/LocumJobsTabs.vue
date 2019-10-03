<template>
  <div class="flex flex-row flex-wrap justify-start">
      <nuxt-link 
        :to="`/locums/${this.user.id}/locum-jobs/locum-current-jobs`"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/locums/${user.id}/locum-jobs/locum-current-jobs` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Current</nuxt-link>
      <nuxt-link
        :to="getRoute('locum-available-jobs')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/locums/${user.id}/locum-jobs/locum-available-jobs` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Available</nuxt-link>
      <nuxt-link
        :to="getRoute('locum-matched-jobs')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/locums/${user.id}/locum-jobs/locum-matched-jobs`? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Matched</nuxt-link>
      <nuxt-link
        :to="getRoute('locum-applied-jobs')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/locums/${user.id}/locum-jobs/locum-applied-jobs`? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Applied</nuxt-link>
      <nuxt-link
        :to="getRoute('locum-cancelled-jobs')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/locums/${user.id}/locum-jobs/locum-cancelled-jobs` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Cancelled</nuxt-link>
      <nuxt-link
        :to="getRoute('locum-unsuccessful-jobs')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/locums/${user.id}/locum-jobs/locum-unsuccessful-jobs` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Unsuccessful</nuxt-link>
      <nuxt-link
        :to="getRoute('locum-declined-jobs')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/locums/${user.id}/locum-jobs/locum-declined-jobs` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Declined</nuxt-link>
      <nuxt-link
        :to="getRoute('locum-completed-jobs')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/locums/${user.id}/locum-jobs/locum-completed-jobs` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Completed</nuxt-link>
  </div>
</template>
<script>
export default {
  props:['user'],
  
  computed: {
    getRoute() {
      return(tab) => {
        try{
          if(!tab){
            tab = ''
          }
          const query = {
            ...this.$route.query,
          }
          return{
            path:`/locums/${this.user.id}/locum-jobs/${tab}`,
            query
          }
        }catch(err){

        }
        
      }
    }
  }
}
</script>