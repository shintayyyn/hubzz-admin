<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col overflow-auto">
    <div style="width: calc(100% - 70px);" class="flex-1 flex flex-col self-end bg-trout">
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link :to="{ path: `/compliances`, query: $route.query }" class="text-white p-1">
          <svgicon
            name="arrow-left-solid"
            height="22"
            width="22"
            class="text-white hover:text-yellow-dark fill-current"
          />
        </nuxt-link>
      </div>
      <!-- HEADER -->
      <!-- BODY -->
      <nuxt-link
        :to="{path:`/compliances/${locumUser.id}/view-profile`, query: $route.query}"
        class="flex lg:w-1/2 no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light mx-6 mt-10 shadow"
        style="position:relative; cursor: pointer;"
      >
          <div class="w-4/5 overflow-hidden text-xs m-4">
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
          <div class="w-1/5 overflow-hidden text-xs m-4 pl-24 pt-6 ">
             <svgicon
                name="chevron-right"
                width="48"
                height="48"
                color="white"
              ></svgicon>
          </div>
      </nuxt-link>

     <div class="flex flex-row lg:w-1/2 text-xs text-white shadow-lg rounded-lg bg-waterloo mx-6 mt-3">
        <p class="m-4  text-grey">GMC / NMC Number</p>
        <p class="m-4">{{ locumUser.locum_detail.gmc_or_nmc_number ? locumUser.locum_detail.gmc_or_nmc_number.number : null }}</p>
        <button
          class="inline-flex text-white text-xs m-2 p-2 border border-white focus:bg-green rounded-full"
          :class="`${locumUser.locum_detail.gmc_or_nmc_number.status === 'Verified' ? 'bg-green border-green text-white px-4 ' : 'bg-transparent px-2'}`"
					v-if="locumUser.locum_detail.gmc_or_nmc_number.status"
          @click.prevent="toPutGmcNmc(locumUser.locum_detail.gmc_or_nmc_number.status,locumUser.id,'Verified')"
        >Verified</button>
        <button
          class="inline-flex text-white text-xs m-2 p-2 border border-white focus:bg-orange rounded-full"
          :class="`${locumUser.locum_detail.gmc_or_nmc_number.status === 'Rejected' ? 'bg-orange border-orange text-white px-4 ' : 'bg-transparent px-2'}`"
					v-if="locumUser.locum_detail.gmc_or_nmc_number.status"
          @click.prevent="toPutGmcNmc(locumUser.locum_detail.gmc_or_nmc_number.status,locumUser.id,'Rejected')"
        >Rejected</button>
      </div>

      <div class="flex flex-row lg:w-1/2 text-xs text-white shadow-lg rounded-lg bg-waterloo mx-6 mt-3">
        <p class="m-4 text-grey">MPL / NPL Number</p>
        <p class="m-4">{{ locumUser.locum_detail.mpl_or_npl_number ? locumUser.locum_detail.mpl_or_npl_number.number : null }}</p>
        <button
          class="inline-flex text-white text-xs m-2 p-2 border border-white focus:bg-green rounded-full"
          :class="`${locumUser.locum_detail.mpl_or_npl_number.status === 'Verified' ? 'bg-green border-green text-white px-4 ' : 'bg-transparent px-2'}`"
					v-if="locumUser.locum_detail.mpl_or_npl_number.status"
          @click.prevent="toPutMplNpl(locumUser.locum_detail.mpl_or_npl_number.status,locumUser.id,'Verified')"
        >Verified</button>
        <button
          class="inline-flex text-white text-xs m-2 p-2 border border-white focus:bg-orange rounded-full"
          :class="`${locumUser.locum_detail.mpl_or_npl_number.status === 'Rejected' ? 'bg-orange border-orange text-white px-4 ' : 'bg-transparent px-2'}`"
					v-if="locumUser.locum_detail.mpl_or_npl_number.status"
          @click.prevent="toPutMplNpl(locumUser.locum_detail.mpl_or_npl_number.status,locumUser.id,'Rejected')"
        >Rejected</button>
      </div>
      <!-- BODY -->
      <p class=" text-sm text-white pt-8 px-8 font-semibold">Mandatory</p>
      <!-- TABLE -->
      <div style="lg:w-1/2 ">
        <div class="flex lg:w-1/2 flex-col mx-6">
          <!-- HEADER -->
          <div class="flex my-2">
            <div style="width: 25%;">
              <div class="flex text-white text-xs p-4">
                <strong>Title</strong>
              </div>
            </div>
            <div style="width: 10%;">
              <div class="flex text-white text-xs p-4">
                <strong>File size</strong>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-xs p-4">
                <strong>File uploaded</strong>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-xs p-4">
                <strong>Expiry date</strong>
              </div>
            </div>
            <div style="width:15%;">
              <div class="flex text-white text-xs p-4">
                <strong>Days to expire</strong>
              </div>
            </div>
            <div style="width: 10%;">
              <div class="flex text-white text-xs p-4">
                <strong>Status</strong>
              </div>
            </div>
          </div>
          <!-- HEADER -->

          <!-- BODY -->
          <nuxt-link
            v-for="(mandatoryComplianceDocument, index) in mandatoryComplianceDocuments" :key="`mandatoryComplianceDocument-${index}`"
            :event="mandatoryComplianceDocument.locumMandatoryComplianceDocument==null ? disabled :'click'" 
            :to="{path:`/compliances/${locumUser.id}/view-file/${mandatoryComplianceDocument.locumMandatoryComplianceDocument ? mandatoryComplianceDocument.locumMandatoryComplianceDocument.id : null }`, query: $route.query}"
            class="flex no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light my-2"
          >
            <div style="width: 25%;">
              <div class="flex text-white text-xs p-4">
                <span>{{mandatoryComplianceDocument.mandatoryComplianceDocument.name}}</span>
              </div>
            </div>
            <div style="width: 10%;">
              <div class="flex text-white text-xs p-4">
                <span>{{ mandatoryComplianceDocument.locumMandatoryComplianceDocument ? 
                  mandatoryComplianceDocument.locumMandatoryComplianceDocument.file.size + ' Bytes' : null }}
                </span>

                <span>{{ mandatoryComplianceDocument.locumMandatoryComplianceDocument ? 
                  mandatoryComplianceDocument.locumMandatoryComplianceDocument.file.id + ' ID' : null }}
                </span>
            
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-xs p-4">
                <span>{{ mandatoryComplianceDocument.locumMandatoryComplianceDocument &&
                   mandatoryComplianceDocument.locumMandatoryComplianceDocument.file &&
                  mandatoryComplianceDocument.locumMandatoryComplianceDocument.file.created_at ? 
                  $moment(mandatoryComplianceDocument.locumMandatoryComplianceDocument.file.created_at)
                  .format('DD/MM/YYYY HH:mm:ss') : null }}</span>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-xs p-4">
                <span>{{ mandatoryComplianceDocument.locumMandatoryComplianceDocument && 
                  mandatoryComplianceDocument.locumMandatoryComplianceDocument.expired_at ? 
                  $moment(mandatoryComplianceDocument.locumMandatoryComplianceDocument.expired_at)
                  .format('DD/MM/YYYY')  : null }}</span>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-xs p-4">
                <span>{{ mandatoryComplianceDocument.locumMandatoryComplianceDocument && 
                  mandatoryComplianceDocument.locumMandatoryComplianceDocument.expired_at ? 
                  $moment(mandatoryComplianceDocument.locumMandatoryComplianceDocument.expired_at)
                  .diff($moment(), 'days')  : null }}</span>
              </div>
            </div>
            <div style="width: 10%;">
              <div class="inline-flex text-black text-xs mt-2 py-2 p-3 border border-white rounded-full"
              :class="`${mandatoryComplianceDocument.locumMandatoryComplianceDocument ? 'bg-yellow border-yellow':'bg-transparent text-white' }`">
                <span>{{ mandatoryComplianceDocument.locumMandatoryComplianceDocument ? 
                  mandatoryComplianceDocument.locumMandatoryComplianceDocument.status : 'Empty' }}</span>
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
              <div class="flex text-white text-xs p-4">
                <strong>Title</strong>
              </div>
            </div>
            <div style="width: 10%;">
              <div class="flex text-white text-xs p-4">
                <strong>File size</strong>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-xs p-4">
                <strong>File uploaded</strong>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-xs p-4">
                <strong>Expiry date</strong>
              </div>
            </div>
            <div style="width:15%;">
              <div class="flex text-white text-xs p-4">
                <strong>Days to expire</strong>
              </div>
            </div>
            <div style="width: 10%;">
              <div class="flex text-white text-xs p-4">
                <strong>Status</strong>
              </div>
            </div>
          </div>
          <!-- HEADER -->

          <!-- BODY -->
         <nuxt-link
            v-for="(optionalComplianceDocument, index) in optionalComplianceDocuments" :key="`optionalComplianceDocument-${index}`"
             :event="optionalComplianceDocument.locumOptionalComplianceDocument==null ? disabled :'click'"
            :to="{path:`/compliances/${locumUser.id}/view-file/${optionalComplianceDocument.optionalComplianceDocument.id}`, query: $route.query}"
            class="flex no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light my-2"
          >
            <div style="width: 25%;">
              <div class="flex text-white text-xs p-4">
                <span>{{optionalComplianceDocument.optionalComplianceDocument.name}}</span>
              </div>
            </div>
            <div style="width: 10%;">
              <div class="flex text-white text-xs p-4">
                <span>{{ optionalComplianceDocument.locumOptionalComplianceDocument ? 
                  optionalComplianceDocument.locumOptionalComplianceDocument.file.size : null }}
                </span>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-xs p-4">
                <span>{{ optionalComplianceDocument.locumOptionalComplianceDocument ? 
                  $moment(optionalComplianceDocument.locumOptionalComplianceDocument.file.created_at)
                  .format('DD/MM/YYYY HH:mm:ss') : null }}
                </span>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-xs p-4">
                <span>{{ optionalComplianceDocument.locumOptionalComplianceDocument && 
                  optionalComplianceDocument.locumOptionalComplianceDocument.expired_at ? 
                  $moment(optionalComplianceDocument.locumOptionalComplianceDocument.expired_at)
                  .format('DD/MM/YYYY')  : null }}
                </span>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-xs p-4">
                <span>{{ optionalComplianceDocument.locumOptionalComplianceDocument &&
                   optionalComplianceDocument.locumOptionalComplianceDocument.expired_at ? 
                   $moment(optionalComplianceDocument.locumOptionalComplianceDocument.expired_at)
                   .diff($moment(), 'days')  : null }}
                </span>
              </div>
            </div>
            <div style="width: 10%;">
              <div class="inline-flex text-white text-xs mt-2 py-2 p-3 border border-white rounded-full">
                <span>{{ optionalComplianceDocument.locumOptionalComplianceDocument ? 
                  optionalComplianceDocument.locumOptionalComplianceDocument.status : 'Empty' }}
                </span>
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
      disabled:'true'
    };
  },

  async asyncData({ app, route }) {
    try {
      let response = await app.$axios.get(`/api/v1/admin/locum-users/${route.params.id}`)
      const locumUser = response.data.data.user

      const professionCategoryid = locumUser.locum_detail.profession.profession_category.id
      response=await app.$axios.get(`/api/v1/profession-categories/${professionCategoryid}`)
      const professionCategory = response.data.data.profession_category

      const mandatoryComplianceDocuments = professionCategory.mandatory_compliance_documents.map((mandatoryComplianceDocument) => {
        const locumMandatoryComplianceDocument = locumUser.locum_detail.compliance_documents.find((complianceDocument) => {
          return complianceDocument.compliance_document.id === mandatoryComplianceDocument.id
        })
        return {
          mandatoryComplianceDocument,
          locumMandatoryComplianceDocument
        }
      })

      console.log(mandatoryComplianceDocuments)

      const optionalComplianceDocuments = professionCategory.optional_compliance_documents.map((optionalComplianceDocument) => {
        const locumOptionalComplianceDocument = locumUser.locum_detail.compliance_documents.find((complianceDocument) => {
          return complianceDocument.compliance_document.id === optionalComplianceDocument.id
        })
        return {
          optionalComplianceDocument,
          locumOptionalComplianceDocument
        }
      })

      return{
        locumUser,
        mandatoryComplianceDocuments,
        optionalComplianceDocuments,
      }
    } catch (err) {
      console.log("index practices index create asyncData err", err);
    }
  },
 
  methods:{
    async toPutGmcNmc(currentStatus,locumID,verifyReject){
      try{
        console.log(currentStatus)
        if(currentStatus === 'Pending'){
           const response = this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
            status:verifyReject
          })
          alert('Saved')

        }else if(currentStatus === 'Verified'||currentStatus ==='Rejected'){
          const response = this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
            status:'Pending'
          })
          alert('Saved. Status reverted back to pending')
        }
      
      }catch(err){
        console.log("index practices index put GMC/NMC err", err);
        alert('Something went wrong!!')
      }
    },
    async toPutMplNpl(currentStatus,locumID, verifyReject){
      try{
        if(currentStatus ===  'Pending'){
          const response = this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
            status:verifyReject
          })
          alert('Saved')
        }else if(currentStatus==='Verified'||currentStatus ==='Rejected'){
          const response = this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
            status:'Pending'
          })
          alert('Saved. Status reverted back to pending')
        }

      }catch(err){
        console.log("index practices index put MPL/NPL err", err);
        alert('Something went wrong!!')
      }
    },
  }
};
</script>
