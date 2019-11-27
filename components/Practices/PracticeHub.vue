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
              <span
              class="py-2 px-4 ml-2 text-sm text-white rounded-lg shadow font-extrabold"
              :class="practiceTypeStyle(practiceParent.type)">{{practiceParent.type}}</span>
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
          <div class="w-full mx-2">
            <div class="flex items-center">
              <div class="text-white font-semibold text-xl">Permissions</div>
              <div class="px-4 py-2 mx-2 bg-sunglow hover:bg-sunglow-dark rounded-lg font-semibold text-sm cursor-pointer" @click="editPermissions = !editPermissions, formError=[]">
                {{ editPermissions === true ? 'Cancel' : 'Edit'}}
              </div>
              <button v-if="editPermissions == true"
                class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg shadow float:right font-bold"
                @click.prevent="updatePracticeSurgery(toPutPracticeParent)"
                >Save</button>
            </div>
            <div v-if="editPermissions == false">
              <div class="text-gray-300 text-sm">Pay for Surgery</div>
              <div class="text-white m-2 semibold">{{practiceHub.pay_for_surgery === true ? 'Yes' : 'No'}}</div>
              <div class="text-gray-300 text-sm">Verify job creation</div>
              <div class="text-white m-2 semibold">{{practiceHub.verify_job_creation === true ? 'Yes' : 'No'}}</div>
              <div class="text-gray-300 text-sm">Share Banks to Other Surgeries</div>
              <div class="text-white m-2 semibold">{{practiceHub.share_banks_to_other_surgeries === true ? 'Yes' : 'No'}}</div>
              <div class="text-gray-300 text-sm">Create Job Rates Limit</div>
              <div class="text-white m-2 semibold">{{practiceHub.create_job_rate_limit}}</div>
            </div>
            <div v-if="editPermissions == true" class="text-white w-full">
              <div class="w-full px-1">
                <AppInput
                v-model="toPutPracticeParent.pay_for_surgery"
                :type="'select'"
                :name="'pay_for_surgery'"
                :label="'Pay for surgery?'"
                :placeholder="'Select...'"
                :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
                :error="formError.find(item => item.field === 'pay_for_surgery')"
					      @blur="CheckEmptyField(toPutPracticeParent.pay_for_surgery, 'pay_for_surgery')"
                />
              </div>
                
              <div class="w-full px-1">
                <AppInput
                v-model="toPutPracticeParent.verify_job_creation"
                :type="'select'"
                :name="'verify_job_creation'"
                :label="'Verify Job Creation?'"
                :placeholder="'Select...'"
                :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
                :error="formError.find(item => item.field === 'verify_job_creation')"
					      @blur="CheckEmptyField(toPutPracticeParent.verify_job_creation, 'verify_job_creation')"
                />
              </div>
              <div class="w-full px-1">
                <AppInput
                v-model="toPutPracticeParent.share_banks_to_other_surgeries"
                :type="'select'"
                :name="'share_banks_to_other_surgeries'"
                :label="'Allow this surgery to share its banks to other surgeries??'"
                :placeholder="'Select...'"
                :items="[{ label: 'Yes', value: true },
                  { label: 'No', value: false }]"
                :error="formError.find(item => item.field === 'share_banks_to_other_surgeries')"
					      @blur="CheckEmptyField(toPutPracticeParent.share_banks_to_other_surgeries, 'share_banks_to_other_surgeries')"
                />
              </div>
              <div class="w-full p-1">
                <AppInput
                  v-model="toPutPracticeParent.create_job_rate_limit"
                  :type="'number'"
                  :name="'create_job_rate_limit'"
                  :label="'Job Rates Limit £'"
                  :inStyle="'text-align:right'"
                  :error="formError.find(item => item.field === 'share_banks_to_other_surgeries')"
					        @blur="CheckEmptyField(toPutPracticeParent.share_banks_to_other_surgeries, 'share_banks_to_other_surgeries')"
                  />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div v-if="!practiceParent && practiceHub">
      <form class="flex flex-col bg-waterloo py-2 px-4 text-white text-sm shadow rounded-lg max-w-3xl">
        <div class="m-4">
          <div class="inline-flex items-center text-lg">
            <span class="flex">
              <svgicon name="alert" width="32" height="32" color="white"/>
            </span>
            <p class="px-2">
              {{ practiceHub.parent_surgery ? 'This surgery is not yet a registered practice in HUBZZ.' : 'This practice has no Hub yet.'}}
            </p>
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
      editPermissions: false,
      toPutPracticeParent:{
        pay_for_surgery: this.practiceHub.practice_surgeries.pay_for_surgery,
        verify_job_creation: this.practiceHub.practice_surgeries.verify_job_creation,
        share_banks_to_other_surgeries: this.practiceHub.practice_surgeries.share_banks_to_other_surgeries,
        create_job_rate_limit: this.practiceHub.practice_surgeries.create_job_rate_limit
      },
      formError: []
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
