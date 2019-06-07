<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div style="width: calc(100% - 140px);" class="flex-1 flex-col self-end bg-trout overflow-auto">
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
          <div v-if="profileTab" class="inline-flex m-4">
            <div class="flex flex-wrap overflow-hidden">
              <div class="w-1/3 overflow-hidden">
                <div class="text-grey mx-5">
                  <p class="m-2">Name</p>
                  <p class="m-2 text-white">{{ locumUser.personal_detail ? locumUser.personal_detail.name : null }}</p>
                  <p class="m-2 mt-5 mr-20">Email address</p>
                  <p class="m-2 text-white underline">{{ locumUser.email ? locumUser.email : null }}</p>
                  <p class="m-2 mt-5 mr-20">Mobile phone number</p>
                  <p class="m-2 text-white">{{ locumUser.contact_detail ? locumUser.contact_detail.mobile_number : null }}</p>
                  <p class="m-2 mt-5 mr-20">Home / landline number</p>
                  <p class="m-2 text-white">{{ locumUser.contact_detail ? locumUser.contact_detail.home_number : null }}</p>
                  <p class="m-2 mt-5 mr-20">Postal Address</p>
                  <p class="ml-2 text-white">{{ locumUser.address_detail ? locumUser.address_detail.line_1 : null }}</p>
                  <p class="ml-2 mt-1 text-white">{{ locumUser.address_detail ? locumUser.address_detail.line_2 : null }}</p>
                  <p class="ml-2 mt-1 text-white">{{ locumUser.address_detail ? locumUser.address_detail.line_3 : null }}</p>
                  <p class="m-2 mt-5 mr-20">GMC Number</p>
                  <p class="m-2 text-white">{{ locumUser.locum_detail.gmc_or_nmc_number ? locumUser.locum_detail.gmc_or_nmc_number.number : null }}</p>
                  <p class="m-2 mt-5 mr-20">MPL / NPL Number</p>
                  <p class="m-2 text-white">{{ locumUser.locum_detail.mpl_or_npl_number ? locumUser.locum_detail.mpl_or_npl_number.number : null }}</p>
                  <p class="m-2 mt-5 mr-20">NHS Smart Card ID Number</p>
                  <p class="m-2 text-white">{{ locumUser.locum_detail.nhs_smart_card_id_number ? locumUser.locum_detail.nhs_smart_card_id_number : null }}</p>
                  <p class="m-2 mt-5 mr-20">Profession</p>
                  <p class="m-2 text-white">{{ locumUser.locum_detail.profession.profession_category ? locumUser.locum_detail.profession.profession_category.name : null }}</p>
                  <p class="m-2 mt-5 mr-20">Speciality</p>
                  <p class="inline-flex ml-2 rounded-lg text-xs text-black p-2 bg-yellow-dark">A&E</p>
                  <p class="m-2 mt-5 mr-20">Clinical Systems</p>
                  <p class="inline-flex ml-2 rounded-lg text-xs text-black p-2 bg-yellow-dark">Adastra</p>
                  <p class="m-2 mt-5 mr-20">Spoken Languages</p>
                  <p class="inline-flex ml-2 rounded-lg text-xs text-black p-2 bg-yellow-dark">English</p>
                </div>
              </div>
              <div class="w-1/3 overflow-hidden">
                <div class="text-grey mx-10">
                  <p class="m-2 mr-20">Headline</p>
                  <p class="m-2 text-white">{{locumUser.locum_detail?locumUser.locum_detail.headline:null}}</p>
                  <p class="m-2 mt-5 mr-20">Short Biography</p>
                  <p class="m-2 text-white">{{locumUser.locum_detail?locumUser.locum_detail.short_biography:null}}</p>
                  <p class="m-2 mt-5 mr-20">Special requirements</p>
                  <p class="ml-2 text-white">{{locumUser.locum_detail?locumUser.locum_detail.special_requirements:null}}</p>
                  <p class="m-2 mt-5 mr-20">Preferred rates</p>
                  <p class="ml-2 text-white">Per hour £ (none)</p>
                  <p class="ml-2 mt-1 text-white">Per session £ (none)</p>
                  <p class="m-2 mt-5 mr-20">Compliance Documents</p>
                  <nuxt-link v-for="(complianceDocument, index) in locumComplianceDocuments"
                   :key="`complianceDocument-${index}`"
                   :to="{ path: `/locums/${locumUser.id}`, query: $route.query }">
                   <p class="m-2 text-white">{{complianceDocument.compliance_document?complianceDocument.compliance_document.name:null}}</p>
                  </nuxt-link>
                  <p class="m-2 mt-5 mr-20">Other Documents</p>
                </div>
              </div>
              <div class="w-1/3 overflow-hidden">
                <div class="mx-20">
                  <img class="w-48 h rounded-full mr-4" src="~/assets/images/default-user-image.png" >
                  <p class="m-2 text-grey">Sign-up verified by email</p>
                  <p class="m-2 text-white">24/01/2019</p>
                  <p class="m-2 text-grey">Active at </p>
                  <p class="m-2 text-white">{{locumUser.actived_at ? $moment(locumUser.actived_at).format('MMM D, YYYY') :null}}</p>
                  <select
                    class="outline-none border-2 border-transparent text-xs text-black pr-6"
                    id="grid-state"
                    v-model="selectedStatus"
                  >
                    <option>Active</option>
                    <option>Disabled</option>
                  </select>
                  <button
                    class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow"
                    @click.prevent="changeLocumUserStatus(locumUser.id,selectedStatus)"
                  >Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- TABLE -->
        <div style="w-full">
          <div v-if="jobTab" class="flex flex-col">
            <!-- HEADER -->
            <div class="flex my-2">
              <div style="width: 20%;">
                <div class="flex text-white text-xs p-4">
                  <strong>Job number</strong>
                </div>
              </div>
              <div style="width: 15%;">
                <div class="flex text-white text-xs p-4">
                  <strong>Practice / Surgery</strong>
                </div>
              </div>
              <div style="width: 15%;">
                <div class="flex text-white text-xs p-4">
                  <strong>Title</strong>
                </div>
              </div>
              <div style="width: 16%;">
                <div class="flex text-white text-xs p-4">
                  <strong>From</strong>
                </div>
              </div>
              <div style="width: 16%;">
                <div class="flex text-white text-xs p-4">
                  <strong>To</strong>
                </div>
              </div>
              <div style="width: 16%;">
                <div class="flex text-white text-xs p-4">
                  <strong>Created</strong>
                </div>
              </div>
            </div>
            <!-- HEADER -->

            <!-- BODY -->
            <nuxt-link
              v-for="(locumUserCurrentJob, index) in locumUserCurrentJobs"
              :key="`compliance-${index}`"
              :to="`/compliances/select-locum`"
              class="flex no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light mt-2"
            >
              <div style="width: 20%;">
                <div class="flex text-white text-xs p-4">
                  <span>{{ locumUserCurrentJob.number }}</span>
                </div>
              </div>
              <div style="width: 15%;">
                <div class="flex text-white text-xs p-4">
                  <span>{{ locumUserCurrentJob.practice }}</span>
                </div>
              </div>
              <div style="width: 15%;">
                <div class="flex text-white text-xs p-4">
                  <span>{{ locumUserCurrentJob.title }}</span>
                </div>
              </div>
              <div style="width: 16%;">
                <div class="flex text-white text-xs p-4">
                  <span>{{ locumUserCurrentJob.from }}</span>
                </div>
              </div>
              <div style="width: 16%;">
                <div class="flex text-white text-xs p-4">
                  <span>{{ locumUserCurrentJob.to }}</span>
                </div>
              </div>
              <div style="width: 16%;">
                <div class="flex text-white text-xs p-4">
                  <span>{{ locumUserCurrentJob.createdAt }}</span>
                </div>
              </div>
            </nuxt-link>
            <!-- BODY -->
          </div>
        </div>
        <!-- TABLE -->
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
      selectedStatus:'',
      locumUser:null,
      profileTab: true,
      jobTab: false,
      locumComplianceDocuments:[],
      locumUserCurrentJobs:[],

    };
  },

  async asyncData({ app, route }) {
    try {
      console.log(route.params.id)
      let response = await app.$axios.get(`/api/v1/admin/locum-users/${route.params.id}`)
      const locumUser = response.data.data.user
      const locumComplianceDocuments = response.data.data.user.locum_detail.compliance_documents


      response = await app.$axios.get(`/api/v1/admin/locum-users/${route.params.id}/current-jobs`)
      const locumUserCurrentJobs = response.data.data.jobs
      

      return{
      locumUser,
      locumComplianceDocuments,
      locumUserCurrentJobs
      }

    } catch (err) {
      console.log("index practices index create asyncData err", err);
    }
  },

  methods:{
    async changeLocumUserStatus(locumID,activeDisabled){
      try{
        const response = this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/status',{
          status:activeDisabled
        })
        alert('Saved')
      }catch(err){
        console.log("index practices index put status err", err);
        alert('Something went wrong!!')
      }
    }
  }

};
</script>

