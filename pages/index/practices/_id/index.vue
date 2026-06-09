<template>
  <section>
    <div>
      <AppLoading :loading="loading" spinner />

      <div
        v-if="
          !$route.params.pracUserId &&
            !$route.params.roleId &&
            !$route.params.pracDocId &&
            !$route.params.practiceSessionPartId &&
            !$route.params.invitationId
        "
        class="flex flex-row justify-start overflow-x-auto border-b border-yellow-500 pt-1"
      >
        <nuxt-link
          v-if="canViewPractices"
          :to="`/practices/${$route.params.id}`"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'index-practices-id-index' ? 'border-b-4 border-yellow-500' : 'text-gray-600'"
        >
          Practice
        </nuxt-link>

        <nuxt-link
          v-if="canViewSurgeryManagementTab"
          :to="`/practices/${$route.params.id}/practice-surgeries`"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.path.includes(`/practices/${$route.params.id}/practice-surgeries`) ? 'border-b-4 border-yellow-500' : 'text-gray-600'"
        >
          Surgery Management
        </nuxt-link>

        <nuxt-link
          v-if="canViewHubTab"
          :to="`/practices/${$route.params.id}/practice-hub`"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.path == `/practices/${$route.params.id}/practice-hub` ? 'border-b-4 border-yellow-500' : 'text-gray-600'"
        >
          Hub
        </nuxt-link>

        <nuxt-link
          v-if="canViewInvitationsTab"
          :to="`/practices/${$route.params.id}/practice-invitations`"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name.includes('index-practices-id-index-practice-invitations-index') ? 'border-b-4 border-yellow-500' : 'text-gray-600'"
        >
          {{ `Invitation${practice.type === 'Hub' ? 's' : ''}` }}
        </nuxt-link>

        <nuxt-link
          v-if="canViewSessionsTab"
          :to="`/practices/${$route.params.id}/practice-sessions`"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.path.includes(`/practices/${$route.params.id}/practice-sessions`) ? 'border-b-4 border-yellow-500' : 'text-gray-600'"
        >
          Sessions
        </nuxt-link>

        <nuxt-link
          v-if="canViewUsersTab"
          :to="`/practices/${$route.params.id}/practice-users`"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.path.includes(`/practices/${$route.params.id}/practice-users`) ? 'border-b-4 border-yellow-500' : 'text-gray-600'"
        >
          Users
        </nuxt-link>

        <nuxt-link
          v-if="canViewDocumentsTab"
          :to="`/practices/${$route.params.id}/practice-documents`"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.path == `/practices/${$route.params.id}/practice-documents` ? 'border-b-4 border-yellow-500' : 'text-gray-600'"
        >
          Documents
        </nuxt-link>

        <nuxt-link
          v-if="canViewRatesTab"
          :to="`/practices/${$route.params.id}/practice-rates`"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.path == `/practices/${$route.params.id}/practice-rates` ? 'border-b-4 border-yellow-500' : 'text-gray-600'"
        >
          Rates
        </nuxt-link>
      </div>
    </div>

    <nuxt-child :practice="practice" :professionComplianceCategories="professionComplianceCategories" @practiceUpdated="practiceUpdatedHandler" />
  </section>
</template>

<script>
import AppLoading from '@/components/Base/AppLoading'
export default {
  components: {
    AppLoading
  },

  props: {
    professionComplianceCategories: {
      type: Array,
      default: () => null
    }
  },

  data() {
    return {
      loading: false,
      practice: null,
      practicePermissions: []
    }
  },

  computed: {
    canViewPractices() {
      return this.practicePermissions.includes('View Practices')
    },

    canViewSurgeryManagement() {
      return this.practicePermissions.includes('View Surgery Management')
    },

    isHubPractice() {
      return this.practice && this.practice.type === 'Hub'
    },

    isSpokePractice() {
      return this.practice && this.practice.type === 'Spoke'
    },

    isNotInactiveBogusDeleted() {
      return this.practice && this.practice.status !== 'Inactive' && this.practice.status !== 'Bogus' && this.practice.status !== 'Deleted'
    },

    isNotInactiveBogus() {
      return this.practice && this.practice.status !== 'Inactive' && this.practice.status !== 'Bogus'
    },

    isNotDeleted() {
      return this.practice && this.practice.status !== 'Deleted'
    },

    isNotBogusDeleted() {
      return this.practice && this.practice.status !== 'Bogus' && this.practice.status !== 'Deleted'
    },

    canViewSurgeryManagementTab() {
      return this.isHubPractice && this.isNotInactiveBogusDeleted && this.canViewSurgeryManagement
    },

    canViewHubTab() {
      return this.isSpokePractice && this.isNotInactiveBogusDeleted && this.canViewSurgeryManagement
    },

    canViewInvitationsTab() {
      return this.isNotInactiveBogusDeleted && this.canViewSurgeryManagement
    },

    canViewSessionsTab() {
      return this.isNotInactiveBogus && this.practicePermissions.includes('View Practice Sessions')
    },

    canViewUsersTab() {
      return this.isNotDeleted && this.practicePermissions.includes('View Practice Users')
    },

    canViewDocumentsTab() {
      return this.isNotBogusDeleted && this.practicePermissions.includes('View Practice Documents')
    },

    canViewRatesTab() {
      return this.isNotBogusDeleted && this.practicePermissions.includes('View Practice Rates')
    }
  },

  async asyncData({ app, route, store }) {
    try {
      let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}`)

      const practice = response.data.practice

      const authAdminPermissions = await store.getters['permissions']

      const practicePermissions = await authAdminPermissions.filter(
        item => item.includes('View Practice') || item.includes('View Surgery Management')
      )

      await store.commit('practices/SET_SPECIFIC_PRACTICE', practice)

      return {
        practice,
        practicePermissions
      }
    } catch (err) {
      store.commit('SET_NOTIFICATION', {
        enabled: true,
        status: 'danger',
        text: 'Something went wrong!'
      })
    }
  },

  created() {
    let toRedirect = ''
    if (!this.practicePermissions.includes('View Practices')) {
      switch (this.practicePermissions[0]) {
        case 'View Practice Sessions':
          toRedirect = 'practice-sessions'
          break
        case 'View Surgery Management':
          if (this.practice.type !== 'Hub') {
            toRedirect = 'practice-hub'
          } else {
            toRedirect = 'practice-surgeries'
          }
          break
        case 'View Practice Users':
          toRedirect = 'practice-users'
          break
        case 'View Practice Documents':
          toRedirect = 'practice-documents'
          break
        case 'View Practice Rates':
          toRedirect = 'practice-rates'
          break
        default:
          toRedirect = ''
      }
      this.$router.push(`/practices/${this.$route.params.id}/${toRedirect}`)
    }
  },

  methods: {
    async practiceUpdatedHandler() {
      const practice = await this.getPractice()

      this.$emit('practiceUpdated', practice)
    },

    async getPractice() {
      const res = await this.$axios.$get(`/api/v1/admin/practices/${this.$route.params.id}`)

      const practice = res.data.practice

      this.practice = { ...practice }

      this.$store.commit('practices/SET_SPECIFIC_PRACTICE', practice)

      return practice
    }
  }
}
</script>

<style>
.card {
  min-width: 100px;
  height: 250px;
  box-sizing: content-box;
}

.practice-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}

.practice-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #ffc72c;
  transition: all 0.3s ease-in-out;
  background-color: #505561;
  z-index: 512;
}

@media screen and (min-width: 1200px) {
  .practice-modal {
    width: 80%;
  }
}
</style>
