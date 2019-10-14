<template>
  <div class="flex overflow-x-auto py-2">
    <!-- Ongoing job is a job of the locum that has not yet started -->
    <nuxt-link
      :to="`/locums/${this.user.id}/locum-jobs/locum-allocated-jobs`"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path === `/locums/${user.id}/locum-jobs/locum-allocated-jobs` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >Allocated(Current)</nuxt-link>
    <!-- Ongoing job is a job of the locum that already has started -->
    <nuxt-link
      :to="`/locums/${this.user.id}/locum-jobs/locum-ongoing-jobs`"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path === `/locums/${user.id}/locum-jobs/locum-ongoing-jobs` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >Ongoing</nuxt-link>
    <nuxt-link
      :to="getRoute('locum-available-jobs')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path === `/locums/${user.id}/locum-jobs/locum-available-jobs` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >Available</nuxt-link>
    <nuxt-link
      :to="getRoute('locum-matched-jobs')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path === `/locums/${user.id}/locum-jobs/locum-matched-jobs`? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >Matched</nuxt-link>
    <nuxt-link
      :to="getRoute('locum-applied-jobs')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path === `/locums/${user.id}/locum-jobs/locum-applied-jobs`? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >Applied</nuxt-link>
    <nuxt-link
      :to="getRoute('locum-cancelled-jobs')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path === `/locums/${user.id}/locum-jobs/locum-cancelled-jobs` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >Cancelled</nuxt-link>
    <nuxt-link
      :to="getRoute('locum-unsuccessful-jobs')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path === `/locums/${user.id}/locum-jobs/locum-unsuccessful-jobs` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >Unsuccessful</nuxt-link>
    <nuxt-link
      :to="getRoute('locum-declined-jobs')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path === `/locums/${user.id}/locum-jobs/locum-declined-jobs` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >Declined</nuxt-link>
    <nuxt-link
      :to="getRoute('locum-completed-jobs')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path === `/locums/${user.id}/locum-jobs/locum-completed-jobs` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >Completed</nuxt-link>
  </div>
</template>
<script>
export default {
  props: ["user"],

  computed: {
    getRoute() {
      return tab => {
        try {
          if (!tab) {
            tab = "";
          }
          const query = {
            ...this.$route.query
          };
          return {
            path: `/locums/${this.user.id}/locum-jobs/${tab}`,
            query
          };
        } catch (err) {}
      };
    }
  }
};
</script>