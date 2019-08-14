<template>
    <div class="absolute page-overlap flex-1 flex flex-col self-end bg-trout">
    <!--^Removed the ff code: style="width: calc(100% - 70px);" -->
      <!-- HEADER -->
      <div class="flex items-center text-sm text-white py-6 px-8 mr-8">
        <div class="mr-6">
          <nuxt-link :to="{path:`/locums/${user.id}?locum_tab=locum_compliance`}" class="cursor-pointer">
            <svgicon name="arrow-left-solid" height="32" width="32" class="text-white fill-current"/>
          </nuxt-link>
        </div>
        
        
        <button class="inline-flex items-center text-white hover:text-black hover:bg-yellow-dark rounded-lg p-2 "
          @click.prevent="toPutLocumDetailComplianceDocs(compliance_doc.id,toPutLocumDetailCompliance,compliance_doc.expired_at)">
          <svgicon
          name="save-icon"
          width="21"
          height="21"
          color="transparent white"
          hover:color="transparent black"
          ></svgicon>
          <span class="px-1">Save</span>
        </button>

        <div class="text-white hover:text-black hover:bg-yellow-dark rounded-lg p-2">
          <a 
            @click.prevent="downloadItem(compliance_doc.file.url,compliance_doc.file.filename)"
            class="inline-flex items-center text-white hover:text-black no-underline">
            <svgicon
              name="cloud-download"
              width="21"
              height="21"
              color="transparent white"
              hover ="transparent black"
            >
            </svgicon>
            <span class="px-1 ">Download</span>
          </a>
        </div>
      </div>
      <!-- HEADER -->
      <!-- BODY -->
      <div class="shadow-lg rounded-lg bg-waterloo mx-12 mb-6 p-4">
        <div class="w-full inline-flex flex-wrap md:flex-no-wrap md:flex-row flex-col-reverse text-sm">
          <div class="text-grey m-2">
            <p class="mr-20">Title</p>
            <p class="text-white">{{compliance_doc.compliance_document ? compliance_doc.compliance_document.name: null}}</p>
            <p class="mt-5 mr-20">Locum</p>
            <p class="text-white">{{user.personal_detail ? user.personal_detail.name: null}}</p>
            <p class="mt-5 mr-20">File last uploaded</p>
            <p class="text-white">{{compliance_doc.file ? $moment(compliance_doc.file.created_at).format('DD/MM/YYYY HH:mm:ss') : null}}</p>
            <p class="mt-5 mr-20">Mobile phone number</p>
            <p class="text-white">{{user.contact_detail ? user.contact_detail.mobile_number : null}}</p>
            <div class="mt-5 mr-20 ">
              <p class="text-white">Expired At</p>
               <!--SHOULD BE A DATE, NOT DATETIME-->
                <input
                  type="date"
                  class="date-picker hasDatepicker valid"
                  name="expiryDate"
                  disable-min-date
                  aria-invalid="false"
                  v-model='toPutLocumDetailCompliance.expired_at'
                >
                <!-- <AppDate
                  v-model="toPutLocumDetailCompliance.expired_at"
                  :name="'expired_at'"
                  :label="'Expiration Date'"
                /> -->
            </div>
            <p class="mt-5 mr-20">Status</p>
                <button
                  class="inline-flex text-white text-sm m-2 p-2 border border-white rounded-full hover:bg-green-light"
                  :class="`${toPutLocumDetailCompliance.status === 'Approved' || toPutLocumDetailCompliance.status === 'Expiring'  ? 'bg-green border-green text-white px-4 hover:bg-green-light' : 'bg-transparent px-4 hover:bg-green-light'}`"
                  @click.prevent="setStatusData('Approved')"
                >Approved</button>
                <button
                  class="inline-flex text-white text-sm m-2 p-2 border border-white rounded-full hover:bg-orange-light"
                  :class="`${toPutLocumDetailCompliance.status === 'Rejected' || toPutLocumDetailCompliance.status === 'Expired'  ? 'bg-orange border-orange text-white px-4 hover:bg-orange-light ' : 'bg-transparent px-4 hover:bg-orange-light'}`"
                  @click.prevent="setStatusData('Rejected')"
                >Rejected</button>

            <p class="mt-5 mr-20">Note to Locum</p>
            <textarea 
                v-model="toPutLocumDetailCompliance.note" 
                placeholder="Type Here" 
                class="text-grey-lightest flex-1 py-2 px-4 bg-transparent overflow-auto resize border-b focus:border-orange" 
                name="complianceNote"
                v-if="notesAreVisible">Type Here
            </textarea>
          </div>
          <div class="flex flex-col text-grey md:m-2">
            <p class="md:mr-20">File</p>
             <embed class="w-full my-2" style="max-width: 800px"
              :src="compliance_doc.file ? compliance_doc.file.url:null"
              >
          </div>
       
        </div>
      </div>
      <!-- BODY -->
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
        notesAreVisible:true,
        };
    },
    computed:{
        
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
        console.log(response)
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileFilename);
        document.body.appendChild(link);
        link.click();
        console.log(fileUrl)
        });
        },

        async toPutLocumDetailComplianceDocs(locumDocID,toPutLocumDetailCompliance){
          console.log(toPutLocumDetailCompliance)
        try{
            await this.$axios.put('/api/v1/admin/locum-detail-compliance-documents/'+locumDocID,{
            status:toPutLocumDetailCompliance.status == "Expiring" ? "Approved" : toPutLocumDetailCompliance.status,
            expired_at:toPutLocumDetailCompliance.expired_at,
            note:toPutLocumDetailCompliance.note
            })
            // alert('Saved')
            this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'alert', text: 'Saved' })
        }catch(err){
            console.log("index put locum detail compliance documents error",err);
            // alert('Something went wrong!')
            this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
        }
        }
    }
}
</script>
<style>

</style>
