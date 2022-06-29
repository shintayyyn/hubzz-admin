<template>
  <div>
    <AppLoading :loading="loading" spinner />

    <LocumComplianceFile v-if="locumUser && locumDetailMandatoryTraining" :user="locumUser" :locumComplianceDocument="locumDetailMandatoryTraining" />
  </div>
</template>

<script>
import LocumComplianceFile from '@/components/Locums/LocumComplianceFile'
import AppLoading from '@/components/Base/AppLoading'

export default {
  transition: {
    name: 'slide',
    mode: 'out-in'
  },

  components: {
    LocumComplianceFile,
    AppLoading
  },

  props: {
    locumUser: {
      type: Object,
      default: () => null
    }
  },

  data() {
    return {
      loading: false,
      locumDetailMandatoryTraining: null
    }
  },

  mounted() {
    const locumDetailMandatoryTrainingId = this.$route.params.docId
    this.$store.commit('locums/SET_LOCUM_USER', null)
    this.loading = true
    this.$axios
      .get(`/api/v1/admin/locum-detail-mandatory-trainings/${locumDetailMandatoryTrainingId}`)
      .then(response => {
        this.locumDetailMandatoryTraining = response.data.data.locum_detail_mandatory_training
      })
      .catch(err => {
        this.$nuxt.error(err)
      })
      .finally(() => {
        this.loading = false
      })
  }
}
</script>

<style>
.compliance-modal {
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
  .compliance-modal {
    width: 70%;
  }
}
</style>
