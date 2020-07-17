<template>
  <div class="flex justify-start overflow-x-auto">
    <nuxt-link
      :to="getRoute()"
      class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
      :class="
        $route.name === 'index-practices-id-index'
          ? 'bg-sunglow hover:bg-sunglow-dark'
          : 'hover:bg-waterloo text-white'
      "
    >
      Practice
    </nuxt-link>

    <nuxt-link
      v-if="
        practiceType === 'Hub'
          && practiceStatus !== 'Inactive'
          && practiceStatus !== 'Bogus'
          && practiceStatus !== 'Deactivated'
      "
      :to="getRoute('practice-surgeries')"
      class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
      :class="
        $route.path.includes(`/practices/${practiceId}/practice-surgeries`)
          ? 'bg-sunglow hover:bg-sunglow-dark'
          : 'hover:bg-waterloo text-white'
      "
    >
      Surgery Management
    </nuxt-link>

    <nuxt-link
      v-if="
        practiceType == 'Spoke' && (practiceStatus !== 'Inactive' && practiceStatus !== 'Bogus' && practiceStatus !== 'Deactivated')
      "
      :to="getRoute('practice-hub')"
      class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
      :class="$route.path == `/practices/${practiceId}/practice-hub`? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
    >
      Hub
    </nuxt-link>

    <nuxt-link
      v-if="(practiceStatus !== 'Inactive' && practiceStatus !== 'Bogus' && practiceStatus !== 'Deactivated')"
      :to="getRoute('practice-invitations')"
      class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
      :class="$route.name.includes('index-practices-id-index-practice-invitations-index') ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
    >
      {{ `Invitation${practiceType === 'Hub' ? 's' : ''}` }}
    </nuxt-link>

    <nuxt-link
      v-if="practiceStatus !== 'Inactive' && practiceStatus !== 'Bogus'"
      :to="getRoute('practice-sessions')"
      class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
      :class="$route.path.includes(`/practices/${practiceId}/practice-sessions`) ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
    >
      Sessions
    </nuxt-link>

    <nuxt-link
      v-if="practiceStatus !== 'Deactivated'"
      :to="getRoute('practice-users')"
      class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
      :class="$route.path.includes(`/practices/${practiceId}/practice-users`) ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
    >
      Users
    </nuxt-link>

    <nuxt-link
      v-if="practiceStatus !== 'Bogus' && practiceStatus !== 'Deactivated'"
      :to="getRoute('practice-documents')"
      class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
      :class="$route.path == `/practices/${practiceId}/practice-documents` ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
    >
      Documents
    </nuxt-link>

    <nuxt-link
      v-if="practiceStatus !== 'Bogus' && practiceStatus !== 'Deactivated'"
      :to="getRoute('practice-rates')"
      class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
      :class="$route.path == `/practices/${practiceId}/practice-rates` ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
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
    practiceId () {
      return this.practice ? this.practice.id : null
    },

    practiceStatus () {
      return this.practice ? this.practice.status : null
    },

    practiceType () {
      return this.practice ? this.practice.type : null
    },

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
            ? `/practices/${this.practiceId}/${tab}`
            : `/practices/${this.practiceId}`,
          query
        }
      }
    }
  }
}
</script>
