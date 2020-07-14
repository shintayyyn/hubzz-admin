<template>
  <div>
    <div class="mt-5">
      <transition name="fade" mode="out-in">
        <LocumProfile
          v-if="locumUser"
          :user="locumUser"
          @updateLocumUsers="$emit('updateLocumUsers')"
          @setViewLocumUser="(locumUser) => $emit('setViewLocumUser', locumUser)"
          @setViewLocumUserLoading="(loading) => $emit('setViewLocumUserLoading', loading)"
        />
      </transition>
    </div>

    <nuxt-child />

    <div
      v-if="$route.name.includes('docId')"
      class="locum-shield"
      @click="$router.go(-1)"
    />
  </div>
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
  }
</script>
