<template>
    <div class="flex xs:flex-col my-3 text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow">
        <div class="inline-flex m-4">
        <div class="flex flex-wrap overflow-hidden">
        <!--COLUMN 1-->
            <div class="w-full md:w-1/3 overflow-hidden mb-2">
            <div class="text-grey mx-5">
                <p class="m-2 font-semibold">Name</p>
                <p class="m-2 text-white">{{ locumUser.personal_detail ? locumUser.personal_detail.name : null }}</p>

                <p class="m-2 mt-5 mr-20 font-semibold">Email address</p>
                <p class="m-2 text-white">{{ locumUser.email ? locumUser.email : null }}</p>

                <p class="m-2 mt-5 mr-20 font-semibold">Mobile phone number</p>
                <p class="m-2 text-white">{{ locumUser.contact_detail ? locumUser.contact_detail.mobile_number : null }}</p>

                <p class="m-2 mt-5 mr-20 font-semibold">Home / landline number</p>
                <p class="m-2 text-white">{{ locumUser.contact_detail ? locumUser.contact_detail.home_number : null }}</p>
                
                <p class="m-2 mt-5 mr-20 font-semibold">Postal Address</p>
                <p class="ml-2 text-white">{{ locumUser.address_detail ? locumUser.address_detail.address.line_1 : null }}</p>
                <p class="ml-2 mt-1 text-white">{{ locumUser.address_detail ? locumUser.address_detail.address.line_2 : null }}</p>
                <p class="ml-2 mt-1 text-white">{{ locumUser.address_detail ? locumUser.address_detail.address.line_3 : null }}</p>
                
                <p class="m-2 mt-5 mr-20 font-semibold">GMC / NMC Number</p>
                <p class="m-2 text-white">{{ locumDetails.gmc_or_nmc_number ? locumDetails.gmc_or_nmc_number.number : null }}</p>
                
                <p class="m-2 mt-5 mr-20 font-semibold">MPL / NPL Number</p>
                <p class="m-2 text-white">{{ locumDetails.mpl_or_npl_number ? locumDetails.mpl_or_npl_number.number : null }}</p>
                
                <p class="m-2 mt-5 mr-20 font-semibold">NHS Smart Card ID Number</p>
                <p class="m-2 text-white">{{ locumDetails.nhs_smart_card_id_number ? locumDetails.nhs_smart_card_id_number : null }}</p>
                
                <p class="m-2 mt-5 mr-20 font-semibold">Profession</p>
                <p class="m-2 text-white">{{ locumDetails.profession ? locumDetails.profession.name : null }}</p>
                
                <p class="m-2 mt-5 mr-20 font-semibold">Speciality</p>
                <p class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-dark"
                v-for="specialty in qualifications"
                :key="specialty.id + '-name'">
                {{specialty ? specialty.name:null}}
                
                </p>
                <p class="m-2 mt-5 mr-20">Clinical Systems</p>
                <p class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-dark"
                v-for="clinicalSystem in clinicalSystems"
                :key="clinicalSystem.id + '-name1'">
                    {{clinicalSystem ? clinicalSystem.name:null}}
                </p>
                
                <p class="m-2 mt-5 mr-20">Spoken Languages</p>
                <p class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-dark">
                English
                </p>
                <p class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-dark"
                v-for="spokenLanguage in spokenLanguages"
                :key="spokenLanguage.id + '-name2'">
                {{spokenLanguage ? spokenLanguage.name:null}}
                </p>
            </div>
            </div>
        <!--COLUMN 2-->
            <div class="w-full md:w-1/3 overflow-hidden mb-2">
            <div class="text-grey mx-5 md:mx-10">
                <p class="m-2 mr-20 font-semibold">Headline</p>
                <p class="m-2 text-white">{{locumUser.locum_detail?locumUser.locum_detail.headline:null}}</p>
                <p class="m-2 mt-5 mr-20 font-semibold">Short Biography</p>
                <p class="m-2 text-white">{{locumUser.locum_detail?locumUser.locum_detail.short_biography:null}}</p>
                <p class="m-2 mt-5 mr-20 font-semibold">Special requirements</p>
                <p class="ml-2 text-white">{{locumUser.locum_detail?locumUser.locum_detail.special_requirements:null}}</p>
                <p class="m-2 mt-5 mr-20 font-semibold">Preferred rates</p>
                <p class="ml-2 text-white">Per hour £ (none)</p>
                <p class="ml-2 mt-1 text-white">Per session £ (none)</p>
                

                <div v-if="locumUserComplianceDocuments">
                <p class="m-2 mt-5 mr-20 font-semibold">Compliance Documents</p>
                <div v-for="(locumUserComplianceDoc, index) in locumUserComplianceDocuments"
                :key="`${index}-${locumUserComplianceDoc.id}-`"
                >
                    <a class="m-2 text-white flex items-center" 
                    @click.prevent="downloadItem(locumUserComplianceDoc.file.url,locumUserComplianceDoc.file.filename)">
                    <svgicon
                        name="cloud-download"
                        width="21"
                        height="21"
                        color="transparent white"
                        class="w-3/4"
                    ></svgicon>
                    <span class="w-full flex px-2">{{ locumUserComplianceDoc.file ? locumUserComplianceDoc.compliance_document.name:null }}</span>
                    </a>
                </div>
                </div>
                <div v-if="locumUserMandatoryTrainings">
                <p class="m-2 mt-5 mr-20 font-semibold">Mandatory Training Documents</p>
                    <div v-for="(locumUserMandatoryTraining, index) in locumUserMandatoryTrainings"
                    :key="`${index}-${locumUserMandatoryTraining.id}-`"
                    >
                    <a class="m-2 text-white flex items-center"
                        :event="locumUserMandatoryTraining.file === null ? disabled:'click'" 
                        @click.prevent="downloadItem(locumUserMandatoryTraining.file.url,locumUserMandatoryTraining.file.filename)">
                        <svgicon
                        v-if="locumUserMandatoryTraining.file"
                        name="cloud-download"
                        width="21"
                        height="21"
                        color="transparent white"
                        class="w-3/4"
                        ></svgicon>
                        <span class="w-full flex px-2">{{locumUserMandatoryTraining.mandatory_training && locumUserMandatoryTraining.file ? locumUserMandatoryTraining.mandatory_training.name:null}}</span>
                    </a>
                    </div>
                </div>
            </div>
            </div>
        <!--COLUMN 3-->
            <div class="w-full md:w-1/3 overflow-hidden mb-2">
            <div class="mx-5 mt-8 md:mt-0">
                <!--RENDER AVATAR PICTURE HERE-->
                <embed
                class=" object-contain w-64  rounded-full mr-4"
                :src="locumUser.avatar ? locumUser.avatar.file.url:null"
                >
                <img v-if="!locumUser.avatar" class="w-48 rounded-full mr-4" src="~/assets/images/default-user-image.png" >
                <p class="m-2 text-grey">Sign-up verified by email</p>
                <p class="m-2 text-white">{{locumUser.is_email_verified ? "Account is E-Mail Verified":"Account is not E-Mail Verified"}}</p>
                <p class="m-2 text-grey">Active at </p>
                <p class="m-2 text-white">{{locumUser.status == "Active" ? "Account is Active" :"Account is "+locumUser.status }}</p>
                <select
                class="outline-none border-2 border-transparent text-sm text-black pr-6"
                id="grid-state"
                v-model="selectedStatus"
                >
                <option>Active</option>
                <option>Inactive</option>
                <option>Deactivated</option>
                <!-- <option>Suspended</option> -->
                <!-- <option>Dormant</option> -->
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
</template>

<script>
export default {
    data() {
        return {
        disabled:'true',
        locumUser : '',
        locumDetails : '',
        selectedStatus:'',
        profileTab: true,
        jobTab: false,
        locumUserComplianceDocuments:[],
        locumUserCurrentJobs:[],
        qualifications:[],
        clinicalSystems:[],
        spokenLanguages:[],
        specificLocumCompDocs:[],
        locumUserMandatoryTrainings:[]
        };
    },

    created() {
        let route = this.$route.params.id
        this.$axios.$get('/api/v1/admin/locum-users/'+route ).then(res => {
            console.log(res.data)
            this.locumUser = res.data.user
            this.locumDetails = this.locumUser.locum_detail
            this.locumUserComplianceDocuments = this.locumUser.locum_detail.compliance_documents
            this.qualifications = this.locumUser.locum_detail.qualifications
            this.clinicalSystems = this.locumUser.locum_detail.clinical_systems
            this.spokenLanguages = this.locumUser.locum_detail.spoken_languages
            
            this.locumUserMandatoryTrainings = this.locumUser.locum_detail.mandatory_trainings
        })
    },

    methods:{
        downloadItem (imgUrl, imgFilename) {
        const axios = require('axios');
        axios({
        url: imgUrl,
        method: 'GET',
        responseType: 'blob', // important
        }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', imgFilename);
            document.body.appendChild(link);
            link.click();
        });
    }   ,

    async changeLocumUserStatus(locumID,activeDisabled){
      try{
        await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/status',{
          status:activeDisabled
        })
        // alert('Saved')
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'alert', text: 'Saved' })
      }catch(err){
        console.log("index practices index put status err", err);
        // alert('Something went wrong!!')
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!!' })
        
      }
    }
  }
}
</script>
