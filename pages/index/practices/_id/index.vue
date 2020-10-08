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
    <!-- {{$route.name}}  do this for later-->
    <AppLoading :loading="loading" spinner />

    <div class="flex justify-start overflow-x-auto">
      <nuxt-link
        v-if="practicePermissions.includes('View Practices')"
        :to="`/practices/${$route.params.id}`"
        class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
        :class="
          $route.name === 'index-practices-id-index'
            ? 'bg-sunglow hover:bg-sunglow-dark'
            : 'hover:bg-waterloo text-white'
        "
      >
        Practice
      </nuxt-link>

      <nuxt-link
        v-if="
          practice 
            && practice.type === 'Hub'
            && practice.status !== 'Inactive'
            && practice.status !== 'Bogus'
            && practice.status !== 'Deactivated'
            && practicePermissions.includes('View Surgery Management')
        "
        :to="`/practices/${$route.params.id}/practice-surgeries`"
        class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
        :class="
          $route.path.includes(`/practices/${$route.params.id}/practice-surgeries`)
            ? 'bg-sunglow hover:bg-sunglow-dark'
            : 'hover:bg-waterloo text-white'
        "
      >
        Surgery Management
      </nuxt-link>

      <nuxt-link
        v-if="
          practice 
            && practice.type === 'Spoke' 
            && (practice.status !== 'Inactive' 
            && practice.status !== 'Bogus' 
            && practice.status !== 'Deactivated')
            && practicePermissions.includes('View Surgery Management')
        "
        :to="`/practices/${$route.params.id}/practice-hub`"
        class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
        :class="$route.path == `/practices/${$route.params.id}/practice-hub`? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
      >
        Hub
      </nuxt-link>

      <nuxt-link
        v-if="
          practice 
            && practice.status !== 'Inactive' 
            && practice.status !== 'Bogus' 
            && practice.status !== 'Deactivated'
            && practicePermissions.includes('View Surgery Management')
        "
        :to="`/practices/${$route.params.id}/practice-invitations`"
        class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
        :class="$route.name.includes('index-practices-id-index-practice-invitations-index') ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
      >
        {{ `Invitation${practice.type === 'Hub' ? 's' : ''}` }}
      </nuxt-link>

      <nuxt-link
        v-if="
          practice 
            && practice.status !== 'Inactive' 
            && practice.status !== 'Bogus'
            && practicePermissions.includes('View Practice Sessions')
        "
        :to="`/practices/${$route.params.id}/practice-sessions`"
        class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
        :class="$route.path.includes(`/practices/${$route.params.id}/practice-sessions`) ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
      >
        Sessions
      </nuxt-link>

      <nuxt-link
        v-if="
          practice 
            && practice.status !== 'Deactivated'
            && practicePermissions.includes('View Practice Users')
        "
        :to="`/practices/${$route.params.id}/practice-users`"
        class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
        :class="$route.path.includes(`/practices/${$route.params.id}/practice-users`) ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
      >
        Users
      </nuxt-link>

      <nuxt-link
        v-if="
          practice 
            && practice.status !== 'Bogus' 
            && practice.status !== 'Deactivated'
            && practicePermissions.includes('View Practice Documents')
        "
        :to="`/practices/${$route.params.id}/practice-documents` "
        class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
        :class="$route.path == `/practices/${$route.params.id}/practice-documents` ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
      >
        Documents
      </nuxt-link>

      <nuxt-link
        v-if="
          practice 
            && practice.status !== 'Bogus' 
            && practice.status !== 'Deactivated'
            && practicePermissions.includes('View Practice Rates')
        "
        :to="`/practices/${$route.params.id}/practice-rates`"
        class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
        :class="$route.path == `/practices/${$route.params.id}/practice-rates` ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
      >
        Rates
      </nuxt-link>
    </div>

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
import AppLoading from '@/components/Base/AppLoading'
export default {
  components: {
    AppLoading,
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
      practicePermissions: null,
    }
  },

  computed: {
    getRoute () {
      return tab => {
        if (!tab) {
          tab = ""
        }
        const query = {
          ...this.$route.query
        }
        delete query.order_by
        delete query.status
        return {
          path: tab
            ? `/practices/${this.$route.params.id}/${tab}`
            : `/practices/${this.$route.params.id}`,
          query
        }
      }
    }
  },

  async asyncData ({ app, route ,store }) {
    try {
      let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}`)
      const practice = response.data.practice

      const authAdminPermissions = store.getters["permissions"]
      
      const practicePermissions = authAdminPermissions.filter(item => item.includes('View Practice') || item.includes('View Surgery Management'))

      await store.commit("practices/SET_SPECIFIC_PRACTICE", practice)
      
      return {
        practice,
        practicePermissions
      }

    } catch (err) {
      store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: "Something went wrong!"
			})
			console.log("Get hubzz invoices error!", err)
    }
  },

  created () {
    let toRedirect = ''
    if (this.practicePermissions.find(item => item === 'View Practices') === undefined) {
      console.log('redirecting')
      switch (this.practicePermissions[0]) {
        case "View Practice Sessions":
          toRedirect = "practice-sessions"
          break
        case "View Surgery Management":
          if (this.practice.type !== 'Hub') {
            toRedirect = "practice-hub"
          } else {
            toRedirect = "practice-surgeries"
          }
          break
        case "View Practice Users":
          toRedirect = "practice-users"
          break
        case "View Practice Documents":
          toRedirect = "practice-documents"
          break
        case "View Practice Rates":
          toRedirect = "practice-rates"
          break
        default:
          toRedirect = ''
      }
      this.$router.push(`/practices/${this.$route.params.id}/${toRedirect}`)
    }
  },

  methods: {
    practiceUpdatedHandler (practice) {
      console.log('practiceUpdatedHandler', practice)
      if (practice) {
        this.practice = practice
      } else {
        this.getPractice()
      }

      this.$emit('practiceUpdated', practice)
    },

    async getPractice () {
      await this.$axios.$get(`/api/v1/admin/practices/${this.$route.params.id}`).then(res => {
        const practice = res.data.practice
        this.$store.commit("practices/SET_SPECIFIC_PRACTICE", practice)
      })
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
