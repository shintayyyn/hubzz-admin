<template>
    <div class="max-w-xl mt-2 text-sm text-white">
        <SessionsTabs/>
        <div>
            <transition name="fade" mode="out-in">
                <Component :is="activeComponent" :practice="practice" /> 
            </transition>
        </div>
    </div>
</template>
<script>
import SessionsTabs from '@/components/Practices/SessionsTabs'
import PracticeAppliedSessions from '@/components/Practices/Sessions/PracticeAppliedSessions.vue'
import PracticeAvailableSessions from '@/components/Practices/Sessions/PracticeAvailableSessions.vue'
import PracticeCancelledSessions from '@/components/Practices/Sessions/PracticeCancelledSessions.vue'
import PracticeCompletedSessions from '@/components/Practices/Sessions/PracticeCompletedSessions.vue'
import PracticeCurrentSessions from '@/components/Practices/Sessions/PracticeCurrentSessions.vue'
import PracticeDeclinedSessions from '@/components/Practices/Sessions/PracticeDeclinedSessions.vue'
import PracticeUnfilledSessions from '@/components/Practices/Sessions/PracticeUnfilledSessions.vue'
export default {
    props:['practice'],
    components:{
        SessionsTabs,
        session_applied: PracticeAppliedSessions,
        session_available: PracticeAvailableSessions,
        session_cancelled: PracticeCancelledSessions,
        session_completed: PracticeCompletedSessions,
        session_current: PracticeCurrentSessions,
        session_declined: PracticeDeclinedSessions,
        session_unfilled: PracticeUnfilledSessions
    },
    computed:{
        activeComponent(){
            return this.$route.query.session_tab
        }
    },
    data(){
        return{

        }
    },
    created(){
        console.log(this.practice)
        const query = {
            ...this.$route.query,
            session_tab:this.$route.query.session_tab || 'session_available'
        }
        this.$router.push({query})
    }

}
</script>
