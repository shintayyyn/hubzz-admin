<template>
  <div class="flex flex-row justify-start overflow-x-auto border-b border-gray-500 mb-4 pt-1">
    <nuxt-link
      v-for="tab in tabs"
      :key="tab.slug"
      :to="tabTo(tab)"
      class="md:mr-3 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :style="tabStyle"
      :class="isActiveTab(tab.slug) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
    >
      {{ tab.label }}
    </nuxt-link>
  </div>
</template>

<script>
export default {
  computed: {
    tabs() {
      return [
        { label: 'Allocated', slug: 'locum-allocated-jobs', keepQuery: false },
        { label: 'Ongoing', slug: 'locum-ongoing-jobs', keepQuery: false },
        { label: 'Available', slug: 'locum-available-jobs', keepQuery: true },
        { label: 'Applied', slug: 'locum-applied-jobs', keepQuery: true },
        { label: 'Cancelled', slug: 'locum-cancelled-jobs', keepQuery: true },
        { label: 'Unsuccessful', slug: 'locum-unsuccessful-jobs', keepQuery: true },
        { label: 'Withdrawn', slug: 'locum-withdrawn-jobs', keepQuery: true },
        { label: 'Completed', slug: 'locum-completed-jobs', keepQuery: true },
        { label: 'Approved', slug: 'locum-approved-jobs', keepQuery: true }
      ]
    },

    tabStyle() {
      return 'display: flex; min-width: 80px; max-width: 250px; justify-content: center;'
    },

    baseLocumJobsPath() {
      return `/locums/${this.$route.params.id}/locum-jobs`
    }
  },

  methods: {
    tabPath(slug) {
      return `${this.baseLocumJobsPath}/${slug || ''}`
    },

    isActiveTab(slug) {
      return this.$route.path.startsWith(this.tabPath(slug))
    },

    tabTo(tab) {
      if (!tab.keepQuery) {
        return this.tabPath(tab.slug)
      }

      const query = {
        ...this.$route.query
      }

      delete query.order_by

      return {
        path: this.tabPath(tab.slug),
        query
      }
    }
  }
}
</script>
