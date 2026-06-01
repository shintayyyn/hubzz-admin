<template>
  <div>
    <div v-if="!$route.params.practiceSessionPartId" class="flex flex-row justify-start overflow-x-auto border-b border-gray-500 mb-4 pt-1">
      <nuxt-link
        v-for="tab in visibleSessionTabs"
        :key="tab.slug"
        :to="getRoute(tab.slug)"
        class="md:mr-3 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        style="display: flex; min-width: 80px; justify-content: center;"
        :class="isActiveTab(tab) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        {{ tab.label }}
      </nuxt-link>
    </div>

    <div class="py-4">
      <nuxt-child :practice="practice" />
    </div>
  </div>
</template>

<script>
const SESSION_TABS = [
  { label: 'Pending', slug: 'practice-pending-sessions', surgerySlug: 'surgery-pending-sessions', requiresSpoke: true },
  { label: 'Live', slug: 'practice-live-sessions', surgerySlug: 'surgery-live-sessions' },
  { label: 'Applied', slug: 'practice-applied-sessions', surgerySlug: 'surgery-applied-sessions' },
  { label: 'Allocated', slug: 'practice-allocated-sessions', surgerySlug: 'surgery-allocated-sessions' },
  { label: 'Ongoing', slug: 'practice-ongoing-sessions', surgerySlug: 'surgery-ongoing-sessions' },
  { label: 'Completed', slug: 'practice-completed-sessions', surgerySlug: 'surgery-completed-sessions' },
  { label: 'Approved', slug: 'practice-approved-sessions', surgerySlug: 'surgery-approved-sessions' },
  { label: 'Unfilled', slug: 'practice-unfilled-sessions', surgerySlug: 'surgery-unfilled-sessions' },
  { label: 'Cancelled', slug: 'practice-cancelled-sessions', surgerySlug: 'surgery-cancelled-sessions' },
  { label: 'Withdrawn', slug: 'practice-withdrawn-sessions', surgerySlug: 'surgery-withdrawn-sessions' }
]

export default {
  transition: {
    name: 'fade',
    mode: 'out-in'
  },

  props: {
    practice: {
      type: Object,
      default: () => null
    }
  },

  computed: {
    sessionTabs() {
      return SESSION_TABS
    },
    visibleSessionTabs() {
      return this.sessionTabs.filter(tab => !tab.requiresSpoke || (this.practice && this.practice.type == 'Spoke'))
    },
    loadingJobs() {
      return this.$store.state.jobs.loading_jobs
    }
  },

  methods: {
    getRoute(tab = '') {
      const query = {
        ...this.$route.query
      }

      delete query.order_by
      delete query.status

      return {
        path: `/practices/${this.$route.params.id}/practice-sessions/${tab}`,
        query
      }
    },

    isActiveTab(tab) {
      return this.$route.path.includes(tab.slug) || this.$route.path.includes(tab.surgerySlug)
    }
  },

  async asyncData({ store, error }) {
    const authAdminPermissions = store.getters['permissions']

    if (authAdminPermissions.includes('View Practice Sessions') === false) {
      error({
        statusCode: 403,
        message: 'You are not authorized to view this page.'
      })
      return
    }
  },

  created() {
    this.$store.commit('jobs/SET_SESSIONS_PRACTICE_ID_VIEWER', parseInt(this.$route.params.id))

    if (this.$route.name == 'index-practices-id-index-practice-sessions-index') {
      this.$router.push({
        path: `/practices/${this.practice.id}/practice-sessions/practice-live-sessions`,
        query: this.$route.query
      })
    }
  }
}
</script>
