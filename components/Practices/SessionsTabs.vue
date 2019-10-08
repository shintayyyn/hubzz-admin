<template>
  <div class="flex justify-start overflow-x-auto">
      <nuxt-link 
        :to="getRoute('practice-available-sessions')"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`practice-available-sessions`) ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Available</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-applied-sessions')"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`/practices/${practice.id}/practice-sessions/practice-applied-sessions`) ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Applied</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-current-sessions')"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`practice-current-sessions`) ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Current</nuxt-link>
      <nuxt-link 
        :to="getRoute('practice-completed-sessions')"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`practice-completed-sessions`) ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Completed</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-unfilled-sessions')"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`practice-unfilled-sessions`) ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Unfilled</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-cancelled-sessions')"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`practice-cancelled-sessions`) ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Cancelled</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-declined-sessions')"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`practice-declined-sessions`) ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
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