s<template>
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

      <div class="mx-6 overflow-auto">
        <div class="flex">
         <p class="text-2xl text-white font-semibold">{{specificJob.platform_job ? specificJob.platform_job.title:null }}</p>
         <p class="text-black p-2 bg-yellow rounded ml-4">{{jobStatus}}</p><br>
        </div>
        <p class="text-white">{{"Posted On: "+specificJob.platform_job.date_created}}</p>
        <div class="flex xs:flex-col mt-3 text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow">
          <div class="inline-flex m-4">
            <div class="flex flex-wrap overflow-hidden">
              <div class="w-1/2 overflow-hidden">
                <div class="text-grey mx-5 text-white">
                  <p class="m-2 font-semibold">Job Number</p>
                  <p class="m-2 text-white">{{specificJob.job_number}}</p>
                  <p class="m-2 mt-5 font-semibold">Rate</p>
                  <p class="m-2 text-white">{{specificJob.platform_job.rate ? "£ "+ specificJob.platform_job.rate+" Per Hour":null +" Per Hour"}}</p>
                  <p class="m-2 mt-5 font-semibold">Total Hours</p>
                  <p class="m-2 text-white">{{specificJob.platform_job.total_hours ? specificJob.platform_job.total_hours+" Hours":null + " Hours"}}</p>
                  <p class="m-2 mt-5 font-semibold">Job Description</p>
                  <p class="m-2 text-white">{{specificJob.platform_job.description}}</p>
                  <p class="m-2 mt-5 font-semibold">Extra Information</p>
                  <p class="m-2 text-white">{{specificJob.platform_job.extra_information ? specificJob.platform_job.extra_information:null }}</p>
                </div>
              </div>

              <div class="w-1/2 overflow-hidden">
                <div class="text-white mx-10">
                  <p class="m-2 mt-5 font-semibold">Duration</p>
                  <span class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-white">From</span>
                  <span class="text-sm text-white font-semibold">{{specificJob.platform_job.date_start}}</span> <br><br>
                  <span class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-white">To</span>
                  <span class="text-sm text-white font-semibold">{{specificJob.platform_job.date_end}}</span> <br><br>
                  <span class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-white">Shift</span>
                  <span class="text-sm text-white font-semibold">{{specificJob.platform_job.shift.name}}</span> <br><br>
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
                    style="width: 100%; height:200px"
                  >
                    <GmapMarker :position="google && new google.maps.LatLng(latLang.y, latLang.x)"/>
                  </GmapMap>
                </div>
            </div>
            </div>
          </div>
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
        mandatoryTrainings:[]
        
    };
  },

  async asyncData({ app, route }) {
    try {
        console.log("Route ID "+route.params.id)
        let response = await app.$axios.get(`/api/v1/admin/jobs/${route.params.jobId}`)

        const specificJob = response.data.data.job

        const jobStatus = specificJob.status 
        const jobPractice = specificJob.platform_job.practice
        const qualifications = specificJob.platform_job.qualifications
        const clinicalSystems = specificJob.platform_job.clinical_systems
        const spokenLanguages = specificJob.platform_job.spoken_languages
        const complianceDocuments = specificJob.platform_job.compliance_documents
        const mandatoryTrainings = specificJob.platform_job.mandatory_trainings

        console.log(jobPractice)

        return{
            specificJob,
            jobStatus,
            jobPractice,
            qualifications,
            clinicalSystems,
            spokenLanguages,
            complianceDocuments,
            mandatoryTrainings
            
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
