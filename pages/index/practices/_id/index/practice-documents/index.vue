<template>
  <div class="mt-5">
    <transition name="fade" mode="out-in">    
      <PracticeDocuments
        :practice="practice"
        @practiceUpdated="(practice) => $emit('practiceUpdated', practice)"
      />
    </transition>

    <nuxt-child />
  </div>
</template>

<script>
import PracticeDocuments from '@/components/Practices/PracticeDocuments'

export default {
  components:{
    PracticeDocuments
  },

  transition:{
    name:'fade',
    mode:'out-in'
  },

  props: {
    practice: {
      type: Object,
      default: () => null,
    },
  },
  
  data (){
    return{
      // practice: null
    }
  },
}
</script>
