<template>
  <div class="flex flex-row flex-wrap justify-start">
      <nuxt-link 
        :to="{path:`/locums/${user.id}`}"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="!$route.query.locum_tab ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Profile</nuxt-link>
      <div
        @click.prevent="goTo('locum_jobs')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.locum_tab === 'locum_jobs' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Jobs</div>
      <div
         @click.prevent="goTo('locum_compliance')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.locum_tab === 'locum_compliance' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Compliance</div>
  </div>
</template>
<script>
export default {
  props:['user'],
  created(){
    console.log("this is user tabs",this.user)
  },
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query,
        locum_tab: type
      }
      if(query.job_status){
        delete query.job_status
      }
      this.$router.push({ query })
    }
  }
}
</script>