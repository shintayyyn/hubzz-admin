<template>
  <div class="flex flex-row flex-wrap justify-start">
      <div 
        @click.prevent="goTo('practice-available-sessions')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/practices/${practice.id}/practice-sessions/practice-available-sessions` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Available</div>
      <div
        @click.prevent="goTo('practice-applied-sessions')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/practices/${practice.id}/practice-sessions/practice-applied-sessions` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Applied</div>
      <div
        @click.prevent="goTo('practice-current-sessions')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/practices/${practice.id}/practice-sessions/practice-current-sessions` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Current</div>
      <div 
        @click.prevent="goTo('practice-completed-sessions')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/practices/${practice.id}/practice-sessions/practice-completed-sessions` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Completed</div>
      <div
        @click.prevent="goTo('practice-unfilled-sessions')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/practices/${practice.id}/practice-sessions/practice-unfilled-sessions` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Unfilled</div>
      <div
        @click.prevent="goTo('practice-cancelled-sessions')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/practices/${practice.id}/practice-sessions/practice-cancelled-sessions` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Cancelled</div>
      <div
        @click.prevent="goTo('practice-declined-sessions')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path === `/practices/${practice.id}/practice-sessions/practice-declined-sessions` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Declined</div>
  </div>
</template>
<script>
export default {
  props:['practice'],
  created(){
    console.log(this.$route.path)
  },
  methods:{
    goTo(type){
      const query = {
        ...this.$route.query,
      }
      if(type){
        this.$router.push({ path:`/practices/${this.practice.id}/practice-sessions/`+type,query})
      }else{
        this.$router.push({ path:`/practices/${this.practice.id}/practice-sessions/`,query})
      }
    }
  },
}
</script>