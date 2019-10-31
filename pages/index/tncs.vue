<template>
    <div class="flex-1 flex flex-col overflow-hidden py-2">
        <div class="px-4 md:px-6">
            <TermsAndConditionsTabs />
        </div>
        
        <div class="px-4 md:px-6 mt-5">
            <transition name="fade" mode="out-in">
                <component :is="activeComponent" :terms="terms" />
            </transition>
        </div>
    </div>
</template>
<script>
import TermsAndConditions from '@/components/TermsAndConditions/TermsAndConditions'
import PrivacyPolicy from '@/components/TermsAndConditions/PrivacyPolicy'
import TermsAndConditionsTabs from '@/components/TermsAndConditions/TermsAndConditionsTabs'
export default {
  components:{
    TermsAndConditions,
    PrivacyPolicy,
    TermsAndConditionsTabs
  },
  computed: {
    activeComponent() {
    return this.$route.query.active_tab
    },
  },
  data(){
    return{
      terms:null,
      tnc:null,
      privacypolicy:null
    }
  },
  created() {
    const query = {
    ...this.$route.query,
    active_tab: this.$route.query.active_tab || 'termsAndConditions'
    }
    this.$router.push({ query })
  },
  async asyncData({app,store,route}){
    try{
      let response = await app.$axios.get(`/api/v1/admin/terms-and-conditions`)
      const terms = response.data.data.terms
      const tnc = response.data.data.terms.terms_and_conditions
      const privacypolicy = response.data.data.terms.privacy_policy
      console.log(terms)
      return{
          terms,
          tnc,
          privacypolicy
      }
    }catch(err){
      store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
      console.log('get TNCS error!!!!', err)
    }
  },
}
</script>
<style>

</style>