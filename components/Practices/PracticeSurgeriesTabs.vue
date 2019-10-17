<template>
  <div class="flex justify-start overflow-x-auto">
      <nuxt-link
        :to="getRoute()" 
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path == `/practices/${practice.id}/practice-surgeries/${practiceSurgery.id}` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Spoke Profile</nuxt-link>
      <nuxt-link
        :to="getRoute('surgery-sessions')"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`surgery-sessions`)? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Spoke Sessions</nuxt-link>
      <nuxt-link
        :to="getRoute('surgery-billing')"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`surgery-billing`)? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Spoke Billings</nuxt-link>
  </div>
</template>
<script>
export default {
  props:['practice', 'practiceSurgery'],
  created(){
    console.log('practice', this.practice)
    console.log('practicesurgery', this.practiceSurgery)
  },
  computed:{
    getRoute(tab){
      return(tab) =>{
        if(!tab){
          tab = ''
        }
        const query = {
          ...this.$route.query,
        }
        delete query.order_by
        return{
          path: tab ? `/practices/${this.practice.id}/practice-surgeries/${this.practiceSurgery.id}/${tab}` : `/practices/${this.practice.id}/practice-surgeries/${this.practiceSurgery.id}` ,
          query
        }
      }
    }
  },
}
</script>