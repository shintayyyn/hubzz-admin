<template>
  <div>
    <div class="mt-5">
      <transition name="fade" mode="out-in">
        <PracticeProfile :practice="practice" :professionComplianceCategories="professionComplianceCategories" />
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

    data () {
      return {
        professionComplianceCategories: [],
      }
    },

    computed: {

      practice () {
        return this.$store.state.practices.practice
      },

    },

    async asyncData ({ app, store, route }) {
      try {
        const [
          practice,
          professionComplianceCategories,
        ] = await Promise.all([
          app.$axios.get(`/api/v1/admin/practices/${route.params.id}`).then((response) => {
            return response.data.data.practice
          }),
          app.$axios.get('/api/v1/admin/profession-compliance-categories').then((response) => {
            return response.data.data.profession_compliance_categories
          }),
        ])

        store.commit("practices/SET_SPECIFIC_PRACTICE", practice)

        return {
          professionComplianceCategories,
        }
      } catch (err) {
        store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: "Something went wrong!"
        })

        console.log("get practice error!!!!", err)
      }
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
