<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div style="width: calc(100% - 70px);" class="flex-1 flex-col self-end bg-trout overflow-auto">
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-6"> <!--GO BACK-->
        <nuxt-link to="/locums" class="text-white hover:text-yellow-dark p-1">
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
          <button
            @click="profileTab = true, jobTab = false"
            class="rounded-lg border-2 border-transparent text-xs text-white p-3 mr-2 focus:bg-waterloo"
          >Profile</button>
          <button
            @click="jobTab = true, profileTab = false"
            class="rounded-lg border-2 border-transparent text-xs text-white p-3 focus:bg-waterloo"
          >Jobs</button>
        </div>

        <div class="flex xs:flex-col mt-3 text-xs no-underline shadow-lg rounded-lg bg-waterloo shadow">
          <div class="inline-flex m-4">
            <div class="flex flex-wrap overflow-hidden">
              <div class="w-1/3 overflow-hidden">
                <div class="text-grey mx-5">
                  <p class="m-2">Job Number</p>
                  <p class="m-2 text-white">{{specificJob.job_number}}</p>
                  <p class="m-2 mt-5 mr-20">Rate</p>
                  <p class="m-2 text-white underline">{{specificJob.platform_job.rate}}</p>
                  <p class="m-2 mt-5 mr-20">Total Hours</p>
                  <p class="m-2 text-white">{{specificJob.platform_job.total_hours}}</p>
                  <p class="m-2 mt-5 mr-20">Job Description</p>
                  <p class="m-2 text-white">{{  }}</p>
                  <p class="m-2 mt-5 mr-20">Extra Information</p>
                  <p class="ml-2 text-white">{{   }}</p>
                  <p class="m-2 mt-5 mr-20">Specialty</p>
                  <p class="m-2 text-white">{{ }}</p>
                  <p class="m-2 mt-5 mr-20">Clinical Systems</p>
                  <p class="inline-flex ml-2 rounded-lg text-xs text-black p-2 bg-yellow-dark">
                      {{}}
                  </p>
                  <p class="m-2 mt-5 mr-20">Spoken Languages</p>
                  <p class="inline-flex ml-2 rounded-lg text-xs text-black p-2 bg-yellow-dark">
                    {{}}
                  </p>
                </div>
              </div>
              <div class="w-1/3 overflow-hidden">
                <div class="text-grey mx-10">
                  <p class="m-2 mr-20">Practice</p>
                  <p class="m-2 text-white">{{}}</p>
                  <p class="m-2 mt-5 mr-20">Short Biography</p>
                  <p class="m-2 text-white">{{}}</p>
                  <p class="m-2 mt-5 mr-20">Special requirements</p>
                  <p class="ml-2 text-white">{{}}</p>
                  <p class="m-2 mt-5 mr-20">Preferred rates</p>
                  <p class="ml-2 text-white">Per hour £ (none)</p>
                  <p class="ml-2 mt-1 text-white">Per session £ (none)</p>
                  <p class="m-2 mt-5 mr-20">Compliance Documents</p>
                  
                  <p class="m-2 mt-5 mr-20">Other Documents</p>
                </div>
              </div>
              <div class="w-1/3 overflow-hidden">
                <div class="mx-20">
                  <img class="w-48 h rounded-full mr-4" src="~/assets/images/default-user-image.png" >
                  <p class="m-2 text-grey">Sign-up verified by email</p>
                  <p class="m-2 text-white">24/01/2019</p>
                  <p class="m-2 text-grey">Active at </p>
                  <p class="m-2 text-white">{{ }}</p>
                  <select
                    class="outline-none border-2 border-transparent text-xs text-black pr-6"
                    id="grid-state"
                  >
                    <option>Active</option>
                    <option>Disabled</option>
                  </select>
               
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
export default {
  transition: "subpage",

  data() {

    return {
        specificJob:[]
    };
  },

  async asyncData({ app, route }) {
    try {
        let response = await app.$axios.get(`/api/v1/admin/jobs/${route.params.id}`)
        const specificJob = response.data.data.job

        console.log(specificJob)

        return{
            specificJob
        }

    } catch (err) {
      console.log("index practices index create asyncData err", err);
    }
  },

  methods:{
  }

};
</script>

