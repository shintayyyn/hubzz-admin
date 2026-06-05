<template>
  <div>
    <AppLoading :loading="loadingPracticeSurgery" spinner />
    <div class="flex flex-row justify-start overflow-x-auto border-b border-gray-500 mb-4 pt-1">
      <nuxt-link
        :to="{ path: `/practices/${$route.params.id}/practice-surgeries/${$route.params.practiceSurgeryId}`, query: $route.query }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.name === 'index-practices-id-index-practice-surgeries-practiceSurgeryId-index' ? 'border-b-4 border-gray-500' : 'text-gray-600'
        "
      >
        Spoke Profile
      </nuxt-link>

      <nuxt-link
        :to="{ path: `/practices/${$route.params.id}/practice-surgeries/${$route.params.practiceSurgeryId}/surgery-sessions`, query: $route.query }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`surgery-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Spoke Sessions
      </nuxt-link>
    </div>

    <nuxt-child
      :practice="practice"
      :practiceSurgery="practiceSurgery"
      :loadingPracticeSurgery="loadingPracticeSurgery"
      @practiceSurgeryDeleted="practiceSurgeryId => $emit('practiceSurgeryDeleted', practiceSurgeryId)"
      @practiceSurgeryUpdated="practiceSurgeryUpdatedHandler"
    />
  </div>
</template>

<script>
import AppLoading from '@/components/Base/AppLoading'

export default {
  components: {
    AppLoading
  },

  props: {
    practice: {
      type: Object,
      default: () => null
    }
  },

  data() {
    return {
      loadingPracticeSurgery: false,
      practiceSurgery: null
    }
  },

  mounted() {
    this.setPracticeSurgery()
  },

  methods: {
    practiceSurgeryUpdatedHandler(practiceSurgery) {
      if (practiceSurgery) {
        this.practiceSurgery = practiceSurgery
        return
      }

      this.setPracticeSurgery()
    },

    setPracticeSurgery() {
      const { id: practiceId, practiceSurgeryId } = this.$route.params

      this.loadingPracticeSurgery = true
      this.$axios
        .get(`/api/v1/admin/practices/${practiceId}/practice-surgeries/${practiceSurgeryId}`)
        .then(response => {
          this.practiceSurgery = response.data.data.practice_surgery
        })
        .catch(err => {
          console.log('err', err.response || err)
          this.$nuxt.error(err)
        })
        .finally(() => {
          this.loadingPracticeSurgery = false
        })
    }
  }
}
</script>

<style>
.card {
  min-width: 100px;
  height: 250px;
  box-sizing: content-box;
}

.spoke-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}

.spoke-modal {
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
  .spoke-modal {
    width: 70%;
  }
}
</style>
