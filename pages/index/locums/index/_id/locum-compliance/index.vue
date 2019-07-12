<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col overflow-auto">
    <div style="width: calc(100%);" class="flex-1 flex flex-col self-end bg-trout">
    <!--^Removed the ff code: style="width: calc(100% - 70px);" -->
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link :to="{path:`/locums/${locumUser.id}`,query: $route.query }" class="text-white p-1">
        <svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
        </nuxt-link>
      </div>
      <!-- HEADER -->

      <!-- CONFIRMATION MODAL -->
      <!-- <div
        class="h-full w-full flex flex-col absolute"
        :style="`z-index: ${confirmationModal ? 100 : -100}; opacity: ${confirmationModal ? 1 : 0};`"
      >
        <div class="flex flex-col self-center py-2 px-24 rounded-lg bg-sunglow">
          <div>
            <span class="text-sm p-2">Proceed to sign-out?</span>
          </div>
          <div class="flex">
            <button class="p-2 text-sm rounded-lg border border-white mx-1 shadow" @click="logout">Yes</button>
            <button
              class="p-2 text-sm rounded-lg border border-white mx-1 shadow"
              @click="confirmationModal = false"
            >Cancel</button>
          </div>
        </div> 
      </div>-->
      <!-- CONFIRMATION MODAL ENDS HERE-->


      <!-- BODY -->
      <div class="flex flex-wrap ml-6">
        <div class="my-1 px-1">
          <div class="my-2 rounded-lg">
            <nuxt-link
            class=" hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
            :to="{path:`/locums/${locumUser.id}`,query: $route.query}">
              <strong>Profile</strong>
            </nuxt-link>
          </div>
        </div>
        <div class="my-1 px-1">
          <div class="my-2 rounded-lg">
              <nuxt-link
              class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
              :to="{path:`/locums/${locumUser.id}/locum-jobs/Current`,query: $route.query}">
                <strong>Jobs</strong>
              </nuxt-link>
          </div>
        </div>
        <div class="my-1 px-1">
            <div class="my-2 rounded-lg">
            <nuxt-link
            class="bg-grey-dark border-white rounded-lg p-3 text-white text-sm no-underline"
            :to="{path:`/locums/${locumUser.id}/locum-compliance`,query: $route.query}"
            :event="locumUser.compliance_status==='Empty' ? disabled : 'click'"
            :class="locumUser.compliance_status==='Empty' ? '' :'hover:bg-waterloo-light text-grey-dark'">
              <strong>{{locumUser.compliance_status === 'Empty'?'No Compliance Documents Uploaded':'Compliances'}}</strong>
            </nuxt-link>
          </div>
        </div>
      </div>
      <nuxt-link
        :to="{path:`/locums/${locumUser.id}`, query: $route.query}"
        class="flex lg:w-1/2 no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light mx-6 mt-4 shadow"
        style="position:relative; cursor: pointer;"
      >
          <div class="w-4/5 overflow-hidden text-sm m-4">
            <div class="text-grey">
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
          <div class="w-1/5 overflow-hidden text-sm m-4 pl-24 pt-6 ">
             <svgicon
                name="chevron-right"
                width="48"
                height="48"
                color="white"
              ></svgicon>
          </div>
      </nuxt-link>
    <!--GMC / NMC NUMBER-->
     <div class="flex flex-row lg:w-1/2 text-sm text-white shadow-lg rounded-lg bg-waterloo mx-6 mt-3">
        <p class="m-4 text-grey">GMC / NMC Number</p>
        <p class="m-3 mt-4 ">{{ locumUser.locum_detail.gmc_or_nmc_number ? locumUser.locum_detail.gmc_or_nmc_number.number : null }}</p>
        <button
          class="inline-flex text-white text-sm m-2 p-2 border border-white focus:bg-green rounded-full hover:bg-green-light"
          :class="`${locumUser.locum_detail.gmc_or_nmc_number.status === 'Verified' ? 'bg-green border-green text-white px-4 hover:bg-green-light' : 'bg-transparent px-2 hover:bg-green-light'}`"
					v-if="locumUser.locum_detail.gmc_or_nmc_number.status"
          @click.prevent="toPutGmcNmc(locumUser.locum_detail.gmc_or_nmc_number.status,locumUser.id,'Verified')"
        >Verified</button>
        <button
          class="inline-flex text-white text-sm m-2 p-2 border border-white focus:bg-orange rounded-full hover:bg-orange-light"
          :class="`${locumUser.locum_detail.gmc_or_nmc_number.status === 'Rejected' ? 'bg-orange border-orange text-white px-4 hover:bg-orange-light ' : 'bg-transparent px-2 hover:bg-orange-light'}`"
					v-if="locumUser.locum_detail.gmc_or_nmc_number.status"
          @click.prevent="toPutGmcNmc(locumUser.locum_detail.gmc_or_nmc_number.status,locumUser.id,'Rejected')"
        >Rejected</button>
      </div>

      <div class="flex flex-row lg:w-1/2 text-sm text-white shadow-lg rounded-lg bg-waterloo mx-6 mt-3">
        <p class="m-4 text-grey">MPL / NPL Number</p>
        <p class="m-4">{{ locumUser.locum_detail.mpl_or_npl_number ? locumUser.locum_detail.mpl_or_npl_number.number : null }}</p>
        <button
          class="inline-flex text-white text-sm m-2 p-2 border border-white focus:bg-green rounded-full hover:bg-green-light"
          :class="`${locumUser.locum_detail.mpl_or_npl_number.status === 'Verified' ? 'bg-green border-green text-white px-4 hover:bg-green-light' : 'bg-transparent px-2 hover:bg-green-light'}`"
					v-if="locumUser.locum_detail.mpl_or_npl_number.status"
          @click.prevent="toPutMplNpl(locumUser.locum_detail.mpl_or_npl_number.status,locumUser.id,'Verified')"
        >Verified</button>
        <button
          class="inline-flex text-white text-sm m-2 p-2 border border-white focus:bg-orange rounded-full hover:bg-orange-light"
          :class="`${locumUser.locum_detail.mpl_or_npl_number.status === 'Rejected' ? 'bg-orange border-orange text-white px-4 hover:bg-orange-light' : 'bg-transparent px-2 hover:bg-orange-light'}`"
					v-if="locumUser.locum_detail.mpl_or_npl_number.status"
          @click.prevent="toPutMplNpl(locumUser.locum_detail.mpl_or_npl_number.status,locumUser.id,'Rejected')"
        >Rejected</button>
      </div>
      <!--GMC / NMC NUMBER ENDS HERE-->

      <p class=" text-sm text-white pt-8 px-8 font-semibold">Mandatory</p>
      <!-- TABLE -->
      <div style="lg:w-1/2 ">
        <div class="flex lg:w-1/2 flex-col mx-6">
          <!-- HEADER -->
          <div class="flex my-2">
            <div style="width: 25%;">
              <div class="flex text-white text-sm p-4">
                <strong>Title</strong>
              </div>
            </div>
            <div style="width: 10%;">
              <div class="flex text-white text-sm p-4">
                <strong>File size</strong>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-sm p-4">
                <strong>File uploaded</strong>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-sm p-4">
                <strong>Expiry date</strong>
              </div>
            </div>
            <div style="width:15%;">
              <div class="flex text-white text-sm p-4">
                <strong>Days to expire</strong>
              </div>
            </div>
            <div style="width: 10%;">
              <div class="flex text-white text-sm p-4">
                <strong>Status</strong>
              </div>
            </div>
          </div>
          <!-- HEADER -->

          <!-- BODY -->
          <nuxt-link
            v-for="(mandatoryComplianceDocument, index) in mandatoryComplianceDocuments" :key="`mandatoryComplianceDocument-${index}`"
            :event="mandatoryComplianceDocument.locumMandatoryComplianceDocument==null ? disabled :'click'" 
            :class="mandatoryComplianceDocument.locumMandatoryComplianceDocument==null? '':' hover:bg-waterloo-light' "
            :to="{path:`/locums/${locumUser.id}/locum-compliance/view-file/compliance-doc/${mandatoryComplianceDocument.locumMandatoryComplianceDocument ? mandatoryComplianceDocument.locumMandatoryComplianceDocument.id : null }`, query: $route.query}"
            class="flex no-underline shadow-lg rounded-lg bg-waterloo my-2"
          >
            <div style="width: 25%;">
              <div class="flex text-white text-sm p-4">
                <span>{{mandatoryComplianceDocument.mandatoryComplianceDocument.name}}</span>
              </div>
            </div>
            <div style="width: 10%;">
              <div class="flex text-white text-sm p-4">
                <span>{{ mandatoryComplianceDocument.locumMandatoryComplianceDocument ? 
                  (mandatoryComplianceDocument.locumMandatoryComplianceDocument.file.size / 1048576).toFixed(2) + 'Mb' : null }}
                </span>

            
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-sm p-4">
                <span>{{ mandatoryComplianceDocument.locumMandatoryComplianceDocument &&
                   mandatoryComplianceDocument.locumMandatoryComplianceDocument.file &&
                  mandatoryComplianceDocument.locumMandatoryComplianceDocument.file.created_at ? 
                  $moment(mandatoryComplianceDocument.locumMandatoryComplianceDocument.file.created_at)
                  .format('DD/MM/YYYY HH:mm:ss') : null }}</span>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-sm p-4">
                <span>{{ mandatoryComplianceDocument.locumMandatoryComplianceDocument && 
                  mandatoryComplianceDocument.locumMandatoryComplianceDocument.expired_at ? 
                  $moment(mandatoryComplianceDocument.locumMandatoryComplianceDocument.expired_at)
                  .format('DD/MM/YYYY')  : null }}</span>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-sm p-4">
                <span>{{ mandatoryComplianceDocument.locumMandatoryComplianceDocument && 
                  mandatoryComplianceDocument.locumMandatoryComplianceDocument.expired_at ? 
                  $moment(mandatoryComplianceDocument.locumMandatoryComplianceDocument.expired_at)
                  .diff($moment(), 'days')  : null }}</span>
              </div>
            </div>
            <div style="width: 10%;">
              <div
              v-if="mandatoryComplianceDocument.locumMandatoryComplianceDocument == null"
              class="inline-flex text-white text-sm mt-2 py-2 p-3 border border-white bg-transparent rounded-full">
                <span>Empty</span>
              </div>
              <div
               v-if="mandatoryComplianceDocument.locumMandatoryComplianceDocument"
              class="inline-flex text-black text-sm mt-2 py-2 p-3 border border-white rounded-full"
              :class="`${mandatoryComplianceDocument.locumMandatoryComplianceDocument &&
               mandatoryComplianceDocument.locumMandatoryComplianceDocument.status &&
               mandatoryComplianceDocument.locumMandatoryComplianceDocument.status === 'Approved' ? 'bg-green border-green text-white':'bg-yellow border-yellow text-black' }`">
                <span>{{mandatoryComplianceDocument.locumMandatoryComplianceDocument && mandatoryComplianceDocument.locumMandatoryComplianceDocument.status ? mandatoryComplianceDocument.locumMandatoryComplianceDocument.status:null}}</span>
              </div>
            </div>
          </nuxt-link>
          <!-- BODY -->
        </div>
      </div>
      <!-- TABLE -->

      <p class=" text-sm text-white pt-8 px-8 font-semibold">Optional</p>
      <!-- TABLE -->
      <div style="lg:w-1/2 ">
        <div class="flex lg:w-1/2 flex-col mx-6">
          <!-- HEADER -->
          <div class="flex my-2">
            <div style="width: 25%;">
              <div class="flex text-white text-sm p-4">
                <strong>Title</strong>
              </div>
            </div>
            <div style="width: 10%;">
              <div class="flex text-white text-sm p-4">
                <strong>File size</strong>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-sm p-4">
                <strong>File uploaded</strong>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-sm p-4">
                <strong>Expiry date</strong>
              </div>
            </div>
            <div style="width:15%;">
              <div class="flex text-white text-sm p-4">
                <strong>Days to expire</strong>
              </div>
            </div>
            <div style="width: 10%;">
              <div class="flex text-white text-sm p-4">
                <strong>Status</strong>
              </div>
            </div>
          </div>
          <!-- HEADER -->

          <!-- BODY -->
         <nuxt-link
            v-for="(optionalComplianceDocument, index) in optionalComplianceDocuments" :key="`optionalComplianceDocument-${index}`"
            :event="optionalComplianceDocument.locumOptionalComplianceDocument==null ? disabled :'click'"
            :class="optionalComplianceDocument.locumOptionalComplianceDocument==null ? '':'hover:bg-waterloo-light'"
            :to="{path:`/locums/${locumUser.id}/locum-compliance/view-file/compliance-doc/${optionalComplianceDocument.locumOptionalComplianceDocument ? optionalComplianceDocument.locumOptionalComplianceDocument.id : null }`, query: $route.query}"
            class="flex no-underline shadow-lg rounded-lg bg-waterloo my-2"
          >
            <div style="width: 25%;">
              <div class="flex text-white text-sm p-4">
                <span>{{optionalComplianceDocument.optionalComplianceDocument.name}}</span>
              </div>
            </div>
            <div style="width: 10%;">
              <div class="flex text-white text-sm p-4">
                <span>{{ optionalComplianceDocument.locumOptionalComplianceDocument ? 
                  (optionalComplianceDocument.locumOptionalComplianceDocument.file.size / 1048576).toFixed(2) + ' Bytes' : null }}
                </span>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-sm p-4">
                <span>{{ optionalComplianceDocument.locumOptionalComplianceDocument ? 
                  $moment(optionalComplianceDocument.locumOptionalComplianceDocument.file.created_at)
                  .format('DD/MM/YYYY HH:mm:ss') : null }}
                </span>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-sm p-4">
                <span>{{ optionalComplianceDocument.locumOptionalComplianceDocument && 
                  optionalComplianceDocument.locumOptionalComplianceDocument.expired_at ? 
                  $moment(optionalComplianceDocument.locumOptionalComplianceDocument.expired_at)
                  .format('DD/MM/YYYY')  : null }}
                </span>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-sm p-4">
                <span>{{ optionalComplianceDocument.locumOptionalComplianceDocument &&
                   optionalComplianceDocument.locumOptionalComplianceDocument.expired_at ? 
                   $moment(optionalComplianceDocument.locumOptionalComplianceDocument.expired_at)
                   .diff($moment(), 'days')  : null }}
                </span>
              </div>
            </div>
            <div style="width: 10%;">
              <div
              v-if="optionalComplianceDocument.locumOptionalComplianceDocument == null"
              class="inline-flex text-black text-sm mt-2 py-2 p-3 border border-white text-white bg-transparent rounded-full">
                <span>Empty</span>
              </div>
              <div
              v-if="optionalComplianceDocument.locumOptionalComplianceDocument" 
              class="inline-flex text-black text-sm mt-2 py-2 p-3 border border-white rounded-full"
              :class="`${optionalComplianceDocument.locumOptionalComplianceDocument && optionalComplianceDocument.locumOptionalComplianceDocument.status  === 'Approved' ? 'bg-green border-green text-white':'bg-yellow border-yellow text-black' }`">
                <span>{{optionalComplianceDocument.locumOptionalComplianceDocument ? optionalComplianceDocument.locumOptionalComplianceDocument.status: null}}</span>
              </div>
            </div>
          </nuxt-link>
          <!-- BODY -->
        </div>
      </div>
      <!-- TABLE -->
      <p class=" text-sm text-white pt-8 px-8 font-semibold">Mandatory Trainings (Optional) </p>
      <!-- TABLE -->
      <div style="lg:w-1/2 ">
        <div class="flex lg:w-1/2 flex-col mx-6">
          <!-- HEADER -->
          <div class="flex my-2">
            <div style="width: 25%;">
              <div class="flex text-white text-sm p-4">
                <strong>Title</strong>
              </div>
            </div>
              <div style="width: 10%;">
              <div class="flex text-white text-sm p-4">
                <strong>File size</strong>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-sm p-4">
                <strong>File uploaded</strong>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-sm p-4">
                <strong>Expiry date</strong>
              </div>
            </div>
            <div style="width:15%;">
              <div class="flex text-white text-sm p-4">
                <strong>Days to expire</strong>
              </div>
            </div>
            <div style="width: 10%;">
              <div class="flex text-white text-sm p-4">
                <strong>Status</strong>
              </div>
            </div>
          </div>
          <!-- HEADER -->

          <!-- BODY -->
          <nuxt-link
            v-for="(optionalMandatoryTraining, index) in optionalMandatoryTrainings" :key="`optionalMandatoryTraining-${index}`"
            :event="optionalMandatoryTraining.locumOptionalMandatoryTraining==null ? disabled :'click'" 
            :class="optionalMandatoryTraining.locumOptionalMandatoryTraining==null? '':' hover:bg-waterloo-light' "
            :to="{path:`/locums/${locumUser.id}/locum-compliance/view-file/mandatory-training/${optionalMandatoryTraining.locumOptionalMandatoryTraining ? optionalMandatoryTraining.locumOptionalMandatoryTraining.id : null }`, query: $route.query}"
            class="flex no-underline shadow-lg rounded-lg bg-waterloo my-2"
          >
            <div style="width: 25%;">
              <div class="flex text-white text-sm p-4">
                <span>{{optionalMandatoryTraining.optionalMandatoryTraining.name}}</span>
              </div>
            </div>
             <div style="width: 10%;">
              <div class="flex text-white text-sm p-4">
                <span>{{ optionalMandatoryTraining.locumOptionalMandatoryTraining &&
                  optionalMandatoryTraining.locumOptionalMandatoryTraining.file ? 
                  (optionalMandatoryTraining.locumOptionalMandatoryTraining.file.size / 1048576).toFixed(2) + ' Bytes' : null}}
                </span>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-sm p-4">
                <span>{{ optionalMandatoryTraining.locumOptionalMandatoryTraining &&
                   optionalMandatoryTraining.locumOptionalMandatoryTraining.file &&
                  optionalMandatoryTraining.locumOptionalMandatoryTraining.file.created_at ? 
                  $moment(optionalMandatoryTraining.locumOptionalMandatoryTraining.file.created_at)
                  .format('DD/MM/YYYY HH:mm:ss') : null }}</span>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-sm p-4">
                <span>{{ optionalMandatoryTraining.locumOptionalMandatoryTraining && 
                  optionalMandatoryTraining.locumOptionalMandatoryTraining.expired_at ? 
                  $moment(optionalMandatoryTraining.locumOptionalMandatoryTraining.expired_at)
                  .format('DD/MM/YYYY')  : null }}</span>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-sm p-4">
                <span>{{ optionalMandatoryTraining.locumOptionalMandatoryTraining && 
                  optionalMandatoryTraining.locumOptionalMandatoryTraining.expired_at ? 
                  $moment(optionalMandatoryTraining.locumOptionalMandatoryTraining.expired_at)
                  .diff($moment(), 'days')  : null }}</span>
              </div>
            </div>
            <div style="width: 10%;">
              <div class="inline-flex text-black text-sm mt-2 py-2 p-3 border border-white rounded-full"
              :class="`${optionalMandatoryTraining.locumOptionalMandatoryTraining ? 'bg-yellow border-yellow':'bg-transparent text-white' }`">
                <span>{{ optionalMandatoryTraining.locumOptionalMandatoryTraining ? 
                  'Compliant' : 'Empty' }}</span>
              </div>
            </div>
          </nuxt-link>
          <!-- BODY -->
        </div>
      </div>
      <!-- TABLE -->
      <nuxt-child/>
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
      optionalMandatoryTrainings:[],
      disabled:'true',
    };
  },

  async asyncData({ app, route }) {
    try {
      let response = await app.$axios.get(`/api/v1/admin/locum-users/${route.params.id}`)
      const locumUser = response.data.data.user
      const professionCategoryid = locumUser.locum_detail.profession.profession_category.id

      response = await app.$axios.get(`/api/v1/profession-categories/${professionCategoryid}`)
      const professionCategory = response.data.data.profession_category

      response = await app.$axios.get(`/api/v1/admin/mandatory-trainings`)
      const mandatoryTrainings = response.data.data.mandatory_trainings


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

      const optionalMandatoryTrainings = mandatoryTrainings.map((optionalMandatoryTraining)=>{
      const locumOptionalMandatoryTraining = locumUser.locum_detail.mandatory_trainings.find((locumMandatoryTraining)=>{
        return locumMandatoryTraining.mandatory_training.id === optionalMandatoryTraining.id
      })
        return{
          optionalMandatoryTraining,
          locumOptionalMandatoryTraining
        }
      })

      return{
        locumUser,
        mandatoryComplianceDocuments,
        optionalComplianceDocuments,
        optionalMandatoryTrainings
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
          await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
            status:verifyReject
          })
          alert('Saved')
        }else if(currentStatus === 'Verified' && verifyReject ==='Rejected'){
          await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
            status:verifyReject
          })
          alert('Saved.')
        }else if(currentStatus === 'Rejected' && verifyReject ==='Verified'){
          await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
            status:verifyReject
          })
          alert('Saved.')
        }else if(currentStatus === 'Verified' && verifyReject ==='Verified'){
          await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
            status:'Pending'
          })
          alert('Saved. Status reverted back to pending')
        }else if(currentStatus === 'Rejected' && verifyReject ==='Rejected'){
          await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
            status:'Pending'
          })
          alert('Saved. Status reverted back to pending')
        }
      
      }catch(err){
        alert('Something went wrong!!')
        console.log("index practices index put GMC/NMC err", err);
        
      }
    },

    async toPutMplNpl(currentStatus,locumID, verifyReject){
      try{
        if(currentStatus === 'Pending'){
           await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
            status:verifyReject
          })
          alert('Saved')
        }else if(currentStatus === 'Verified' && verifyReject ==='Rejected'){
          await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
            status:verifyReject
          })
          alert('Saved.')
        }else if(currentStatus === 'Rejected' && verifyReject ==='Verified'){
          await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
            status:verifyReject
          })
          alert('Saved.')
        }else if(currentStatus === 'Verified' && verifyReject ==='Verified'){
          await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
            status:'Pending'
          })
          alert('Saved. Status reverted back to pending')
        }else if(currentStatus === 'Rejected' && verifyReject ==='Rejected'){
          await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
            status:'Pending'
          })
          alert('Saved. Status reverted back to pending')
        }

      }catch(err){
        alert('Something went wrong!!')
        console.log("index practices index put MPL/NPL err", err);
      }
    },
  }
};
</script>
