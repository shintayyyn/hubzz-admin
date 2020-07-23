<template>
  <div class="spoke-modal p-4 md:p-8 shadow-lg">
    <nuxt-link class="block cursor-pointer mb-4" :to="{ path:`/practices/${$route.params.id}/practice-surgeries`, query: $route.query }">
      <svgicon
        name="arrow-left-solid"
        height="32"
        width="32"
        class="text-white hover:text-sunglow fill-current"
      />
    </nuxt-link>

    <AppLoading :loading="loadingPracticeSurgery" spinner />

    <div class="flex justify-start overflow-x-auto">
      <nuxt-link
        :to="{ path: `/practices/${$route.params.id}/practice-surgeries/${$route.params.practiceSurgeryId}`, query: $route.query }" 
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="
          $route.name === 'index-practices-id-index-practice-surgeries-practiceSurgeryId-index'
            ? 'bg-waterloo hover:bg-gray-500'
            : 'hover:bg-waterloo'
        "
      >
        Spoke Profile
      </nuxt-link>

      <nuxt-link
        :to="{ path: `/practices/${$route.params.id}/practice-surgeries/${$route.params.practiceSurgeryId}/surgery-sessions`, query: $route.query }" 
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`surgery-sessions`)? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >
        Spoke Sessions
      </nuxt-link>

      <!-- <nuxt-link
        :to="{ path: `/practices/${$route.params.id}/practice-surgeries/${$route.params.practiceSurgeryId}/surgery-billing`, query: $route.query }" 
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.path.includes(`surgery-billing`)? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >
        Spoke Billings
      </nuxt-link> -->
    </div>

    <nuxt-child
      :practice="practice"
      :practiceSurgery="practiceSurgery"
      :loadingPracticeSurgery="loadingPracticeSurgery"
      @practiceSurgeryDeleted="(practiceSurgeryId) => $emit('practiceSurgeryDeleted', practiceSurgeryId)"
      @practiceSurgeryUpdated="practiceSurgeryUpdatedHandler"
    />
  </div>
</template>

<script>
import AppLoading from '@/components/Base/AppLoading'

export default {

  components: {
    AppLoading,
  },

  props: {
    practice: {
      type: Object,
      default: () => null,
    },
  },

  data (){
    return{
      loadingPracticeSurgery: false,
      practiceSurgery: null,
    }
  },

  mounted () {
    this.setPracticeSurgery()
  },

  methods: {
    practiceSurgeryUpdatedHandler (practiceSurgery) {
      if (practiceSurgery) {
        this.practiceSurgery = practiceSurgery
        return
      }

      this.setPracticeSurgery()
    },

    setPracticeSurgery () {
      const {
        id: practiceId,
        practiceSurgeryId,
      } = this.$route.params

      this.loadingPracticeSurgery = true
      this.$axios.get(`/api/v1/admin/practices/${practiceId}/practice-surgeries/${practiceSurgeryId}`).then((response) => {
        this.practiceSurgery = response.data.data.practice_surgery
      }).catch((err) => {
        console.log('err', err.response || err)
        this.$nuxt.error(err)
      }).finally(() => {
        this.loadingPracticeSurgery = false
      })
    }
  },
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
    border-left: solid 2px #FFC72C;
    transition: all 0.3s ease-in-out;
    background-color:#505561;
    z-index: 512;
  }

  @media screen and (min-width: 1200px) {
    .spoke-modal {
      width: 70%;
    }
  }
</style>
