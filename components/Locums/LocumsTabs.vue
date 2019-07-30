<template>
  <div class="flex flex-row flex-wrap justify-start">
      <div 
        @click.prevent="goTo('profile')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.locums_tab === 'profile' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Profile</div>
      <div
        @click.prevent="goTo('jobs')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.locums_tab === 'jobs' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Jobs</div>
      <div
        @click.prevent="goTo('compliance')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.locums_tab === 'compliance' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Compliance</div>
  </div>
</template>
<script>
export default {
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query,
        locums_tab: type
      }
      this.$router.push({ query })
    }
  }
}
</script>