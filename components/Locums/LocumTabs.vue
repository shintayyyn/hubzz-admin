<template>
  <div class="flex flex-row flex-wrap justify-start">
      <div 
        @click="goTo()"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/locums/${user.id}` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Profile</div>
      <div
        @click="goTo('locum-jobs')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path.includes(`/locums/${user.id}/locum-jobs`) ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Jobs</div>
      <div
        @click="goTo('locum-compliance')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/locums/${user.id}/locum-compliance` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Compliance</div>
  </div>
</template>
<script>
export default {
  props:['user'],
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query
      }
      if(query.job_status){
        delete query.job_status
      }
      if(type){
        this.$router.push({path:`/locums/${this.user.id}/`+type,query })
      }else{
        this.$router.push({path:`/locums/${this.user.id}`,query })
      }
    }
  }
}
</script>