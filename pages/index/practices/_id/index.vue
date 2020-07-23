<template>
  <div class="practice-modal p-4 md:p-8 shadow-lg">
    <nuxt-link class="block mb-4" :to="{ name: 'index-practices', query: $route.query }">
      <svgicon
        name="arrow-left-solid"
        height="32"
        width="32"
        class="cursor-pointer text-white hover:text-sunglow fill-current"
      />
    </nuxt-link>

    <AppLoading :loading="loading" spinner />

    <PracticeTabs v-if="practice" :practice="practice" />

    <div
      v-if="
        $route.name.includes('pracUserId')
          || $route.name.includes('pracDocId')
          || $route.name.includes('invitationId')
          || $route.name.includes('practiceSessionId')
      "
      class="practice-shield"
      @click="goBack()"
    />

    <div
      v-if="$route.name.includes('practiceSurgeryId')"
      class="practice-shield"
      @click="$router.push(`/practices/${$route.params.id}/practice-surgeries`)"
    />

    <div
      v-if="$route.name.includes('practiceSessionPartId')"
      class="practice-shield"
      @click="$router.go(-1)"
    />

    <div
      v-if="$route.name.includes('add-spoke')"
      class="practice-shield" @click="$router.go(-1)"
    />

    <nuxt-child
      :practice="practice"
      :professionComplianceCategories="professionComplianceCategories"
      @practiceUpdated="practiceUpdatedHandler"
    />
  </div>
</template>

<script>
import PracticeTabs from "@/components/Practices/PracticeTabs"
import AppLoading from '@/components/Base/AppLoading'

export default {

  components: {
    AppLoading,
    PracticeTabs,
  },

  props: {
    professionComplianceCategories: {
      type: Array,
      default: () => null,
    },
  },

  data () {
    return {
      loading: false,
      practice: null,
    }
  },

  mounted () {
    this.getPractice()
  },

  methods: {
    getPractice () {
      const practiceId = this.$route.params.id
      this.loading = true
      this.$axios.get(`/api/v1/admin/practices/${practiceId}`).then((response) => {
        this.practice = response.data.data.practice
      }).catch((err) => {
        this.$nuxt.error(err)
      }).finally(() => {
        this.loading = false
      })
    },

    practiceUpdatedHandler (practice) {
      console.log('practiceUpdatedHandler', practice)
      if (practice) {
        this.practice = practice
      } else {
        this.getPractice()
      }

      this.$emit('practiceUpdated', practice)
    },

    goBack () {
      let url = "/practices"
      if (this.practice.status === "Inactive") {
        url = "/practices/pending-practices"
      }
      if (this.practice.status === "Bogus") {
        url = "/practices/bogus-practices"
      }
      if (this.practice.status === "Deactivated") {
        url = "/practices/deactivated-practices"
      }
      const query = {
        ...this.$route.query
      }
      this.$router.push({ path: url, query })
    },
  },
}
</script>

<style>
  .card {
    min-width: 100px;
    height: 250px;
    box-sizing: content-box;
  }

  .practice-shield {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #333;
    opacity: 0.5;
    z-index: 511;
  }

  .practice-modal {
    position: fixed;
    top: 0;
    right: 0;
    margin-right: 0%;
    width: 100%;
    height: 100%;
    overflow: auto;
    border-left: solid 2px #ffc72c;
    transition: all 0.3s ease-in-out;
    background-color: #505561;
    z-index: 512;
  }

  @media screen and (min-width: 1200px) {
    .practice-modal {
      width: 80%;
    }
  }
</style>
