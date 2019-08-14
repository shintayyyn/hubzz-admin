<template>
    <div class="flex xs:flex-col my-3 text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow">
        <div class="inline-flex m-4">
            <div class="flex flex-wrap overflow-hidden">
            <!--COLUMN 1-->
                <div class="w-full md:w-1/3 overflow-hidden mb-2">
                    <div class="text-grey mx-5">
                        <p class="m-2 font-semibold">Name</p>
                        <p class="m-2 text-white">{{ user.personal_detail ? user.personal_detail.name : null }}</p>

                        <p class="m-2 mt-5 mr-20 font-semibold">Email address</p>
                        <p class="m-2 text-white">{{ user.email ? user.email : null }}</p>

                        <p class="m-2 mt-5 mr-20 font-semibold">Mobile phone number</p>
                        <p class="m-2 text-white">{{ user.contact_detail ? user.contact_detail.mobile_number : null }}</p>

                        <p class="m-2 mt-5 mr-20 font-semibold">Home / landline number</p>
                        <p class="m-2 text-white">{{ user.contact_detail ? user.contact_detail.home_number : null }}</p>
                        
                        <p class="m-2 mt-5 mr-20 font-semibold">Postal Address</p>
                        <p class="ml-2 text-white">{{ user.address_detail ? user.address_detail.address.line_1 : null }}</p>
                        <p class="ml-2 mt-1 text-white">{{ user.address_detail ? user.address_detail.address.line_2 : null }}</p>
                        <p class="ml-2 mt-1 text-white">{{ user.address_detail ? user.address_detail.address.line_3 : null }}</p>
                        
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
                        v-for="specialty in user.locum_detail.qualifications"
                        :key="specialty.id + '-name'">
                        {{specialty ? specialty.name:null}}
                        
                        </p>
                        <p class="m-2 mt-5 mr-20">Clinical Systems</p>
                        <p class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-dark"
                        v-for="clinicalSystem in user.locum_detail.clinical_systems"
                        :key="clinicalSystem.id + '-name1'">
                            {{clinicalSystem ? clinicalSystem.name:null}}
                        </p>
                        
                        <p class="m-2 mt-5 mr-20">Spoken Languages</p>
                        <p class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-dark">
                        English
                        </p>
                        <p class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-dark"
                        v-for="spokenLanguage in user.locum_detail.spoken_languages"
                        :key="spokenLanguage.id + '-name2'">
                        {{spokenLanguage ? spokenLanguage.name:null}}
                        </p>
                    </div>
                </div>
            <!--COLUMN 2-->
                <div class="w-full md:w-1/3 overflow-hidden mb-2">
                    <div class="text-grey mx-5 md:mx-10">
                        <p class="m-2 mr-20 font-semibold">Headline</p>
                        <p class="m-2 text-white">{{user.locum_detail?user.locum_detail.headline:null}}</p>
                        <p class="m-2 mt-5 mr-20 font-semibold">Short Biography</p>
                        <p class="m-2 text-white">{{user.locum_detail?user.locum_detail.short_biography:null}}</p>
                        <p class="m-2 mt-5 mr-20 font-semibold">Special requirements</p>
                        <p class="ml-2 text-white">{{user.locum_detail?user.locum_detail.special_requirements:null}}</p>
                        <p class="m-2 mt-5 mr-20 font-semibold">Preferred rates</p>
                        <p class="ml-2 text-white">Per hour £ (none)</p>
                        <p class="ml-2 mt-1 text-white">Per session £ (none)</p>
                        
                        <div v-if="userComplianceDocuments">
                        <p class="m-2 mt-5 mr-20 font-semibold">Compliance Documents</p>
                        <div v-for="(userComplianceDoc, index) in user.locum_detail.compliance_documents"
                        :key="`${index}-${userComplianceDoc.id}-`"
                        >
                            <a class="m-2 text-white flex items-center" 
                            @click.prevent="downloadItem(userComplianceDoc.file.url,userComplianceDoc.file.filename)">
                            <svgicon
                                name="cloud-download"
                                width="21"
                                height="21"
                                color="transparent white"
                                class="w-3/4"
                            ></svgicon>
                            <span class="w-full flex px-2">{{ userComplianceDoc.file ? userComplianceDoc.compliance_document.name:null }}</span>
                            </a>
                        </div>
                        </div>
                        <div v-if="userMandatoryTrainings">
                        <p class="m-2 mt-5 mr-20 font-semibold">Mandatory Training Documents</p>
                            <div v-for="(userMandatoryTraining, index) in user.locum_detail.mandatory_trainings"
                            :key="`${index}-${userMandatoryTraining.id}-`"
                            >
                            <a class="m-2 text-white flex items-center"
                                :event="userMandatoryTraining.file === null ? disabled:'click'" 
                                @click.prevent="downloadItem(userMandatoryTraining.file.url,userMandatoryTraining.file.filename)">
                                <svgicon
                                v-if="userMandatoryTraining.file"
                                name="cloud-download"
                                width="21"
                                height="21"
                                color="transparent white"
                                class="w-3/4"
                                ></svgicon>
                                <span class="w-full flex px-2">{{userMandatoryTraining.mandatory_training && userMandatoryTraining.file ? userMandatoryTraining.mandatory_training.name:null}}</span>
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
                        :src="user.avatar ? user.avatar.file.url:null"
                        >
                        <img v-if="!user.avatar" class="w-48 rounded-full mr-4" src="~/assets/images/default-user-image.png" >
                        <p class="m-2 text-grey">Sign-up verified by email</p>
                        <p class="m-2 text-white">{{user.is_email_verified ? "Account is E-Mail Verified":"Account is not E-Mail Verified"}}</p>
                        <p class="m-2 text-grey">Active at </p>
                        <p class="m-2 text-white">{{user.status == "Active" ? "Account is Active" :"Account is "+user.status }}</p>
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
                        @click.prevent="changeLocumUserStatus(user.id,selectedStatus)"
                        >Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['user'],
    components:{

    },
    data() {
        return {
        disabled:'true',
        locumDetails : '',
        selectedStatus:'',
        profileTab: true,
        jobTab: false,
        userComplianceDocuments:[],
        userCurrentJobs:[],
        qualifications:[],
        clinicalSystems:[],
        spokenLanguages:[],
        specificLocumCompDocs:[],
        userMandatoryTrainings:[]
        };
    },

    created() {
    
        console.log("this is locum profile",this.user)
        // this.locumDetails = this.user.locum_detail
        // this.userComplianceDocuments = this.user.locum_detail.compliance_documents
        // this.qualifications = this.user.locum_detail.qualifications
        // this.clinicalSystems = this.user.locum_detail.clinical_systems
        // this.spokenLanguages = this.user.locum_detail.spoken_languages
        
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
        },

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
