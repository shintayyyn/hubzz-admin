<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div style="width: calc(100%);" class="flex-1 flex-col self-end bg-trout overflow-auto">
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
          <div class="flex flex-wrap">
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                class="bg-grey-dark hover:bg-grey rounded-lg p-3 text-white text-sm"
                :to="{path:`/locums/${locumUser.id}`,query: $route.query}">
                  <strong>Profile</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                  <nuxt-link
                  class="hover:bg-grey rounded-lg p-3 text-white text-sm"
                  :to="{path:`/locums/${locumUser.id}/locum-jobs/Current`,query: $route.query}">
                    <strong>Jobs</strong>
                  </nuxt-link>
              </div>
            </div>
          </div>

        <div class="flex xs:flex-col mt-3 text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow">
          <div v-if="profileTab" class="inline-flex m-4">
            <div class="flex flex-wrap overflow-hidden">
              <!--COLUMN 1-->
              <div class="w-1/3 overflow-hidden">
                <div class="text-grey mx-5">
                  <p class="m-2 font-semibold">Name</p>
                  <p class="m-2 text-white">{{ locumUser.personal_detail ? locumUser.personal_detail.name : null }}</p>
                  <p class="m-2 mt-5 mr-20 font-semibold">Email address</p>
                  <p class="m-2 text-white underline">{{ locumUser.email ? locumUser.email : null }}</p>
                  <p class="m-2 mt-5 mr-20 font-semibold">Mobile phone number</p>
                  <p class="m-2 text-white">{{ locumUser.contact_detail ? locumUser.contact_detail.mobile_number : null }}</p>
                  <p class="m-2 mt-5 mr-20 font-semibold">Home / landline number</p>
                  <p class="m-2 text-white">{{ locumUser.contact_detail ? locumUser.contact_detail.home_number : null }}</p>
                  <p class="m-2 mt-5 mr-20 font-semibold">Postal Address</p>
                  <p class="ml-2 text-white">{{ locumUser.address_detail ? locumUser.address_detail.address.line_1 : null }}</p>
                  <p class="ml-2 mt-1 text-white">{{ locumUser.address_detail ? locumUser.address_detail.address.line_2 : null }}</p>
                  <p class="ml-2 mt-1 text-white">{{ locumUser.address_detail ? locumUser.address_detail.address.line_3 : null }}</p>
                  <p class="m-2 mt-5 mr-20 font-semibold">GMC / NMC Number</p>
                  <p class="m-2 text-white">{{ locumUser.locum_detail.gmc_or_nmc_number ? locumUser.locum_detail.gmc_or_nmc_number.number : null }}</p>
                  <p class="m-2 mt-5 mr-20 font-semibold">MPL / NPL Number</p>
                  <p class="m-2 text-white">{{ locumUser.locum_detail.mpl_or_npl_number ? locumUser.locum_detail.mpl_or_npl_number.number : null }}</p>
                  <p class="m-2 mt-5 mr-20 font-semibold">NHS Smart Card ID Number</p>
                  <p class="m-2 text-white">{{ locumUser.locum_detail.nhs_smart_card_id_number ? locumUser.locum_detail.nhs_smart_card_id_number : null }}</p>
                  <p class="m-2 mt-5 mr-20 font-semibold">Profession</p>
                  <p class="m-2 text-white">{{ locumUser.locum_detail.profession ? locumUser.locum_detail.profession.name : null }}</p>
                  <p class="m-2 mt-5 mr-20 font-semibold">Speciality</p>
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
              <!--COLUMN 2-->
              <div class="w-1/3 overflow-hidden">
                <div class="text-grey mx-10">
                  <p class="m-2 mr-20 font-semibold">Headline</p>
                  <p class="m-2 text-white">{{locumUser.locum_detail?locumUser.locum_detail.headline:null}}</p>
                  <p class="m-2 mt-5 mr-20 font-semibold">Short Biography</p>
                  <p class="m-2 text-white">{{locumUser.locum_detail?locumUser.locum_detail.short_biography:null}}</p>
                  <p class="m-2 mt-5 mr-20 font-semibold">Special requirements</p>
                  <p class="ml-2 text-white">{{locumUser.locum_detail?locumUser.locum_detail.special_requirements:null}}</p>
                  <p class="m-2 mt-5 mr-20 font-semibold">Preferred rates</p>
                  <p class="ml-2 text-white">Per hour £ (none)</p>
                  <p class="ml-2 mt-1 text-white">Per session £ (none)</p>
                  <p class="m-2 mt-5 mr-20 font-semibold">Compliance Documents</p>

                  <div v-for="(specificComplianceDoc, index) in specificLocumCompDocs"
                   :key="`${index}-${specificComplianceDoc.id}-`"
                  >
                    <a class="m-2 text-white" v-bind:href="specificComplianceDoc.locumSpecificCompDoc ? specificComplianceDoc.locumSpecificCompDoc.file.url:null">
                      <svgicon
                        name="cloud-download"
                        width="21"
                        height="21"
                        color="transparent white"
                      ></svgicon>
                      <span class="pb-2">{{specificComplianceDoc.locumSpecificCompDoc ? specificComplianceDoc.locumSpecificCompDoc.compliance_document.name:null}}</span>
                    </a>
                  </div>
                  
                  <p class="m-2 mt-5 mr-20 font-semibold">Mandatory Training Documents</p>

                  <div v-for="(specificLocumMandatoryTraining, index) in specificLocumMandatoryTrainings"
                   :key="`${index}-${specificLocumMandatoryTraining.id}-`"
                  >
                    <a class="m-2 text-white" v-bind:href="specificLocumMandatoryTraining.file ? specificLocumMandatoryTraining.file.url:null">
                      <svgicon
                        name="cloud-download"
                        width="21"
                        height="21"
                        color="transparent white"
                      ></svgicon>
                      <span class="pb-2">{{specificLocumMandatoryTraining.mandatory_training ? specificLocumMandatoryTraining.mandatory_training.name:null}}</span>
                    </a>
                  </div>
                </div>
              </div>
              <!--COLUMN 3-->
              <div class="w-1/3 overflow-hidden">
                <div class="mx-20">
                  <img class="w-48 rounded-full mr-4" src="~/assets/images/default-user-image.png" >
                  <p class="m-2 text-grey">Sign-up verified by email</p>
                  <p class="m-2 text-white">24/01/2019</p>
                  <p class="m-2 text-grey">Active at </p>
                  <p class="m-2 text-white">{{locumUser.actived_at ? $moment(locumUser.actived_at).format('MMM D, YYYY') :null}}</p>
                  <select
                    class="outline-none border-2 border-transparent text-sm text-black pr-6"
                    id="grid-state"
                    v-model="selectedStatus"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Deactivated</option>
                    <option>Suspended</option>
                  </select>
                  <button
                    class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow"
                    @click.prevent="changeLocumUserStatus(locumUser.id,selectedStatus)"
                  >Save</button>
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
      locumUser:null,
      selectedStatus:'',
      profileTab: true,
      jobTab: false,
      locumUserComplianceDocuments:[],
      locumUserCurrentJobs:[],
      qualifications:[],
      clinicalSystems:[],
      spokenLanguages:[],
      specificLocumCompDocs:[],
      specificLocumMandatoryTrainings:[]
    };
  },

  async asyncData({ app, route }) {
    try {
      console.log(route.params.id)
      let response = await app.$axios.get(`/api/v1/admin/locum-users/${route.params.id}`)
      const locumUser = response.data.data.user
      const locumUserComplianceDocuments = locumUser.locum_detail.compliance_documents
      const qualifications = locumUser.locum_detail.qualifications
      const clinicalSystems = locumUser.locum_detail.clinical_systems
      const spokenLanguages = locumUser.locum_detail.spoken_languages

      response = await app.$axios.get(`/api/v1/admin/locum-detail-compliance-documents`)
      const locumCompDoc = response.data.data.locum_detail_compliance_documents

      const specificLocumCompDocs = locumUserComplianceDocuments.map((specificComplianceDoc)=>{
        const locumSpecificCompDoc = locumCompDoc.find((complianceDoc)=>{
          return complianceDoc.id === specificComplianceDoc.id
        })
        return{
          specificComplianceDoc,
          locumSpecificCompDoc
        }
      })

      const specificLocumMandatoryTrainings = locumUser.locum_detail.mandatory_trainings
      console.log(specificLocumMandatoryTrainings)

      response = await app.$axios.get(`/api/v1/admin/jobs`)
      const allJobs = response.data.data.jobs

      const locumUserCurrentJobs = allJobs.filter((locumsAppointed)=>{
        return locumsAppointed.appointed_to_locum_detail_id === locumUser.locum_detail.id
      })      

      return{
      locumUser,
      locumUserComplianceDocuments,
      qualifications,
      clinicalSystems,
      spokenLanguages,
      specificLocumCompDocs,
      specificLocumMandatoryTrainings,
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

