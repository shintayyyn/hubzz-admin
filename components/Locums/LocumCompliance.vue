<template>
  <div>
    <div
      class="mx-4 md:mx-8 flex no-underline shadow-lg rounded-lg bg-waterloo mt-4 shadow"
      style="position:relative;"
    >
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
    <div 
      v-for="(item, index) in referenceCompDocs" :key="`item-${index}`"
      class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center mx-4 md:mx-8 px-0 py-4 text-sm text-white shadow-lg rounded-lg bg-waterloo mt-3"
    >
      <div class="flex flex-col sm:w-1/2 md:w-1/4 px-1 xl:px-2 xl:pl-6 py-2 align-middle">
        <span :class="item && item.compliance_document_name ? 'truncate' : 'break-word'">{{ item ? item.compliance_document_name : null }}</span>
      </div>
      <div class="flex flex-col md:justify-center md:items-center sm:w-1/2 md:w-1/4 px-1 xl:px-2 xl:pl-6 py-2 align-middle">
        <span :class="item && item.reference ? 'truncate' : 'break-word'">{{ item ? item.reference : null }}</span>
      </div>
      <div class="sm:w-1/2 md:w-1/4 text-center h-16 min-h-full overflow-y-auto">
        <span class="break-word">{{ item && item.note ? item.note : null }}</span>
      </div>
      <div class="flex flex-col md:justify-center md:items-center sm:w-1/2 md:w-1/4 px-1 xl:px-2 xl:pl-6 py-2 align-middle">
        <div class="flex justify-end mt-2 sm:m-0">
          <button
            class="w-1/2 sm:w-auto text-white text-sm mr-2 py-2 px-4 border border-white focus:bg-green-500 rounded-full hover:bg-green-500 focus:outline-none"
            :class="`${item.status === 'Verified' ? 'bg-green-500 border-green-500 text-white px-4 text-center cursor-default ' : 'bg-transparent px-2 hover:bg-green-500 hover:border-green-600 '}`"
            @click.prevent="item.status === 'Verified' ? null : toUpdateReferenceNums(item.id,'Approved')"
          >
            {{ item.status == 'Verified' ? 'Verified' : 'Verify' }}
          </button>
          <button
            class="w-1/2 sm:w-auto text-white text-sm ml-2 py-2 px-4 border border-white focus:bg-red-600 rounded-full focus:outline-none"
            :class="`${item.status === 'Rejected' ? 'bg-red-600 border-red-600 text-white px-4 text-center cursor-default' : 'bg-transparent px-2 hover:bg-red-600 hover:border-red-700'}`"
            @click.prevent="item.status === 'Rejected' ? null : rejectGmcNmc = true"
          >
            {{ item.status == 'Rejected' ? 'Rejected' : 'Reject' }}
          </button>
        </div>
      </div>
      <div v-if="rejectGmcNmc === true" class="note-modal">
        <div class="flex flex-col w-full p-4">
          <p class="mb-2">
            Reason for Rejection
          </p>
          <div class="border rounded-lg p-2 h-full w-full">
            <textarea
              v-model="notes" 
              class="flex-1 bg-transparent overflow-auto resize-none text-white focus:outline-none w-full"
              rows="4" 
              name="complianceNote"
              maxlength="255"
            />
          </div>
          <p class="text-sm text-right">
            {{ notes.length }}/255
          </p>
          <div class="flex justify-end mt-2">
            <button class="my-1 mx-1 py-2 px-8 rounded-full rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none" @click.prevent="toUpdateReferenceNums(item.id, 'Rejected', notes)">
              <span>Confirm</span>
            </button>
            <button class="my-1 mx-1 py-2 px-8 rounded-full rounded-lg text-white bg-gray-500 hover:bg-gray-600 focus:outline-none" @click.prevent="rejectGmcNmc = false">
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--GMC / NMC NUMBER ENDS HERE-->

    <!-- MANDATORY -->
    <p class="text-sm text-white px-4 md:px-8 pt-8 font-semibold">
      Mandatory
    </p>
    <div class="w-full overflow-x-auto p-4 md:px-8 md:py-2">
      <!-- HEADER --> 
      <div class="hidden md:flex items-center text-white justify-around font-semibold"> 
        <div class="align-middle pl-6 pr-2 w-1/6">
          Title
        </div> 
        <div class="align-middle px-2 text-center w-1/6">
          File size
        </div>
        <div class="align-middle px-2 text-center w-1/6">
          File uploaded
        </div>
        <div class="align-middle px-2 text-center w-1/6">
          Expiry Date
        </div>
        <div class="align-middle px-2 text-center w-1/6">
          Days to expire
        </div>
        <div class="align-middle px-2 text-center w-1/6">
          Status
        </div>
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
              :class="item && item.file ? 'truncate' : 'break-word'"
            >
              {{ item && item.country_name ? item.country_name + "("+item.country_code+")" : null }}
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
              :class="statusStyle(item && item.status ? item.status:null)"
            >
              <span>
                {{ item && item.status ? item.status:null }}
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
                :class="item && item.file ? 'truncate' : 'break-word'"
              >
                {{ item && item.country_name ? item.country_name + "("+item.country_code+")" : null }}
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
                   class="text-center text-white text-sm py-2 px-8 sm:mx-2 border border-white bg-transparent rounded-full"
              >
                <span>Empty</span>
              </div>
              <div
                v-else
                class="text-center text-black text-sm py-2 sm:mx-2 border border-white rounded-full"
                :class="statusStyle(item && item.status ? item.status:null)"
              >
                <span>
                  {{ item && item.status ? item.status:null }}
                </span>
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>

    <!-- OPTIONAL -->
    <p class="text-sm text-white px-4 md:px-8 pt-8 font-semibold">
      Optional
    </p>
    <div class="w-full overflow-x-auto p-4 md:px-8 md:py-2">
      <!-- HEADER --> 
      <div class="hidden md:flex items-center text-white justify-around font-semibold"> 
        <div class="align-middle pl-6 pr-2 w-1/6">
          Title
        </div> 
        <div class="align-middle px-2 text-center w-1/6">
          File size
        </div>
        <div class="align-middle px-2 text-center w-1/6">
          File uploaded
        </div>
        <div class="align-middle px-2 text-center w-1/6">
          Expiry Date
        </div>
        <div class="align-middle px-2 text-center w-1/6">
          Days to expire
        </div>
        <div class="align-middle px-2 text-center w-1/6">
          Status
        </div>
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
            :class="item && item.file ? 'truncate' : 'break-word'"
          >
            {{ item && item.country_name ? item.country_name + "("+item.country_code+")" : null }}
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
            :class="statusStyle(item && item.file ? 'Present' : 'Empty')"
          >
            <span>
              {{ item && item.file ? 'Present' : 'Empty' }}
            </span>
          </div>
        </div>
      </nuxt-link>
    </div>
    
    <!-- MANDATORY TRAININGS -->
    <p class=" text-sm text-white px-4 md:px-8 md:pt-8 font-semibold">
      Mandatory Trainings
    </p>
    <div v-if="locumMandatoryTrainings.length === 0">
      <div class="w-full text-white font-bold text-gray-500 text-sm leading-tight py-2 px-4 md:px-8">
        This locum has not uploaded any Mandatory Training Documents.
      </div>
    </div>
    <!-- TABLE RESPONSIVE MANDATORY TRAININGS-->
    <div v-if="locumMandatoryTrainings.length > 0" class="w-full overflow-x-auto p-4 md:px-8 md:py-2"> 
      <div class="hidden md:flex items-center text-white justify-around font-semibold"> 
        <div class="align-middle pl-6 pr-2 text-left w-1/4">
          Title
        </div> 
        <div class="align-middle px-2 text-center w-1/4">
          File size
        </div>
        <div class="align-middle px-2 text-center w-1/4">
          File uploaded
        </div>
        <div class="w-1/4" />
      </div>
      <!-- BODY -->
      <nuxt-link
        v-for="(item, index) in locumMandatoryTrainings" :key="`item-${index}`"
        :event="item.file==null ? disabled :'click'"
        :to="{path:`/locums/${user.id}/locum-compliance/mandatory-training/${item ? item.id : null }`, query: $route.query}"
        class="flex flex-col md:flex-row px-4 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo" 
        :class="item.file==null ? 'cursor-auto':' hover:bg-waterloo-light transition-hover ' "
        draggable="false"
      >
        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/4 px-1 xl:px-2 xl:pl-6 py-2 align-middle">
          <strong class="block md:hidden text-sm uppercase">Title</strong>
          <span :class="item.mandatory_training ? 'truncate' : 'break-word leading-none'">{{ item.mandatory_training.name }}</span>
        </div>

        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/4 px-1 xl:px-2 py-2 align-middle md:text-center">
          <strong class="block md:hidden text-sm uppercase">File size</strong>
          <span>
            {{ ( item.file ? item.file.size : 0 / 1048576).toFixed(2) + 'Bytes' }}
          </span>
        </div>
        <!-- $moment(document.practiceSpecificDoc.updated_at 
          ? document.practiceSpecificDoc.updated_at
          : document.practiceSpecificDoc.created_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYYY, h:mm:ss a'):null }} -->
        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/4 px-1 xl:px-2 xl:pr-4 py-2 align-middle md:text-center">
          <strong class="block md:hidden text-sm uppercase">File uploaded</strong>
          <span class="break-all">{{ item.file ? $moment(item.file.created_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a'): null }}</span>
        </div>

        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/4 px-1 xl:px-2 xl:pr-4 py-2 align-middle md:text-center">
          <strong class="block md:hidden">Status</strong>
          <div
            class="text-center text-black text-sm py-2 sm:mx-2 border border-white rounded-full"
            :class="statusStyle(item && item.file ? 'Present' : 'Empty')"
          >
            <span>
              {{ item && item.file ? 'Present' : 'Empty' }}
            </span>
          </div>
        </div>
      </nuxt-link>
      <!-- END BODY -->
    </div>
    
    <div v-if="rejectGmcNmc" class="shield" @click="rejectGmcNmc=false" />
    <nuxt-child />
  </div>
</template>
<script>
import AppDate from '@/components/Base/AppDate'
export default {
    components:{
      // AppDate
    },
    props:['user'],
    data () {
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
      }
    },
    computed:{
      mandatoryComplianceDocuments (){
        return this.$store.state.locums.mandatoryComplianceDocuments
      },
    },
    async created () {
      let route = this.$route.params.id
      await this.getData()
      this.query = {
        ...this.$route.query
      }
      await this.getCompliances()
    },
    methods:{
      getLocums (){
        this.$store.dispatch("locums/fetchLocums",{
          limit:8,
          order_by:'created_at:desc',
          offset: this.getQuery()
        })
      },
      getQuery (){
        const query = {
          ...this.$route.query
        }
        const offset = parseInt(query.page)*8 - 8 
        return offset
      },
      toRejectGmcNmc (){
        this.rejectGmcNmc = !this.rejectGmcNmc
      },
      toRejectMplNpl (){
        this.rejectMplNpl = !this.rejectMplNpl
      },
      async getData (){
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
          this.optionalComplianceDocuments = await this.professionCategory.optional_compliance_documents.map((optionalComplianceDocument)=>{
            const locumOptionalComplianceDocument = this.user.locum_detail.compliance_documents.find((complianceDocument) => {
              return complianceDocument.compliance_document.id === optionalComplianceDocument.id
            })
            return{
              optionalComplianceDocument,
              locumOptionalComplianceDocument
            }
          })

          const allLocumComplianceDocuments = await this.user.locum_detail.compliance_documents //====> USE THIS FOR LATER AS REPLACEMENT FOR STATE

          await this.$store.commit('locums/SET_MANDATORY_DOCS', mandatoryComplianceDocuments)
          await this.$store.commit('locums/SET_LOCUM_COMP_DOCS', allLocumComplianceDocuments)
        }catch(err){

          // this.$store.commit('SET_NOTIFICATION',{ 
          //   enabled: true, 
          //   status:'danger', 
          //   text:err.response.data.message
          // })
          console.log("get data error!!", err)
        }
      },

      async getCompliances (){
        try {
          await this.$axios.$get(`/api/v1/admin/locum-user-compliances/${this.user.id}`).then(res => {
            this.referenceCompDocs = res.data.user.reference_locum_compliance_documents
            this.mandatoryCompDocs = res.data.user.mandatory_locum_compliance_documents
            this.optionalCompDocs = res.data.user.optional_locum_compliance_documents
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
      async toUpdateReferenceNums (id, status, note) {
        try {
          await this.$axios.$put(`/api/v1/admin/locum-compliance-documents/${id}/update-status`,{
            status: status,
            note: note,
          }).then(res => {
            this.rejectGmcNmc = false
            this.getLocums()
            this.getCompliances()
            this.$store.commit('SET_NOTIFICATION',{ 
              enabled: true, 
              status: 'success', 
              text: res.message 
            })
          })
        } catch (err) {
             this.$store.commit('SET_NOTIFICATION',{ 
              enabled: true, 
              status: 'success', 
              text: err.message
            })
        }
      },

      statusStyle (status){
        switch(status){
          case 'Approved':
            return 'bg-green-500 border-green-500 text-white lg:px-8 sm:px-4'
            break
          case 'Expiring':
            return 'bg-yellow-500 border-yellow-500 text-black lg:px-8 sm:px-4'
            break
          case 'Expired':
            return 'bg-red-500 border-red-500 text-white lg:px-8 sm:px-4'
            break
          case 'Rejected':
            return 'bg-red-500 border-red-500 text-white lg:px-8 sm:px-4'
              break
          case 'Pending':
            return 'bg-yellow-500 border-yellow-500 text-black lg:px-8 sm:px-4'
            break
          case 'Present':
            return 'bg-yellow-500 border-yellow-500 text-black lg:px-8 sm:px-4'
            break
          case 'Empty':
            return 'border-white text-white lg:px-8 sm:px-4'
            break
          default:
            return
        }
      },
  }
}
</script>
<style>
.note-modal {
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	border-radius: 10px;
  min-width: 600px;
	max-height: 80%;
	overflow: auto;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}

</style>