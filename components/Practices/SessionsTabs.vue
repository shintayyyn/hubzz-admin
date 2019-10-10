<template>
  <div class="flex justify-start overflow-x-auto">
      <nuxt-link 
        :to="getRoute(practice_surgery ? 'surgery-available-sessions':'practice-available-sessions')"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`practice-available-sessions`) || $route.path.includes(`surgery-available-sessions`) ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Available</nuxt-link>

      <nuxt-link
        :to="getRoute(practice_surgery ? 'surgery-applied-sessions':'practice-applied-sessions')"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`practice-applied-sessions`) || $route.path.includes(`surgery-applied-sessions`) ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Applied</nuxt-link>

      <nuxt-link
        :to="getRoute(practice_surgery ? 'surgery-current-sessions':'practice-current-sessions')"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`practice-current-sessions` ) || $route.path.includes(`surgery-current-sessions`)? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Allocated(Current)</nuxt-link> <!--may locum na, pero hindi pa nag sstart-->

      <!--Ongoing , nag start na, by job parts -->
      <nuxt-link 
        :to="getRoute(practice_surgery ? 'surgery-ongoing-sessions':'practice-ongoing-sessions')"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`practice-ongoing-sessions`) || $route.path.includes(`surgery-ongoing-sessions`) ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Ongoing</nuxt-link>

      <!--loob ng completed(specific completed), tabs: to be invoiced, disputed(na-invoice na pero may problema), invoiced--->
      <!--approved - job parts din ang naka display-->
      <nuxt-link 
        :to="getRoute(practice_surgery ? 'surgery-completed-sessions':'practice-completed-sessions')"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`practice-completed-sessions`) || $route.path.includes(`surgery-completed-sessions`) ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Completed</nuxt-link>
      

      <nuxt-link
        :to="getRoute(practice_surgery ? 'surgery-unfilled-sessions':'practice-unfilled-sessions')"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`practice-unfilled-sessions`) || $route.path.includes(`surgery-unfilled-sessions`) ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Unfilled</nuxt-link>

      <nuxt-link
        :to="getRoute(practice_surgery ? 'surgery-cancelled-sessions':'practice-cancelled-sessions')"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`practice-cancelled-sessions`) || $route.path.includes(`surgery-cancelled-sessions`) ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Cancelled</nuxt-link>

      <nuxt-link
        :to="getRoute(practice_surgery ? 'surgery-declined-sessions':'practice-declined-sessions')"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`practice-declined-sessions`) || $route.path.includes(`surgery-declined-sessions`) ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >Declined</nuxt-link>
  </div>
</template>
<script>
export default {
  props:['practice','practice_surgery'],
  created(){
    console.log('practice', this.practice)
    console.log('practice surgery', this.practice_surgery)
  },
  computed:{
    getRoute(tab){
      return(tab) => {
        if(!tab){
          tab = ''
        }
        const query = {
          ...this.$route.query,
        }
        return{
          path:this.practice_surgery ? `/practices/${this.practice.id}/practice-surgeries/${this.practice_surgery.id}/surgery-sessions/${tab}`: 
         `/practices/${this.practice.id}/practice-sessions/${tab}`,query 
        }
      }
    }
  },
}
</script>