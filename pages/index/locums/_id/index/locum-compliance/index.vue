<template>
  <div class="mt-5">
    <AppLoading :loading="loadingCompliances" :message="'Loading compliances'" />
    
    <LocumCompliance 
      v-if="locumUser"
      :user="locumUser"
      @complianceUpdated="complianceUpdatedHandler"
      @loadingCompliances="(_loadingCompliances) => loadingCompliances = _loadingCompliances"
    />

    <nuxt-child :locumUser="locumUser" />
  </div>
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

    methods: {
      complianceUpdatedHandler () {
        this.$emit('updateLocumUsers')
      },
    },
    
  }
</script>
