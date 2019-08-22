<template>
    <div class="flex flex-col px-4">
        <div class="w-1/2">
            <button
            @click="show()"
            class=" no-underline py-2 px-4 mb-4 bg-sunglow text-sm text-black rounded-lg shadow">
                <span v-if="practiceParent">Change Parent</span>
                <span v-else>Add Parent</span>
            </button>
        </div>
        <div v-if="practiceParent">
          <form class="flex flex-col bg-waterloo py-2 px-4 shadow rounded-lg sm:w-full lg:w-2/3">
            <div class="flex flex-wrap">
                <div class="w-full md:w-1/2">
                    <div class="text-grey-light text-sm p-2">
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
                        <p class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-dark"
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
                        
                        <div v-if="practiceParent && practiceParent.type=='Spoke'">
                        <p class="flex m-2 text-base font-bold underline"> HUB info</p>
                        <p class="flex">Practice Name</p>
                        <p class="flex text-grey-light text-sm p-2 font-semibold">{{practiceParentHub.name}}</p>
                        <!-- <p class="flex">Phone Number</p>
                        <p class="flex text-grey-light text-sm p-2 font-semibold">{{practiceParent.practice_parent.phone_number}}</p> -->
                        </div>
                    </div>
                </div>
                <div class="w-full md:w-1/2 ">
                    <div>
                        <p class="flex text-grey-light text-sm p-2">Does the hub pay for the Surgery?</p>
                        <select
                            class="outline-none w-1/2 border-2 border-transparent text-sm text-black pr-6"
                            v-model='toPutPracticeParent.pay_for_surgery'
                            >
                            <option>Yes</option>
                            <option>No</option>
                        <!-- <option>Dormant</option> -->
                        </select>
                        <p class="flex text-grey-light text-sm p-2">Verify Job Creation</p>
                        <select
                            class="outline-none w-1/2 border-2 border-transparent text-sm text-black pr-6"
                            v-model='toPutPracticeParent.verify_job_creation'
                            >
                            <option>Yes</option>
                            <option>No</option>
                        </select>
                    </div>
                    
                    <button
                    class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow float:right"
                    @click.prevent="updatePracticeSurgery(toPutPracticeParent)"
                    >Save</button>
                </div>
            </div>
          </form>
        </div>
        <div class="practice-shield" v-if="modal == true"></div>
        <transition name="slide" mode="out-in">
            <div class="change-parent-modal shadow-lg" v-if="modal">
                <AddPracticeSurgery :practice="practice" :practiceHub="practiceHub" @close="modal = false"/>
            </div>
        </transition>
      </div>
</template>
<script>
import AddPracticeSurgery from '@/components/Practices/AddPracticeSurgery'
export default {
    components:{
        AddPracticeSurgery
    },
    props:['practice','practiceParent','practiceHub'],

    data(){
        return{
            modal:false,
            toPutPracticeParent:{}
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
                return 'bg-green-light text-white lg:px-4 sm:px-2'
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
        async updatePracticeSurgery(toPutPracticeParent){
            try{
                await this.$axios.put(`/api/v1/admin/practices/${this.practice.id}/parent-surgery`,{
                    pay_for_surgery:toPutPracticeParent.pay_for_surgery,
                    verify_job_creation:toPutPracticeParent.verify_job_creation
                })
                this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'alert', text: 'Practice Parent Updated' })
            }catch(err){
                console.log("put practice error",err)
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
  border-left: solid 2px orange;
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
