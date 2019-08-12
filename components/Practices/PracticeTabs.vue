<template>
  <div class="flex flex-row flex-wrap justify-start">
      <nuxt-link 
        :to="{path:`/practices/${practice.id}`}"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="!$route.query.practice_tab ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Practice</nuxt-link>
      <div
        v-if="this.practice.practice_children.length > 0"
        @click.prevent="goTo('practice_surgeries')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.practice_tab === 'practice_surgeries' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Surgeries</div>
      <div
        @click.prevent="goTo('practice_sessions')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.practice_tab === 'practice_sessions' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Sessions</div>
      <div 
        @click.prevent="goTo('practice_users')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.practice_tab === 'practice_users' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Users</div>
      <div
        @click.prevent="goTo('practice_documents')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.practice_tab === 'practice_documents' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Documents</div>
      <div
        @click.prevent="goTo('practice_rates')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.query.practice_tab === 'practice_rates' ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : 'text-white'"
      >Rates</div>
  </div>
</template>
<script>
export default {
  props:['practice'],
  created(){
    console.log(this.$route.query.practice_tab)
    console.log("practice tabs has",this.practice)
  },
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query,
        practice_tab: type
      }
      if(query.session_tab){
        delete query.session_tab
      }
      this.$router.push({ query })
    }
  }
}
</script>