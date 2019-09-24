<template>
    <div class=m-6>
        <!-- BODY -->
        <div class= "w-full overflow-auto">
          <div class="flex m-2 ">
            <div class="text-2xl text-white font-semibold">{{job ? job.title:null }}</div>
            <div class="text-black p-2 bg-yellow rounded ml-4">{{job.status}}</div>
            <div class="text-black p-2 text-white rounded ml-4" :class="job.type == 'Platform'? 'bg-red':'bg-blue'">{{job.type}}</div>
          </div>
          <div class="text-white mx-4">{{"Posted On: "+job.date_created}}</div>
          <div class="flex m-2 flex-wrap overflow-hidden ">
            <div class="xl:w-3/5 w-full my-2 overflow-hidden">
              <div class="flex flex-wrap h-full overflow-hidden text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow">

                <div class="xl:w-1/2 w-full overflow-hidden">
                  <div class="m-4 mt-5 text-grey text-white">
                    <p class="font-semibold">Job Number</p>
                    <p class="text-white">{{job.job_number}}</p>
                    <p class="mt-5 font-semibold">Rate</p>
                    <p class="text-white no-underline">{{job.rate ? "£ "+job.rate+" Per Hour":null +" Per Hour"}}</p>
                    <p class="mt-5 font-semibold">Total Hours</p>
                    <p class="text-white">{{job.total_hours ? job.total_hours+" Hours":null + " Hours"}}</p>
                    <p class="mt-5 font-semibold">Job Description</p>
                    <p class="text-white">{{job.description}}</p>
                    <p class="mt-5 font-semibold">Extra Information</p>
                    <p class="text-white">{{job.platform_job ? job.platform_job.extra_information : 'N/A'}}</p>
                  </div>
                </div>

                <div class="text-white xl:w-1/2 w-full overflow-hidden">
                  <div class="m-2 mt-5">
                    <p class="font-semibold">Duration</p>
                    <span class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-white">From</span>
                    <span class="text-sm font-semibold">{{job.date_start}}</span> <br><br>
                    <span class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-white">To</span>
                    <span class="text-sm font-semibold">{{job.date_end}}</span> <br><br>
                    <span class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-white">Shift</span>
                    <span class="text-sm  ont-semibold">{{job.shift.name}}</span> <br><br>
                    <p class="m-2 mt-5 font-semibold">Auto-assigns this job to the first applicant</p>
                    
                    <div v-if="job.platform_job">
                      <div class="m-2 mt-5">
                        <span>This job is </span>
                        <span class="font-semibold">{{job.platform_job.ir35 === true ? "INSIDE":"OUTSIDE"}}</span>
                        <span> of</span>
                        <span class="font-semibold">IR35</span> 
                      </div>

                      <p class="m-2 mt-5 font-semibold">Role</p>
                      <p class="m-2 ">{{job.platform_job.profession.name}}</p>

                      <p class="m-2 mt-5 w-1/2 font-semibold">Speciality</p>
                      <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-dark"
                        v-for="specialty in job.platform_job.qualifications"
                        :key="specialty.id + '-name'">
                        {{specialty ? specialty.name:null}}
                      </p>

                      <p class="m-2 mt-5 w-1/2 font-semibold">Clinical Systems</p>
                      <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-dark"
                        v-for="clinicalSystem in job.platform_job.clinical_systems"
                        :key="clinicalSystem.id + '-name1'">
                          {{clinicalSystem ? clinicalSystem.name:null}}
                      </p>

                      <p class="m-2 mt-5 w-1/2 font-semibold">Spoken Languages</p>
                      <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-dark"
                        v-for="spokenLanguage in job.platform_job.spoken_languages"
                        :key="spokenLanguage.id + '-name2'">
                        {{spokenLanguage ? spokenLanguage.name:null}}
                      </p>

                      <div v-if="job.platform_job.compliance_documents.length > 0">
                        <p class="flex ml-2 font-semibold">Compliance Requirements for GPs:</p>
                        <div class="text-sm ml-4 mb-2" v-for="(gpComplianceDocs,index) in job.platform_job.compliance_documents"
                          :key="`${index}-${gpComplianceDocs.name}`"
                          >
                            <span >{{gpComplianceDocs ? gpComplianceDocs.name:"(none)"}}</span> 
                        </div>
                      </div>

                      <div v-if="job.platform_job.mandatory_trainings.length > 0">
                        <p class="flex ml-2 font-semibold">Mandatory Trainings</p>
                        <div class="text-sm ml-4 mb-2" v-for="(mandatoryTrainings, index) in job.platform_job.mandatory_trainings"
                          :key="`${index}-${mandatoryTrainings.name}`"
                          >
                            <span >{{mandatoryTrainings ? mandatoryTrainings.name:"(none)"}}</span> 
                        </div>
                      </div>
                    </div>
                    <div v-else-if="job.private_job">
                      
                    </div>
                  </div>
                </div>

                <div class="w-full m-4 overflow-hidden" v-if="job.platform_job">
                  <div class="m-2 text-white">
                    <p class="font-semibold">
                      Practice<br>
                      {{job.platform_job.practice.surgery.name}}
                    </p>
                    <p>
                      {{job.platform_job.practice.surgery.address.line_1}}
                      {{job.platform_job.practice.surgery.address.line_2}}
                      {{job.platform_job.practice.surgery.address.line_3}}
                    </p>
                  </div>
                
                  <div class="w-full mx-2 ">
                    <!-- google map -->
                    <GmapMap
                      :center="{lat:latLangPlatform.y,lng:latLangPlatform.x}"
                      :zoom="15"
                      map-type-id="terrain"
                      style="width: 100%; height:350px"
                    >
                      <GmapMarker :position="google && new google.maps.LatLng(latLangPlatform.y, latLangPlatform.x)"/>
                    </GmapMap>
                  </div>
                </div>
                <div class="w-full m-4 overflow-hidden" v-if="job.private_job">
                  <div class="text-white">
                    <p class="font-semibold">
                      Practice<br>
                      {{job.private_job.private_practice.surgery.name}}
                    </p>
                    <p>
                      {{job.private_job.private_practice.surgery.address.line_1}}
                      {{job.private_job.private_practice.surgery.address.line_2}}
                      {{job.private_job.private_practice.surgery.address.line_3}}
                    </p>
                  </div>
                
                  <div class="w-full">
                    <!-- google map -->
                    <GmapMap
                      :center="{lat:latLangPrivate.y,lng:latLangPrivate.x}"
                      :zoom="15"
                      map-type-id="terrain"
                      style="width: 100%; height:250px "
                    >
                      <GmapMarker :position="google && new google.maps.LatLng(latLangPrivate.y, latLangPrivate.x)"/>
                    </GmapMap>
                  </div>
                </div>
                
              </div>
            </div>

            <div class="xl:w-2/5 w-full my-2 overflow-hidden">
              <div v-if="job.platform_job && job.platform_job.appointed_to_locum && locumUser" 
                class="flex px-2 xl:mx-2 text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow text-white">
                
                <div class="flex flex-wrap overflow-hidden">
                  <div class="text-white mx-5">
                    <div class="flex flex-wrap -mx-2 ">
                      <div class="my-4 px-2 w-1/2 ">
                        <embed
                          v-if="locumUser.avatar"
                          class="flex w-4/5 rounded-full mr-4"
                            :src="locumUser && locumUser.avatar ? locumUser.avatar.file.url:null"
                          >
                          <img v-else class="w-48 rounded-full mr-4" src="~/assets/images/default-user-image.png" >
                      </div>

                      <div class="my-6  w-1/2 ">
                        <p class="text-white my-2 font-semibold text-base">{{locumUser.personal_detail ? locumUser.personal_detail.title:null}} {{locumUser.personal_detail.first_name}} {{locumUser.personal_detail.last_name}}</p>
                        <p class="text-white my-2 font-lighttext-sm">{{locumUser.locum_detail.profession.profession_category.name}}</p>
                      </div>

                    </div>
                  </div>
                  <div class="overflow-x-hidden mx-4">
                    <div class="m-2 font-semibold">Headline</div>
                    <p class="m-2 text-white">{{ locumUser.locum_detail ? locumUser.locum_detail.headline : null }}</p>
                    <p class="m-2 mt-5 mr-20 font-semibold">Biography</p>
                    <p class="m-2 text-white">{{ locumUser.locum_detail ? locumUser.locum_detail.short_biography : null }}</p>
                    <p class="m-2 mt-5 mr-20 font-semibold">Special Requirements</p>
                    <p class="m-2 text-white">{{ locumUser.locum_detail ? locumUser.locum_detail.special_requirements : null }}</p>
                    <p class="m-2 mt-5 mr-20 font-semibold">Rates</p>

                    <p class="m-2 text-white"
                      v-for="locumRates in locumUser.locum_detail.rates"
                      :key="locumRates.id + '-name1'" >
                      {{locumRates.rate_type.name}} £ {{locumRates.min}} ~ {{locumRates.max}}</p>

                    <p class="m-2 mt-5 mr-20 font-semibold">Postal Address</p>
                    <p class="ml-2 text-white">{{ locumUser.address_detail ? locumUser.address_detail.address.line_1 : null }}</p>
                    <p class="ml-2 mt-1 text-white">{{ locumUser.address_detail ? locumUser.address_detail.address.line_2 : null }}</p>
                    <p class="ml-2 mt-1 text-white">{{ locumUser.address_detail ? locumUser.address_detail.address.line_3 : null }}</p>
                    <p class="m-2 mt-5 mr-20 font-semibold">GMC / NMC Number</p>
                    <p class="m-2 text-white">{{ locumUser.locum_detail.gmc_or_nmc_number ? locumUser.locum_detail.gmc_or_nmc_number.number : null }}</p>
                    <p class="m-2 mt-5 mr-20 font-semibold">MPL / NPL Number</p>
                    <p class="m-2 text-white">{{ locumUser.locum_detail.mpl_or_npl_number ? locumUser.locum_detail.mpl_or_npl_number.number : null }}</p>

                    <p class="m-2 mt-5 mr-20 font-semibold">Profession</p>
                    <p class="m-2 text-white">{{ locumUser.locum_detail.profession ? locumUser.locum_detail.profession.name : null }}</p>
                    
                    <p class="m-2 mt-5 mr-20 font-semibold">Speciality</p>
                    <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-dark"
                      v-for="specialty in locumUser.locum_detail.qualifications"
                      :key="specialty.id + '-name'">
                      {{specialty ? specialty.name:null}}
                    </p> 
                    
                    <p class="m-2 mt-5 mr-20 font-semibold">Clinical Systems</p>
                    <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-dark"
                      v-for="clinicalSystem in locumUser.locum_detail.clinical_systems"
                      :key="clinicalSystem.id + '-name1'">
                        {{clinicalSystem ? clinicalSystem.name:null}}
                    </p>
                    <p class="m-2 mt-5 mr-20 font-semibold">Spoken Languages</p>
                    <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-dark"
                      v-for="spokenLanguage in locumUser.locum_detail.spoken_languages"
                      :key="spokenLanguage.id + '-name2'">
                      {{spokenLanguage ? spokenLanguage.name:null}}
                    </p>
                    
                    <div class="h-32 mb-6 w-full overflow-auto">
                      <p class="m-2 mt-5 mr-20 font-semibold">Compliance Documents</p>
                    <div v-for="(specificComplianceDoc, index) in locumUser.locum_detail.compliance_documents"
                      :key="`${index}-${specificComplianceDoc.id}-`"
                      >
                        <a class="m-2 text-white" v-bind:href="specificComplianceDoc.file ? specificComplianceDoc.file.url:null">
                          <svgicon
                            name="cloud-download"
                            width="21"
                            height="21"
                            color="transparent white"
                          ></svgicon>
                          <span class="pb-2">{{specificComplianceDoc.compliance_document ? specificComplianceDoc.compliance_document.name:null}}</span>
                        </a>
                      </div>
                    <p class="m-2 mt-5 mr-20 font-semibold">Mandatory Training Documents</p>
                      <div v-for="(specificMandatoryDoc, index) in locumUser.locum_detail.mandatory_trainings"
                      :key="`${index}-${specificMandatoryDoc.id}-`"
                      >
                        <a class="m-2 text-white" v-bind:href="specificMandatoryDoc.file ? specificMandatoryDoc.file.url:null">
                          <svgicon
                            name="cloud-download"
                            width="21"
                            height="21"
                            color="transparent white"
                          ></svgicon>
                          <span class="pb-2">{{specificMandatoryDoc.mandatory_training ? specificMandatoryDoc.mandatory_training.name:null}}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- BODY -->
        <nuxt-child/>
      </div>
</template>
<script>
import { gmapApi } from 'vue2-google-maps'
export default {
  props:['job'],
  data(){
    return{
        locumUser:null
      }
  },
  async created(){
    console.log('job', this.job)
    if(this.job.platform_job.appointed_to_locum){
      await this.getLocum()
    }
  },
  computed: {
    google: gmapApi,
    latLangPlatform() {
      return this.job.platform_job.practice.surgery.address.coordinates
    },
    latLangPrivate() {
      return this.job.private_job.private_practice.surgery.address.coordinates
    },
  },
  methods: {
    async getLocum(){
      await this.$axios.$get(`/api/v1/admin/locum-users/${this.job.platform_job.appointed_to_locum.id}`).then(res=>{
        this.locumUser = res.data.user
      }).catch(err=>{
        console.log('get locum in job error!!!',err)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
      })
    },
    goTo(type) {
      const query = {
        ...this.$route.query,
        locum_jobs: type
      }
      this.$router.push({ query })
    }
  }
}
</script>