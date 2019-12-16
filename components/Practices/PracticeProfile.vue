<template>
  <div class="flex flex-col rounded-lg">
    <div>
      <form class="flex flex-col bg-waterloo py-2 px-4 shadow rounded-lg sm:w-full lg:max-w-2xl">
        <div class="flex flex-wrap">
          <!-- VIEW PRIMARY INFORMATION -->
          <div class="w-full md:w-1/2 text-gray-300 text-sm">
            <p class="flex font-bold">Practice Name</p>
            <p class="flex flex-wrap items-center text-white text-sm mb-2 md:px-2 ">
              <span class="mr-2">{{practice.surgery ? practice.surgery.name : null}}</span>
              <span
              class="py-2 px-4 text-sm text-white rounded-lg shadow font-extrabold"
              :class="practiceTypeStyle(practice.type)">{{practice.type}}</span>
              <span
              v-if="practice.type === 'Hub' && practice.hub_type === 'Type 2'"
              class="py-2 px-4 mx-1 text-sm text-white rounded-lg shadow font-extrabold"
              :class="practiceTypeStyle(practice.hub_type)">{{practice.hub_type == 'Type 2' ? 'Health Board' : null}}</span>
            </p>
            
            <p class="flex font-bold">Practice Code</p>
            <p class="flex text-white text-sm md:px-2  mb-2">{{practice.surgery ? practice.surgery.code : null}}</p>
            <p class="flex font-bold">Address</p>
            <p class="flex flex-col text-white text-sm md:px-2  mb-2">
              <span v-if="practice.surgery.address && practice.surgery.address.line_1">{{practice.surgery.address ? practice.surgery.address.line_1 : null}}</span>
              <span v-if="practice.surgery.address && practice.surgery.address.line_2">{{practice.surgery.address ? practice.surgery.address.line_2 : null}}</span>
              <span v-if="practice.surgery.address && practice.surgery.address.line_3">{{practice.surgery.address ? practice.surgery.address.line_3 : null}}</span>
            </p>
            <p class="flex font-bold">CCG</p>
            <p class="flex text-white text-sm md:px-2  mb-2">{{practice.surgery.clinical_commissioning_group ? practice.surgery.clinical_commissioning_group.name:null}}</p>
            
            <p class="flex font-bold">Practice Types</p>
            <div v-if="practice.practice_types.length > 0" class="flex flex-wrap mb-2">
              <p class="inline-flex px-4 py-1 mr-2 mb-1 rounded-lg text-sm text-black md:px-2 bg-yellow-500"
                v-for="practiceType in practice.practice_types"
                  :key="practiceType.id + '-name'">
                  {{practiceType ? practiceType.name:null}}
              </p>
            </div>
            <div v-else>
              <p class="flex text-white text-sm md:px-2  mb-2">Not set</p>
            </div>
            <div v-if="practice.gp_compliance_documents.length > 0">
              <p class="flex font-bold">Compliance Requirements for GPs:</p>
              <div class="text-white text-sm m-1  mb-2" v-for="(gpComplianceDocs,index) in practice.gp_compliance_documents"
                :key="`${index}-${gpComplianceDocs.name}`"
                >
                  <span >{{gpComplianceDocs ? gpComplianceDocs.name:"(none)"}}</span> 
              </div>
            </div>
            <div v-if="practice.others_compliance_documents.length > 0">
              <p class="font-bold">For Nurses, et al:</p>
              <div class="text-white text-sm m-1  mb-2" v-for="(othersComplianceDocs, index) in practice.others_compliance_documents"
                :key="`${index}-${othersComplianceDocs.name}`"
                >
                  <span >{{othersComplianceDocs ? othersComplianceDocs.name:"(none)"}}</span> 
              </div>
            </div>
            <div v-if="practice.mandatory_trainings.length > 0">
              <p class="flex font-bold">Mandatory Trainings</p>
              <div class="text-white text-sm m-1  mb-2" v-for="(mandatoryTrainings, index) in practice.mandatory_trainings"
                :key="`${index}-${mandatoryTrainings.name}`"
                >
                  <span >{{mandatoryTrainings ? mandatoryTrainings.name:"(none)"}}</span> 
              </div>
            </div>
            <div v-if="!practice.gp_compliance_documents.length > 0 || !practice.others_compliance_documents.length > 0  || !practice.mandatory_trainings.length > 0">
              <p class="flex text-white md:text-base py-2 font-bold leading-tight">Compliance Documents is not yet set up by the Practice yet.</p>
            </div>
          </div>
          <!-- VIEW / EDIT OTHER INFORMATION -->
          <div class="w-full text-sm text-white md:w-1/2">
            <div class="flex flex-wrap justify-between items-center">
              <span class="text-lg mr-2 font-bold">Other Information</span>
					    <AppButton v-if="authAdminPermissions.includes('Edit Practice Other Information')" :label="toEdit ? 'Cancel Editing' : 'Edit'"  @click="toEdit=!toEdit"/>
            </div>

            <div v-if="toEdit == false">
              <p class="flex text-gray-300 font-bold">Phone Number</p>
              <p class="flex md:mx-2 mb-2">{{practice && practice.phone_number ? practice.phone_number : 'N/A'}}</p>
              <p class="flex text-gray-300 font-bold">Full name to report to</p>
              <p class="flex md:mx-2 mb-2">{{practice && practice.report_to ? practice.report_to : 'N/A'}}</p>
              <p class="flex text-gray-300 font-bold">Extra information (Parking restrictions, transport links, etc.)</p>
              <p class="flex md:mx-2 mb-2">{{practice && practice.extra_information ? practice.extra_information : 'N/A'}}</p>
              <div class="flex items-center mb-2">
                <span class="text-gray-300 mr-2 font-bold">Status: </span>
                <span class="text-white px-4 py-1 rounded-lg " :class="practice.status == 'Active' ? 'bg-green-500' : 'bg-red-500'">{{practice.status}}</span>
                <span class="tool" data-tip="Practice Status is automatically set to 'Active' once Practice Verification Process is done." tabindex="1">
                  <svgicon
                  name="info"
                  width="21"
                  height="21"
                  color="white transparent black"
                  class="ml-2" 
                  ></svgicon>
                </span>
              </div>
              <p class="text-gray-300 font-bold">Active Until</p>
              <p class="flex md:mx-2  mb-2">{{practice && practice.actived_until ? practice.actived_until : 'N/A'}}</p>
            </div>

            <div v-if="toEdit == true && authAdminPermissions.includes('Edit Practice Other Information')">
               <AppInput
                v-model="toPutPractice.phone_number"
                :type="'text'"
                :name="'phonenumber'"
                :label="'Phone Number'"
              />
               <AppInput
                v-model="toPutPractice.report_to"
                :type="'text'"
                :name="'report_to'"
                :label="'Full name to report to'"
              />
              <AppInput
                v-model="toPutPractice.extra_information"
                :type="'textarea'"
                :name="'practiceNote'"
                :label="'Extra information (Parking restrictions, transport links, etc.)'"
                :resize="false"
                :rows="2"
              />
              <div class="flex items-center mb-4">
                <AppInput
                  class="w-2/3 md:w-1/2 mr-2"
                  v-model="toPutPractice.status"
                  :type="'select'"
                  :name="'status'"
                  :label="'Status'"
                  :placeholder="'Select...'"
                  :items="[
                    { label: 'Active', value: 'Active' },
                    { label: 'Inactive', value: 'Inactive' },
                    { label: 'Suspended', value: 'Suspended' },
                    { label: 'Deactivated', value: 'Deactivated' }
                  ]"
                />
                <span class="tool" data-tip="Practice Status cannot be set to 'Active' until the Practice is Verified at least once, since the day it was created." tabindex="1">
                  <svgicon
                  name="info"
                  width="21"
                  height="21"
                  color="white transparent black"
                  ></svgicon>
                </span>
              </div>
              <AppDate
                v-model="toPutPractice.actived_until"
                :name="'actived_until'"
                :label="'Active Until'"
                @blur="CheckEmptyField(toPutPractice.actived_until,'actived_until')"
                isAfter
              />

					    <AppButton :label="'Save'" @click="toPutPracticeInfo(practice.id,toPutPractice)" />
            </div>

            <div v-if="toEdit == true && authAdminPermissions.includes('Change Practice Type') && !practiceParent" >
              <AppInput
                v-model="toPutPracticeType.type"
                :type="'select'"
                :name="'type'"
                :label="'Change Practice Type'"
                :placeholder="'Select...'"
                :items="[
                  { label: 'Hub', value: 'Hub' },
                  { label: 'Spoke', value: 'Spoke' },
                  { label: 'Stand Alone', value: 'Stand Alone' }
                ]"
              />
               <AppInput
                v-if="toPutPracticeType.type === 'Hub'"
                v-model="toPutPracticeType.hub_type"
                :type="'select'"
                :name="'hub_type'"
                :placeholder="'Select...'"
                :items="[
                  { label: 'Type 1', value: 'Type 1' },
                  { label: 'Type 2', value: 'Type 2' },
                ]"
              />
					    <AppButton :label="'Change'" @click="toChangePracticeType(practice.id,toPutPracticeType)" />
            </div>
            
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import AppDate from "@/components/Base/AppDate";
import AppInput from "@/components/Base/AppInput"
import AppButton from "@/components/Base/AppButton"
export default {
  components: {
    AppDate,
    AppInput,
    AppButton
  },
  props:['practice'],
  data(){
    return{
      practiceParent:'',
      toPutPractice:{
        phone_number:this.practice.phone_number,
        report_to:this.practice.report_to,
        extra_information:this.practice.extra_information,
        status:this.practice.status,
        actived_until:this.practice.actived_until
      },
      toEdit:false,
      toPutPracticeType:{
        type:this.practice.type,
        hub_type:this.practice.hub_type,
      },
    }
  },
  computed: {
    authAdminPermissions() {
      return this.$store.getters["auth/permissions"]
    }
  },
  async created(){
    console.log(this.practice.actived_until)
    if(this.practice.type == 'Spoke'){
      Promise.all([
        this.$axios.$get(`/api/v1/admin/practices/${this.practice.id}/parent-surgery`).then(res=>{
          this.practiceParent = res.data.practice.parent_surgery
        })
      ]).then(()=>{
        console.log('get parent done')
      })
    }
  },

  methods:{
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
    getPractice(){
      this.$store.dispatch("practices/fetchSpecificPractice",{
        id:this.practice.id
      })
    },
    async toPutPracticeInfo(practiceID){
      try{
          const response = await this.$axios.put(`/api/v1/admin/practices/${practiceID}`,this.toPutPractice)
          await this.getPractices()
          await this.getPractice()
          this.toEdit = false  
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved' })
          
      }catch(err){
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: err.response.data.message })
          console.log("put locum profile info error",err.message);
      }

    },
    async toChangePracticeType(practiceID){
      console.log(practiceID)
      try{
        await this.$axios.put(`/api/v1/admin/practices/${practiceID}/practice-type`,this.toPutPracticeType)
        await this.getPractices()
        await this.getPractice()
        this.toEdit = false
        this.$store.commit('SET_NOTIFICATION',{enabled:true, status:'success',text:'Saved'})
      }catch(err){
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: err.response.data.message })
        console.log('change practice type error!',err.message)
      }
    },

    practiceTypeStyle(type){
      switch(type){
        case 'Stand Alone':
          return 'bg-indigo-500 text-white lg:px-4 sm:px-2'
          break;
        case 'Hub':
          return 'bg-red-500 text-white lg:px-8 sm:px-2'
          break;
        case 'Spoke':
          return 'bg-blue-500 text-white lg:px-8 sm:px-2'
          break;
        case 'Type 2':
          return 'bg-purple-500 text-white lg:px-8 sm:px-2'
          break;
        default:
          
      }
    },   
  }
}
</script>
<style>

</style>
