<template>
  <div class="confirmcancel fixed top-0 mx-4 w-4/5 flex justify-center">
    <div class="confirmcancel-modal border-solid rounded-b-lg bg-yellow-500 px-6 py-2">
      <div class="flex justify-center py-2">
        <div class>Are you sure?</div>
      </div>
      <div class="flex justify-center my-1">
        <div class="mx-2">
          <button
            class="border border-solid bg-yellow-500 hover:text-white focus:outline-none text-black font-bold py-2 md:py-5 rounded-lg"
            @click="performAction()"
            style="width:100px;"
          >Yes</button>
        </div>
        <div class="mx-2">
          <button
            class="border border-solid bg-yellow-500 hover:text-white focus:outline-none text-black font-bold py-2 md:py-5 rounded-lg"
            @click.prevent="$emit('close')"
            style="width:100px;"
          >Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["adminAccountId"],
  created() {
    console.log("account id", this.adminAccountId);
  },
  methods: {
    async performAction() {
      if (this.adminAccountId) {
        await this.$axios
          .$delete(`/api/v1/admin/admin-users/${this.adminAccountId}`)
          .then(() => {
            this.$store.getters["adminusers/getAdminUsers"]
            this.$emit("close");
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: "Admin Account Successfully Deleted"
            });
          })
          .catch(err => {
            console.log("delete error", err);
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: "Something Went Wrong!"
            });
          });
      }
    }
  }
};
</script>
<style scoped>
.confirmcancel {
  z-index: 600;
}
.confirmcancel-modal {
  width: 100%;
  /* margin: 0 20px; */
}
@media screen and (min-width: 991px) {
  .confirmcancel-modal {
    width: auto;
  }
}
button:active {
  transform: translate(2px, 2px);
}
</style>

