<template>
  <section class="mt-5">
    <template v-if="$route.name === 'index-practices-id-index-practice-surgeries'" class="flex flex-col rounded-lg">
      <div class="flex overflow-hidden">
        <div class="flex overflow-x-auto mb-2">
          <div
            v-if="practice && practice.status === 'Active' && authAdminPermissions.includes('Create New Spoke To Hub')"
            class="flex-3 mx-1 whitespace-no-wrap"
          >
            <AppButton
              :label="'Add Spoke for this Hub'"
              :icon="'add-rectangle'"
              :nuxtLink="{ path: `/practices/${this.$route.params.id}/practice-surgeries/add-spoke`, query: $route.query }"
            />
          </div>

          <div v-if="deleteSurgery == true" class="flex-3 mx-1 whitespace-no-wrap">
            <button
              class="inline-flex items-center no-underline py-2 px-4 bg-green-500 hover:bg-green-600 text-sm font-semibold text-white rounded-lg shadow float-right"
              @click="deleteSurgery = false"
            >
              Done
              <svgicon name="circle-check" width="21" height="21" color="white white" class="mx-1 -my-1" />
            </button>
          </div>
        </div>
      </div>

      <template v-if="practiceChildren.length > 0">
        <AppTableNew
          :total="total"
          :items="practiceChildren"
          :current-page="currentPage"
          :perPage="perPage"
          :columns="columns"
          :loading="loadingSurgeries"
          :loading-message="'Loading Surgeries'"
          :router-link="`/practices/${$route.params.id}/practice-surgeries`"
          @pagechanged="pagechanged"
        >
          <template v-slot:type_slot="slotProps">
            <div class="flex justify-center">
              <div class="rounded-full text-center py-2 px-4 md:px-8" :class="statusStyle(slotProps.item)">
                {{ checkStatus(slotProps.item) }}
              </div>

              <div
                v-if="slotProps.item.termination_requested_at"
                class="flex items-center w-10 ml-2 md:ml-2 md:ml-0 cursor-pointer text-red-600 hover:text-red-700"
                @click.prevent.stop="viewTerminationModal(slotProps.item)"
              >
                <div class="p-1 bg-white rounded-lg shadow">
                  <svgicon name="exclamation-circle-solid" width="22" height="22" class="fill-current" />
                </div>
              </div>
            </div>
          </template>
        </AppTableNew>
      </template>

      <div v-else>
        <div class="mt-10 w-full text-center" style="font-family: Nunito">
          <p>This practice has no children.</p>
        </div>
      </div>

      <!-- END TABLE -->

      <transition name="slide" mode="out-in">
        <div v-if="addPracticeSurgeryModal" class="add-practice-modal shadow-lg">
          <AddPracticeSurgery :practice="practice" :spokesCount="total" @close="addPracticeSurgeryModal = false" />
        </div>
      </transition>
    </template>

    <nuxt-child :practice="practice" @practiceSurgeryDeleted="practiceSurgeryDeletedHandler" />
  </section>
</template>

<script>
import AddPracticeSurgery from '@/components/Practices/AddPracticeSurgery'
import AppTableNew from '@/components/Base/AppTableNew'
import AppButton from '@/components/Base/AppButton'

export default {
  middleware: 'changedPracticeType',

  transition: {
    name: 'fade',
    mode: 'out-in'
  },

  components: {
    AddPracticeSurgery,
    AppTableNew,
    AppButton
  },

  props: {
    practice: {
      type: Object,
      default: () => null
    }
  },

  data() {
    return {
      // practiceChildren:{},
      // total:0,
      // totalPages:0,
      deleteSurgery: false,
      currentPage: 1,
      perPage: 0,
      addPracticeSurgeryModal: false,
      loadingSurgeries: false,
      specificChildSurgery: '',
      columns: [
        {
          name: 'Practice ID',
          dataIndex: 'child_practice.id',
          class: 'md:text-center',
          sortable: false,
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '140px'
        },
        {
          name: 'Practice Name',
          dataIndex: 'child_practice.name',
          class: 'md:text-center',
          sortable: false,
          flex: '1 0 0',
          minWidth: '120px',
          maxWidth: '550px'
        },
        {
          name: 'Practice Code',
          dataIndex: 'child_practice.code',
          class: 'md:text-center',
          sortable: false,
          flex: '1 0 0',
          minWidth: '120px',
          maxWidth: '550px'
        },
        {
          name: 'Invited',
          dataIndex: 'created_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: false,
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '170px'
        },
        {
          name: 'Accepted',
          dataIndex: 'invitation_accepted_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: false,
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '170px'
        },
        {
          name: 'Invitation Status',
          dataIndex: 'status',
          class: 'md:text-center',
          sortable: false,
          slot: true,
          slotName: 'type_slot',
          flex: '1 0 0',
          minWidth: '200px',
          maxWidth: '200px'
        }
      ]
    }
  },

  computed: {
    authAdminPermissions() {
      return this.$store.getters['permissions']
    },
    total() {
      return this.$store.state.practices.practiceSpokesCount
    },
    practiceChildren() {
      return this.$store.state.practices.practiceSpokes
    },
    totalPages() {
      return this.$store.state.practices.practiceSpokesPageCount
    }
  },

  async asyncData({ app, route, store, error }) {
    try {
      let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}`)
      const practice = response.data.practice

      const authAdminPermissions = store.getters['permissions']

      if (authAdminPermissions.includes('View Surgery Management') === false) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.'
        })
        return
      }

      if (practice.type === 'Spoke') {
        error({
          statusCode: 403,
          message: 'That function is not available on this practice.'
        })

        return
      }

      return {
        practice
      }
    } catch (err) {
      console.log('get practice error', err)
    }
  },

  async created() {
    try {
      this.loadingSurgeries = true

      this.$store.commit('practices/SET_SPECIFIC_PRACTICE', this.practice)

      const count = await this.$axios
        .get(`/api/v1/admin/practices/${this.$route.params.id}/practice-surgeries/count`)
        .then(response => response.data.data.count)

      this.$store.commit('practices/SET_PRACTICE_SPOKES_COUNT', count)

      this.perPage = 5

      let pageCount = Math.ceil(this.total / this.perPage)

      this.$store.commit('practices/SET_PRACTICE_SPOKES_PAGE_COUNT', pageCount)

      this.getPracticeSurgeries()
    } catch (err) {
      console.log('err', err.response || err)

      this.$store.commit('SET_NOTIFICATION', {
        enabled: true,
        status: 'danger',
        text: err.response.data.message
      })
    }
  },

  methods: {
    practiceSurgeryDeletedHandler(practiceSurgeryId) {
      console.log('practiceSurgeryDeletedHandler', practiceSurgeryId)
      this.getPracticeSurgeries()
    },

    async viewTerminationModal(practiceSurgery) {
      console.log('viewTerminationModal', practiceSurgery)

      this.specificChildSurgery = practiceSurgery

      this.$router.push(`/practices/${this.$route.params.id}/practice-surgeries/${practiceSurgery.id}/terminate-spoke`)
    },

    getPracticeSurgeries() {
      const limit = 5

      const offset = this.perPage * (parseInt(this.currentPage) - 1)

      const params = { limit, offset }

      this.$axios
        .get(`/api/v1/admin/practices/${this.$route.params.id}/practice-surgeries`, {
          params
        })
        .then(response => {
          this.$store.commit('practices/SET_PRACTICE_SPOKES', response.data.data.practice_surgeries)
        })
        .catch(err => {
          console.log('get children error!!!!', err)
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'danger',
            text: err.response.data.message
          })
        })
        .finally(() => {
          this.loadingSurgeries = false
        })
    },

    pagechanged(page) {
      this.currentPage = page || 1
      this.getPracticeSurgeries()
    },

    statusStyle(status) {
      switch (this.checkStatus(status)) {
        case 'Active':
          return 'bg-green-500 text-white'
        case 'Rejected':
          return 'bg-gray-500 text-gray-700'
        case 'Termination Requested':
          return 'bg-orange-500 text-white'
        case 'Terminated':
          return 'bg-red-800 text-red-400'
        default:
          return 'bg-yellow-400 text-black'
      }
    },

    checkStatus(invitation) {
      let result = 'Invited'

      if (invitation.invitation_accepted_at) {
        result = 'Active'
      }

      if (invitation.invitation_rejected_at) {
        result = 'Rejected'
      }

      if (invitation.termination_requested_at) {
        if (invitation.invitation_accepted_at) {
          result = 'Termination Requested'
        } else {
          result = 'Cancellation Requested'
        }
      }

      if (invitation.terminated_at) {
        result = 'Terminated'
      }

      return result
    }
  }
}
</script>

<style>
.add-spoke-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}

.card {
  min-width: 100px;
  height: 250px;
  box-sizing: content-box;
}

.add-practice-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}

.add-practice-modal {
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

.termination-modal {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 25px;
  width: 800px;
  max-width: 95%;
  max-height: 80%;
  overflow: auto;
  transition: all 0.3s ease-in-out;
  background-color: #505561;
  z-index: 512;
}

@media screen and (min-width: 1200px) {
  .add-practice-modal {
    width: 70%;
  }
}

@media screen and (min-width: 768px) {
  .termination-modal {
    max-height: 60%;
  }
}
</style>
