<template>
  <div class="flex overflow-x-auto py-2">
    <!-- Ongoing job is a job of the locum that has not yet started -->
    <nuxt-link
      :to="`/locums/${$route.params.id}/locum-jobs/locum-allocated-jobs`"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path === `/locums/${$route.params.id}/locum-jobs/locum-allocated-jobs` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >
      Allocated
    </nuxt-link>

    <!-- Ongoing job is a job of the locum that already has started -->
    <nuxt-link
      :to="`/locums/${$route.params.id}/locum-jobs/locum-ongoing-jobs`"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path === `/locums/${$route.params.id}/locum-jobs/locum-ongoing-jobs` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >
      Ongoing
    </nuxt-link>

    <nuxt-link
      :to="getRoute('locum-available-jobs')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path === `/locums/${$route.params.id}/locum-jobs/locum-available-jobs` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >
      Available
    </nuxt-link>

    <!-- <nuxt-link
      :to="getRoute('locum-matched-jobs')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path === `/locums/${$route.params.id}/locum-jobs/locum-matched-jobs`? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >
      Matched
    </nuxt-link> -->
    <nuxt-link
      :to="getRoute('locum-applied-jobs')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path === `/locums/${$route.params.id}/locum-jobs/locum-applied-jobs`? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >
      Applied
    </nuxt-link>

    <nuxt-link
      :to="getRoute('locum-cancelled-jobs')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path === `/locums/${$route.params.id}/locum-jobs/locum-cancelled-jobs` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >
      Cancelled
    </nuxt-link>

    <nuxt-link
      :to="getRoute('locum-unsuccessful-jobs')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path === `/locums/${$route.params.id}/locum-jobs/locum-unsuccessful-jobs` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >
      Unsuccessful
    </nuxt-link>

    <!-- DECLINED IS NOW WITHDRAWN. STATUS STAYS THE SAME(DECLINED) -->
    <nuxt-link
      :to="getRoute('locum-withdrawn-jobs')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path === `/locums/${$route.params.id}/locum-jobs/locum-withdrawn-jobs` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >
      Withdrawn
    </nuxt-link>

    <nuxt-link
      :to="getRoute('locum-completed-jobs')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path === `/locums/${$route.params.id}/locum-jobs/locum-completed-jobs` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >
      Completed
    </nuxt-link>

    <nuxt-link
      :to="getRoute('locum-approved-jobs')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path === `/locums/${$route.params.id}/locum-jobs/locum-approved-jobs` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >
      Approved
    </nuxt-link>

    <!-- <nuxt-link
      :to="getRoute('locum-withrawn-jobs')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer text-white rounded-lg"
      :class="$route.path === `/locums/${$route.params.id}/locum-jobs/locum-withrawn-jobs` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >
      Withrawn
    </nuxt-link> -->
  </div>
</template>

<script>
  export default {
    computed: {
      getRoute () {
        return tab => {
          if (!tab) {
            tab = ""
          }

          const query = {
            ...this.$route.query
          }

          delete query.order_by

          return {
            path: `/locums/${this.$route.params.id}/locum-jobs/${tab}`,
            query
          }
        }
      },
    },
  }
</script>
