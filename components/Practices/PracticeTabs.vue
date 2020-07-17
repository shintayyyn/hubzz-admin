<template>
  <div class="flex justify-start overflow-x-auto">
    <nuxt-link
      :to="getRoute()"
      class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
      :class="$route.path == `/practices/${practice.id}` ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
    >
      Practice
    </nuxt-link>
    <nuxt-link
      v-if="practice.type == 'Hub' && (practice.status !== 'Inactive' && practice.status !== 'Bogus' && practice.status !== 'Deactivated')"
      :to="getRoute('practice-surgeries')"
      class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
      :class="$route.path.includes(`/practices/${practice.id}/practice-surgeries`)? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
    >
      Surgery Management
    </nuxt-link>
    <nuxt-link
      v-if="practice.type == 'Spoke' && (practice.status !== 'Inactive' && practice.status !== 'Bogus' && practice.status !== 'Deactivated')"
      :to="getRoute('practice-hub')"
      class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
      :class="$route.path == `/practices/${practice.id}/practice-hub`? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
    >
      Hub
    </nuxt-link>
    <nuxt-link
      v-if="(practice.status !== 'Inactive' && practice.status !== 'Bogus' && practice.status !== 'Deactivated')"
      :to="getRoute('practice-invitations')"
      class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
      :class="$route.name.includes('index-practices-id-index-practice-invitations-index') ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
    >
      {{ `Invitation${practice.type === 'Hub' ? 's' : ''}` }}
    </nuxt-link>
    <nuxt-link
      v-if="practice.status !== 'Inactive' && practice.status !== 'Bogus'"
      :to="getRoute('practice-sessions')"
      class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
      :class="$route.path.includes(`/practices/${practice.id}/practice-sessions`) ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
    >
      Sessions
    </nuxt-link>
    <nuxt-link
      v-if="practice.status !== 'Deactivated'"
      :to="getRoute('practice-users')"
      class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
      :class="$route.path.includes(`/practices/${practice.id}/practice-users`) ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
    >
      Users
    </nuxt-link>
    <nuxt-link
      v-if="practice.status !== 'Bogus' && practice.status !== 'Deactivated'"
      :to="getRoute('practice-documents')"
      class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
      :class="$route.path == `/practices/${practice.id}/practice-documents` ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
    >
      Documents
    </nuxt-link>
    <nuxt-link
      v-if="practice.status !== 'Bogus' && practice.status !== 'Deactivated'"
      :to="getRoute('practice-rates')"
      class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
      :class="$route.path == `/practices/${practice.id}/practice-rates` ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
    >
      Rates
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    practice: {
      type: Object,
      default: () => null,
    }
  },

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
        delete query.status
        return {
          path: tab
            ? `/practices/${this.practice.id}/${tab}`
            : `/practices/${this.practice.id}`,
          query
        }
      }
    }
  }
}
</script>
