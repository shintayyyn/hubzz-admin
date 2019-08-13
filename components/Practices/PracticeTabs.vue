<template>
  <div class="flex flex-row flex-wrap justify-start">
      <nuxt-link 
        :to="{path:`/practices/${practice.id}`}"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Practice</nuxt-link>
      <nuxt-link
        v-if="this.practice.practice_children.length > 0"
        :to="{path:`/practices/${practice.id}/practice-surgeries`}"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}/practice-surgeries`? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Surgeries</nuxt-link>
      <nuxt-link
        :to="{path:`/practices/${practice.id}/practice-sessions`}"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}/practice-sessions` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Sessions</nuxt-link>
      <nuxt-link 
        :to="{path:`/practices/${practice.id}/practice-users`}"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}/practice-users` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Users</nuxt-link>
      <nuxt-link
        :to="{path:`/practices/${practice.id}/practice-documents`}"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}/practice-documents` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Documents</nuxt-link>
      <nuxt-link
        :to="{path:`/practices/${practice.id}/practice-rates`}"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}/practice-rates` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Rates</nuxt-link>
  </div>
</template>
<script>
export default {
  props:['practice'],
  created(){
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