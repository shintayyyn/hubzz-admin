<template>
    <div>
        <!-- BODY -->
        <div class="m-8 my-4 overflow-auto">
          <div class="flex">
            <p class="text-2xl text-white font-semibold">{{job ? job.title:null }}</p>
            <p class="text-black p-2 bg-yellow-500 rounded ml-4">{{job.status}}</p><br>
            <p class="text-black p-2 text-white rounded ml-4" :class="job.type == 'Platform'? 'bg-red-500':'bg-blue-500'">{{job.type}}</p><br>
          </div>
          <p class="text-white">{{"Posted On: "+job.date_created}}</p>

          <div class="flex xs:flex-col mt-3 text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow">
            <div class="inline-flex m-4">
              <div class="flex flex-wrap overflow-hidden">
                <div class="xl:w-1/2 sm:w-full overflow-hidden">
                  <div class="text-gray text-white">
                    <p class="m-2 font-semibold">Job Number</p>
                    <p class="m-2 text-white">{{job.job_number}}</p>
                    <p class="m-2 mt-5 font-semibold">Rate</p>
                    <p class="m-2 text-white no-underline">{{job.rate ? "£ "+job.rate+" Per Hour":null +" Per Hour"}}</p>
                    <p class="m-2 mt-5 font-semibold">Total Hours</p>
                    <p class="m-2 text-white">{{job.total_hours ? job.total_hours+" Hours":null + " Hours"}}</p>
                    <p class="m-2 mt-5 font-semibold">Job Description</p>
                    <p class="m-2 text-white">{{job.description}}</p>
                    <p class="m-2 mt-5 font-semibold">Extra Information</p>
                    <p class="m-2 text-white">{{job.extra_information ? job.extra_information:null }}</p>
                  </div>
                </div>

                <div class="text-white xl:w-1/2 sm:w-full overflow-hidden">
                  <p class="m-2 mt-5 font-semibold">Duration</p>
                  <span class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-white">From</span>
                  <span class="text-sm text-white font-semibold">{{job.date_start}}</span> <br><br>
                  <span class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-white">To</span>
                  <span class="text-sm text-white font-semibold">{{job.date_end}}</span> <br><br>
                  <span class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-white">Shift</span>
                  <span class="text-sm text-white font-semibold">{{job.shift.name}}</span> <br><br>
                  <p class="m-2 mt-5 font-semibold">Auto-assigns this job to the first applicant</p>
                  
                  <div v-if="job.platform_job">
                    <div class="m-2 mt-5 text-white">
                      <span>This job is </span>
                      <span class="font-semibold">{{job.platform_job.ir35 === true ? "INSIDE":"OUTSIDE"}}</span>
                      <span> of</span>
                      <span class="font-semibold">IR35</span> 
                    </div>

                    <p class="m-2 mt-5 font-semibold">Role</p>
                    <p class="m-2 text-white">{{job.platform_job.profession.name}}</p>

                    <p class="m-2 mt-5 font-semibold">Speciality</p>
                    <p class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                      v-for="specialty in job.platform_job.qualifications"
                      :key="specialty.id + '-name'">
                      {{specialty ? specialty.name:null}}
                    </p>

                    <p class="m-2 mt-5 font-semibold">Clinical Systems</p>
                    <p class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                      v-for="clinicalSystem in job.platform_job.clinical_systems"
                      :key="clinicalSystem.id + '-name1'">
                        {{clinicalSystem ? clinicalSystem.name:null}}
                    </p>

                    <p class="m-2 mt-5 font-semibold">Spoken Languages</p>
                    <p class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                      v-for="spokenLanguage in job.platform_job.spoken_languages"
                      :key="spokenLanguage.id + '-name2'">
                      {{spokenLanguage ? spokenLanguage.name:null}}
                    </p>

                    <div v-if="job.platform_job.compliance_documents.length > 0">
                      <p class="flex">Compliance Requirements for GPs:</p>
                      <div class="text-white text-sm m-1 font-semibold" v-for="(gpComplianceDocs,index) in job.platform_job.compliance_documentss"
                        :key="`${index}-${gpComplianceDocs.name}`"
                        >
                          <span >{{gpComplianceDocs ? gpComplianceDocs.name:"(none)"}}</span> 
                      </div>
                    </div>

                    <div v-if="job.platform_job.mandatory_trainings.length > 0">
                      <p class="flex">Mandatory Trainings</p>
                      <div class="text-white text-sm m-1 font-semibold" v-for="(mandatoryTrainings, index) in job.platform_job.mandatory_trainings"
                        :key="`${index}-${mandatoryTrainings.name}`"
                        >
                          <span >{{mandatoryTrainings ? mandatoryTrainings.name:"(none)"}}</span> 
                      </div>
                    </div>
                  </div>

                  <div v-else-if="job.private_job">

                  </div>
                </div>
                <div class="w-full overflow-hidden" v-if="job.platform_job">
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
                      style="width: 100%; height:250px"
                    >
                      <GmapMarker :position="google && new google.maps.LatLng(latLangPlatform.y, latLangPlatform.x)"/>
                    </GmapMap>
                  </div>
                </div>
                <div class="w-full overflow-hidden" v-if="job.private_job">
                  <div class="m-2 text-white">
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
                
                  <div class="w-full mx-2 ">
                    <!-- google map -->
                    <GmapMap
                      :center="{lat:latLangPrivate.y,lng:latLangPrivate.x}"
                      :zoom="15"
                      map-type-id="terrain"
                      style="width: 100%; height:250px"
                    >
                      <GmapMarker :position="google && new google.maps.LatLng(latLangPrivate.y, latLangPrivate.x)"/>
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
</template>
<script>
import { gmapApi } from 'vue2-google-maps'
export default {
  props:['job'],
  created(){
    console.log('Tis is the job wthin the modal',this.job)
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