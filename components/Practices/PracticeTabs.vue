<template>
  <div class="flex flex-row flex-wrap justify-start">
      <nuxt-link
        :to="getRoute()" 
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Practice</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-surgeries')"
        v-if="practice.type == 'Hub' "
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}/practice-surgeries`? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Surgeries</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-hub')"
        v-if="practice.type == 'Spoke' "
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}/practice-hub`? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Hub</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-sessions')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path.includes(`/practices/${practice.id}/practice-sessions`)? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Sessions</nuxt-link>
      <nuxt-link 
        :to="getRoute('practice-users')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}/practice-users` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Users</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-documents')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}/practice-documents` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Documents</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-rates')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}/practice-rates` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
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