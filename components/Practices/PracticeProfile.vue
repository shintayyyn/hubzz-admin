<template>
    <div class="flex flex-col rounded-lg p-4 sm:p-4">
        <div>
          <form class="flex flex-col bg-waterloo py-2 px-4 shadow rounded-lg sm:w-full lg:w-2/3">
            <div class="flex flex-wrap">
              <div class="w-full md:w-1/2 text-grey-light text-sm p-2">
                <p class="flex">Practice Name</p>
                <p class="flex items-center text-white text-sm p-2 font-semibold">
                  {{practice.surgery ? practice.surgery.name : null}} 
                  <span
                  class="py-2 px-4 ml-2 text-sm text-white rounded-lg shadow font-extrabold"
                  :class="practiceTypeStyle(practice.type)">{{practice.type}}</span>
                </p>
                
                <p class="flex">Practice Code</p>
                <p class="flex text-white text-sm p-2 font-semibold">{{practice.surgery ? practice.surgery.code : null}}</p>
                <p class="flex">Address</p>
                <p class="flex text-white text-sm p-2 font-semibold">
                  {{practice.surgery.address ? practice.surgery.address.line_1 : null}} <br>
                  {{practice.surgery.address ? practice.surgery.address.line_2 : null}} <br>
                  {{practice.surgery.address ? practice.surgery.address.line_3 : null}} <br>
                </p>
                <p class="flex">CCG</p>
                <p class="flex text-white text-sm p-2 font-semibold">{{practice.surgery.clinical_commissioning_group ? practice.surgery.clinical_commissioning_group.name:null}}</p>
                
                <p class="flex">Practice Types</p>
                <div v-if="practice.practice_types.length > 0">
                  <p class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-dark"
                    v-for="practiceType in practice.practice_types"
                      :key="practiceType.id + '-name'">
                      {{practiceType ? practiceType.name:null}}
                  </p>
                </div>
                <div v-else>
                  <p class="flex text-white text-sm p-2 font-semibold">Not set</p>
                </div>
                <div v-if="practice.gp_compliance_documents.length > 0">
                  <p class="flex">Compliance Requirements for GPs:</p>
                  <div class="text-white text-sm m-1 font-semibold" v-for="(gpComplianceDocs,index) in practice.gp_compliance_documents"
                    :key="`${index}-${gpComplianceDocs.name}`"
                    >
                      <span >{{gpComplianceDocs ? gpComplianceDocs.name:"(none)"}}</span> 
                  </div>
                </div>
                <div v-if="practice.others_compliance_documents.length > 0">
                  <p class>For Nurses, et al:</p>
                  <div class="text-white text-sm m-1 font-semibold" v-for="(othersComplianceDocs, index) in practice.others_compliance_documents"
                    :key="`${index}-${othersComplianceDocs.name}`"
                    >
                      <span >{{othersComplianceDocs ? othersComplianceDocs.name:"(none)"}}</span> 
                  </div>
                </div>
                <div v-if="practice.mandatory_trainings.length > 0">
                  <p class="flex">Mandatory Trainings</p>
                  <div class="text-white text-sm m-1 font-semibold" v-for="(mandatoryTrainings, index) in practice.mandatory_trainings"
                    :key="`${index}-${mandatoryTrainings.name}`"
                    >
                      <span >{{mandatoryTrainings ? mandatoryTrainings.name:"(none)"}}</span> 
                  </div>
                </div>
                <div v-if="!practice.gp_compliance_documents.length > 0 || !practice.others_compliance_documents.length > 0  || !practice.mandatory_trainings.length > 0">
                  <p class="flex text-white text-base py-2 font-semibold">Compliance Documents is not yet set up by the Practice yet.</p>
                </div>
              </div>

              <div class="w-full text-sm text-white md:w-1/2 ">
                <div class="m-2">
                  <span class="font-semibold text-lg">Other Information</span>
                  <span class="m-1 p-2 bg-sunglow text-black font-semibold rounded-lg cursor-pointer" v-if="toEdit ==false" @click="toEdit=true">Edit</span>
                  <span class="m-1 p-2 bg-sunglow text-black font-semibold rounded-lg cursor-pointer" v-if="toEdit == true" @click="toEdit=false">Cancel Editing</span>
                </div>

                <div v-if="toEdit == false" class="border-b border-white">
                  <p class="flex text-grey-light p-2">Phone Number</p>
                  <p class="flex mx-4 font-semibold">{{practice && practice.phone_number ? practice.phone_number : 'N/A'}}</p>
                  <p class="flex text-grey-light p-2">Full name to report to</p>
                  <p class="flex mx-4 font-semibold">{{practice && practice.report_to ? practice.report_to : 'N/A'}}</p>
                  <p class="flex text-grey-light p-2">Extra information (Parking restrictions, transport links, etc.)</p>
                  <p class="flex mx-4 font-semibold">{{practice && practice.extra_information ? practice.extra_information : 'N/A'}}</p>
                  <div class="my-4">
                    <span class="text-grey-light p-2">Status: </span>
                    <span class="text-grey-light p-2 rounded-lg font-semibold" :class="practice.status == 'Active' ? 'bg-green' : 'bg-red'">{{practice.status}}</span>
                  </div>
                  <span class="text-grey-light p-2">Active Until</span>
                  <p class="flex m-4 font-semibold">{{practice && practice.actived_until ? practice.actived_until : 'N/A'}}</p>
                </div>

                <div v-if="toEdit == true" class="border-b-4 border-white">
                  <p class="flex text-grey-light p-2">Phone Number</p>
                  <input
                    class="appearance-none text-white bg-transparent border-b w-full mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-orange"
                    type="text"
                    aria-label="phonenumber"
                    v-model="toPutPractice.phone_number"
                  >
                  <p class="flex text-grey-light p-2">Full name to report to</p>
                  <input
                    class="appearance-none text-white bg-transparent border-b w-full mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-orange"
                    type="text"
                    aria-label="fullName"
                    v-model='toPutPractice.report_to'
                  >
                  <p
                    class="flex text-grey-light p-2"
                  >Extra information (Parking restrictions, transport links, etc.)</p>
                  <textarea  
                    placeholder="Type Here" 
                    class="text-grey-lightest w-full bg-transparent overflow-auto resize border-b focus:border-orange" 
                    name="practiceNote"
                    v-model='toPutPractice.extra_information'>
                  </textarea>
                  <span class="text-grey-light p-2">Status: </span>
                  <select
                    class="mx-2 m-1 outline-none border-2 border-transparent text-black pr-6"
                    v-model='toPutPractice.status'
                  >
                    <option>Active</option>
                    <option>Suspended</option>
                    <option>Deactivated</option>
                  </select>
                  <div class="my-2">
                    <span class="text-grey-light p-2">Active Until</span>
                      <input
                        type="date"
                        class="date-picker hasDatepicker valid"
                        name="expiryDate"
                        disable-min-date
                        placeholder="dd/mm/yyyy"
                        aria-invalid="false"
                        v-model='toPutPractice.actived_until'
                      >
                  </div>
                  
                  <button
                    class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-black font-semibold rounded-lg shadow float:right"
                    @click.prevent="toPutPracticeInfo(practice.id,toPutPractice)"
                  >Save</button>
                </div>
                <p class="flex text-grey-light text-base font-bold mt-4">Change Practice Type</p>
                <select
                  class="outline-none border-2 border-transparent text-black pr-6"
                  v-model='toPutPracticeType.type'
                >
                  <option>Hub</option>
                  <option>Spoke</option>
                  <option>Stand Alone</option>
                </select>
                
                <button
                  class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-black font-semibold rounded-lg shadow float:right"
                  @click.prevent="toChangePracticeType(practice.id,toPutPracticeType)"
                >Change</button>
                <!-- <div v-if="toPutPracticeType.type == 'Spoke'">
                  <p class="flex text-grey-light p-2">Parent Practice ID:</p>
                  <input
                    class="appearance-none bg-transparent border-b w-full mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-orange"
                    type="text"
                    placeholder
                    aria-label="fullName"
                    v-model='toPutPractice.report_to'
                  >
                </div> -->
              </div>
            </div>
          </form>
        </div>
      </div>
</template>
<script>
export default {
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
              type:this.practice.type
            },
        }
    },
    created(){
        console.log("You are currently viewing this practice",this.practice)

        if(this.practice.type == 'Spoke'){
          Promise.all([
            this.$axios.$get(`/api/v1/admin/practices/${this.practice.id}/parent-surgery`).then(res=>{
              this.practiceParent = res.data.practice.parent_surgery
            })
          ]).then(()=>{
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
        console.log("hello")
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
      async toPutPracticeInfo(practiceID,toPutPractice){
        try{
            const response = await this.$axios.put(`/api/v1/admin/practices/${practiceID}`,{
              phone_number:toPutPractice.phone_number,
              report_to:toPutPractice.report_to,
              extra_information:toPutPractice.extra_information,
              status:toPutPractice.status,
              actived_until:toPutPractice.actived_until
            })
            this.practice.phone_number = response.data.data.practice.phone_number
            this.practice.report_to = response.data.data.practice.report_to,
            this.practice.extra_information = response.data.data.extra_information,
            this.practice.status = response.data.data.practice.status,
            this.practice.actived_until = response.data.data.practice.actived_until
            
            await this.getPractices()
            this.toEdit = false  
            this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved' })
            
        }catch(err){
            this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
            console.log("put locum profile info error");
        }

      },
      async toChangePracticeType(practiceID,toPutPracticeType){
        try{
          console.log(toPutPracticeType)
          // if(toPutPracticeType.type)
          const response = await this.$axios.put(`/api/v1/admin/practices/${practiceID}/practice-type`,{
            type:toPutPracticeType.type
          })
          
          this.practice.type = response.data.data.practice.type
          await this.getPractices()
          await this.getPractice()
          this.$store.commit('SET_NOTIFICATION',{enabled:true, status:'success',text:'Saved'})
        }catch(err){
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
          console.log('change practice type error!',err)
        }
      },
      practiceTypeStyle(type){
        switch(type){
          case 'Stand Alone':
            return 'bg-indigo-light text-white lg:px-4 sm:px-2'
            break;
          case 'Hub':
            return 'bg-red-light text-white lg:px-8 sm:px-2'
            break;
          case 'Spoke':
            return 'bg-blue-light text-white lg:px-8 sm:px-2'
            break;
          default:
            return
        }
      },   
    }
    
}
</script>
<style>

</style>
