<template>
  <div class="flex flex-col">
    <div v-if="practiceParent">
      <form class="flex flex-col bg-waterloo p-2 md:px-4 shadow rounded-lg sm:w-full lg:w-2/3">
        <div class="flex flex-wrap">
          <div class="w-full">
            <div class="text-gray-300 text-sm p-2">
              <p class="flex">Practice Name</p>
              <p class="flex items-center text-white text-sm p-2 font-semibold">
              {{practiceParent.surgery ? practiceParent.surgery.name : null}} 
              </p>
              <p class="flex">Practice Code</p>
              <p class="flex text-white text-sm p-2 font-semibold">{{practiceParent.surgery ? practiceParent.surgery.code : null}}</p>
              <p class="flex">Address</p>
              <p class="flex text-white text-sm p-2 font-semibold">
              {{practiceParent.surgery.address ? practiceParent.surgery.address.line_1 : null}} <br>
              {{practiceParent.surgery.address ? practiceParent.surgery.address.line_2 : null}} <br>
              {{practiceParent.surgery.address ? practiceParent.surgery.address.line_3 : null}} <br>
              </p>
              <p class="flex">CCG</p>
              <p class="flex text-white text-sm p-2 font-semibold">{{practiceParent.surgery.clinical_commissioning_group ? practiceParent.surgery.clinical_commissioning_group.name:null}}</p>
              
              <p class="flex">Practice Types</p>
              <div v-if="practiceParent.practice_types.length > 0">
              <p class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-500"
                  v-for="practiceType in practiceParent.practice_types"
                  :key="practiceType.id + '-name'">
                  {{practiceType ? practiceType.name:null}}
              </p>
              </div>
              <div v-else>
              <p class="flex text-white text-sm p-2 font-semibold">Not set</p>
              </div>
          
              <div v-if="practiceParent.gp_compliance_documents.length > 0">
              <p class="flex">Compliance Requirements for GPs:</p>
              <div class="text-white text-sm m-1 font-semibold" v-for="(gpComplianceDocs,index) in practiceParent.gp_compliance_documents"
                  :key="`${index}-${gpComplianceDocs.name}`"
                  >
                  <span >{{gpComplianceDocs ? gpComplianceDocs.name:"(none)"}}</span> 
              </div>
              </div>
              <div v-if="practiceParent.others_compliance_documents.length > 0">
              <p class>For Nurses, et al:</p>
              <div class="text-white text-sm m-1 font-semibold" v-for="(othersComplianceDocs, index) in practiceParent.others_compliance_documents"
                  :key="`${index}-${othersComplianceDocs.name}`"
                  >
                  <span >{{othersComplianceDocs ? othersComplianceDocs.name:"(none)"}}</span> 
              </div>
              </div>
              <div v-if="practiceParent.mandatory_trainings.length > 0">
              <p class="flex">Mandatory Trainings</p>
              <div class="text-white text-sm m-1 font-semibold" v-for="(mandatoryTrainings, index) in practiceParent.mandatory_trainings"
                  :key="`${index}-${mandatoryTrainings.name}`"
                  >
                  <span >{{mandatoryTrainings ? mandatoryTrainings.name:"(none)"}}</span> 
              </div>
              </div>
              
              <div v-if="!practiceParent.gp_compliance_documents.length > 0 || !practiceParent.others_compliance_documents.length > 0  || !practiceParent.mandatory_trainings.length > 0">
              <p class="flex text-white text-base py-2 font-semibold">Compliance Documents is not yet set up by the Practice Hub yet.</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div v-if="!practiceParent && practiceHub">
      <form class="flex flex-col bg-waterloo py-2 px-4 text-white text-sm shadow rounded-lg sm:w-full lg:w-2/3">
        <div class="m-4">
          <div class="inline-flex text-lg">
            <div class="flex">
              <svgicon name="alert" width="48" height="48" color="white"/>
            </div>
            <div class="flex">
              <p v-if="practiceHub.parent_surgery" class="mt-4">This surgery is not yet a registered practice in HUBZZ.</p>
              <p v-else>This practice has no Hub yet.</p>
            </div>
          </div>
        </div>
        <div v-if="practiceHub.parent_surgery" class="text-gray-300 text-sm m-4">
          <p class="font-semibold">Surgery Name</p>
          <p class="m-2">{{practiceHub.parent_surgery ? practiceHub.parent_surgery.name : ''}}</p>
          <p class="font-semibold">Surgery Code</p>
          <p class="m-2">{{practiceHub.parent_surgery ? practiceHub.parent_surgery.code : ''}}</p>
        </div>
      </form>
    </div>
    <div class="practice-shield" v-if="modal == true" @click="modal=false"></div>
    <transition name="slide" mode="out-in">
      <div class="change-parent-modal shadow-lg" v-if="modal">
        <AddPracticeSurgery :practice="practice" :practiceHub="practiceHub" @close="modal = false"/>
      </div>
    </transition>
  </div>
</template>
<script>
import AppInput from '@/components/Base/AppInput'
import AddPracticeSurgery from '@/components/Practices/AddPracticeSurgery'
export default {
  components:{
    AppInput,
    AddPracticeSurgery
  },
  props:['practice','practiceParent','practiceHub'],

  data(){
    return{
      modal:false,
    }
  },
  created(){
    console.log('pracc',this.practice)
    console.log('parent',this.practiceParent)
    console.log('hub',this.practiceHub)
  },
  methods:{
    show(){
      this.modal=true
    },
    practiceTypeStyle(type){
      switch(type){
        case 'Stand Alone':
        return 'bg-green-400 text-white lg:px-4 sm:px-2'
        break;
        case 'Hub':
        return 'bg-red-400 text-white lg:px-8 sm:px-2'
        break;
        case 'Spoke':
        return 'bg-blue-400 text-white lg:px-8 sm:px-2'
        break;
        default:
        return
      }
    },
    async updatePracticeSurgery(){
      this.Validate(this.toPutPracticeParent)
      if (!this.formError.length){
        try{
          await this.$axios.put(`/api/v1/admin/practices/${this.practice.id}/parent-surgery`,
            this.toPutPracticeParent
          )
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'alert', text: 'Practice Parent Updated' })
        }catch(err){
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
          console.log("put practice error",err)
        }
      }
      
    }   
  }
    
}
</script>
<style>
.change-parent-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px yellow;
  transition: all 0.3s ease-in-out;
  background-color:#505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .change-parent-modal {
    width: 70%;
  }
}
</style>
