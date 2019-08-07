<template>
  <div class="flex flex-row flex-wrap justify-start">
      <div 
        @click.prevent="goTo('locum_profile')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.locum_tab === 'locum_profile' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Profile</div>
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
  created(){
    console.log(this.$route.query.locum_tab)
  },
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query,
        locum_tab: type
      }
      this.$router.push({ query })
    }
  }
}
</script>