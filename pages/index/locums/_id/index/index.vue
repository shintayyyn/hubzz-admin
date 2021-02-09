<template>
  <section>
    <template>
      <transition name="fade" mode="out-in">
        <LocumProfile
          v-if="locumUser && authAdminPermissions.includes('View Locums')"
          :user="locumUser"
          @updateLocumUsers="() => $emit('updateLocumUsers')"
          @setViewLocumUser="(locumUser) => $emit('setViewLocumUser', locumUser)"
          @setViewLocumUserLoading="(loading) => $emit('setViewLocumUserLoading', loading)"
        />
      </transition>
    </template>

    <nuxt-child />
  </section>
</template>

<script>
  import LocumProfile from "@/components/Locums/LocumProfile"
  export default {
    components: {
      LocumProfile
    },

    props: {
      locumUser: {
        type: Object,
        default: () => null,
      }
    },

    computed: {
      authAdminPermissions () {
        return this.$store.getters["permissions"]
      },
    },
  }
</script>
