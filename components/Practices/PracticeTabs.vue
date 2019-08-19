<template>
  <div class="flex flex-row flex-wrap justify-start">
      <nuxt-link
        :to="getRoute()" 
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Practice</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-surgeries')"
        v-if="practice.practice_children.length>=0 && practice.practice_parent == null "
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}/practice-surgeries`? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Surgeries</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-sessions')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}/practice-sessions` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Sessions</nuxt-link>
      <nuxt-link 
        :to="getRoute('practice-users')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}/practice-users` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Users</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-documents')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}/practice-documents` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Documents</nuxt-link>
      <nuxt-link
        :to="getRoute('practice-rates')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer text-white"
        :class="$route.path == `/practices/${practice.id}/practice-rates` ? 'border rounded-lg border-grey-dark bg-grey-dark hover:bg-grey' : ''"
      >Rates</nuxt-link>
  </div>
</template>
<script>
export default {
  props:['practice'],
  
  created(){
    console.log("Practice in tabs",this.practice)
  },
  computed:{
    getRoute(){
      return(tab) =>{
        if(!tab){
          tab = ''
        }
        const query = {
          ...this.$route.query,
        }

        delete query.session_tab

        return{
          path: tab ? `/practices/${this.practice.id}/${tab}` : `/practices/${this.practice.id}`,
          query
        }
      }
    }
  },
  // methods: {
  //   goTo(type) {
  //     const query = {
  //       ...this.$route.query
  //     }
  //     if(query.sesstion_tab){
  //       delete query.session_tab
  //     }
  //     if(type){
  //       this.$router.push({path:`/practices/${this.practice.id}/`+type,query })
  //     }else{
  //       this.$router.push({path:`/practices/${this.practice.id}`,query })
  //     }
  //   }
  // }
}
</script>