<template>
  <div class="fixed lg:absolute top-0 bottom-0 right-0 left-0 flex flex-col overflow-auto">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
    <!--^Removed the ff code: style="width: calc(100% - 70px);" -->
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link :to="{path:`/locums/${locumUser.id}`,query: $route.query }" class="text-white p-1">
        <svgicon name="arrow-left-solid" height="32" width="32" class="text-white hover:text-sunglow fill-current"/>
        </nuxt-link>
      </div>
      <!-- HEADER -->
      <!-- BODY -->
      <div class="flex flex-wrap mx-6">
        <div class="my-1 px-1">
          <div class="my-2 rounded-lg">
            <nuxt-link
            class=" hover:bg-gray rounded-lg p-3 text-white text-sm no-underline"
            :to="{path:`/locums/${locumUser.id}`,query: $route.query}">
              <strong>Profile</strong>
            </nuxt-link>
          </div>
        </div>
        <div class="my-1 px-1">
          <div class="my-2 rounded-lg">
              <nuxt-link
              class="hover:bg-gray rounded-lg p-3 text-white text-sm no-underline"
              :to="{path:`/locums/${locumUser.id}/locum-jobs/Current`,query: $route.query}">
                <strong>Jobs</strong>
              </nuxt-link>
          </div>
        </div>
        <div class="my-1 px-1">
            <div class="my-2 rounded-lg">
              <nuxt-link
              class="bg-gray-dark border-white rounded-lg p-3 text-white text-sm no-underline"
              :to="{path:`/locums/${locumUser.id}/locum-compliance`,query: $route.query}" 
              :event="locumUser.compliance_status==='Empty' ? disabled : 'click'"
              :class="locumUser.compliance_status==='Empty' ? '' :'hover:bg-waterloo-light text-gray-dark'">
              <strong>{{locumUser.compliance_status === 'Empty'?'No Compliance Documents Uploaded':'Compliances'}}</strong>
              </nuxt-link>
          </div>
        </div>
      </div>
      <div class="px-6">
        <div
          class="flex lg:w-2/3 no-underline shadow-lg rounded-lg bg-waterloo mt-4 shadow"
          style="position:relative"
        >
            <div class="w-4/5 overflow-hidden text-sm m-4">
              <div class="text-gray">
                <p class="m-2">
                  Name <span class="m-2 text-white">{{ locumUser.personal_detail ? locumUser.personal_detail.name : null }}</span>
                </p>
                <p class="m-2">
                  Email address <span class="m-2 text-white">{{ locumUser ? locumUser.email : null }}</span>
                </p>
                <p class="m-2">
                  Mobile phone number <span class="m-2 text-white">{{ locumUser.contact_detail ? locumUser.contact_detail.mobile_number : null }}</span> 
                </p>
                <p class="m-2">
                  Home phone number <span class="m-2 text-white">{{ locumUser.contact_detail ? locumUser.contact_detail.home_number : null }}</span>
                </p>
              </div>
              <div class="text-white">
              </div>
            </div>
            <div class="w-1/5 overflow-hidden text-sm m-4 pt-6">
              <!-- <svgicon
                class="float-right"
                name="chevron-right"
                width="48"
                height="48"
                color="white"
                ></svgicon> -->
            </div>
        </div>
        <!--GMC / NMC NUMBER-->
          <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center lg:w-2/3 px-6 py-4 text-sm text-white shadow-lg rounded-lg bg-waterloo mt-3">
            <div class="flex w-full sm:w-1/2 sm:justify-between">
              <p class="text-gray">GMC / NMC Number</p>
              <p class="mx-3 sm:mx-0">{{ locumUser.locum_detail.gmc_or_nmc_number ? locumUser.locum_detail.gmc_or_nmc_number.number : null }}</p>
            </div>
            <div class="flex w-full sm:w-1/2 justify-end mt-2 sm:m-0">
              <button
                class="w-1/2 sm:w-auto text-white text-sm mr-2 p-2 px-4 border border-white focus:bg-green rounded-full hover:bg-green-300"
                :class="`${locumUser.locum_detail.gmc_or_nmc_number.status === 'Verified' ? 'bg-green border-green text-white px-4 hover:bg-green-300 text-center ' : 'bg-transparent px-2 hover:bg-green-300'}`"
                v-if="locumUser.locum_detail.gmc_or_nmc_number.status"
                @click.prevent="toPutGmcNmc(locumUser.locum_detail.gmc_or_nmc_number.status,locumUser.id,'Verified')"
              >Verified</button>
              <button
                class="w-1/2 sm:w-auto text-white text-sm ml-2 p-2 px-4 border border-white focus:bg-yellow rounded-full hover:bg-yellow-300"
                :class="`${locumUser.locum_detail.gmc_or_nmc_number.status === 'Rejected' ? 'bg-yellow border-yellow text-white px-4 hover:bg-yellow-300 ' : 'bg-transparent px-2 hover:bg-yellow-300'}`"
                v-if="locumUser.locum_detail.gmc_or_nmc_number.status"
                @click.prevent="toPutGmcNmc(locumUser.locum_detail.gmc_or_nmc_number.status,locumUser.id,'Rejected')"
              >Rejected</button>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center lg:w-2/3 px-6 py-4 text-sm text-white shadow-lg rounded-lg bg-waterloo mt-3">
            <div class="flex w-full sm:w-1/2 sm:justify-between">
              <p class="text-gray">MPL / NPL Number</p>
              <p class="mx-3 sm:mx-0">{{ locumUser.locum_detail.mpl_or_npl_number ? locumUser.locum_detail.mpl_or_npl_number.number : null }}</p>
            </div>
            <div class="flex w-full sm:w-1/2 justify-end mt-2 sm:m-0">
              <button
                class="w-1/2 sm:w-auto text-white text-sm mr-2 p-2 px-4 border border-white focus:bg-green rounded-full hover:bg-green-300"
                :class="`${locumUser.locum_detail.mpl_or_npl_number.status === 'Verified' ? 'bg-green border-green text-white px-4 hover:bg-green-300' : 'bg-transparent px-2 hover:bg-green-300'}`"
                v-if="locumUser.locum_detail.mpl_or_npl_number.status"
                @click.prevent="toPutMplNpl(locumUser.locum_detail.mpl_or_npl_number.status,locumUser.id,'Verified')"
              >Verified</button>
              <button
                class="w-1/2 sm:w-auto text-white text-sm ml-2 p-2 px-4 border border-white focus:bg-yellow rounded-full hover:bg-yellow-300"
                :class="`${locumUser.locum_detail.mpl_or_npl_number.status === 'Rejected' ? 'bg-yellow border-yellow text-white px-4 hover:bg-yellow-300' : 'bg-transparent px-2 hover:bg-yellow-300'}`"
                v-if="locumUser.locum_detail.mpl_or_npl_number.status"
                @click.prevent="toPutMplNpl(locumUser.locum_detail.mpl_or_npl_number.status,locumUser.id,'Rejected')"
              >Rejected</button>
            </div>
          </div>
        <!--GMC / NMC NUMBER ENDS HERE-->
<!-- MANDATORY -->
        <p class="text-sm text-white pt-8 font-semibold">Mandatory</p>
        <!-- TABLE RESPONSIVE-->
        <div class="w-full lg:w-2/3 table border-separate" style="border-spacing: 0 10px;"> 
          <!-- HEADER -->
          <div class="hidden md:table-row font-bold text-white text-sm py-4"> 
            <div class="table-cell p-2 align-middle">Title</div> 
            <div class="table-cell p-2 align-middle">File size</div>
            <div class="table-cell p-2 align-middle">File uploaded</div>
            <div class="table-cell p-2 align-middle">Expiry Date</div>
            <div class="table-cell p-2 align-middle">Date to expire</div>
            <div class="table-cell p-2 align-middle">Status</div>
          </div>
          <!-- END HEADER -->
          <!-- BODY -->
          <nuxt-link
            v-for="(mandatoryComplianceDocument, index) in mandatoryComplianceDocuments" :key="`mandatoryComplianceDocument-${index}`"
            :event="mandatoryComplianceDocument.locumMandatoryComplianceDocument==null ? disabled :'click'" 
            :class="mandatoryComplianceDocument.locumMandatoryComplianceDocument==null? '':'hover:bg-waterloo-light' "
            :to="{path:`/locums/${locumUser.id}/locum-compliance/view-file/compliance-doc/${mandatoryComplianceDocument.locumMandatoryComplianceDocument ? mandatoryComplianceDocument.locumMandatoryComplianceDocument.id : null }`, query: $route.query}"
            class="flex flex-col sm:flex-row sm:flex-wrap justify-between px-2 py-2 mt-2 md:table-row text-white no-underline shadow-lg rounded-lg bg-waterloo" 
            draggable="false"
          >
            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
              <strong class="block md:hidden text-sm uppercase">Title</strong>
              <span class="break-word">{{ mandatoryComplianceDocument.mandatoryComplianceDocument.name }}</span>
            </div>

            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
              <strong class="block md:hidden text-sm uppercase">File size</strong>
              <span>{{ mandatoryComplianceDocument.locumMandatoryComplianceDocument ? 
                    (mandatoryComplianceDocument.locumMandatoryComplianceDocument.file.size / 1048576).toFixed(2) + 'Mb' : null }}
                  </span>
            </div>

            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
              <strong class="block md:hidden text-sm uppercase">File uploaded</strong>
               <span>{{ mandatoryComplianceDocument.locumMandatoryComplianceDocument &&
                    mandatoryComplianceDocument.locumMandatoryComplianceDocument.file &&
                    mandatoryComplianceDocument.locumMandatoryComplianceDocument.file.created_at ? 
                    $moment(mandatoryComplianceDocument.locumMandatoryComplianceDocument.file.created_at)
                    .format('DD/MM/YYYY HH:mm:ss') : null }}</span>
            </div>

            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
              <strong class="block md:hidden text-sm uppercase">Expiry Date</strong>
              <span class="break-all">{{ mandatoryComplianceDocument.locumMandatoryComplianceDocument && 
                    mandatoryComplianceDocument.locumMandatoryComplianceDocument.expired_at ? 
                    $moment(mandatoryComplianceDocument.locumMandatoryComplianceDocument.expired_at)
                    .format('DD/MM/YYYY')  : null }}</span>
            </div>

            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
              <strong class="block md:hidden text-sm uppercase">Date to expire</strong>
              <span class="break-all">{{ mandatoryComplianceDocument.locumMandatoryComplianceDocument && 
                    mandatoryComplianceDocument.locumMandatoryComplianceDocument.expired_at ? 
                    $moment(mandatoryComplianceDocument.locumMandatoryComplianceDocument.expired_at)
                    .diff($moment(), 'days')  : null }}</span>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center sm:w-1/2 md:w-auto md:table-cell pl-1 pr-4 py-2 md:py-4 align-middle">
              <strong class="block md:hidden">Status</strong>
               <div
                v-if="mandatoryComplianceDocument.locumMandatoryComplianceDocument == null"
                class="text-center text-white text-sm py-2 px-8 sm:mx-2 border border-white bg-transparent rounded-full">
                  <span>Empty</span>
                </div>
                <div
                v-if="mandatoryComplianceDocument.locumMandatoryComplianceDocument"
                class="text-center text-black text-sm py-2 sm:mx-2 border border-white rounded-full"
                :class="statusStyle(mandatoryComplianceDocument.locumMandatoryComplianceDocument && mandatoryComplianceDocument.locumMandatoryComplianceDocument.status ? mandatoryComplianceDocument.locumMandatoryComplianceDocument.status:null)">
                <span>
                  {{mandatoryComplianceDocument.locumMandatoryComplianceDocument && mandatoryComplianceDocument.locumMandatoryComplianceDocument.status ? mandatoryComplianceDocument.locumMandatoryComplianceDocument.status:null}}
                </span>
                </div>
            </div>

          </nuxt-link>
          <!-- END BODY -->
        </div>
        <!-- END TABLE -->  
<!-- OPTIONAL -->
        <p class=" text-sm text-white pt-8 font-semibold">Optional</p>
        <!-- TABLE RESPONSIVE-->
        <div class="w-full lg:w-2/3 table border-separate" style="border-spacing: 0 10px;"> 
          <!-- HEADER -->
          <div class="hidden md:table-row font-bold text-white text-sm py-4"> 
            <div class="table-cell p-2 align-middle">Title</div> 
            <div class="table-cell p-2 align-middle">File size</div>
            <div class="table-cell p-2 align-middle">File uploaded</div>
            <div class="table-cell p-2 align-middle">Expiry Date</div>
            <div class="table-cell p-2 align-middle">Date to expire</div>
            <div class="table-cell p-2 align-middle">Status</div>
          </div>
          <!-- END HEADER -->
          <!-- BODY -->
          <nuxt-link
            v-for="(optionalComplianceDocument, index) in optionalComplianceDocuments" :key="`optionalComplianceDocument-${index}`"
            :event="optionalComplianceDocument.locumOptionalComplianceDocument==null ? disabled :'click'"
            :class="optionalComplianceDocument.locumOptionalComplianceDocument==null ? '':'hover:bg-waterloo-light'"
            :to="{path:`/locums/${locumUser.id}/locum-compliance/view-file/compliance-doc/${optionalComplianceDocument.locumOptionalComplianceDocument ? optionalComplianceDocument.locumOptionalComplianceDocument.id : null }`, query: $route.query}"
            class="flex flex-col sm:flex-row sm:flex-wrap justify-between px-2 py-2 mt-2 md:table-row text-white no-underline shadow-lg rounded-lg bg-waterloo" 
            draggable="false"
          >
            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
              <strong class="block md:hidden text-sm uppercase">Title</strong>
              <span class="break-word">{{ optionalComplianceDocument.optionalComplianceDocument.name }}</span>
            </div>

            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
              <strong class="block md:hidden text-sm uppercase">File size</strong>
              <span>
                {{ optionalComplianceDocument.locumOptionalComplianceDocument ? (optionalComplianceDocument.locumOptionalComplianceDocument.file.size / 1048576).toFixed(2) + ' Bytes' : null }}
              </span>
            </div>

            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
              <strong class="block md:hidden text-sm uppercase">File uploaded</strong>
               <span>{{ optionalComplianceDocument.locumOptionalComplianceDocument ? 
                      $moment(optionalComplianceDocument.locumOptionalComplianceDocument.file.created_at)
                      .format('DD/MM/YYYY HH:mm:ss') : null }}</span>
            </div>

            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
              <strong class="block md:hidden text-sm uppercase">Expiry Date</strong>
              <span class="break-all">{{ optionalComplianceDocument.locumOptionalComplianceDocument && 
                      optionalComplianceDocument.locumOptionalComplianceDocument.expired_at ? 
                      $moment(optionalComplianceDocument.locumOptionalComplianceDocument.expired_at)
                      .format('DD/MM/YYYY')  : null }}</span>
            </div>

            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
              <strong class="block md:hidden text-sm uppercase">Date to expire</strong>
              <span class="break-all">{{ optionalComplianceDocument.locumOptionalComplianceDocument &&
                      optionalComplianceDocument.locumOptionalComplianceDocument.expired_at ? 
                      $moment(optionalComplianceDocument.locumOptionalComplianceDocument.expired_at)
                      .diff($moment(), 'days')  : null }}</span>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center sm:w-1/2 md:w-auto md:table-cell pl-1 pr-4 py-2 md:py-4 align-middle">
              <strong class="block md:hidden">Status</strong>
               <div
                v-if="optionalComplianceDocument.locumOptionalComplianceDocument == null"
                class="text-center text-white text-sm py-2 px-8 sm:mx-2 border border-white bg-transparent rounded-full">
                  <span>Empty</span>
                </div>
                <div
                v-if="optionalComplianceDocument.locumOptionalComplianceDocument"
                class="text-center text-black text-sm py-2 sm:mx-2 border border-white rounded-full"
                :class="statusStyle(optionalComplianceDocument.locumOptionalComplianceDocument ? optionalComplianceDocument.locumOptionalComplianceDocument.status: null)">
                <span>
                  {{ optionalComplianceDocument.locumOptionalComplianceDocument ? optionalComplianceDocument.locumOptionalComplianceDocument.status: null }}
                </span>
                </div>
            </div>

          </nuxt-link>
          <!-- END BODY -->
        </div>
        <!-- END TABLE -->

<!-- MANDATORY TRAININGS -->
        <p class=" text-sm text-white pt-8 font-semibold">Mandatory Trainings (Optional) </p>
        <!-- TABLE RESPONSIVE-->
        <div class="w-full lg:w-2/3 table border-separate" style="border-spacing: 0 10px;"> 
          <!-- HEADER -->
          <div v-if="!locumMandatoryTrainings.length === 0" class="hidden md:table-row font-bold text-white text-sm py-4"> 
            <div class="table-cell p-2 align-middle">Title</div> 
            <div class="table-cell p-2 align-middle">File size</div>
            <div class="table-cell p-2 align-middle">File uploaded</div>
            <div class="table-cell p-2 align-middle">Expiry Date</div>
            <div class="table-cell p-2 align-middle">Date to expire</div>
            <div class="table-cell p-2 align-middle">Status</div>
          </div>
          <div v-else>
            <div class="text-white m-4 ml-8">No mandatory trainings uploded</div>
          </div>
          <!-- END HEADER -->
          <!-- BODY -->
          <nuxt-link
            v-for="(locumMandatoryTraining, index) in locumMandatoryTrainings" :key="`locumMandatoryTraining-${index}`"
            :event="locumMandatoryTraining==null ? disabled :'click'" 
            :class="locumMandatoryTraining==null? '':' hover:bg-waterloo-light' "
            :to="{path:`/locums/${locumUser.id}/locum-compliance/view-file/mandatory-training/${locumMandatoryTraining ? locumMandatoryTraining.id : null }`, query: $route.query}"
            class="flex flex-col sm:flex-row sm:flex-wrap justify-between px-2 py-2 mt-2 md:table-row text-white no-underline shadow-lg rounded-lg bg-waterloo" 
            draggable="false"
          >
            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
              <strong class="block md:hidden text-sm uppercase">Title</strong>
              <span class="break-word">{{ locumMandatoryTraining.mandatory_training.name }}</span>
            </div>

            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
              <strong class="block md:hidden text-sm uppercase">File size</strong>
              <span>
                {{ locumMandatoryTraining && locumMandatoryTraining.file ? (locumMandatoryTraining.file.size / 1048576).toFixed(2) + ' Bytes' : null }}
              </span>
            </div>

            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
              <strong class="block md:hidden text-sm uppercase">File uploaded</strong>
               <span>{{ locumMandatoryTraining &&
                    locumMandatoryTraining.file &&
                    locumMandatoryTraining.file.created_at ? 
                    $moment(locumMandatoryTraining.file.created_at)
                    .format('DD/MM/YYYY HH:mm:ss') : null }}</span>
            </div>

            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
              <strong class="block md:hidden text-sm uppercase">Expiry Date</strong>
              <span class="break-all">{{ locumMandatoryTraining && 
                    locumMandatoryTraining.expired_at ? 
                    $moment(locumMandatoryTraining.expired_at)
                    .format('DD/MM/YYYY')  : null }}</span>
            </div>

            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
              <strong class="block md:hidden text-sm uppercase">Date to expire</strong>
              <span class="break-all">{{ locumMandatoryTraining && 
                    locumMandatoryTraining.expired_at ? 
                    $moment(locumMandatoryTraining.expired_at)
                    .diff($moment(), 'days')  : null }}</span>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center sm:w-1/2 md:w-auto md:table-cell pl-1 pr-4 py-2 md:py-4 align-middle">
              <strong class="block md:hidden">Status</strong>
                <div
                class="text-center text-black text-sm py-2 px-4 lg:px-8 sm:mx-2 border border-white rounded-full"
                :class="`${locumMandatoryTraining ? 'bg-green border-green text-white':'bg-transparent text-white' }`">
                  <span>{{ locumMandatoryTraining ? 
                    'Compliant' : 'Empty' }}</span>
                </div>
            </div>

          </nuxt-link>
          <!-- END BODY -->
        </div>
        <!-- END TABLE -->
        
        <nuxt-child/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  transition: "subpage",
  data() {
    return {
      locumUser: null,
      mandatoryComplianceDocuments:[],
      optionalComplianceDocuments:[],
      locumMandatoryTrainings:[],
      disabled:'true',
    };
  },

  async asyncData({ app, route }) {
    try {
      let response = await app.$axios.get(`/api/v1/admin/locum-users/${route.params.id}`)
      const locumUser = response.data.data.user
      const professionCategoryid = locumUser.locum_detail.profession.profession_category.id
      const locumMandatoryTrainings = locumUser.locum_detail.mandatory_trainings
  
      response = await app.$axios.get(`/api/v1/profession-categories/${professionCategoryid}`)
      const professionCategory = response.data.data.profession_category

      response = await app.$axios.get(`/api/v1/admin/mandatory-trainings`)
      
      const mandatoryComplianceDocuments = professionCategory.mandatory_compliance_documents.map((mandatoryComplianceDocument) => {
        const locumMandatoryComplianceDocument = locumUser.locum_detail.compliance_documents.find((complianceDocument) => {
          return complianceDocument.compliance_document.id === mandatoryComplianceDocument.id
        })
        return {
          mandatoryComplianceDocument,
          locumMandatoryComplianceDocument
        }
      })
      const optionalComplianceDocuments = professionCategory.optional_compliance_documents.map((optionalComplianceDocument) => {
        const locumOptionalComplianceDocument = locumUser.locum_detail.compliance_documents.find((complianceDocument) => {
          return complianceDocument.compliance_document.id === optionalComplianceDocument.id
        })
        return {
          optionalComplianceDocument,
          locumOptionalComplianceDocument
        }
      })

      // const locumMandatoryTrainings = mandatoryTrainings.map((locumMandatoryTraining)=>{
      // const locumOptionalMandatoryTraining = locumUser.locum_detail.mandatory_trainings.find((locumMandatoryTraining)=>{
      //   return locumMandatoryTraining.mandatory_training.id === locumMandatoryTraining.id
      // })
      //   return{
      //     locumMandatoryTraining,
      //     locumOptionalMandatoryTraining
      //   }
      // })

      return{
        locumUser,
        mandatoryComplianceDocuments,
        optionalComplianceDocuments,
        locumMandatoryTrainings
      }
    } catch (err) {
      console.log("index practices index create asyncData err", err);
    }
  },
 
  methods:{
    showConfirmationModal(){
      this.confirmationModal = false;
    },

    async toPutGmcNmc(currentStatus,locumID,verifyReject){
      try{
        if(currentStatus === 'Pending'){
          const response = await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
            status:verifyReject
          })
          // alert('Saved')
        this.locumUser.locum_detail.gmc_or_nmc_number.status = response.data.data.user.locum_detail.gmc_or_nmc_number.status
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved' })

        }else if(currentStatus === 'Verified' && verifyReject ==='Rejected'){
          const response = await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
            status:verifyReject
          })
          // alert('Saved.')
        this.locumUser.locum_detail.gmc_or_nmc_number.status = response.data.data.user.locum_detail.gmc_or_nmc_number.status
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved' })

        }else if(currentStatus === 'Rejected' && verifyReject ==='Verified'){
          const response = await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
            status:verifyReject
          })
          // alert('Saved.')
        this.locumUser.locum_detail.gmc_or_nmc_number.status = response.data.data.user.locum_detail.gmc_or_nmc_number.status
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved' })

        }else if(currentStatus === 'Verified' && verifyReject ==='Verified'){
          const response = await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
            status:'Pending'
          })
          // alert('Saved. Status reverted back to pending')
        this.locumUser.locum_detail.gmc_or_nmc_number.status = response.data.data.user.locum_detail.gmc_or_nmc_number.status
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved. Status reverted back to pending' })

        }else if(currentStatus === 'Rejected' && verifyReject ==='Rejected'){
          const response = await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
            status:'Pending'
          })
          // alert('Saved. Status reverted back to pending')
        this.locumUser.locum_detail.gmc_or_nmc_number.status = response.data.data.user.locum_detail.gmc_or_nmc_number.status
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved. Status reverted back to pending' })
        }
      
      }catch(err){
        alert('Something went wrong!!')
        console.log("index practices index put GMC/NMC err", err);
        
      }
    },

    async toPutMplNpl(currentStatus,locumID, verifyReject){
      try{
        if(currentStatus === 'Pending'){
           const response = await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
            status:verifyReject
          })
          // alert('Saved')
        this.locumUser.locum_detail.mpl_or_npl_number.status = response.data.data.user.locum_detail.mpl_or_npl_number.status
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved' })

        }else if(currentStatus === 'Verified' && verifyReject ==='Rejected'){
          const response = await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
            status:verifyReject
          })
          // alert('Saved.')
        this.locumUser.locum_detail.mpl_or_npl_number.status = response.data.data.user.locum_detail.mpl_or_npl_number.status
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved' })

        }else if(currentStatus === 'Rejected' && verifyReject ==='Verified'){
          const response = await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
            status:verifyReject
          })
          // alert('Saved.')
        this.locumUser.locum_detail.mpl_or_npl_number.status = response.data.data.user.locum_detail.mpl_or_npl_number.status
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved' })

        }else if(currentStatus === 'Verified' && verifyReject ==='Verified'){
          const response = await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
            status:'Pending'
          })
          // alert('Saved. Status reverted back to pending')
        this.locumUser.locum_detail.mpl_or_npl_number.status = response.data.data.user.locum_detail.mpl_or_npl_number.status
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved. Status reverted back to pending' })

        }else if(currentStatus === 'Rejected' && verifyReject ==='Rejected'){
          const response = await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
            status:'Pending'
          })
          // alert('Saved. Status reverted back to pending')
        this.locumUser.locum_detail.mpl_or_npl_number.status = response.data.data.user.locum_detail.mpl_or_npl_number.status
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved. Status reverted back to pending' })

        }

      }catch(err){
        alert('Something went wrong!!')
        console.log("index practices index put MPL/NPL err", err);
      }
    },

    statusStyle(status){
			switch(status){
				case 'Approved':
					return 'bg-green border-green text-white lg:px-8 sm:px-4'
					break;
				case 'Expiring':
					return 'bg-yellow border-yellow text-black lg:px-8 sm:px-4'
					break;
				case 'Expired':
					return 'bg-red border-red text-white lg:px-8 sm:px-4'
					break;
				case 'Rejected':
					return 'bg-yellow-dark border-yellow text-black lg:px-8 sm:px-4'
          break;
        case 'Pending':
					return 'bg-yellow border-yellow text-black lg:px-8 sm:px-4'
					break;
				default:
					return
			}
		},
  }
};
</script>
<style>
  .md\:table-cell:first-child{
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  .md\:table-cell:last-child{
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  @media(min-width: 450px){
  .right-side-header-content{
    width: calc(100% - 0px);
  }
  }
  .page-overlap{
    min-width: 100%;
  }
  
  @media screen and (min-width: 768px){
    .page-overlap{
    min-width: calc(100% - 70px);
    }
  }

  @media screen and (min-width: 1200px) {
    .page-overlap{
      min-width: calc(100% - 200px);
    }
  }
</style>