<template>
  <div class="mt-5">
    <div class="flex flex-row justify-start overflow-x-auto border-b border-gray-500 mb-4 pt-1">
      <nuxt-link
        v-for="tab in sessionTabs"
        :key="tab.slug"
        :to="`${sessionPathBase}/${tab.slug}`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(tab.slug) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        {{ tab.label }}
      </nuxt-link>
    </div>
    <nuxt-child :practice="practice" :practiceSurgery="practiceSurgery" />
  </div>
</template>

<script>
const SESSION_TABS = [
  { label: 'Pending', slug: 'surgery-pending-sessions' },
  { label: 'Live', slug: 'surgery-live-sessions' },
  { label: 'Applied', slug: 'surgery-applied-sessions' },
  { label: 'Allocated', slug: 'surgery-allocated-sessions' },
  { label: 'Ongoing', slug: 'surgery-ongoing-sessions' },
  { label: 'Completed', slug: 'surgery-completed-sessions' },
  { label: 'Approved', slug: 'surgery-approved-sessions' },
  { label: 'Unfilled', slug: 'surgery-unfilled-sessions' },
  { label: 'Cancelled', slug: 'surgery-cancelled-sessions' },
  { label: 'Withdrawn', slug: 'surgery-withdrawn-sessions' }
]

export default {
  props: {
    practice: {
      type: Object,
      default: () => null
    },

    practiceSurgery: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    sessionPathBase() {
      return `/practices/${this.$route.params.id}/practice-surgeries/${this.$route.params.practiceSurgeryId}/surgery-sessions`
    },
    sessionTabs() {
      return SESSION_TABS
    }
  }
}
</script>
