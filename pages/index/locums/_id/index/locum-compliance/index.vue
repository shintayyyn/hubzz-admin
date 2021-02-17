<template>
  <section class="mt-5">
    <template v-if="$route.name === 'index-locums-id-index-locum-compliance'">
      <AppLoading :loading="loadingCompliances" :message="'Loading compliances'" />
    
      <LocumCompliance 
        v-if="locumUser"
        :user="locumUser"
        @complianceUpdated="complianceUpdatedHandler"
        @loadingCompliances="(_loadingCompliances) => loadingCompliances = _loadingCompliances"
      />
    </template>
    <nuxt-child :locumUser="locumUser" />
  </section>
</template>

<script>
  import AppLoading from "@/components/Base/AppLoading"
  import LocumCompliance from "@/components/Locums/LocumCompliance"

  export default {
    components: {
      AppLoading,
      LocumCompliance,
    },

    props: {
      locumUser: {
        type: Object,
        default: () => null,
      }
    },

    data () {
      return {
        loadingCompliances: false,
      }
    },

    async asyncData ({ store, error }) {
      const authAdminPermissions = store.getters["permissions"]

      if (authAdminPermissions.includes('View Locum Compliance Detail') === false) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })
        return
      }
    },

    methods: {
      complianceUpdatedHandler () {
        this.$emit('updateLocumUsers')
      },
    },
    
  }
</script>
