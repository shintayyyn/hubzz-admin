<template>
  <div class="locum-modal shadow-lg">
    <div class="px-4 md:px-8">
      <div class="py-4">
        <svgicon
          name="arrow-left-solid"
          height="32"
          widht="32"
          class="text-white hover:text-sunglow fill-current cursor-pointer"
          @click="$router.push('/locums')"
        />
      </div>

      <AppLoading :loading="loading" spinner />

      <div class="flex flex-row flex-wrap justify-start">
        <nuxt-link
          v-if="authAdminPermissions.includes('View Locums')"
          :to="{ name: 'index-locums-id-index', params: { id: $route.params.id } }"
          class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg transition-hover"
          :class="$route.name === 'index-locums-id-index' ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
        >
          Profile
        </nuxt-link>

        <nuxt-link
          v-if="authAdminPermissions.includes('View Locum Jobs')"
          :to="{ name: 'index-locums-id-index-locum-jobs-index', params: { id: $route.params.id } }"
          class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg transition-hover"
          :class="$route.path.includes(`/locums/${$route.params.id}/locum-jobs`) ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
        >
          Jobs
        </nuxt-link>

        <nuxt-link
          v-if="locumUser && locumUser.status !== 'Deactivated' && authAdminPermissions.includes('View Locum Compliance Detail')"
          :to="{ name: 'index-locums-id-index-locum-compliance', params: { id: $route.params.id } }"
          class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg transition-hover"
          :class="$route.name === 'index-locums-id-index-locum-compliance' ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
        >
          Compliance
        </nuxt-link>
      </div>

      <div 
        v-if="$route.name.includes('locumJobPartId')" 
        class="locum-shield" @click="$router.go(-1)"
      />

      <div
        v-if="$route.name.includes('index-locum-compliance-docId')"
        class="locum-shield"
        @click="$router.go(-1)"
      />
      
      <div
        v-if="$route.name.includes('locumJobId') || $route.name === 'index-locums-id-index-locum-compliance-mandatory-training-docId'"
        class="locum-shield"
        @click="$router.go(-1)"
      />
    </div>

    <nuxt-child
      :locumUser="locumUser"
      @updateLocumUsers="updateLocumUsersHandler"
      @setViewLocumUser="setViewLocumUserHandler"
      @setViewLocumUserLoading="(_loading) => loading = _loading"
    />
  </div>
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
      const authAdminpermissions = store.getters["permissions"]
      
      const locumPermissions = authAdminpermissions.filter(item => item.includes('View Locum'))

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
      console.log('dsadsa', this.locumPermissions.find(item => item === 'View Locums'))
      if (this.locumPermissions.find(item => item === 'View Locums') === undefined){
        console.log('gago')
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
        console.log('redirect')
        this.$axios.get(`/api/v1/admin/locum-users/${this.$route.params.id}`).then((response) => {
          this.locumUser = response.data.data.user
        }).catch((err) => {
          this.$nuxt.error(err)
        }).finally(() => {
          this.$router.push(`/locums/${this.$route.params.id}/${toRedirect}`)
        })
      } else {
        console.log('tang ina')
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
