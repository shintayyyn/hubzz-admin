<template>
  <div class="flex justify-start overflow-x-auto">
    <nuxt-link
      v-for="tab in tabs"
      :key="tab.label"
      :to="getRoute(tab.path)"
      class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
      :class="isActiveTab(tab.path) ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
    >
      {{ tab.label }}
    </nuxt-link>
  </div>
</template>
<script>
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
    tabs() {
      return [
        { label: 'Spoke Profile', path: '' },
        { label: 'Spoke Sessions', path: 'surgery-sessions' },
        { label: 'Spoke Billings', path: 'surgery-billing' }
      ]
    }
  },

  methods: {
    getRoute(tab = '') {
      const query = {
        ...this.$route.query
      }
      delete query.order_by
      return {
        path: tab
          ? `/practices/${this.practice.id}/practice-surgeries/${this.practiceSurgery.id}/${tab}`
          : `/practices/${this.practice.id}/practice-surgeries/${this.practiceSurgery.id}`,
        query
      }
    },

    isActiveTab(tab) {
      if (!tab) {
        return this.$route.path == `/practices/${this.practice.id}/practice-surgeries/${this.practiceSurgery.id}`
      }
      return this.$route.path.includes(tab)
    }
  }
}
</script>
