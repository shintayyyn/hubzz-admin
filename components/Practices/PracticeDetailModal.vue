<template>
    <div class="p-8 max-w-xl">
      <nuxt-link to="/practices" class="cursor-pointer">
        <svgicon name="arrow-left-solid" height="32" width="32" class="text-white fill-current"/>
      </nuxt-link>
      <PracticeTabs :practice="practice"/>

      <!-- <transition name="fade" mode="out-in">
        <div v-if="!$route.query.practice_tab" class="mt-5">
          <form class="flex flex-col bg-waterloo py-2 px-4 shadow rounded-lg sm:w-full lg:w-2/3">
            <div class="flex flex-wrap">
              <div class="w-full md:w-1/2 text-grey-light text-sm p-2">
                <p class="flex">Practice Name</p>
                <p class="flex items-center text-white text-sm p-2 font-semibold">
                  {{practice.surgery ? practice.surgery.name : null}} 
                  <span
                  class="py-2 px-4 ml-2 text-sm text-white rounded-lg shadow font-extrabold"
                  :class="`${practice && practice.practice_parent ? 'bg-blue-light' :'bg-red-light' }`">{{practice && practice.practice_parent ? 'SPOKE' : 'HUB'}}</span>
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
                
                <div v-if="practice && practice.practice_parent">
                  <p class="flex m-2 text-base font-bold underline"> HUB info</p>
                  <p class="flex">Practice Name</p>
                  <p class="flex text-grey-light text-sm p-2 font-semibold">{{practice.practice_parent.surgery.name}}</p>
                  <p class="flex">Practice Code</p>
                  <p class="flex text-grey-light text-sm p-2 font-semibold">{{practice.practice_parent.surgery.code}}</p>
                  <p class="flex">Phone Number</p>
                  <p class="flex text-grey-light text-sm p-2 font-semibold">{{practice.practice_parent.phone_number}}</p>
                </div>
              </div>
              <div class="w-full md:w-1/2 ">
                <p class="flex text-grey-light text-sm p-2">Phone Number</p>
                <input
                  class="appearance-none bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-orange"
                  type="text"
                  aria-label="phonenumber"
                  :placeholder="practice.phone_number"
                  v-model="toPutPractice.phone_number"
                >
                <p class="flex text-grey-light text-sm p-2">Full name to report to</p>
                <input
                  class="appearance-none bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-orange"
                  type="text"
                  aria-label="fullName"
                  :placeholder="practice.report_to ? practice.report_to :'Type Here'"
                  v-model="toPutPractice.report_to"
                >
                <p
                  class="flex text-grey-light text-sm p-2"
                >Extra information (Parking restrictions, transport links, etc.)</p>
                  <textarea
                  class="text-grey-lightest text-sm w-full bg-transparent overflow-auto resize border-b focus:border-orange" 
                  name="practiceNote"
                  :placeholder="practice.extra_information ? practice.extra_information : 'Type Here'"
                  v-model='toPutPractice.extra_information'>
                </textarea>

                <p class="flex text-grey-light text-sm p-2">Status</p>
                <select
                  class="outline-none border-2 border-transparent text-sm text-black pr-6"
                  v-model='toPutPractice.status'
                >
                  <option>Active</option>
                  <option>Suspended</option>
                  <option>Deactivated</option>
                </select>
                <p class="flex text-grey-light text-sm p-2">Active Until</p>
                  <input
                    type="date"
                    class="date-picker hasDatepicker valid"
                    name="expiryDate"
                    disable-min-date
                    placeholder="dd/mm/yyyy"
                    aria-invalid="false"
                    v-model='toPutPractice.actived_until'
                  >
                <button
                  class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow float:right"
                  @click.prevent="toPutPracticeInfo(practice.id,toPutPractice)"
                >Save</button>
              </div>
            </div>
          </form>
        </div>
      </transition> -->
     
      <div class="mt-5">
        <transition name="fade" mode="out-in">
          <PracticeProfile :practice="practice"/>
        </transition>
      </div>
    </div>
</template>
<script>
import PracticeTabs from '@/components/Practices/PracticeTabs'
import PracticeProfile from '@/components/Practices/PracticeProfile'
import PracticeSurgeries from '@/components/Practices/PracticeSurgeries'
import PracticeSessions from '@/components/Practices/PracticeSessions'
import PracticeUsers from '@/components/Practices/PracticeUsers'
import PracticeDocuments from '@/components/Practices/PracticeDocuments'
import PracticeRates from '@/components/Practices/PracticeRates'
export default {
    props:['practice'],
    components:{ 
        PracticeTabs,
        PracticeProfile,
        practice_surgeries:PracticeSurgeries,
        practice_sessions:PracticeSessions,
        practice_users:PracticeUsers,
        practice_documents:PracticeDocuments,
        practice_rates:PracticeRates
    },
    data(){
        return{
            practiceParent:null,
            toPutPractice:{}
        }
    },
    computed:{
        activeComponent(){
            return this.$route.query.practice_tab
        }
    },
    methods:{
      goBack(){
        const query = {
          ...this.$route.query
        }
        delete query.practice_tab
        
        this.$router.push({path:'/practices',query})
      },
      async toPutPracticeInfo(practiceID,toPutPractice){
            try{
                //await finishes the promise. if failed, corresponding funcs will not be executed
                await this.$axios.put(`/api/v1/admin/practices/${practiceID}`,{
                phone_number:toPutPractice.phone_number,
                report_to:toPutPractice.report_to,
                extra_information:toPutPractice.extra_information,
                status:toPutPractice.status,
                actived_until:toPutPractice.actived_until
                })
                // alert('Saved')
                this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'alert', text: 'Saved' })
                
            }catch(err){
                // alert('Something went wrong!')
                this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
                console.log("index put locum detail compliance documents error");
            }

        }
    }
    
}
</script>
