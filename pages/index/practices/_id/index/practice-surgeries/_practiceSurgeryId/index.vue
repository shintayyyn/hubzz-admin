<template>
  <div class="spoke-modal p-4 md:p-8 shadow-lg">
    <div class="cursor-pointer mb-4" @click="goBack()">
      <svgicon name="arrow-left-solid" height="32" width="32" class="text-white hover:text-sunglow fill-current" />
    </div>
    <div class="flex justify-start overflow-x-auto">
      <nuxt-link
        :to="getRoute()" 
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path == `/practices/${practice.id}/practice-surgeries/${practiceSurgery.id}` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >
        Spoke Profile
      </nuxt-link>
      <nuxt-link
        :to="getRoute('surgery-sessions')"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`surgery-sessions`)? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >
        Spoke Sessions
      </nuxt-link>
      <nuxt-link
        :to="getRoute('surgery-billing')"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`surgery-billing`)? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >
        Spoke Billings
      </nuxt-link>
    </div>
    <nuxt-child />
  </div>
</template>
<script>
export default {
  components:{
  },
  data (){
    return{
      practice: '',
      practiceSurgery: '',
      practiceSurgeries: '',
    }
  },
  computed:{
    getRoute (tab){
      console.log(tab)
      return(tab) => {
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
  async asyncData ({ app, route }){
    try {
      let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}`)
      const practice = response.data.practice
      response = await app.$axios.$get(`/api/v1/admin/practices/${practice.id}/practice-surgeries/${route.params.practiceSurgeryId}`)
      const practiceSurgery = response.data.practice_surgery

      return{
        practice,
        practiceSurgery
      }
    } catch(err){
      throw err
    }
  },
  methods:{
    goBack (){
      const query = {
        ...this.$route.query
      }
      console.log('route', this.$route)
      this.$router.push({path:`/practices/${this.$route.params.id}/practice-surgeries`,query})
    },
  }
}
</script>
<style>
.card {
  min-width: 100px;
  height: 250px;
  box-sizing: content-box;
}
.spoke-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.spoke-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #FFC72C;
  transition: all 0.3s ease-in-out;
  background-color:#505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .spoke-modal {
    width: 70%;
  }
}
</style>