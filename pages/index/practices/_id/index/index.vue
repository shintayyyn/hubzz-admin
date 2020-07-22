<template>
  <div>
    <div class="mt-5">
      <transition name="fade" mode="out-in">
        <PracticeProfile
          v-if="practice"
          :practice="practice"
          :professionComplianceCategories="professionComplianceCategories"
          @practiceUpdated="(practice) => $emit('practiceUpdated', practice)"
        />
      </transition>
    </div>
  </div>
</template>

<script>
  import PracticeProfile from "@/components/Practices/PracticeProfile"

  export default {

    components: {
      PracticeProfile
    },

    props: {
      practice: {
        type: Object,
        default: () => null,
      },

      professionComplianceCategories: {
        type: Array,
        default: () => null,
      },
    },

    methods: {
      goBack () {
        const query = {
          ...this.$route.query
        }

        if (query.session_tab) {
          delete query.session_tab
        }

        this.$router.push({ path: "/practices", query })
      },
    },

  }
</script>
