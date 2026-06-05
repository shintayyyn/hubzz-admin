<template>
  <section>
    <div v-if="sessionExpiring">
      <div class="signout fixed font-semibold top-0 w-full flex justify-center">
        <div class="signout-modal border-solid rounded-b-lg bg-waterloo-dark px-12 py-2">
          <div class="flex text-white justify-center py-2">
            <div>
              Your session is expiring in 5 minutes. Would you like to continue your session?
            </div>
          </div>
          <div class="flex justify-center my-1">
            <AppButton class="mr-2" :label="'Log Out'" @click="$emit('logout')" />
            <AppButton class="mr-2" :label="'Continue with Session'" @click="continueSession" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AppButton from '~/components/Base/AppButton'
export default {
  components: {
    AppButton
  },
  computed: {
    sessionExpiring() {
      return this.$store.getters['sessionExpiring']
    }
  },

  methods: {
    async continueSession() {
      await this.$axios.$patch(`/api/v1/admin/me/update-token`)
      this.$store.commit('SESSION_EXPIRING', false)
    }
  }
}
</script>
<style scoped>
.signout {
  z-index: 600;
}
.signout-modal {
  width: 100%;
  margin: 0 20px;
}
@media screen and (min-width: 991px) {
  .signout-modal {
    width: auto;
  }
}
button:active {
  transform: translate(2px, 2px);
}
</style>
