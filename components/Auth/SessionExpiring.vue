<template>
  <section>
    <div v-if="sessionExpiring">
      <div class="signout fixed font-semibold top-0 w-full flex justify-center">
        <div class="signout-modal border-solid rounded-b-lg bg-yellow-500 px-6 py-2">
          <div class="flex justify-center py-2">
            <div>
              Your session is expiring in 5 minutes. Would you like to continue?
            </div>
          </div>
          <div class="flex justify-center my-1">
            <div class="mx-2">
              <button
                class="border border-solid bg-yellow-500 hover:text-red-600 focus:outline-none text-black font-bold px-4 py-2 md:py-4 rounded-lg"
                @click.prevent="$emit('logout')"
              >
                Sign-out
              </button>
            </div>
            <div class="mx-2">
              <button
                class="border border-solid bg-yellow-500 hover:text-white hover:bg-red-600 hover:border-red-600 focus:outline-none text-black font-bold w-24 min-w-full px-4 py-2 md:py-4 rounded-lg"
                @click="cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    sessionExpiring () {
      return this.$store.getters["sessionExpiring"]
    }
  },

  methods: {
    async cancel () {
      await this.$axios.$get(`/api/v1/admin/me`)
      this.$store.commit("SESSION_EXPIRING", false)
    }
  },

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