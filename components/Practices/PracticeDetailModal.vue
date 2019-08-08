<template>
    <div class="p-8 max-w-xl">
    <nuxt-link to="/practices" class="cursor-pointer">
      <svgicon name="arrow-left-solid" height="32" width="32" class="text-white fill-current"/>
    </nuxt-link>

    <PracticeTabs :practice="practice"/>

    <div class="mt-5">
      <transition name="fade" mode="out-in">
        <Component :is="activeComponent" :practice="practice" />
      </transition>
    </div>
    
    <div>
      <nuxt-child/>
    </div>

  </div>
</template>
<script>
import PracticeTabs from '@/components/Practices/PracticeTabs'
import PracticeProfile from '@/components/Practices/PracticeProfile'
import PracticeSurgeries from '@/components/Practices/PracticeSurgeries'
import PracticeSessions from '@/components/Practices/PracticeSessions'
import PracticeUsers from '@/components/Practices/PracticeUsers'
import PracticeDocuments from '@/components/Practices/PracticeDocuments'
import PracticeRates from '@/components/Practices/PracticeRates'
export default {
    props:['practice'],
    components:{ 
        PracticeTabs,
        practice_profile : PracticeProfile,
        practice_surgeries : PracticeSurgeries,
        practice_sessions : PracticeSessions,
        practice_users : PracticeUsers,
        practice_documents : PracticeDocuments,
        practice_rates : PracticeRates
    },
    created(){
        const query = {
            ...this.$route.query,
            practice_tab: this.$route.query.practice_tab || 'practice_profile'
        }
        this.$router.push({ query })
    },
    computed:{
        activeComponent(){
            return this.$route.query.practice_tab
        }
    }
    
}
</script>
