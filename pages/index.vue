<template>
  <div class="flex-1 flex flex-col">
    <nuxt-child/>
  </div>
</template>

<script>
export default {
  layout: "authenticated",

  async asyncData({ store, redirect }) {
    try {
      if (!store.$auth.loggedIn) {
        redirect("/sign-in");
        return;
      }
    } catch (err) {
      console.log("index asyncData pages index err", err);
    }
  }
};
</script>
