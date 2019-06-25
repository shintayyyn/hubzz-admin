<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div style="width: calc(100%);" class="flex-1 flex-col self-end bg-trout overflow-auto">
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-6"> <!--GO BACK-->
        <nuxt-link :to="{path:`/locums/${locumUser.id}/locum-jobs`, query:$route.query}" class="text-white hover:text-yellow-dark p-1">
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
        </div>

        <div class="flex xs:flex-col mt-3 text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow">
          <div class="inline-flex m-4">
            <div class="flex flex-wrap overflow-hidden">
              <div class="w-1/2 overflow-hidden">
                <div class="text-grey mx-5">
                  <p class="m-2">Job Number</p>
                  <p class="m-2 text-white">{{specificJob.job_number}}</p>
                  <p class="m-2 mt-5 mr-20">Rate</p>
                  <p class="m-2 text-white underline">{{"£"+specificJob.platform_job ? specificJob.platform_job.rate:null +" Per Hour"}}</p>
                  <p class="m-2 mt-5 mr-20">Total Hours</p>
                  <p class="m-2 text-white">{{specificJob.platform_job.total_hours + " Hours"}}</p>
                  <p class="m-2 mt-5 mr-20">Job Description</p>
                  <p class="m-2 text-white">{{specificJob.platform_job.description}}</p>
                  <p class="m-2 mt-5 mr-20">Extra Information</p>
                  <p class="ml-2 text-white">{{   }}</p>
                 <p class="m-2 mt-5 mr-20">Speciality</p>
                  <p class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-yellow-dark"
                    v-for="specialty in qualifications"
                    :key="specialty.id + '-name'">
                    {{specialty ? specialty.name:null}}
                  </p>
                  <p class="m-2 mt-5 mr-20">Clinical Systems</p>
                  <p class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-yellow-dark"
                    v-for="clinicalSystem in clinicalSystems"
                    :key="clinicalSystem.id + '-name1'">
                      {{clinicalSystem ? clinicalSystem.name:null}}
                  </p>
                  <p class="m-2 mt-5 mr-20">Spoken Languages</p>
                  <p class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-yellow-dark"
                    v-for="spokenLanguage in spokenLanguages"
                    :key="spokenLanguage.id + '-name2'">
                    {{spokenLanguage ? spokenLanguage.name:null}}
                  </p>
                </div>
              </div>
              <div class="w-1/2 overflow-hidden">
                <div class="text-grey mx-10">
                  <p class="m-2 mr-20">Practice</p>
                  <p class="m-2 text-white">
                    {{specificJob.platform_job.practice.surgery.name}} <br><br>
                    {{specificJob.platform_job.practice.surgery.address.line_1}}<br><br>
                    {{specificJob.platform_job.practice.surgery.address.line_2}}<br><br>
                    {{specificJob.platform_job.practice.surgery.address.line_3}}<br><br>
                  </p>
                  <div class="mt-4 mx-2 ">
                    <!-- google map -->
                    <GmapMap
                      :center="{lat:latLang.x, lng:latLang.y}"
                      :zoom="15"
                      map-type-id="terrain"
                      style="width: 400px; height:300px"
                    >
                      <GmapMarker :position="google && new google.maps.LatLng(latLang.x, latLang.y)"/>
                    </GmapMap>
                  </div>
                  <p class="m-2 mt-5 mr-20">Duration</p>
                  <span class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-white">From</span>
                  <span class="text-sm text-white font-semibold">{{specificJob.platform_job.date_start}}</span> <br><br>
                  <span class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-white">To</span>
                  <span class="text-sm text-white font-semibold">{{specificJob.platform_job.date_end}}</span> <br><br>
                  <span class="inline-flex ml-2 rounded-lg text-sm text-black p-2 bg-white">Shift</span>
                  <span class="text-sm text-white font-semibold">{{specificJob.platform_job.shift.name}}</span> <br><br>
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
        locumUser:[],
        qualifications:[],
        clinicalSystems:[],
        spokenLanguages:[],
    };
  },

  async asyncData({ app, route }) {
    try {
        console.log("Route ID "+route.params.id)
        let response = await app.$axios.get(`/api/v1/admin/jobs/${route.params.jobId}`)

        const specificJob = response.data.data.job
        const locumUserID = specificJob.platform_job.appointed_to_locum.user.id

        response = await app.$axios.get(`/api/v1/admin/locum-users/${locumUserID}`)
        const locumUser = response.data.data.user
        const qualifications = locumUser.locum_detail.qualifications
        const clinicalSystems = locumUser.locum_detail.clinical_systems
        const spokenLanguages = locumUser.locum_detail.spoken_languages

        return{
            specificJob,
            locumUser,
            qualifications,
            clinicalSystems,
            spokenLanguages
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
