<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div style="width: calc(100%);" class="flex-1 flex-col self-end bg-trout overflow-auto">
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-6"> <!--GO BACK-->
        <nuxt-link :to="{path:`/practices/${jobPractice.id}/sessions/${jobStatus}`, query:$route.query}" class="text-white hover:text-yellow-dark p-1">
          <svgicon
            name="arrow-left-solid"
            height="22"
            width="22"
            class="hover:text-yellow-dark fill-current"
          />
        </nuxt-link>
      </div>
      <!-- HEADER -->
      <!-- BODY -->

      <div class="mx-6 overflow-hidden">
        <div class="flex">
         <p class="text-2xl text-white font-semibold">{{specificJob ? specificJob.title:null }}</p>
         <p class="text-black p-2 bg-yellow rounded ml-4">{{jobStatus}}</p><br>
        </div>
        <p class="text-white">{{"Posted On: "+specificJob.date_created}}</p>
        
        <div class="flex flex-wrap overflow-hidden">
          <!--JOB INFOS-->
            <div class="flex xs:flex-col my-2 mx-2 px-2 w-2/4 text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow ">
              <div class="inline-flex m-4">
                <div class="flex flex-wrap overflow-hidden">
                  <div class="w-1/2 overflow-hidden">
                    <div class="text-grey mx-5 text-white">
                      <p class="m-2 font-semibold">Job Number</p>
                      <p class="m-2 text-white">{{specificJob.job_number}}</p>
                      <p class="m-2 mt-5 font-semibold">Rate</p>
                      <p class="m-2 text-white">{{specificJob.rate ? "£ "+ specificJob.rate+" Per Hour":null +" Per Hour"}}</p>
                      <p class="m-2 mt-5 font-semibold">Total Hours</p>
                      <p class="m-2 text-white">{{specificJob.total_hours ? specificJob.total_hours+" Hours":null + " Hours"}}</p>
                      <p class="m-2 mt-5 font-semibold">Job Description</p>
                      <p class="m-2 text-white">{{specificJob.description}}</p>
                      <p class="m-2 mt-5 font-semibold">Extra Information</p>
                      <p class="m-2 text-white">{{specificJob.extra_information ? specificJob.extra_information:null }}</p>
                    </div>
                  </div>

                  <div class="w-1/2 overflow-hidden">
                    <div class="text-white mx-10">
                      <p class="m-2 mt-5 font-semibold">Duration</p>
                      <span class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-white">From</span>
                      <span class="text-sm text-white font-semibold">{{specificJob.date_start}}</span> <br><br>
                      <span class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-white">To</span>
                      <span class="text-sm text-white font-semibold">{{specificJob.date_end}}</span> <br><br>
                      <span class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-white">Shift</span>
                      <span class="text-sm text-white font-semibold">{{specificJob.shift.name}}</span> <br><br>
                      <p class="m-2 mt-5 font-semibold">Auto-assigns this job to the first applicant</p>
                      <div class="m-2 mt-5 text-white">
                        <span>This job is </span>
                        <span class="font-semibold">{{specificJob.platform_job.ir35 === true ? "INSIDE":"OUTSIDE"}}</span>
                        <span> of</span>
                        <span class="font-semibold">IR35</span> 
                      </div>
                      <p class="m-2 mt-5 font-semibold">Role</p>
                      <p class="m-2 text-white">{{specificJob.platform_job.profession.name}}</p>
                      <p class="m-2 mt-5 font-semibold">Speciality</p>
                      <p class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-yellow-dark"
                        v-for="specialty in qualifications"
                        :key="specialty.id + '-name'">
                        {{specialty ? specialty.name:null}}
                      </p>
                      <p class="m-2 mt-5 font-semibold">Clinical Systems</p>
                      <p class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-yellow-dark"
                        v-for="clinicalSystem in clinicalSystems"
                        :key="clinicalSystem.id + '-name1'">
                          {{clinicalSystem ? clinicalSystem.name:null}}
                      </p>
                      <p class="m-2 mt-5 font-semibold">Spoken Languages</p>
                      <p class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-yellow-dark"
                        v-for="spokenLanguage in spokenLanguages"
                        :key="spokenLanguage.id + '-name2'">
                        {{spokenLanguage ? spokenLanguage.name:null}}
                      </p>
                      <p class="m-2 mt-5 font-semibold">Compliance Documents</p>
                      <p class="m-2 mt-5 font-semibold">Mandatory Trainings</p>
                    </div>
                  </div>

                  <div class="w-full overflow-hidden">
                    <div class="m-2 text-white">
                      <p class="font-semibold">
                        Practice<br>
                        {{specificJob.platform_job.practice.surgery.name}}
                      </p>
                      <p>
                        {{specificJob.platform_job.practice.surgery.address.line_1}}
                        {{specificJob.platform_job.practice.surgery.address.line_2}}
                        {{specificJob.platform_job.practice.surgery.address.line_3}}
                      </p>
                    </div>
                  
                  <div class="w-full mx-2 ">
                    <!-- google map -->
                    <GmapMap
                      :center="{lat:latLang.y,lng:latLang.x}"
                      :zoom="15"
                      map-type-id="terrain"
                      class="w-full h-64"
                    >
                      <GmapMarker :position="google && new google.maps.LatLng(latLang.y, latLang.x)"/>
                    </GmapMap>
                  </div>
                </div>
                </div>
              </div>
            </div>
          <!--JOB INFOS ENDS HERE-->

          <!--LOCUM INFOS-->
            <div class="flex xs:flex-col my-2 mx-2 px-2 w-1/4 text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow text-white">
              <div class="inline-flex">
                <div class="flex flex-wrap overflow-hidden">
                   <div class="text-white mx-5">
                    <div class="flex flex-wrap -mx-2 ">
                      <div class="my-4 px-2 w-1/2 ">
                         <embed
                          class="flex w-4/5 rounded-full mr-4"
                            :src="locumUser.avatar ? locumUser.avatar.file.url:null"
                          >
                          <img v-if="!locumUser.avatar" class="w-48 rounded-full mr-4" src="~/assets/images/default-user-image.png" >
                      </div>

                      <div class="my-6  w-1/2 ">
                        <p class="text-white my-2 font-semibold text-base">{{locumUser.personal_detail ? locumUser.personal_detail.title:null}} {{locumUser.personal_detail.name}}</p>
                        <p class="text-white my-2 font-lighttext-sm">{{locumUser.locum_detail.profession.name}}</p>
                      </div>

                    </div>
                    <p class="m-2 font-semibold">Headline</p>
                    <p class="m-2 text-white">{{ locumUser.locum_detail ? locumUser.locum_detail.headline : null }}</p>
                    <p class="m-2 mt-5 mr-20 font-semibold">Biography</p>
                    <p class="m-2 text-white underline">{{ locumUser.locum_detail ? locumUser.locum_detail.short_biography : null }}</p>
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
                    <p class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-yellow-dark"
                      v-for="specialty in locumUser.locum_detail.qualifications"
                      :key="specialty.id + '-name'">
                      {{specialty ? specialty.name:null}}
                    </p> 
                    <p class="m-2 mt-5 mr-20 font-semibold">Clinical Systems</p>
                    <p class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-yellow-dark"
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
                    <!--DOCUMENTS-->
                    <div class="h-32 mb-6 overflow-auto">
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
                    <!--DOCUMENTS END HERE-->
                  </div>
                </div>
               
              </div>
              
            </div>
          <!--LOCUM INFOS END HERE-->
        </div>
      </div>
      <!-- BODY -->
       <nuxt-child/>
    </div>
  </div>
 
</template>

<script>
import { gmapApi } from 'vue2-google-maps'
export default {
  transition: "subpage",

  data() {
    return {
        specificJob:[],
        jobStatus:null,
        jobPractice:[],
        qualifications:[],
        clinicalSystems:[],
        spokenLanguages:[],
        complianceDocuments:[],
        mandatoryTrainings:[],
        locumUser:null
        
    };
  },

  async asyncData({ app, route }) {
    try {
        console.log("Route ID "+route.params.id)
        let response = await app.$axios.get(`/api/v1/admin/jobs/${route.params.locumJobId}`)

        const specificJob = response.data.data.job
        const jobStatus = specificJob.status 
        const jobPractice = specificJob.platform_job.practice
        const qualifications = specificJob.platform_job.qualifications
        const clinicalSystems = specificJob.platform_job.clinical_systems
        const spokenLanguages = specificJob.platform_job.spoken_languages
        const complianceDocuments = specificJob.platform_job.compliance_documents
        const mandatoryTrainings = specificJob.platform_job.mandatory_trainings

        const appointedToUserID = specificJob.platform_job.appointed_to_locum

        response = await app.$axios.get(`/api/v1/admin/locum-users/${appointedToUserID.user.id}`)
        const locumUser = response.data.data.user


        console.log(jobPractice)

        return{
            specificJob,
            jobStatus,
            jobPractice,
            qualifications,
            clinicalSystems,
            spokenLanguages,
            complianceDocuments,
            mandatoryTrainings,
            locumUser
            
        }

    } catch (err) {
      console.log("index practices index create asyncData err", err);
    }
  },
  computed: {
    google: gmapApi,
    latLang() {
      return this.specificJob.platform_job.practice.surgery.address.coordinates
    },
  },
  methods:{
  }

};
</script>
<style>
</style>
