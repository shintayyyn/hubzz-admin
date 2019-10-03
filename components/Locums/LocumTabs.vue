<template>
  <div class="flex flex-row flex-wrap justify-start">
      <nuxt-link 
        :to="getRoute()"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/locums/${user.id}` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Profile</nuxt-link>
      <nuxt-link
        :to="getRoute('locum-jobs')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path.includes(`/locums/${user.id}/locum-jobs`) ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Jobs</nuxt-link>
      <nuxt-link
        :to="getRoute('locum-compliance')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/locums/${user.id}/locum-compliance` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Compliance</nuxt-link>
  </div>
</template>
<script>
export default {
  props:['user'],
  computed: {
    getRoute() {
      return(tab) =>{
        if(!tab){
          tab = ''
        }
        const query = {
          ...this.$route.query
        }
        return{
          path: tab ? `/locums/${this.user.id}/${tab}` : `/locums/${this.user.id}`,
          query
        }
      }
    }
  }
}
</script>