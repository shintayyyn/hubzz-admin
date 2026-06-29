<template>
  <div>
    <div>
      <!-- Active Hub relationship -->
      <div v-if="practiceHub">
        <form class="flex flex-col p-2 md:px-4 border rounded-lg mt-4">
          <div class="flex flex-wrap">
            <!-- Hub Details -->
            <div class="w-1/2 text-sm p-2">
              <p class="flex">
                Practice Name
              </p>
              <p class="flex items-center text-sm p-2 font-semibold">
                {{ practiceHub.name }}
              </p>

              <p class="flex">
                Practice Code
              </p>
              <p class="flex text-sm p-2 font-semibold">
                {{ practiceHub.code }}
              </p>

              <p class="flex">
                Address
              </p>
              <p class="flex text-sm p-2 font-semibold">
                {{ practiceHub.address_line_1 }}<br />
                {{ practiceHub.address_line_2 }}<br />
                {{ practiceHub.address_line_3 }}<br />
              </p>

              <p class="flex">
                CCG
              </p>
              <p class="flex text-sm p-2 font-semibold">
                {{ practiceHub.clinical_commissioning_group_name || null }}
              </p>
            </div>

            <!-- Spoke Permissions -->
            <div class="w-1/2 my-2">
              <div class="flex flex-row items-center">
                <div class="text-lg font-semibold">
                  Spoke Permissions
                </div>
              </div>

              <div class="mt-2 mb-4 mx-2">
                <!-- Permission rows -->
                <div class="flex items-center pb-2">
                  <span class="mr-2">
                    <svgicon
                      color="white"
                      :name="practice.allow_surgery_create_sessions ? 'circle-check' : 'times-solid'"
                      class="fill-current w-5 h-5 rounded-full"
                      :class="practice.allow_surgery_create_sessions ? 'bg-green-500' : 'bg-red-500 p-1'"
                    />
                  </span>
                  <p class="font-semibold">
                    Does Hub allow creation of Jobs/Sessions?
                  </p>
                </div>

                <!-- Rate limits (only shown when session creation is allowed) -->
                <div v-if="practice.allow_surgery_create_sessions === true" class="bg-gray-300 p-2 rounded-lg mb-2">
                  <p class="font-semibold pt-2">
                    Rate Limits (Only effective when allowed to create jobs)
                  </p>
                  <div class="p-2">
                    <div v-for="rateLimit in rateLimits" :key="rateLimit.key" class="flex flex-col md:flex-row">
                      <p class="font-semibold md:w-1/2">
                        {{ rateLimit.label }}
                      </p>
                      <p>{{ rateLimit.value }}</p>
                    </div>
                  </div>
                </div>

                <!-- Remaining permission rows -->
                <div v-for="perm in permissionRows" :key="perm.key" class="flex items-center pb-2">
                  <span class="mr-2">
                    <svgicon
                      color="white"
                      :name="practice[perm.key] ? 'circle-check' : 'times-solid'"
                      class="fill-current w-5 h-5 rounded-full"
                      :class="practice[perm.key] ? 'bg-green-500' : 'bg-red-500 p-1'"
                    />
                  </span>
                  <p class="font-semibold">
                    {{ perm.label }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>

        <AppButton v-if="canTerminateSpoke" class="mt-4" :background="'red'" :label="'Terminate this spoke from Hub'" @click="confirm = true" />
      </div>

      <!-- Pending invitations table -->
      <div v-else-if="hubInvitations && hubInvitations.length > 0" class="mt-4">
        <AppTableNew
          :total="hubInvitationsCount"
          :items="hubInvitations"
          :current-page="currentPage"
          :per-page="params.limit"
          :columns="columns"
          :router-link="`/practices/${practice.id}/practice-hub`"
          :loading="loadingSurgeries"
          :loading-message="'Loading Surgeries'"
          @pagechanged="pagechanged"
        >
          <template v-slot:actions="slotProps">
            <div v-if="!slotProps.item.invitation_rejected && canTerminateSpoke" class="flex justify-center">
              <AppButton class="ml-2" :background="'green'" :label="'Accept'" @click="toAcceptInvitation(slotProps.item.id)" />
              <AppButton class="ml-2" :background="'red'" :label="'Reject'" @click="toRejectInvitation(slotProps.item.id)" />
            </div>
            <div v-if="slotProps.item.invitation_rejected" class="flex justify-center">
              <div class="bg-red-500 rounded-lg shadow-lg px-2 py-1">
                Rejected
              </div>
            </div>
          </template>
        </AppTableNew>
      </div>

      <!-- No invitations state -->
      <div v-else>
        <form class="flex flex-col bg-waterloo py-2 px-4 text-sm shadow rounded-lg sm:w-full lg:w-2/3">
          <div class="m-4">
            <div class="inline-flex text-lg">
              <div class="flex">
                <svgicon name="alert" width="48" height="48" color="white" />
              </div>
              <div class="flex">
                <p>This practice has no any invitation.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

    <transition name="drop" mode="out-in">
      <AppConfirm
        v-if="confirm"
        :message="'Are you sure you want to terminate this spoke from hub?'"
        @cancel="confirm = false"
        @confirm="toTerminateFromHub()"
      />
    </transition>

    <div v-if="confirm" class="shield" />

    <nuxt-child />
  </div>
</template>

<script>
import AppButton from '@/components/Base/AppButton'
import AppConfirm from '@/components/Base/AppConfirm'
import AppTableNew from '@/components/Base/AppTableNew'

export default {
  middleware: 'changedPracticeType',

  components: { AppButton, AppConfirm, AppTableNew },

  data() {
    return {
      confirm: false,
      currentPage: 1,
      params: {
        limit: 10,
        offset: 0,
        order_by: 'created_at:desc'
      },
      columns: [
        { name: 'Practice Name', dataIndex: 'practice.surgery.name' },
        { name: 'Practice Code', dataIndex: 'practice.surgery.code', class: 'text-center' },
        { name: 'Invited at', dataIndex: 'created_at_in_gb_formatted', class: 'text-center' },
        { name: 'Actions', dataIndex: '', slot: true, slotName: 'actions', class: 'text-center' }
      ],

      permissionRows: [
        { key: 'allow_surgery_create_permanent_jobs', label: 'Does Hub allow the creation of Permanent Jobs?' },
        { key: 'allow_surgery_bill_locum', label: 'Does Hub permit billing of Locums?' },
        { key: 'allow_surgery_bill_hubzz', label: 'Does Hub permit billing for Hubzz?' },
        { key: 'share_banks_to_other_surgeries', label: 'Can other Spokes see your Banks?' },
        { key: 'share_my_banks', label: 'Does Spoke allow to see hub banks?' }
      ]
    }
  },

  computed: {
    authAdminPermissions() {
      return this.$store.getters['permissions']
    },
    canTerminateSpoke() {
      return this.authAdminPermissions.includes('Terminate Spoke')
    },
    loadingSurgeries() {
      return this.$store.state.practices.loading_practices
    },
    practice() {
      return this.$store.state.practices.practice
    },
    practiceHub() {
      return this.$store.state.practices.practiceHub
    },
    hubInvitationsCount() {
      return this.$store.state.practices.hubInvitationsCount
    },
    hubInvitations() {
      return this.$store.state.practices.hubInvitations
    },

    rateLimits() {
      const p = this.practice
      return [
        { key: 'max_hourly_rate_limit', label: 'Maximum Hourly Rate Limit', value: p.max_hourly_rate_limit ? `£ ${p.max_hourly_rate_limit}` : 'N/A' },
        {
          key: 'max_halfday_rate_limit',
          label: 'Maximum Half Day Rate Limit',
          value: p.max_halfday_rate_limit ? `£ ${p.max_halfday_rate_limit}` : 'N/A'
        },
        {
          key: 'max_wholeday_rate_limit',
          label: 'Maximum Whole Day Rate Limit',
          value: p.max_wholeday_rate_limit ? `£ ${p.max_wholeday_rate_limit}` : 'N/A'
        },
        { key: 'max_ooh_rate_limit', label: 'Maximum Out-of-Hours Rate Limit', value: p.max_ooh_rate_limit ? `£ ${p.max_ooh_rate_limit}` : 'N/A' },
        { key: 'max_excess_hours', label: 'Maximum Excess Hours', value: p.max_excess_hours ? `${p.max_excess_hours} Hrs` : 'N/A' }
      ]
    }
  },

  async asyncData({ app, store, route, error }) {
    try {
      const authAdminPermissions = store.getters['permissions']

      if (!authAdminPermissions.includes('View Surgery Management')) {
        return error({ statusCode: 403, message: 'You are not authorized to view this page.' })
      }

      const params = { limit: 10, offset: 0, order_by: 'created_at:desc' }

      await store.commit('practices/TOGGLE_LOADING', true)

      let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}`)
      const practice = response.data.practice

      if (practice.type === 'Hub') {
        return error({ statusCode: 403, message: 'That function is not available on this practice.' })
      }

      let practiceHub = null

      if (practice.type === 'Spoke') {
        response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}/parent-surgery`)
        practiceHub = response.data.practice.parent_practice
      }

      let practiceInvitationsCount = 0
      let practiceInvitations = []

      if (practice.type === 'Spoke' || practice.type === 'Stand Alone') {
        response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}/parent-surgery/invitations-count`)
        practiceInvitationsCount = response.data.count

        response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}/parent-surgery/invitations`, { params })
        practiceInvitations = response.data.practice_surgeries
      }

      await store.commit('practices/SET_SPECIFIC_PRACTICE', practice)
      await store.commit('practices/SET_PRACTICE_HUB', practiceHub)
      await store.commit('practices/SET_HUBZZ_INVITATIONS_COUNT', practiceInvitationsCount)
      await store.commit('practices/SET_HUBZZ_INVITATIONS', practiceInvitations)
      await store.commit('practices/TOGGLE_LOADING', false)
    } catch (err) {
      error({ statusCode: 404 })
      store.commit('SET_NOTIFICATION', {
        enabled: true,
        status: 'danger',
        text: 'Something went wrong!'
      })
    }
  },

  methods: {
    getHubInvitations() {
      this.$store
        .dispatch('practices/fetchHubInvitations', {
          practice_id: this.$route.params.id,
          countOnly: true
        })
        .then(() => {
          this.$store.dispatch('practices/fetchHubInvitations', {
            practice_id: this.$route.params.id,
            limit: this.params.limit,
            offset: this.params.offset
          })
        })
    },

    pagechanged(page) {
      const query = { ...this.$route.query, practice_children_page: page || 1 }
      this.params.offset = this.params.limit * (page - 1)
      this.$router.push({ query })
      this.getHubInvitations()
    },

    async toTerminateFromHub() {
      try {
        await this.$axios.$delete(`/api/v1/admin/practices/${this.$route.params.id}/parent-surgery`)

        this.$store.commit('practices/SET_PRACTICE_HUB', null)
        this.$store.commit('practices/SET_PRACTICE_PARENT', null)

        await this.refreshPageData()

        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'success',
          text: 'Successfully Terminated Spoke'
        })
        this.confirm = false
      } catch (err) {
        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'danger',
          text: err.response.data.message
        })
      }
    },

    async refreshPageData() {
      const id = this.$route.params.id
      const params = this.params

      const practiceRes = await this.$axios.$get(`/api/v1/admin/practices/${id}`)
      const practice = practiceRes.data.practice
      await this.$store.commit('practices/SET_SPECIFIC_PRACTICE', practice)

      await this.$store.commit('practices/SET_PRACTICE_HUB', null)

      const countRes = await this.$axios.$get(`/api/v1/admin/practices/${id}/parent-surgery/invitations-count`)
      await this.$store.commit('practices/SET_HUBZZ_INVITATIONS_COUNT', countRes.data.count)

      const invRes = await this.$axios.$get(`/api/v1/admin/practices/${id}/parent-surgery/invitations`, { params })
      await this.$store.commit('practices/SET_HUBZZ_INVITATIONS', invRes.data.practice_surgeries)
    },

    async toAcceptInvitation(id) {
      try {
        await this.$axios.$put(`/api/v1/admin/practices/${this.$route.params.id}/parent-surgery/invitations/${id}/accept-invitation`)

        await this.refreshPageData()
        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'success',
          text: 'Successfully Accepted Invitation'
        })
      } catch (err) {
        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'danger',
          text: err.response.data.message
        })
      }
    },

    async toRejectInvitation(id) {
      try {
        await this.$axios.$put(`/api/v1/admin/practices/${this.$route.params.id}/parent-surgery/invitations/${id}/reject-invitation`)

        await this.refreshPageData()
        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'success',
          text: 'Successfully Rejected Invitation'
        })
      } catch (err) {
        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'danger',
          text: err.response.data.message
        })
      }
    }
  }
}
</script>
