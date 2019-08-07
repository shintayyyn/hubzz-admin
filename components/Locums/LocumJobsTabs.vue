<template>
  <div class="flex flex-row flex-wrap justify-start">
      <div 
        @click.prevent="goTo('locum_current')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.job_status === 'locum_current' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Current</div>
      <div
        @click.prevent="goTo('locum_available')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.job_status === 'locum_available' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Available</div>
      <div
        @click.prevent="goTo('locum_matched')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.job_status === 'locum_matched' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Matched</div>
      <div
        @click.prevent="goTo('locum_applied')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.job_status === 'locum_applied' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Applied</div>
      <div
        @click.prevent="goTo('locum_cancelled')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.job_status === 'locum_cancelled' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Cancelled</div>
      <div
        @click.prevent="goTo('locum_unsuccessful')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.job_status === 'locum_unsuccessful' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Unsuccessful</div>
      <div
        @click.prevent="goTo('locum_declined')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.job_status === 'locum_declined' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Declined</div>
      <div
        @click.prevent="goTo('locum_completed')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.job_status === 'locum_completed' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Completed</div>
  </div>
</template>
<script>
export default {
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query,
        job_status: type
      }
      this.$router.push({ query })
    }
  }
}
</script>