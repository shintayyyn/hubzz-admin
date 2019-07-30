<template>
  <div class="fixed lg:absolute pin-t pin-b pin-r pin-l flex flex-col overflow-y-auto overflow-x-hidden">
    <div class="page-overlap flex-1 flex-col self-end bg-trout overflow-auto">
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
        <div class="mx-6 overflow-auto">
          <!-- <div class="flex flex-wrap">
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                class="bg-grey-dark hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
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
                class="border-white rounded-lg p-3 text-white text-sm no-underline"
                :to="{path:`/locums/${locumUser.id}/locum-compliance`,query: $route.query}"
                :event="locumUser.compliance_status==='Empty' ? disabled : 'click'"
                :class="locumUser.compliance_status==='Empty' ? 'text-grey-dark bg-red m-3 rounded-lg' :'hover:bg-waterloo-light'">
                  <strong>{{locumUser.compliance_status === 'Empty'?'No Compliance Documents Uploaded':'Compliances'}}</strong>
                </nuxt-link>
              </div>
            </div>
          </div> -->
          <LocumsTabs />
          <transition name="fade" mode="out-in">
            <Component :is="activeComponent"/>
          </transition>
          
      <!-- BODY -->
        
 
      </div>
      <!-- BODY -->
       <nuxt-child/>
    </div>
  </div>
 
</template>

<script>
import LocumsTabs from '~/components/Locums/LocumsTabs'
import Profile from '~/components/Locums/Profile'
import Compliance from '~/components/Locums/Compliance'
export default {
  // transition: "subpage",
  components: {
    LocumsTabs,
    Profile,
    Compliance
  },
  // data() {
  //   return {
  //     disabled:'true',
  //     locumUser:null,
  //     selectedStatus:'',
  //     profileTab: true,
  //     jobTab: false,
  //     locumUserComplianceDocuments:[],
  //     locumUserCurrentJobs:[],
  //     qualifications:[],
  //     clinicalSystems:[],
  //     spokenLanguages:[],
  //     specificLocumCompDocs:[],
  //     locumUserMandatoryTrainings:[]
  //   };
  // },
  
  // async asyncData({ app, route }) {
  //   try {
  //     let response = await app.$axios.get(`/api/v1/admin/locum-users/${route.params.id}`)
  //     const locumUser = response.data.data.user
  //     const locumUserComplianceDocuments = locumUser.locum_detail.compliance_documents
  //     const qualifications = locumUser.locum_detail.qualifications
  //     const clinicalSystems = locumUser.locum_detail.clinical_systems
  //     const spokenLanguages = locumUser.locum_detail.spoken_languages

  //     const locumUserMandatoryTrainings = locumUser.locum_detail.mandatory_trainings

  //     response = await app.$axios.get(`/api/v1/admin/jobs`)
  //     const allJobs = response.data.data.jobs

  //     const locumUserCurrentJobs = allJobs.filter((locumsAppointed)=>{
  //       return locumsAppointed.appointed_to_locum_detail_id === locumUser.locum_detail.id
  //     })      

  //     return{
  //     locumUser,
  //     locumUserComplianceDocuments,
  //     qualifications,
  //     clinicalSystems,
  //     spokenLanguages,
  //     locumUserMandatoryTrainings,
  //     locumUserCurrentJobs,
  //     selectedStatus: locumUser.status
  //     }

  //   } catch (err) {
  //     console.log("index practices index create asyncData err", err);
  //   }
  // },
  create() {
     let firstTab = 'profile'
     console.log(firstTab)
    const query = {
      ...this.$route.query,
      locums_tab: this.$route.query.locums_tab || firstTab
    }
    this.$router.push({ query })
      console.log(this.$route.query.locums_tab)
},

computed: {
  activeComponent() {
    if (this.$route.query.locums_tab === 'profile') {
      return 'Profile'
    }
    if (this.$route.query.locums_tab === 'jobs') {
      return 'Jobs'
    }
    if (this.$route.query.locums_tab === 'compliance') {
      return 'Compliance'
    }
  }
},
  // methods:{
  //   downloadItem (imgUrl, imgFilename) {
  //     const axios = require('axios');
  //     axios({
  //     url: imgUrl,
  //     method: 'GET',
  //     responseType: 'blob', // important
  //   }).then(response => {
  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', imgFilename);
  //     document.body.appendChild(link);
  //     link.click();
  //     });
  //   },

  //   async changeLocumUserStatus(locumID,activeDisabled){
  //     try{
  //       await this.$axios.put('/api/v1/admin/locum-users/'+locumID+'/status',{
  //         status:activeDisabled
  //       })
  //       // alert('Saved')
  //       this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'alert', text: 'Saved' })
  //     }catch(err){
  //       console.log("index practices index put status err", err);
  //       // alert('Something went wrong!!')
  //       this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!!' })
        
  //     }
  //   }
  // }
};
</script>

<style>
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