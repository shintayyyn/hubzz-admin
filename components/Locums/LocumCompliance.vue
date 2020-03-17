<template>
  <div>
    <div
      class="mx-4 md:mx-8 flex no-underline shadow-lg rounded-lg bg-waterloo mt-4 shadow"
      style="position:relative;">
      <div class="w-4/5 overflow-hidden text-sm m-4">
        <div class="text-gray-400">
          <p class="m-2">
            Name <span class="m-2 text-white">{{ user.personal_detail ? user.personal_detail.name : null }}</span>
          </p>
          <p class="m-2">
            Email address <span class="m-2 text-white">{{ user ? user.email : null }}</span>
          </p>
          <p class="m-2">
            Mobile phone number <span class="m-2 text-white">{{ user.contact_detail ? user.contact_detail.mobile_number : null }}</span> 
          </p>
          <p class="m-2">
            Home phone number <span class="m-2 text-white">{{ user.contact_detail ? user.contact_detail.home_number : null }}</span>
          </p>
        </div>
      </div>
    </div>
    <!--GMC / NMC NUMBER-->
    <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center mx-4 md:mx-8 px-6 py-4 text-sm text-white shadow-lg rounded-lg bg-waterloo mt-3">
      <div class="flex flex-col md:flex-row w-full sm:w-1/2 justify-between">
        <p class="text-gray-400">GMC / NMC / HCPC Number</p>
        <p class="mx-3 sm:mx-0">{{ user.locum_detail.gmc_or_nmc_number ? user.locum_detail.gmc_or_nmc_number.number : null }}</p>
      </div>
      <div class="flex w-full sm:w-1/2 justify-end mt-2 sm:m-0">
        <button
          v-if="user.locum_detail.gmc_or_nmc_number"
          class="w-1/2 sm:w-auto text-white text-sm mr-2 py-2 px-4 border border-white focus:bg-green-500 rounded-full hover:bg-green-500 focus:outline-none"
          :class="`${user.locum_detail.gmc_or_nmc_number.status === 'Verified' ? 'bg-green-500 border-green-500 text-white px-4 hover:bg-green-600 text-center ' : 'bg-transparent px-2 hover:bg-green-500'}`"
          @click.prevent="toPutGmcNmc(user.locum_detail.gmc_or_nmc_number.status,user.id,'Verified')"
        >{{user.locum_detail.gmc_or_nmc_number.status == 'Verified' ? 'Verified' : 'Verify' }}</button>
        <button
          v-if="user.locum_detail.gmc_or_nmc_number"
          class="w-1/2 sm:w-auto text-white text-sm ml-2 py-2 px-4 border border-white focus:bg-yellow-500 rounded-full hover:bg-yellow-500 focus:outline-none"
          :class="`${user.locum_detail.gmc_or_nmc_number.status === 'Rejected' ? 'bg-yellow-500 border-yellow-500 text-white px-4 hover:bg-yellow-600 ' : 'bg-transparent px-2 hover:bg-yellow-500'}`"
          @click.prevent="toRejectGmcNmc()"
        >{{user.locum_detail.gmc_or_nmc_number.status == 'Rejected' ? 'Rejected' : 'Reject' }}</button>
      </div>
      <div v-if="rejectGmcNmc == true" class="flex w-full justify-end mt-2 sm:m-0">
        <div class="flex flex-col md:flex-row w-full md:w-auto items-center my-2">
          <div class="border rounded-lg mx-2 p-2 h-full w-full md:w-auto">
            <textarea
              v-model="notes" 
              placeholder="Reason for Rejection" 
              class="flex-1 bg-transparent overflow-auto resize-none text-white focus:outline-none" 
              name="complianceNote"
            />
          </div>
          <div class="flex md:flex-col mt-2">
            <button @click.prevent="toPutGmcNmc(user.locum_detail.gmc_or_nmc_number.status,user.id,'Rejected')" class="my-1 mx-1 md:mx-0 py-2 px-8 rounded-full rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none">
              <span>{{user.locum_detail.gmc_or_nmc_number.status == 'Rejected' ? 'Revert' : 'Confirm'}}</span>
            </button>
            <button @click.prevent="rejectGmcNmc = false" class="my-1 mx-1 md:mx-0 py-2 px-8 rounded-full rounded-lg text-white bg-gray-500 hover:bg-gray-600 focus:outline-none">
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center mx-4 md:mx-8 px-6 py-4 text-sm text-white shadow-lg rounded-lg bg-waterloo mt-3">
      <div class="flex flex-col md:flex-row w-full sm:w-1/2 justify-between">
        <p class="text-gray-400">MPL / NPL Number</p>
        <p class="mx-3 sm:mx-0">{{ user.locum_detail.mpl_or_npl_number ? user.locum_detail.mpl_or_npl_number.number : null }}</p>
      </div>
      <div class="flex w-full sm:w-1/2 justify-end mt-2 sm:m-0">
        <button
          class="w-1/2 sm:w-auto text-white text-sm mr-2 py-2 px-4 border border-white rounded-full hover:bg-green-500 focus:outline-none"
          :class="`${user.locum_detail.mpl_or_npl_number.status === 'Verified' ? 'bg-green-500 border-green-500 text-white px-4 hover:bg-green-600' : 'bg-transparent px-2 hover:bg-green-300'}`"
          v-if="user.locum_detail.mpl_or_npl_number"
          @click.prevent="toPutMplNpl(user.locum_detail.mpl_or_npl_number.status,user.id,'Verified')"
          >{{user.locum_detail.mpl_or_npl_number.status == 'Verified' ? 'Verified' : 'Verify' }}
        </button>
        <button
          class="w-1/2 sm:w-auto text-white text-sm ml-2 py-2 px-4 border border-white rounded-full hover:bg-yellow-500 focus:outline-none"
          :class="`${user.locum_detail.mpl_or_npl_number.status === 'Rejected' ? 'bg-yellow-500 border-yellow-500 text-white px-4 hover:bg-yellow-300' : 'bg-transparent px-2 hover:bg-yellow-300'}`"
          v-if="user.locum_detail.mpl_or_npl_number"
          @click.prevent="toRejectMplNpl()"
          >{{user.locum_detail.mpl_or_npl_number.status == 'Rejected' ? 'Rejected' : 'Reject' }}
        </button>
      </div>
      <div v-if="rejectMplNpl == true" class="flex w-full justify-end mt-2 sm:m-0">
        <div class="flex flex-col md:flex-row w-full md:w-auto items-center my-2">
          <div class="border rounded-lg mx-2 p-2 h-full w-full md:w-auto">
            <textarea
              v-model="notes" 
              placeholder="Reason for Rejection" 
              class="flex-1 bg-transparent overflow-auto resize-none text-white focus:outline-none" 
              name="complianceNote"
            />
          </div>
          
          <div class="flex md:flex-col mt-2">
            <button @click.prevent="toPutMplNpl(user.locum_detail.mpl_or_npl_number.status,user.id,'Rejected')" class="my-1 mx-1 md:mx-0 py-2 px-8 rounded-full rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none">
              <span>{{user.locum_detail.mpl_or_npl_number.status == 'Rejected' ? 'Revert' : 'Confirm'}}</span>
            </button>
            <button @click.prevent="rejectMplNpl = false" class="my-1 mx-1 md:mx-0 py-2 px-8 rounded-full rounded-lg text-white bg-gray-500 hover:bg-gray-600 focus:outline-none">
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--GMC / NMC NUMBER ENDS HERE-->

    <!-- MANDATORY -->
    <p class="text-sm text-white px-4 md:px-8 pt-8 font-semibold">Mandatory</p>
    <div class="w-full overflow-x-auto p-4 md:px-8 md:py-2">
      <!-- HEADER --> 
      <div class="hidden md:flex items-center text-white justify-around font-semibold"> 
        <div class="align-middle pl-6 pr-2 w-1/6">Title</div> 
        <div class="align-middle px-2 text-center w-1/6">File size</div>
        <div class="align-middle px-2 text-center w-1/6">File uploaded</div>
        <div class="align-middle px-2 text-center w-1/6">Expiry Date</div>
        <div class="align-middle px-2 text-center w-1/6">Days to expire</div>
        <div class="align-middle px-2 text-center w-1/6">Status</div>
      </div>
      <!-- END HEADER -->
      <!-- BODY -->
      <div
        v-for="(item, index) in mandatoryCompDocs" :key="`item-${index}`"
      >
        <nuxt-link
          :event="item.file == null ? disabled :'click'" 
          :class="item.file == null ? 'cursor-auto':' hover:bg-waterloo-light transition-hover ' "
          :to="{path:`/locums/${user.id}/locum-compliance/${item ? item.id : null }`, query: $route.query}"
          class="flex flex-col md:flex-row px-4 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo" 
          draggable="false"
        >
        
          <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 xl:pl-6 py-2 align-middle">
            <strong class="block md:hidden text-sm uppercase">Title</strong>
            <span 
              :class="item && item.file ? 'truncate' : 'break-word'"
            >
              {{ item && item.compliance_document_name ? item.compliance_document_name : null }}
            </span>
            <span
              v-if="item && item.compliance_document_name === 'Passport'" 
              :class="item && item.file ? 'truncate' : 'break-word'">
              {{ item && item.country_name ? item.country_name + "("+item.country_code+")" : null}}
            </span>
          </div>

          <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
            <strong class="block md:hidden text-sm uppercase">File size</strong>
            <span>{{ item.file ? (item.file.size / 1048576).toFixed(2) + 'Mb' : null }}
            </span>
          </div>

          <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
            <strong class="block md:hidden text-sm uppercase">File uploaded</strong>
            <span>{{ item && item.file ? item.uploaded_at_formatted : null }}
            </span>
          </div>

          <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
            <strong class="block md:hidden text-sm uppercase">Expiry Date</strong>
            <span class="break-all">
              {{ item && item.expired_at 
                ? $moment(item.expired_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a')
                : null }}
            </span>
          </div>

          <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
            <strong class="block md:hidden text-sm uppercase">Days to expire</strong>
            <span class="break-all">
              {{ item && item.expired_at 
                ? $moment(item.expired_at).diff($moment(), 'days')  
                : null }}
            </span>
          </div>

          <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 xl:pr-4 py-2 align-middle md:text-center">
            <strong class="block md:hidden">Status</strong>
            <div
              class="text-center text-black text-sm py-2 sm:mx-2 border border-white rounded-full"
              :class="statusStyle(item && item.status ? item.status:null)">
              <span>
                {{item && item.status ? item.status:null}}
              </span>

            </div>
          </div>
        </nuxt-link>
        <div v-if="item.child_locum_compliance_documents && item.child_locum_compliance_documents.length > 0 ">
          <nuxt-link
            v-for="(item, index) in item.child_locum_compliance_documents" :key="`item-${index}`"
            :event="item.file == null ? disabled :'click'" 
            :class="item.file == null ? 'cursor-auto':' hover:bg-waterloo-light transition-hover ' "
            :to="{path:`/locums/${user.id}/locum-compliance/${item ? item.id : null }`, query: $route.query}"
            class="flex flex-col md:flex-row ml-4 px-4 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo" 
            draggable="false"
          >
            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 xl:pl-6 py-2 align-middle">
              <strong class="block md:hidden text-sm uppercase">Title</strong>
              <span 
                :class="item && item.file ? 'truncate' : 'break-word'"
              >
                {{ item && item.compliance_document_name ? item.compliance_document_name : null }}
              </span>
              <span
                v-if="item && item.compliance_document_name === 'Passport'" 
                :class="item && item.file ? 'truncate' : 'break-word'">
                {{ item && item.country_name ? item.country_name + "("+item.country_code+")" : null}}
              </span>
            </div>

            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
              <strong class="block md:hidden text-sm uppercase">File size</strong>
              <span>{{ item.file ? (item.file.size / 1048576).toFixed(2) + 'Mb' : null }}
              </span>
            </div>

            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
              <strong class="block md:hidden text-sm uppercase">File uploaded</strong>
              <span>{{ item && item.file ? item.uploaded_at_formatted : null }}
              </span>
            </div>

            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
              <strong class="block md:hidden text-sm uppercase">Expiry Date</strong>
              <span class="break-all">
                {{ item && item.expired_at 
                  ? $moment(item.expired_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a')
                  : null }}
              </span>
            </div>

            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
              <strong class="block md:hidden text-sm uppercase">Days to expire</strong>
              <span class="break-all">
                {{ item && item.expired_at 
                  ? $moment(item.expired_at).diff($moment(), 'days')  
                  : null }}
              </span>
            </div>

            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 xl:pr-4 py-2 align-middle md:text-center">
              <strong class="block md:hidden">Status</strong>
              <div v-if="item.file == null"
                class="text-center text-white text-sm py-2 px-8 sm:mx-2 border border-white bg-transparent rounded-full">
                <span>Empty</span>
              </div>
              <div
                v-else
                class="text-center text-black text-sm py-2 sm:mx-2 border border-white rounded-full"
                :class="statusStyle(item && item.status ? item.status:null)">
                <span>
                  {{item && item.status ? item.status:null}}
                </span>
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>

    <!-- OPTIONAL -->
    <p class="text-sm text-white px-4 md:px-8 pt-8 font-semibold">Optional</p>
    <div class="w-full overflow-x-auto p-4 md:px-8 md:py-2">
      <!-- HEADER --> 
      <div class="hidden md:flex items-center text-white justify-around font-semibold"> 
        <div class="align-middle pl-6 pr-2 w-1/6">Title</div> 
        <div class="align-middle px-2 text-center w-1/6">File size</div>
        <div class="align-middle px-2 text-center w-1/6">File uploaded</div>
        <div class="align-middle px-2 text-center w-1/6">Expiry Date</div>
        <div class="align-middle px-2 text-center w-1/6">Days to expire</div>
        <div class="align-middle px-2 text-center w-1/6">Status</div>
      </div>
      <!-- END HEADER -->
      <!-- BODY -->
      <nuxt-link
        v-for="(item, index) in optionalCompDocs" :key="`item-${index}`"
        :event="item.file == null ? disabled :'click'" 
        :class="item.file == null ? 'cursor-auto':' hover:bg-waterloo-light transition-hover ' "
        :to="{path:`/locums/${user.id}/locum-compliance/${item ? item.id : null }`, query: $route.query}"
        class="flex flex-col md:flex-row px-4 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo" 
        draggable="false"
      >
        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 xl:pl-6 py-2 align-middle">
          <strong class="block md:hidden text-sm uppercase">Title</strong>
          <span 
            :class="item && item.file ? 'truncate' : 'break-word'"
          >
            {{ item && item.compliance_document_name ? item.compliance_document_name : null }}
          </span>
          <span
            v-if="item && item.compliance_document_name === 'Passport'" 
            :class="item && item.file ? 'truncate' : 'break-word'">
            {{ item && item.country_name ? item.country_name + "("+item.country_code+")" : null}}
          </span>
        </div>

        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
          <strong class="block md:hidden text-sm uppercase">File size</strong>
          <span>{{ item.file ? (item.file.size / 1048576).toFixed(2) + 'Mb' : null }}
          </span>
        </div>

        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
          <strong class="block md:hidden text-sm uppercase">File uploaded</strong>
          <span>{{ item && item.file ? item.uploaded_at_formatted : null }}
          </span>
        </div>

        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
          <strong class="block md:hidden text-sm uppercase">Expiry Date</strong>
          <span class="break-all">
            {{ item && item.expired_at 
              ? $moment(item.expired_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a')
              : null }}
          </span>
        </div>

        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
          <strong class="block md:hidden text-sm uppercase">Days to expire</strong>
          <span class="break-all">
            {{ item && item.expired_at 
              ? $moment(item.expired_at).diff($moment(), 'days')  
              : null }}
          </span>
        </div>

        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 xl:pr-4 py-2 align-middle md:text-center">
          <strong class="block md:hidden">Status</strong>
          <div
            class="text-center text-black text-sm py-2 sm:mx-2 border border-white rounded-full"
            :class="statusStyle('Present')">
            <span>
              Present
            </span>
          </div>
        </div>

      </nuxt-link>
    </div>

    <nuxt-child/>
  </div>
</template>
<script>
import AppDate from '@/components/Base/AppDate'
export default {
    props:['user'],
    components:{
      // AppDate
    },
    data() {
      return {
      locumUser: {
        locum_detail: {
          gmc_or_nmc_number:'',
          mpl_or_npl_number: ''
        }
      },
      referenceCompDocs: null,
      professionCategoryId: null,
      mandatoryCompDocs: null,
      optionalCompDocs: null,
      // mandatoryComplianceDocuments:[],
      optionalComplianceDocuments: [],
      locumMandatoryTrainings: [],
      professionCategory: null,
      disabled: 'true',
      query: null,
      rejectGmcNmc: false,
      rejectMplNpl: false,
      notes:''
      };
    },
    async created() {
      let route = this.$route.params.id
      await this.getData()
      this.query = {
        ...this.$route.query
      }
      await this.getCompliances()
    },
    computed:{
      mandatoryComplianceDocuments(){
        return this.$store.state.locums.mandatoryComplianceDocuments
      },
    },
    methods:{
      getLocums(){
        this.$store.dispatch("locums/fetchLocums",{
          limit:8,
          order_by:'created_at:desc',
          offset: this.getQuery()
        });
      },
      getQuery(){
        const query = {
          ...this.$route.query
        }
        const offset = parseInt(query.page)*8 - 8 
        return offset
      },
      toRejectGmcNmc(){
        this.rejectGmcNmc = !this.rejectGmcNmc
      },
      toRejectMplNpl(){
        this.rejectMplNpl = !this.rejectMplNpl
      },
      async getData(){
        try{
          this.professionCategoryId = this.user.locum_detail.profession.profession_category.id

          this.locumMandatoryTrainings = this.user.locum_detail.mandatory_trainings

          const proCat = await this.$axios.$get(`/api/v1/admin/profession-categories/${this.professionCategoryId}`).then(res =>{
            this.professionCategory = res.data.profession_category
          })

          const mandatoryComplianceDocuments = await this.professionCategory.mandatory_compliance_documents.map((mandatoryComplianceDocument)=>{
            const locumMandatoryComplianceDocument = this.user.locum_detail.compliance_documents.find((complianceDocument) => {
              return complianceDocument.compliance_document.id === mandatoryComplianceDocument.id
            })
            return{
              mandatoryComplianceDocument,
              locumMandatoryComplianceDocument
            }
          })

          console.log('old mandatory compliance docs', mandatoryComplianceDocuments)

          this.optionalComplianceDocuments = await this.professionCategory.optional_compliance_documents.map((optionalComplianceDocument)=>{
            const locumOptionalComplianceDocument = this.user.locum_detail.compliance_documents.find((complianceDocument) => {
              return complianceDocument.compliance_document.id === optionalComplianceDocument.id
            })
            return{
              optionalComplianceDocument,
              locumOptionalComplianceDocument
            }
          })

          console.log('old optional compliance docs', this.optionalComplianceDocuments)

          const allLocumComplianceDocuments = await this.user.locum_detail.compliance_documents //====> USE THIS FOR LATER AS REPLACEMENT FOR STATE

          await this.$store.commit('locums/SET_MANDATORY_DOCS', mandatoryComplianceDocuments)
          await this.$store.commit('locums/SET_LOCUM_COMP_DOCS', allLocumComplianceDocuments)
        }catch(err){

          // this.$store.commit('SET_NOTIFICATION',{ 
          //   enabled: true, 
          //   status:'danger', 
          //   text:err.response.data.message
          // })
          console.log("get data error!!", err);
        }
      },

      async getCompliances(){
        try {
          await this.$axios.$get(`/api/v1/admin/locum-user-compliances/${this.user.id}`).then(res => {
            console.log('res', res)
            this.referenceCompDocs = res.data.user.reference_locum_compliance_documents
            console.log('reference gmc nmc', this.referenceCompDocs)
            this.mandatoryCompDocs = res.data.user.mandatory_locum_compliance_documents
            console.log('mandatory comp docs', this.mandatoryCompDocs)
            this.optionalCompDocs = res.data.user.optional_locum_compliance_documents
            console.log('optional comp docs', this.optionalCompDocs)
          })
        } catch (err) {
          console.log('err', err)
          this.$store.commit('SET_NOTIFICATION',{ 
            enabled: true, 
            status:'danger', 
            text:err.response.data.message
          })
        }
      },
      async toUpdateReferenceNums () {
        try {
          await this.$axios.$put(`/api/v1/`)
        } catch (err) {

        }
      },

      async toPutGmcNmc(currentStatus, locumID, verifyReject){
        try{
          if(currentStatus === 'Pending'){
            if(verifyReject === 'Verified'){
              const response = await this.$axios.$put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
                  status:verifyReject,
              })
              // this.user.locum_detail.gmc_or_nmc_number.status = response.data.user.locum_detail.gmc_or_nmc_number.status
              this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: verifyReject })
              await this.getLocums()
            }else if(verifyReject === 'Rejected'){
              if(this.notes){
                const response = await this.$axios.$put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
                    status:verifyReject,
                    note:this.notes
                })
                // this.user.locum_detail.gmc_or_nmc_number.status = response.data.user.locum_detail.gmc_or_nmc_number.status
                this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: verifyReject })
                await this.getLocums()
              }else if(this.notes == ''){
                this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Notes for Rejection is required!' })
              }
            }
          }else if(currentStatus === 'Verified' && verifyReject ==='Rejected'){
            if(this.notes){
              const response = await this.$axios.$put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
                status:verifyReject,
                note:this.notes
              })
              // this.user.locum_detail.gmc_or_nmc_number.status = response.data.user.locum_detail.gmc_or_nmc_number.status
              this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: verifyReject })
              await this.getLocums()
            }else if(this.notes == ''){
              this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Notes for Rejection is required!' })
            }

          }else if(currentStatus === 'Rejected' && verifyReject ==='Verified'){
            const response = await this.$axios.$put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
              status:verifyReject
            })
            // this.user.locum_detail.gmc_or_nmc_number.status = response.data.user.locum_detail.gmc_or_nmc_number.status
            this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: verifyReject })
            await this.getLocums()

          }else if(currentStatus === 'Verified' && verifyReject ==='Verified'){
            const response = await this.$axios.$put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
              status:'Pending'
            })
            // this.user.locum_detail.gmc_or_nmc_number.status = response.data.user.locum_detail.gmc_or_nmc_number.status
            this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved. Status reverted back to Pending' })
            await this.getLocums()

          }else if(currentStatus === 'Rejected' && verifyReject ==='Rejected'){
            const response = await this.$axios.$put('/api/v1/admin/locum-users/'+locumID+'/gmc-or-nmc-number/status',{
              status:'Pending',
              note:this.notes
            })
            // this.user.locum_detail.gmc_or_nmc_number.status = response.data.user.locum_detail.gmc_or_nmc_number.status
            this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved. Status reverted back to Pending' })
            await this.getLocums()
          }
          this.rejectGmcNmc = false
          this.notes = ''
        
        }catch(err){
          this.$store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text: err.response.data.message})
          console.log("index practices index put GMC/NMC err", err);
        }
      },
      async toPutMplNpl(currentStatus, locumID, verifyReject){
        try{
          if(currentStatus === 'Pending'){
            if(verifyReject === 'Verified'){
              const response = await this.$axios.$put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
                  status:verifyReject,
              })
              //this.user.locum_detail.mpl_or_npl_number.status = response.data.user.locum_detail.mpl_or_npl_number.status
              this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: verifyReject })
              await this.getLocums()
            }else if(verifyReject === 'Rejected'){
              if(this.notes){
                const response = await this.$axios.$put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
                    status:verifyReject,
                    note:this.notes
                })
                //this.user.locum_detail.mpl_or_npl_number.status = response.data.user.locum_detail.mpl_or_npl_number.status
                this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: verifyReject })
                await this.getLocums()
              }else if(this.notes == ''){
                this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Notes for Rejection is required!' })
              }
            }
          }else if(currentStatus === 'Verified' && verifyReject ==='Rejected'){
            if(this.notes){
              const response = await this.$axios.$put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
                status:verifyReject,
                note:this.notes
              })
              //this.user.locum_detail.mpl_or_npl_number.status = response.data.user.locum_detail.mpl_or_npl_number.status
              this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: verifyReject })
              await this.getLocums()
            }else if(this.notes == ''){
              this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Notes for Rejection is required!' })
            }
          }else if(currentStatus === 'Rejected' && verifyReject ==='Verified'){
            const response = await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
              status:verifyReject
            })
            //this.user.locum_detail.mpl_or_npl_number.status = response.data.user.locum_detail.mpl_or_npl_number.status
            this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved' })
            await this.getLocums()
          }else if(currentStatus === 'Verified' && verifyReject ==='Verified'){
            const response = await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
              status:'Pending'
            })
            //this.user.locum_detail.mpl_or_npl_number.status = response.data.user.locum_detail.mpl_or_npl_number.status
            this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved. Status reverted back to pending' })
            await this.getLocums()

          }else if(currentStatus === 'Rejected' && verifyReject ==='Rejected'){
            const response = await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/mpl-or-npl-number/status',{
              status:'Pending'
            })
            //this.user.locum_detail.mpl_or_npl_number.status = response.data.user.locum_detail.mpl_or_npl_number.status
            this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved. Status reverted back to pending' })
            await this.getLocums()
          }
          this.rejectMplNpl = false
          this.notes = ''
        }catch(err){
          this.$store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:err.response.data.message})
          console.log("index practices index put MPL/NPL err", err);
        }
      },
      statusStyle(status){
			switch(status){
				case 'Approved':
					return 'bg-green-500 border-green-500 text-white lg:px-8 sm:px-4'
					break;
				case 'Expiring':
					return 'bg-yellow-500 border-yellow-500 text-black lg:px-8 sm:px-4'
					break;
				case 'Expired':
					return 'bg-red-500 border-red-500 text-white lg:px-8 sm:px-4'
					break;
				case 'Rejected':
					return 'bg-red-500 border-red-500 text-white lg:px-8 sm:px-4'
            break;
        case 'Pending':
					return 'bg-yellow-500 border-yellow-500 text-black lg:px-8 sm:px-4'
          break;
        case 'Present':
          return 'bg-yellow-500 border-green-300 text-black lg:px-8 sm:px-4'
          break;
				default:
					return
			}
		},

  }
}
</script>
<style>

</style>