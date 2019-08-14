<template>
  <div class="flex flex-row flex-wrap justify-start">
      <div
        @click="goTo()" 
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Practice</div>
      <div
        @click="goTo('practice-surgeries')"
        v-if="this.practice.practice_children.length > 0"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}/practice-surgeries`? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Surgeries</div>
      <div
        @click="goTo('practice-sessions')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}/practice-sessions` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Sessions</div>
      <div 
        @click="goTo('practice-users')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}/practice-users` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Users</div>
      <div
        @click="goTo('practice-documents')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}/practice-documents` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Documents</div>
      <div
        @click="goTo('practice-rates')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}/practice-rates` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Rates</div>
  </div>
</template>
<script>
export default {
  props:['practice'],
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query
      }
      if(query.sesstion_tab){
        delete query.sesstion_tab
      }
      if(type){
        this.$router.push({path:`/practices/${this.practice.id}/`+type,query })
      }else{
        this.$router.push({path:`/practices/${this.practice.id}`,query })
      }
    }
  }
}
</script>