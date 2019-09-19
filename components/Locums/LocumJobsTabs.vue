<template>
  <div class="flex flex-row flex-wrap justify-start">
      <div 
        @click.prevent="goTo('locum-current-jobs')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/locums/${user.id}/locum-jobs/locum-current-jobs` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Current</div>
      <div
        @click.prevent="goTo('locum-available-jobs')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/locums/${user.id}/locum-jobs/locum-available-jobs` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Available</div>
      <div
        @click.prevent="goTo('locum-matched-jobs')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/locums/${user.id}/locum-jobs/locum-matched-jobs`? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Matched</div>
      <div
        @click.prevent="goTo('locum-applied-jobs')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/locums/${user.id}/locum-jobs/locum-applied-jobs`? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Applied</div>
      <div
        @click.prevent="goTo('locum-cancelled-jobs')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/locums/${user.id}/locum-jobs/locum-cancelled-jobs` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Cancelled</div>
      <div
        @click.prevent="goTo('locum-unsuccessful-jobs')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/locums/${user.id}/locum-jobs/locum-unsuccessful-jobs` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Unsuccessful</div>
      <div
        @click.prevent="goTo('locum-declined-jobs')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/locums/${user.id}/locum-jobs/locum-declined-jobs` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Declined</div>
      <div
        @click.prevent="goTo('locum-completed-jobs')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/locums/${user.id}/locum-jobs/locum-completed-jobs` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Completed</div>
  </div>
</template>
<script>
export default {
  props:['user'],
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query,
      }
      if(type){
        this.$router.push({ path:`/locums/${this.user.id}/locum-jobs/`+type,query })
      }else{
        this.$router.push({ path:`/locums/${this.user.id}/locum-jobs/`,query })
      }
      
    }
  }
}
</script>