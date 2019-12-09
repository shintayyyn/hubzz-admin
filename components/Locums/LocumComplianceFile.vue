<template>
  <div class="absolute page-overlap flex-1 flex flex-col self-end bg-trout w-full max-w-2xl">
    <div class="flex items-center text-sm text-white py-6 px-4 md:px-8">
      <div @click="goBack()" class="cursor-pointer">
        <svgicon name="arrow-left-solid" height="32" width="32" class="text-white hover:text-sunglow fill-current"/>
      </div>
      
      <button class="inline-flex items-center cursor-pointer text-white hover:bg-yellow-500 rounded-lg p-2 m-1"
        @click.prevent="toPutLocumDetailComplianceDocs(compliance_doc.id,toPutLocumDetailCompliance,compliance_doc.expired_at)">
        <svgicon
        name="save-icon"
        width="21"
        height="21"
        color="transparent white"
        hover:color="transparent black"
        ></svgicon>
        <span class="px-1 font-semibold">Save</span>
      </button>

      <div class="inline-flex items-center text-white hover:bg-yellow-500 rounded-lg p-2 m-1">
        <button
          @click.prevent="downloadItem(compliance_doc.file.url,compliance_doc.file.filename)"
          class="inline-flex items-center cursor-pointer no-underline">
          <svgicon
            name="cloud-download"
            width="21"
            height="21"
            color="transparent white"
            hover="transparent black"
          >
          </svgicon>
          <span class="px-1 font-semibold">Download</span>
        </button>
      </div>
    </div>
    <div class="shadow-lg rounded-lg bg-waterloo mx-4 md:mx-12 mb-6 p-4">
      <div class="w-full inline-flex flex-wrap md:flex-no-wrap md:flex-row flex-col-reverse text-sm">
        <div class="text-gray-300 m-2 md:w-1/3 lg:w-1/3">
          <div class="leading-tight pb-4">
            <p class="font-bold text-base">Title</p>
            <p class="text-white">{{compliance_doc.compliance_document ? compliance_doc.compliance_document.name: null}}</p>
          </div>
          <div class="leading-tight pb-4">
            <p class="font-bold text-base">Locum</p>
            <p class="text-white">{{user.personal_detail ? user.personal_detail.name: null}}</p>
          </div>
          <div class="leading-tight pb-4">
            <p class="font-bold text-base">File last uploaded</p>
            <p class="text-white">{{compliance_doc.file ? $moment(compliance_doc.file.created_at).format('DD/MM/YYYY HH:mm:ss') : null}}</p>
          </div>
          <div class="leading-tight pb-4">
            <p class="font-bold text-base">Mobile phone number</p>
            <p class="text-white">{{user.contact_detail ? user.contact_detail.mobile_number : null}}</p>
          </div>
          
          <div  v-if="compliance_doc.compliance_document.id < 5" class="w-full">
            <div class="border-b border-white">
              <div class="leading-tight pb-4">
                <p class="font-bold">Expired At </p>
                <p class="text-white">{{$moment(compliance_doc && compliance_doc.expired_at ? compliance_doc.expired_at : null).format('DD/MM/YYYY HH:mm:ss')}}</p>
              </div>
              <div  class="pb-2 mb-2" if="compliance_doc.status == 'Rejected'">
                <p class="font-bold">Note</p>
                <p class="text-white break-words">{{compliance_doc && compliance_doc.note ? compliance_doc.note : 'N/A'}}</p>
              </div>
            </div>
            <div class="pb-4">
              <AppDate
                v-model="toPutLocumDetailCompliance.expired_at"
                :name="'expired_at'"
                :label="'Change Expiration Date / Status'"
                isAfter
              />
            </div>
            <div> <!--CHANGE THIS ASAP-->
              <p class=" font-bold">Status</p>
              <div class="flex justify-center">
                <button
                  class="w-1/2 text-white text-sm m-2 p-2 border border-white rounded-full hover:bg-green-500 px-4 focus:outline-none"
                  :class="`${toPutLocumDetailCompliance.status === 'Approved' || toPutLocumDetailCompliance.status === 'Expiring'  ? 'bg-green-500 border-green-500 text-white hover:bg-green-light' : ''}`"
                  @click.prevent="setStatusData('Approved')"
                >Approved</button>
                <button
                  class="w-1/2 text-white text-sm m-2 p-2 border border-white rounded-full hover:bg-yellow-500 px-4 focus:outline-none"
                  :class="`${toPutLocumDetailCompliance.status === 'Rejected' || toPutLocumDetailCompliance.status === 'Expired'  ? 'bg-yellow-500 border-yellow-500 text-white hover:bg-yellow-light ' : ''}`"
                  @click.prevent="setStatusData('Rejected')"
                >Rejected</button>
                </div>
            </div>
            
            <div class="w-full" v-if="notesAreVisible">
              <p class="mt-5 mr-20">Reason for Rejection</p>
              <textarea 
                  v-model="toPutLocumDetailCompliance.note" 
                  placeholder="Type Here" 
                  class="w-full text-gray-700 flex-1 py-2 px-4 bg-transparent overflow-auto resize-vertical border-b focus:border-yellow-800 focus:outline-none" 
                  name="complianceNote"
                  >Type Here
              </textarea>
            </div>
          </div>
        </div>
        <div class="flex flex-col text-gray-400 md:m-2 md:w-2/3 lg:w-2/3">
          <p class="font-bold pb-2">File</p>
          <div class="w-full">
            <embed class="object-contain object-left-top w-full"
            :class="compliance_doc.file.type == 'image' ? 'image' : 'document h-full'"
            :src="compliance_doc.file.subtype === 'tiff' || compliance_doc.file.subtype === 'msword' ? convertDoc(compliance_doc.file.url) : compliance_doc.file.url"
            >
          </div>
        </div>
      </div>
    </div>
    <nuxt-child/>
  </div>
</template>
<script>
import AppDate from '@/components/Base/AppDate'
export default {
    props:["user","compliance_doc"],
    components:{
      AppDate
    },
    data() {
        return {
        toPutLocumDetailCompliance:{
          expired_at:this.compliance_doc.expired_at,
          status:this.compliance_doc.status,
          note:this.compliance_doc.note
        },
        notesAreVisible:false,
        };
    },
    methods:{
        setStatusData(incomingStatus){
          if(this.toPutLocumDetailCompliance.status === 'Approved' && incomingStatus === 'Approved' || this.toPutLocumDetailCompliance.status === 'Expiring' && incomingStatus === 'Approved'){

              this.toPutLocumDetailCompliance.status = ''
              this.notesAreVisible = false

          }else if(this.toPutLocumDetailCompliance.status === 'Approved' && incomingStatus === 'Rejected' || this.toPutLocumDetailCompliance.status === 'Expiring' && incomingStatus === 'Rejected'){
              
              this.toPutLocumDetailCompliance.status = 'Rejected'
              this.notesAreVisible = true
              this.toPutLocumDetailCompliance.expired_at = null

          }else if(this.toPutLocumDetailCompliance.status === 'Rejected' && incomingStatus === 'Rejected' || this.toPutLocumDetailCompliance.status === 'Expired' && incomingStatus === 'Rejected'){
              
              this.toPutLocumDetailCompliance.status = ''
              this.notesAreVisible = true
              this.toPutLocumDetailCompliance.expired_at = null

          }else if(this.toPutLocumDetailCompliance.status === 'Rejected' && incomingStatus === 'Approved' || this.toPutLocumDetailCompliance.status === 'Expired' && incomingStatus === 'Approved'){
              
              this.toPutLocumDetailCompliance.status = 'Approved'
              this.notesAreVisible = false

          }else if(this.toPutLocumDetailCompliance.status === 'Pending' || this.toPutLocumDetailCompliance.status === ''  && incomingStatus === 'Approved'){
              
              this.toPutLocumDetailCompliance.status = incomingStatus
              this.notesAreVisible = false

          }else if(this.toPutLocumDetailCompliance.status === 'Pending' || this.toPutLocumDetailCompliance.status === '' && incomingStatus === 'Rejected'){
              this.toPutLocumDetailCompliance.status = incomingStatus
              this.notesAreVisible = true
              this.toPutLocumDetailCompliance.expired_at = null
          }   
        },

        downloadItem (fileUrl, fileFilename) {
          const axios = require('axios');
          axios({
            url: fileUrl,
            method: 'GET',
            responseType: 'blob', // important
          }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileFilename);
            document.body.appendChild(link);
            link.click();
          });
        }, 
        convertDoc(document) {
          return `https://docs.google.com/gview?url=${document}&embedded=true`;
        },
        getQuery(){
          const query = {
            ...this.$route.query
          }
          const offset = parseInt(query.page)*10 - 10 
          return offset
        },
        getLocums(){
          this.$store.dispatch("locums/fetchLocums",{
            limit:10,
            order_by:'created_at:desc',
            offset: this.getQuery()
          });
        },
        
        async toPutLocumDetailComplianceDocs(locumDocID,toPutLocumDetailCompliance){
          try{
            if(toPutLocumDetailCompliance.status == 'Rejected'){
              if(toPutLocumDetailCompliance.note){
                await this.$axios.put('/api/v1/admin/locum-detail-compliance-documents/'+locumDocID,{
                  status:toPutLocumDetailCompliance.status == "Expiring" ? "Approved" : toPutLocumDetailCompliance.status,
                  expired_at:toPutLocumDetailCompliance.expired_at,
                  note:toPutLocumDetailCompliance.note
                })
                await this.getLocums()
                this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved' })
              }else if(toPutLocumDetailCompliance.note == ''){
                this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Notes are required' })
              }
              
            }else if(toPutLocumDetailCompliance.status == 'Approved' || toPutLocumDetailCompliance.status == 'Expired' || toPutLocumDetailCompliance.statis == ''){
              await this.$axios.put('/api/v1/admin/locum-detail-compliance-documents/'+locumDocID,{
                status:toPutLocumDetailCompliance.status == "Expiring" ? "Approved" : toPutLocumDetailCompliance.status,
                expired_at:toPutLocumDetailCompliance.expired_at,
              })
              await this.getLocums()
              this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved' })
            }
          }catch(err){
            console.log('compliance file verification error',err);
            this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: err })
          }
        },
        goBack() {
          const query = {
            ...this.$route.query,
          }
          if(query.job_status){
            delete query.job_status
          }
          this.$router.push({path:`/locums/${this.user.id}/locum-compliance`,query })
        }
    }
}
</script>
<style>
 .document {
    width: 100%;
    min-height: 50vh;
  }

  .image {
    min-height: 100%;
    max-height: 100%;
  }

  @media screen and (min-width: 768px) {
    .document {
      min-height: 70vh;
    }

    .image {
      min-height: 60vh;
      max-height: 60vh;
    }
  }
</style>
