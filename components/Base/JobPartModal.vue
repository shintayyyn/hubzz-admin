<template>
  <div class="m-6">
    <!-- HEADER -->
    <div v-if="!isNuxtChild" class="flex justify-between text-sm text-white">
      <div @click="$emit('close')" class="cursor-pointer">
        <svgicon name="arrow-left-solid" height="32" width="32" class="text-white hover:text-sunglow fill-current" />
      </div>
    </div>
    <div class="flex flex-wrap my-4">
      <div class="text-2xl text-white font-semibold mr-4">{{jobPart.job ? jobPart.job.title:null }}</div>
      <div class="flex">
        <div class="text-black p-2 bg-yellow-500 rounded">{{jobPart.status}}</div>
        <div class="text-black p-2 text-white rounded ml-4" :class="jobPart.job && jobPart.job.type == 'Platform'? 'bg-red-500':'bg-blue-500'">{{jobPart.job ? jobPart.job.type : null}}</div>
      </div>
    </div>
    <div class="flex flex-wrap">
      <div class="flex order-2 md:order-1 flex-wrap h-full xl:w-2/3 sm:w-full overflow-auto text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow">
        <!-- INFOS RIGHT -->
        <div class="xl:w-1/2 w-full overflow-hidden">
          <div class="m-4 mt-5 text-gray text-white">
            <p class="font-semibold">Job Part Number</p>
            <p class="text-white">{{jobPart.job_part_number}}</p>
            <p class="mt-5 font-semibold">Job Part</p>
            <p class="text-white">{{jobPart.part}} of {{jobPart.parts}}</p>
            <p class="mt-5 font-semibold">Rate</p>
            <p class="text-white no-underline">{{jobPart.job ? "£ "+jobPart.job.rate+" Per Hour":null +" Per Hour"}}</p>
            <p class="mt-5 font-semibold">Total Hours</p>
            <p class="text-white">{{jobPart.job ? jobPart.job.total_hours+" Hours":null + " Hours"}}</p>
            <p class="mt-5 font-semibold">Job Description</p>
            <p class="text-white">{{jobPart.job ? jobPart.job.description: 'N/A'}}</p>
          </div>
        </div>
        <!-- INFOS RIGHT -->
        <div class="text-white xl:w-1/2 w-full overflow-hidden">
          <div class="m-2 mt-5">
            <p class="font-semibold">Duration</p>
            <div class="flex items-center py-2 mx-2 text-sm">
              <span class="w-16 text-black"><span class="bg-white p-2 rounded-lg"> From </span></span>
              <span class="font-semibold">{{jobPart.date_start}}</span>
            </div>
            <div class="flex items-center py-2 mx-2 text-sm">
              <span class="w-16 text-black"><span class="bg-white p-2 rounded-lg"> To </span></span>
              <span class="font-semibold">{{jobPart.date_end}}</span>
            </div>
            <div class="flex items-center py-2 mx-2 text-sm">
              <span class="w-16 text-black"><span class="bg-white p-2 rounded-lg"> Shift </span></span>
              <span class="font-semibold">{{ jobPart.job ? jobPart.job.shift.name : null}}</span>
            </div>
            <p class="mt-5 font-semibold">Invoiced?</p>
            <p class="text-white">{{jobPart.invoiced ? 'Yes': 'No'}}</p>
            <p class="mt-5 font-semibold">Issued?</p>
            <p class="text-white">{{jobPart.issued ? 'Yes': 'No'}}</p>
            <!-- <div v-if="jobPart.job ? jobPart.job.platform_job : null">
              <div class="m-2 mt-5">
                <span>This job is </span>
                <span class="font-semibold">{{jobPart.job.platform_job.ir35 === true ? "INSIDE":"OUTSIDE"}}</span>
                <span> of</span>
                <span class="font-semibold">IR35</span> 
              </div>

              <p class="m-2 mt-5 font-semibold">Role</p>
              <p class="m-2 ">{{jobPart.job.platform_job.profession.name}}</p>

              <p class="m-2 mt-5 w-1/2 font-semibold">Speciality</p>
              <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                v-for="specialty in jobPart.job.platform_job.qualifications"
                :key="specialty.id + '-name'">
                {{specialty ? specialty.name:null}}
              </p>

              <p class="m-2 mt-5 w-1/2 font-semibold">Clinical Systems</p>
              <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                v-for="clinicalSystem in jobPart.job.platform_job.clinical_systems"
                :key="clinicalSystem.id + '-name1'">
                  {{clinicalSystem ? clinicalSystem.name:null}}
              </p>

              <p class="m-2 mt-5 w-1/2 font-semibold">Spoken Languages</p>
              <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500">
                English
              </p>
              <p class="inline-flex ml-2 mb-2 rounded-lg text-sm text-black p-2 bg-yellow-500"
                v-for="spokenLanguage in jobPart.job.platform_job.spoken_languages"
                :key="spokenLanguage.id + '-name2'">
                {{spokenLanguage ? spokenLanguage.name:null}}
              </p>

              <div v-if="jobPart.job.platform_job.compliance_documents.length > 0">
                <p class="flex ml-2 font-semibold">Compliance Requirements for GPs:</p>
                <div class="text-sm ml-4 mb-2" v-for="(gpComplianceDocs,index) in jobPart.job.platform_job.compliance_documents"
                  :key="`${index}-${gpComplianceDocs.name}`"
                  >
                    <span >{{gpComplianceDocs ? gpComplianceDocs.name:"(none)"}}</span> 
                </div>
              </div>

              <div v-if="jobPart.job.platform_job.mandatory_trainings.length > 0">
                <p class="flex ml-2 font-semibold">Mandatory Trainings</p>
                <div class="text-sm ml-4 mb-2" v-for="(mandatoryTrainings, index) in jobPart.job.platform_job.mandatory_trainings"
                  :key="`${index}-${mandatoryTrainings.name}`"
                  >
                    <span >{{mandatoryTrainings ? mandatoryTrainings.name:"(none)"}}</span> 
                </div>
              </div>
            </div>
            <div v-else-if="jobPart.job ? jobPart.job.private_job : null">
            </div> -->
          </div>
        </div>
        <!-- GOOGLE MAPS -->
        <div class="w-full m-2 md:m-4 overflow-hidden" v-if="jobPart.job ? jobPart.job.platform_job : null">
          <div class="text-white pb-2">
            <div class="font-semibold">
              Practice
              <p>{{jobPart.job ? jobPart.job.platform_job.practice.surgery.name : null}}</p>
            </div>
            <p>
              {{jobPart.job ? jobPart.job.platform_job.practice.surgery.address.line_1 : null}}
              {{jobPart.job ? jobPart.job.platform_job.practice.surgery.address.line_2 : null}}
              {{jobPart.job ? jobPart.job.platform_job.practice.surgery.address.line_3 : null}}
            </p>
          </div>
        
          <div class="w-full">
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
      </div>
      <div class="flex order-1 md:order-2 w-full xl:w-1/3">
        <div v-if="jobPart.job.job_parts.length > 0" class="py-2 md:py-0 md:mx-4 overflow-hidden w-full">
          <div class="mx-2 text-white font-semibold">Job Parts</div> 
            <div class="flex flex-col text-white">
              <nuxt-link 
                v-for="(item, index) in jobPart.job.job_parts"
                :to="item.id != specificJobPart.id && `/practices/${$route.params.id}/practice-sessions/practice-${item.status.toLowerCase()}-sessions/${item.id}`"
                :key="`item-${index}`"
                class="w-full flex flex-col md:flex-row rounded-lg bg-waterloo hover:bg-waterloo-light my-1 md:my-2 shadow-lg cursor-pointer border-l-8 p-4"
                :class="item.id === specificJobPart.id ? 'border-yellow-500':'border-waterloo-light md:border-0 md:pl-6'"
              >
                <div class="flex flex-col text-white leading-tight">
                  <strong class="block md:hidden text-sm uppercase">Job Part Number</strong>
                  <span class="">{{item.job_part_number}}</span>
                  <span class="">{{item.status}}</span>
                </div>
              </nuxt-link> 
            </div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import { gmapApi } from 'vue2-google-maps'
export default {
  props:['jobPartId', 'specificJobPart', 'isNuxtChild'],
  data(){
    return{
      jobPart: this.specificJobPart,
    }
  },
  created(){
    console.log('specific job part', this.specificJobPart)
  },  
  computed:{
    loadingPractices(){
      return this.$store.state.practices.loading_practices
    },
    google: gmapApi,
    latLangPlatform() {
      return this.specificJobPart.job.platform_job.practice.surgery.address.coordinates
    },
    latLangPrivate() {
      return this.specificJobPart.job.private_job.private_practice.surgery.address.coordinates
    },
  },
  methods:{
    async showJobPart(){
    }
  }
}
</script>
<style>

</style>