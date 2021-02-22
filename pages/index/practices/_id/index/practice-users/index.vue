<template>
  <div class=" mt-2">
    <!-- tabs here -->
    <div v-if="!$route.params.roleId" class="flex flex-row overflow-x-auto border-b border-gray-500 mb-2">
      <nuxt-link
        :to="getRoute()"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.path == `/practices/${practice.id}/practice-users`
            ? 'border-b-4 border-gray-500' : 'text-gray-600'
        "
      >
        Users
      </nuxt-link>
      
      <nuxt-link
        v-if="practice.status !== 'Deactivated'"
        :to="getRoute('user-roles')"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.path.includes(`/user-roles`)
            ? 'border-b-4 border-gray-500' : 'text-gray-600'
        "
      >
        Roles
      </nuxt-link>
    </div>

    <nuxt-child
      @practiceUpdated="() => $emit('practiceUpdated')"
    />
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
    getRoute () {
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
