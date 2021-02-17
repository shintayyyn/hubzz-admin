<template>
  <div class="flex flex-row justify-start overflow-x-auto border-b border-gray-500 mb-4 pt-1">
    <!-- Ongoing job is a job of the locum that has not yet started -->
    <nuxt-link
      :to="`/locums/${$route.params.id}/locum-jobs/locum-allocated-jobs`"
      class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.path === `/locums/${$route.params.id}/locum-jobs/locum-allocated-jobs` ? 'border-b-4 border-gray-500' : 'text-gray-600'"
    >
      Allocated
    </nuxt-link>

    <!-- Ongoing job is a job of the locum that already has started -->
    <nuxt-link
      :to="`/locums/${$route.params.id}/locum-jobs/locum-ongoing-jobs`"
      class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.path === `/locums/${$route.params.id}/locum-jobs/locum-ongoing-jobs` ? 'border-b-4 border-gray-500' : 'text-gray-600'"
    >
      Ongoing
    </nuxt-link>

    <nuxt-link
      :to="getRoute('locum-available-jobs')"
      class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.path === `/locums/${$route.params.id}/locum-jobs/locum-available-jobs` ? 'border-b-4 border-gray-500' : 'text-gray-600'"
    >
      Available
    </nuxt-link>

    <!-- <nuxt-link
      :to="getRoute('locum-matched-jobs')"
      class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.path === `/locums/${$route.params.id}/locum-jobs/locum-matched-jobs`? 'border-b-4 border-gray-500' : 'text-gray-600'"
    >
      Matched
    </nuxt-link> -->
    <nuxt-link
      :to="getRoute('locum-applied-jobs')"
      class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.path === `/locums/${$route.params.id}/locum-jobs/locum-applied-jobs`? 'border-b-4 border-gray-500' : 'text-gray-600'"
    >
      Applied
    </nuxt-link>

    <nuxt-link
      :to="getRoute('locum-cancelled-jobs')"
      class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.path === `/locums/${$route.params.id}/locum-jobs/locum-cancelled-jobs` ? 'border-b-4 border-gray-500' : 'text-gray-600'"
    >
      Cancelled
    </nuxt-link>

    <nuxt-link
      :to="getRoute('locum-unsuccessful-jobs')"
      class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.path === `/locums/${$route.params.id}/locum-jobs/locum-unsuccessful-jobs` ? 'border-b-4 border-gray-500' : 'text-gray-600'"
    >
      Unsuccessful
    </nuxt-link>

    <!-- DECLINED IS NOW WITHDRAWN. STATUS STAYS THE SAME(DECLINED) -->
    <nuxt-link
      :to="getRoute('locum-withdrawn-jobs')"
      class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.path === `/locums/${$route.params.id}/locum-jobs/locum-withdrawn-jobs` ? 'border-b-4 border-gray-500' : 'text-gray-600'"
    >
      Withdrawn
    </nuxt-link>

    <nuxt-link
      :to="getRoute('locum-completed-jobs')"
      class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.path === `/locums/${$route.params.id}/locum-jobs/locum-completed-jobs` ? 'border-b-4 border-gray-500' : 'text-gray-600'"
    >
      Completed
    </nuxt-link>

    <nuxt-link
      :to="getRoute('locum-approved-jobs')"
      class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.path === `/locums/${$route.params.id}/locum-jobs/locum-approved-jobs` ? 'border-b-4 border-gray-500' : 'text-gray-600'"
    >
      Approved
    </nuxt-link>

    <!-- <nuxt-link
      :to="getRoute('locum-withrawn-jobs')"
      class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.path === `/locums/${$route.params.id}/locum-jobs/locum-withrawn-jobs` ? 'border-b-4 border-gray-500' : 'text-gray-600'"
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
