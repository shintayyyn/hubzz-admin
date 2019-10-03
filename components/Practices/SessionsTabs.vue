<template>
  <div class="flex flex-row flex-wrap justify-start">
      <nuxt-link 
        :to="getRoute('practice-available-sessions')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path.includes(`practice-available-sessions`) ? 'border rounded-lg border-gray-dark bg-gray-dark hover:bg-gray' : ''"
      >Available</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-applied-sessions')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path.includes(`/practices/${practice.id}/practice-sessions/practice-applied-sessions`) ? 'border rounded-lg border-gray-dark bg-gray-dark hover:bg-gray' : 'text-white'"
      >Applied</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-current-sessions')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path.includes(`practice-current-sessions`) ? 'border rounded-lg border-gray-dark bg-gray-dark hover:bg-gray' : 'text-white'"
      >Current</nuxt-link>
      <nuxt-link 
        :to="getRoute('practice-completed-sessions')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path.includes(`practice-completed-sessions`) ? 'border rounded-lg border-gray-dark bg-gray-dark hover:bg-gray' : ''"
      >Completed</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-unfilled-sessions')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path.includes(`practice-unfilled-sessions`) ? 'border rounded-lg border-gray-dark bg-gray-dark hover:bg-gray' : 'text-white'"
      >Unfilled</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-cancelled-sessions')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path.includes(`practice-cancelled-sessions`) ? 'border rounded-lg border-gray-dark bg-gray-dark hover:bg-gray' : 'text-white'"
      >Cancelled</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-declined-sessions')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path.includes(`practice-declined-sessions`) ? 'border rounded-lg border-gray-dark bg-gray-dark hover:bg-gray' : 'text-white'"
      >Declined</nuxt-link>
  </div>
</template>
<script>
export default {
  props:['practice'],
  
  computed:{
    getRoute(){
      return(tab) => {
        if(!tab){
          tab = ''
        }
        const query = {
          ...this.$route.query,
        }
        return{
          path:`/practices/${this.practice.id}/practice-sessions/${tab}`,
          query
        }
      }
    }
  },
}
</script>