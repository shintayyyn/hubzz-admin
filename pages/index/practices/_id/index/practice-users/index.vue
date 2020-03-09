<template>
  <div class="mt-5">
    <!-- tabs here -->
    <div class="flex justify-start overflow-x-auto">
      <nuxt-link
        :to="getRoute()"
        class="p-3 mx-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
        :class="
          $route.path == `/practices/${practice.id}/practice-users`
          ? 'bg-sunglow hover:bg-sunglow-dark'  :  
          'hover:bg-waterloo text-white'
        "
        >Users
      </nuxt-link>
      
      <nuxt-link
        v-if="practice.status !== 'Deactivated'"
        :to="getRoute('user-roles')"
        class="p-3 mx-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
        :class="
          $route.path.includes(`/user-roles`)
          ? 'bg-sunglow hover:bg-sunglow-dark'  :  
          'hover:bg-waterloo text-white'
        "
        >Roles
      </nuxt-link>
    </div>
    <nuxt-child/>
  </div>
</template>
<script>

export default {
  transition:{
    name:'fade',
    mode:'out-in'
  },
  data (){
    return{
    }
  },
  computed:{
    practice (){
      return this.$store.state.practices.practice
    },
    getRoute (tab) {
      return(tab) => {
        if(!tab){
          tab = ''
        }
        const query = {
          ...this.$route.query,
        }
        delete query.order_by
        delete query.status
        return{
          path: tab ? `/practices/${this.practice.id}/practice-users/${tab}`: `/practices/${this.practice.id}/practice-users`
        }
      }
    }
  },
  async asyncData ({ app, store, route }) {
    try{
      let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}`)
      const practice = response.data.practice
      await store.commit('practices/SET_SPECIFIC_PRACTICE',practice)
      return{
      }
    }catch(err){
      store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
      console.log('get practice error!!!!',err)
    }
  }
}
</script>
