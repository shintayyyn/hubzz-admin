<template>
  <div class="flex justify-start overflow-x-auto my-2">
      <nuxt-link
        :to="getRoute('to-be-invoiced')" 
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`to-be-invoiced`) ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >To Be Invoiced</nuxt-link>
      <div class="p-3 rounded-lg border-solid border-4 border-orange-400">
        <nuxt-link
        :to="getRoute('disputed')"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`disputed`)? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Disputed</nuxt-link>
      <nuxt-link
        :to="getRoute('invoiced')"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path == `/practices/${practice.id}/practice-sessions/practice-completed-sessions/invoiced` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Invoiced</nuxt-link>
      </div>
      
  </div>
</template>
<script>
export default {
  props:['practice', 'practiceSurgery'],
  created(){
    console.log('route', this.$route.path)
  },
  computed:{
    getRoute(tab){
      return(tab) =>{
        if(!tab){
          tab = ''
        }
        const query = {
          ...this.$route.query,
        }
        delete query.session_tab
        return{
          path: `/practices/${this.practice.id}/practice-sessions/practice-completed-sessions/${tab}`,
          query
        }
      }
    }
  },
}
</script>