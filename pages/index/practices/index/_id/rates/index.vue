<template>
  <div class="fixed lg:absolute pin-t pin-b pin-r pin-l flex flex-col overflow-x-hidden overflow-y-auto">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout shadow-lg ">
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link :to="`/practices/${specificPractice.id}`" class="text-white p-1">
          <svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
        </nuxt-link>
      </div>
    <!-- DEFAULT TABS -->
      <div class="flex flex-col rounded-lg pl-6 mt-2 " >
        <div class="w-full">
          <div class="flex flex-wrap -mx-1">
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                  :to="{path:`/practices/${specificPractice.id}`,query: $route.query}">
                  <strong>Practice</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                  v-if="!specificPractice.practice_parent"
                  :to="{path:`/practices/${specificPractice.id}/surgeries`,query: $route.query}">
                  <strong>Surgeries</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                  :to="{path:`/practices/${specificPractice.id}/sessions/available`,query: $route.query}">
                  <strong>Sessions</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                  :to="{path:`/practices/${specificPractice.id}/users`,query: $route.query}">
                  <strong>Users</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                  :to="{path:`/practices/${specificPractice.id}/documents`,query: $route.query}">
                  <strong>Documents</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="bg-grey-dark hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                  :to="{path:`/practices/${specificPractice.id}/rates`,query: $route.query}">
                  <strong>Rates</strong>
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    <!--DEFAULT TABS END HERE-->

      <div class="flex sm:p-2">
        <div class="flex w-full text-white">
          <div class="w-full flex text-white text-sm bg-waterloo m-4 py-2 px-3 shadow rounded-lg" style="max-width: 600px">
            <div class="w-full overflow-hidden text-grey-light text-sm p-2">
              <div v-if="errors[0]" class="p-2 rounded text-black bg-sunglow mb-2">
                  {{errors[0]}}
              </div>
              <div class="flex py-1">GP Rate
                <span v-if="!toPutPracticeRate.gp_rate" class="bg-red p-1 ml-4 rounded">Required</span>
              </div>
              <input
                class="appearance-none bg-transparent border-b w-full text-white mr-3 mb-3 py-3 px-2 leading-tight focus:outline-none"
                type="text"
                v-model="toPutPracticeRate.gp_rate"
                aria-label=""
              >
              <div class="flex py-1">Others Rate
                <span v-if="!toPutPracticeRate.others_rate" class="bg-red p-1 ml-4 rounded">Required</span>
              </div>
              <input
                class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
                type="text"
                v-model="toPutPracticeRate.others_rate"
                aria-label="newtext"
              >
              <button
                class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow float-left"
                @click.prevent="checkForm(specificPractice.id,toPutPracticeRate)"
                >Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nuxt-child/>
  </div>
</template>

<script>
export default {

  data() {
    return {
      specificPractice:null,
      toPutPracticeRate:{},
      errors:[]
    }

  },
  async asyncData({ app,route }){
    try{
        
        let response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}`)
        const specificPractice = response.data.data.practice
        const specificPracticeRates = specificPractice.rates
        
        return{
          specificPractice,
          toPutPracticeRate:{
            gp_rate: specificPractice.rates && specificPractice.rates[0] ? specificPractice.rates[0].rate: null,
            others_rate:specificPractice.rates && specificPractice.rates[1] ? specificPractice.rates[1].rate:null
          }
        }

    }catch(err){
        alert('Something went wrong!')
        console.log("index put locum detail compliance documents error", err);
    }
  },
  
  // computed :{
  //   checkNumeric: function(){
  //     return thius.isNumeric(this.number) === false
  //   }
  // },
 
  methods: {

    // isNumeric: function(n){
    //   return !isNaN(parseFloat(n)) && isFinite(n)
    // },
    checkForm:function(practiceID,rateInfo) {
      this.errors = []
      if(!rateInfo.gp_rate){
        this.errors.push("Please input rate for GP.")
      }
      if(!rateInfo.others_rate){
        this.errors.push("Please input rate for Others")
      }
      if(isNaN(rateInfo.gp_rate)===true){
        this.errors.push("Please input a numerical info for GP")
      }
      if(isNaN(rateInfo.others_rate)===true){
        this.errors.push("Please input a numerical info for Others")
      }
      if(!this.errors.length){
        this.toPutPracticeRateInfo(practiceID)
      }

    },

  
    async toPutPracticeRateInfo(specificPracticeID){
      try{
        await this.$axios.put(`/api/v1/admin/practices/${specificPracticeID}/rates`,{
          gp_rate:this.toPutPracticeRate.gp_rate,
          others_rate:this.toPutPracticeRate.others_rate
        })
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'alert', text: 'Saved' })
        // alert('Saved') 
      
      }catch(err){
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
        // alert('Something went wrong!')
        console.log("index put locum detail compliance documents error", err);
      }
    },

  },

};
</script>
<style>
  @media(min-width: 450px){
  .right-side-header-content{
    width: calc(100% - 0px);
  }
  }
  .page-overlap{
    min-width: 100%;
  }
  @media screen and (min-width: 768px){
    .page-overlap{
    min-width: calc(100% - 70px);
    }
  }

  @media screen and (min-width: 1200px) {
    .page-overlap{
      min-width: calc(100% - 200px);
    }
  }
</style>