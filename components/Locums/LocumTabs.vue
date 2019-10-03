<template>
  <div class="flex flex-row flex-wrap justify-start">
    <nuxt-link
      :to="getRoute()"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path == `/locums/${user.id}` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >Profile</nuxt-link>
    <nuxt-link
      :to="getRoute('locum-jobs')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path.includes(`/locums/${user.id}/locum-jobs`) ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >Jobs</nuxt-link>
    <nuxt-link
      :to="getRoute('locum-compliance')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path === `/locums/${user.id}/locum-compliance` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >Compliance</nuxt-link>
  </div>
</template>
<script>
export default {
  props: ["user"],
  computed: {
    getRoute() {
      return tab => {
        if (!tab) {
          tab = "";
        }
        const query = {
          ...this.$route.query
        };
        return {
          path: tab
            ? `/locums/${this.user.id}/${tab}`
            : `/locums/${this.user.id}`,
          query
        };
      };
    }
  }
};
</script>