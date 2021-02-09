<template>
  <section>
    <div>
      <AppLoading :loading="loading" spinner />
      <div class="flex flex-row justify-start overflow-x-auto border-b border-yellow-500 mb-4 pt-1">
        <nuxt-link
          v-if="authAdminPermissions.includes('View Locums')"
          :to="{ name: 'index-locums-id-index', params: { id: $route.params.id } }"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'index-locums-id-index' ? 'border-b-4 border-yellow-500' : 'text-gray-600'"
        >
          Profile
        </nuxt-link>

        <nuxt-link
          v-if="authAdminPermissions.includes('View Locum Jobs')"
          :to="{ name: 'index-locums-id-index-locum-jobs-index', params: { id: $route.params.id } }"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.path.includes(`/locums/${$route.params.id}/locum-jobs`) ? 'border-b-4 border-yellow-500' : 'text-gray-600'"
        >
          Jobs
        </nuxt-link>

        <nuxt-link
          v-if="locumUser && locumUser.status !== 'Deactivated' && authAdminPermissions.includes('View Locum Compliance Detail')"
          :to="{ name: 'index-locums-id-index-locum-compliance', params: { id: $route.params.id } }"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'index-locums-id-index-locum-compliance' || $route.name === 'index-locums-id-index-locum-compliance-docId'? 'border-b-4 border-yellow-500' : 'text-gray-600'"
        >
          Compliance
        </nuxt-link>
      </div>
    </div>

    <nuxt-child
      :locumUser="locumUser"
      @updateLocumUsers="updateLocumUsersHandler"
      @setViewLocumUser="setViewLocumUserHandler"
      @setViewLocumUserLoading="(_loading) => loading = _loading"
    />
  </section>
</template>

<script>
import AppLoading from '@/components/Base/AppLoading'

export default {
  components: {
    AppLoading,
  },

  data () {
    return {
      loading: false,
      locumUser: null,
      locumPermissions: null,
    }
  },

  computed: {
    authAdminPermissions () {
      return this.$store.getters["permissions"]
    },
  },

   async asyncData ({ store, error }) {
    try {
      const authAdminPermissions = store.getters["permissions"]
      
      const locumPermissions = authAdminPermissions.filter(item => item.includes('View Locum'))

      return {
        locumPermissions,
      }

    } catch(err) {
      error({ statusCode: 404 })
      store.commit("SET_NOTIFICATION", {
        enabled: true,
        status: "danger",
        text: "Something went wrong!"
      })
      console.log("get parent practice error!!", err)
    }
  },

  mounted () {
    this.getLocumUser()
  },

  methods: {
    async getLocumUser () {
      let toRedirect = ''
      if (this.locumPermissions.find(item => item === 'View Locums') === undefined){
        switch (this.locumPermissions[0]) {
          case "View Locum Jobs":
            toRedirect = "locum-jobs"
            break
          case "View Locum Compliance Detail":
            toRedirect = "locum-compliance"
            break
          default:
            toRedirect = ''
        }
        this.$axios.get(`/api/v1/admin/locum-users/${this.$route.params.id}`).then((response) => {
          this.locumUser = response.data.data.user
        }).catch((err) => {
          this.$nuxt.error(err)
        }).finally(() => {
          this.$router.push(`/locums/${this.$route.params.id}/${toRedirect}`)
        })
      } else {
        this.loading = true
        this.$axios.get(`/api/v1/admin/locum-users/${this.$route.params.id}`).then((response) => {
          this.locumUser = response.data.data.user
        }).catch((err) => {
          this.$nuxt.error(err)
        }).finally(() => {
          this.loading = false
        })
      }
    },

    setViewLocumUserHandler (locumUser) {
      this.locumUser = locumUser
      this.$emit('locumUserUpdated', locumUser)
    },

    updateLocumUsersHandler () {
      this.getLocumUser()
      this.$emit('updateLocumUsers')
    },
  },
}
</script>

<style>
  .locum-shield {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #333;
    opacity: 0.5;
    z-index: 511;
    cursor: pointer;
  }

  .locum-modal {
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
    .locum-modal {
      width: 80%;
    }
  }
</style>
