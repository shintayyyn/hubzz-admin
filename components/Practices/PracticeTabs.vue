<template>
  <div class="flex flex-row flex-wrap justify-start">
      <nuxt-link
        :to="getRoute()" 
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
        :class="$route.path == `/practices/${practice.id}` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Practice</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-surgeries')"
        v-if="practice.type == 'Hub' "
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
        :class="$route.path == `/practices/${practice.id}/practice-surgeries`? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Surgeries</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-hub')"
        v-if="practice.type == 'Spoke' "
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
        :class="$route.path == `/practices/${practice.id}/practice-hub`? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Hub</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-sessions')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
        :class="$route.path.includes(`/practices/${practice.id}/practice-sessions`)? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Sessions</nuxt-link>
      <nuxt-link 
        :to="getRoute('practice-users')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
        :class="$route.path == `/practices/${practice.id}/practice-users` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Users</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-documents')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
        :class="$route.path == `/practices/${practice.id}/practice-documents` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Documents</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-rates')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
        :class="$route.path == `/practices/${practice.id}/practice-rates` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Rates</nuxt-link>
  </div>
</template>
<script>
export default {
  props:['practice'],
  
  computed:{
    getRoute(){
      return(tab) =>{
        if(!tab){
          tab = ''
        }
        const query = {
          ...this.$route.query,
        }
        delete query.session_tab
        return{
          path: tab ? `/practices/${this.practice.id}/${tab}` : `/practices/${this.practice.id}`,
          query
        }
      }
    }
  },
}
</script>