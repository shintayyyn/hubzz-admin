<template>
  <div>
    <!-- HEADER -->
    <div class="flex justify-between text-sm text-white py-2 px-6">
      <div @click="$emit('close')" class="cursor-pointer">
        <svgicon name="arrow-left-solid" height="32" width="32" class="text-white fill-current" />
      </div>
      
        <div class="flex flex-wrap h-full overflow-hidden text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow">

          <div class="xl:w-1/2 w-full overflow-hidden">
            <div class="m-4 mt-5 text-gray text-white">
              <p class="font-semibold">Job Part Number</p>
              <p class="text-white">{{specificJobPart.job_part_number}}</p>
              <p class="mt-5 font-semibold">Rate</p>
              <p class="text-white no-underline">{{specificJobPart.job ? "£ "+specificJobPart.job.rate+" Per Hour":null +" Per Hour"}}</p>
              <p class="mt-5 font-semibold">Total Hours</p>
              <p class="text-white">{{specificJobPart.job ? specificJobPart.job.total_hours+" Hours":null + " Hours"}}</p>
              <p class="mt-5 font-semibold">Job Description</p>
              <p class="text-white">{{specificJobPart.job ? specificJobPart.job.description: 'N/A'}}</p>
              <p class="mt-5 font-semibold">Extra Information</p>
              <p class="text-white">{{specificJobPart.job? specificJobPart.job.platform_job.extra_information : 'N/A'}}</p>
            </div>
          </div>

          <div class="text-white xl:w-1/2 w-full overflow-hidden">
            <div class="m-2 mt-5">
              <p class="font-semibold">Duration</p>
              <span class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-white">From</span>
              <span class="text-sm font-semibold">{{specificJobPart.job.date_start}}</span> <br><br>
              <span class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-white">To</span>
              <span class="text-sm font-semibold">{{specificJobPart.job.date_end}}</span> <br><br>
              <span class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-white">Shift</span>
              <span class="text-sm  ont-semibold">{{specificJobPart.job.shift.name}}</span> <br><br>
              <p class="m-2 mt-5 font-semibold">Auto-assigns this job to the first applicant</p>
              
              <div v-if="specificJobPart.job.platform_job">
                <div class="m-2 mt-5">
                  <span>This job is </span>
                  <span class="font-semibold">{{specificJobPart.job.platform_job.ir35 === true ? "INSIDE":"OUTSIDE"}}</span>
                  <span> of</span>
                  <span class="font-semibold">IR35</span> 
                </div>

                <p class="m-2 mt-5 font-semibold">Role</p>
                <p class="m-2 ">{{specificJobPart.job.platform_job.profession.name}}</p>

                <p class="m-2 mt-5 w-1/2 font-semibold">Speciality</p>
                <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                  v-for="specialty in specificJobPart.job.platform_job.qualifications"
                  :key="specialty.id + '-name'">
                  {{specialty ? specialty.name:null}}
                </p>

                <p class="m-2 mt-5 w-1/2 font-semibold">Clinical Systems</p>
                <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                  v-for="clinicalSystem in specificJobPart.job.platform_job.clinical_systems"
                  :key="clinicalSystem.id + '-name1'">
                    {{clinicalSystem ? clinicalSystem.name:null}}
                </p>

                <p class="m-2 mt-5 w-1/2 font-semibold">Spoken Languages</p>
                <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                  v-for="spokenLanguage in specificJobPart.job.platform_job.spoken_languages"
                  :key="spokenLanguage.id + '-name2'">
                  {{spokenLanguage ? spokenLanguage.name:null}}
                </p>

                <div v-if="specificJobPart.job.platform_job.compliance_documents.length > 0">
                  <p class="flex ml-2 font-semibold">Compliance Requirements for GPs:</p>
                  <div class="text-sm ml-4 mb-2" v-for="(gpComplianceDocs,index) in specificJobPart.job.platform_job.compliance_documents"
                    :key="`${index}-${gpComplianceDocs.name}`"
                    >
                      <span >{{gpComplianceDocs ? gpComplianceDocs.name:"(none)"}}</span> 
                  </div>
                </div>

                <div v-if="specificJobPart.job.platform_job.mandatory_trainings.length > 0">
                  <p class="flex ml-2 font-semibold">Mandatory Trainings</p>
                  <div class="text-sm ml-4 mb-2" v-for="(mandatoryTrainings, index) in specificJobPart.job.platform_job.mandatory_trainings"
                    :key="`${index}-${mandatoryTrainings.name}`"
                    >
                      <span >{{mandatoryTrainings ? mandatoryTrainings.name:"(none)"}}</span> 
                  </div>
                </div>
              </div>
              <div v-else-if="specificJobPart.job.private_job">
                
              </div>
            </div>
          </div>

          <!-- <div class="w-full m-4 overflow-hidden" v-if="job.platform_job">
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
              <GmapMap
                :center="{lat:latLangPlatform.y,lng:latLangPlatform.x}"
                :zoom="15"
                map-type-id="terrain"
                style="width: 100%; height:350px"
              >
                <GmapMarker :position="google && new google.maps.LatLng(latLangPlatform.y, latLangPlatform.x)"/>
              </GmapMap>
            </div>
          </div> -->

          <!-- <div class="w-full m-4 overflow-hidden" v-if="job.private_job">
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
              <GmapMap
                :center="{lat:latLangPrivate.y,lng:latLangPrivate.x}"
                :zoom="15"
                map-type-id="terrain"
                style="width: 100%; height:250px "
              >
                <GmapMarker :position="google && new google.maps.LatLng(latLangPrivate.y, latLangPrivate.x)"/>
              </GmapMap>
            </div>
          </div> -->
          
        </div>
      </div>
    </div>
    <!-- HEADER -->
  </div>
</template>
<script>
export default {
  props:['jobPartId'],
  data(){
    return{
      specificJobPart: '',
    }
  },
  async created(){

    console.log('part id', this.jobPartId)
    let response = await this.$axios.$get(`/api/v1/admin/job-parts/${this.jobPartId}`)
    console.log('job part response', response.data.job_part)
    this.specificJobPart = response.data.job_part

  },
  computed:{
     loadingPractices(){
        return this.$store.state.practices.loading_practices
      },
  }
}
</script>
<style>

</style>