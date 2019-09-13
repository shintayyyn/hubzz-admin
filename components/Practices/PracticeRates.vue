<template>
    <div class="flex flex-col rounded-lg">
      <div class="w-full flex text-white text-sm bg-waterloo py-2 px-3 shadow rounded-lg" style="max-width: 600px">
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
                @click.prevent="checkForm(practice.id,toPutPracticeRate)"
                >Save Changes
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
        specificPractice:null,
        toPutPracticeRate:{
          gp_rate:this.practice.rates.length>0 ? this.practice.rates[0].rate : '',
          others_rate:this.practice.rates.length>0 ? this.practice.rates[1].rate: ''
        },
        errors:[]
      }
  },
  created(){
      console.log("rates",this.practice.rates)
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
        await this.$axios.$put(`/api/v1/admin/practices/${specificPracticeID}/rates`,{
          gp_rate:this.toPutPracticeRate.gp_rate,
          others_rate:this.toPutPracticeRate.others_rate
        }).then(()=>{
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved' })
          this.getPractices()
        })
      }catch(err){
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
        console.log("index put locum detail compliance documents error", err);
      }
    },
  },
}
</script>
