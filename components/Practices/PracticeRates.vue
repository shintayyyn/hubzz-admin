<template>
    <div class="flex flex-col rounded-lg">
      <div class="w-full flex text-white text-sm bg-waterloo p-2 shadow rounded-lg" style="max-width: 600px">
        <div v-if="toEdit == false" class="relative w-full overflow-hidden text-gray-300 text-sm px-2 md:p-2">
          <button
              v-if="authAdminPermissions.includes('Edit Practice Rates')"
              class="absolute right-0 top-0 inline-flex no-underline py-2 px-4 md:m-2 font-semibold bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg shadow float-left"
              @click="toEdit = true"
              >Edit
            </button>
          <div class="flex py-1">
            GP Rate
          </div>
          <div class="text-white text-lg font-semibold mx-3 mb-2 leading-tight focus:outline-none">
            {{practice.rates.length > 0 ?'£'+practice.rates[0].rate : 'N/A'}}
          </div>
          <div class="flex py-1">Others Rate
          </div>
            <div class="text-white text-lg font-semibold mx-3 leading-tight focus:outline-none">
            {{practice.rates.length > 0 ? '£'+practice.rates[1].rate : 'N/A'}}
          </div>
          
        </div>
        <div v-if="toEdit == true && authAdminPermissions.includes('Edit Practice Rates')" class="w-full overflow-hidden text-gray-300 text-sm p-2">
            <div v-if="errors.length > 0" class="mb-2">
              <p class="rounded bg-red-500 mb-1 px-2 py-1" v-for="(error, index) in errors" :key="index">{{ error }}</p>
                <!-- {{errors[0]}} -->
            </div>
            <div class="flex items-center justify-between py-1">GP Rate
                <!-- <span v-if="gpError" class="bg-red-600 px-2 py-1 ml-2 rounded">{{gpError}}</span> -->
            </div>
            <input
                class="appearance-none bg-transparent border-b w-full text-white mr-3 mb-3 py-3 px-2 leading-tight focus:outline-none"
                :class="gpError && 'border-red-600'"
                type="number"
                v-model="toPutPracticeRate.gp_rate"
                @blur="verifyGpRate()"
                aria-label=""
            >
            <div class="flex items-center justify-between py-1">Others Rate
                <!-- <span v-if="othersError" class="bg-red-600 px-2 py-1 ml-2 rounded">{{othersError}}</span> -->
            </div>
            <input
                class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
                :class="othersError && 'border-red-600'"
                type="number"
                v-model="toPutPracticeRate.others_rate"
                @blur="verifyOthersRate()"
                aria-label="newtext"
            >
            <button
                class="inline-flex no-underline py-2 px-4 my-2 font-semibold bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg shadow float-left"
                @click.prevent="checkForm()"
                >Save Changes
            </button>
            <button
                class="inline-flex no-underline py-2 px-4 m-2 font-semibold bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg shadow float-left"
                @click="toEdit = false"
                >Cancel
            </button>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  props:['practice'],
  data() {
      return {
        toEdit: false,
        specificPractice:null,
        toPutPracticeRate:{
          gp_rate:this.practice.rates.length>0 ? this.practice.rates[0].rate : '',
          others_rate:this.practice.rates.length>0 ? this.practice.rates[1].rate: ''
        },
        errors:[],
        gpError:'',
        othersError:''
      }
  },
  computed:{
    authAdminPermissions() {
      return this.$store.getters["auth/permissions"]
    },
  },
  methods: {
    getQuery(){
      const query = {
        ...this.$route.query
      }
      const offset = parseInt(query.page)*8 - 8
      return offset
    },

    getPractices(){
      this.$store.dispatch("practices/fetchPractices",{
        limit:8,
        order_by:'created_at:desc',
        offset:this.getQuery()
      })
    },
    verifyGpRate:function(){
      this.gpError = ''
      if(!this.toPutPracticeRate.gp_rate){
        this.gpError="GP rate is required"
      }
      if(isNaN(this.toPutPracticeRate.gp_rate) === true){
        this.gpError="Input should be a number"
      }
    },
    verifyOthersRate:function(){
      this.othersError = ''
      if(!this.toPutPracticeRate.others_rate){
        this.othersError = "Others Rate is required"
      }
      if(isNaN(this.toPutPracticeRate.others_rate) === true){
        this.othersError = "Input should be a number"
      }
    },
    checkForm:function() {
      this.errors = []
      if(!this.toPutPracticeRate.gp_rate){
        this.errors.push("Please input rate for GP.")
      }
      if(!this.toPutPracticeRate.others_rate){
        this.errors.push("Please input rate for Others")
      }
      if(isNaN(this.toPutPracticeRate.gp_rate)===true){
        this.errors.push("Please input a numerical info for GP")
      }
      if(isNaN(this.toPutPracticeRate.others_rate)===true){
        this.errors.push("Please input a numerical info for Others")
      }
      if(!this.errors.length){
        this.toPutPracticeRateInfo(this.practice.id)
      }

    },

    async toPutPracticeRateInfo(specificPracticeID){
      try{
        await this.$axios.$put(`/api/v1/admin/practices/${specificPracticeID}/rates`,{
          gp_rate:this.toPutPracticeRate.gp_rate,
          others_rate:this.toPutPracticeRate.others_rate
        }).then(()=>{
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved' })
          this.getPractices()
          this.toEdit = false
        })
      }catch(err){
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
        console.log("index put locum detail compliance documents error", err);
      }
    },
  },
}
</script>
