<template>
  <div class="mt-5">
    <LocumCompliance 
      v-if="locumUser"
      :user="locumUser"
      @complianceUpdated="$emit('updateLocumUsers')"
    />

    <nuxt-child :locumUser="locumUser" />
  </div>
</template>

<script>
  import LocumCompliance from "@/components/Locums/LocumCompliance"

  export default {
    components: {
      LocumCompliance,
    },

    props: {
      locumUser: {
        type: Object,
        default: () => null,
      }
    },
    
  }
</script>
