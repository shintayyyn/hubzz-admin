<template>
  <section class="flex-1 flex flex-col overflow-y-auto">
    <template
      v-if="
        (authAdminPermissions.includes('View Locums') ||
          authAdminPermissions.includes('View Locum Jobs') ||
          authAdminPermissions.includes('View Locum Compliance Detail')) &&
          $route.name === 'index-locums'
      "
    >
      <div class="flex flex-col md:flex-row justify-between md:items-center">
        <div class="flex flex-col w-full justify-start mb-2">
          <div class="flex justify-between">
            <div class="flex">
              <div class="w-full">
                <AppInputSmall
                  v-model="search"
                  :type="'text'"
                  :name="'search'"
                  :button="true"
                  :buttonLabel="'Search'"
                  :placeholder="'Search Locum by Name'"
                  @click="searchSubmit()"
                />
              </div>

              <div class="mx-1 my-2">
                <AppButton
                  label="Filters"
                  icon="caret-down"
                  :rotate="filterModal ? 180 : ''"
                  :customTheme="'border-2 border-gray-400 rounded-lg font-bold text-gray-600'"
                  labelClass="flex-row-reverse mr-2"
                  iconWidth="10"
                  @click="filterModal = !filterModal"
                />
              </div>

              <div v-if="filterModal" class="mx-1 my-2">
                <AppButton
                  label="Apply"
                  :customTheme="'bg-orange-400 hover:bg-orange-500 text-gray-700 border border-gray-400 rounded'"
                  @click="submitFilters()"
                />
              </div>

              <div v-if="filterModal" class="mx-1 my-2">
                <AppButton
                  label="Clear"
                  :customTheme="'bg-gray-400 hover:bg-gray-500 text-black border border-gray-400 rounded'"
                  @click="filterReset"
                />
              </div>

              <!-- <div class="mx-1 my-2">
                <AppButton
                  label="Message"
                  :customTheme="
                    `border rounded-lg ${
                      chosenLocums.length > 0 ? 'bg-orange-400 hover:bg-orange-500 text-gray-700' : 'bg-gray-400 hover:bg-gray-500 text-black'
                    }`
                  "
                  labelClass="flex-row-reverse mr-2"
                  :disabled="chosenLocums.length === 0"
                  @click="sendMessageModal = !sendMessageModal"
                />
              </div> -->
            </div>
          </div>
          <div class="flex flex-row flex-wrap justify-start items-center w-full rounded-lg -mt-3" :class="filterModal ? 'flex' : 'hidden'">
            <div class="text-gray-800 w-full lg:w-1/4 md:w-1/5">
              <AppInputSmall v-model="filterStatus" :type="'select'" :name="'locum_status'" :placeholder="'Locum Status'" :items="locumStatuses" />
            </div>

            <div class="mx-2 text-gray-800 w-full lg:w-1/4 md:w-1/5">
              <AppInputSmall
                v-model="filterCompliances"
                :type="'select'"
                :name="'compliance_status'"
                :placeholder="'Compliance Status'"
                :items="complianceStatuses"
              />
            </div>
          </div>
        </div>
      </div>

      <AppTableNew
        v-if="count !== 0"
        :total="count"
        :items="locumUsers"
        :currentPage="currentPage"
        :perPage="limit"
        :columns="columns"
        :loading="loading"
        :routerLink="`/locums`"
        :orderBy="orderBy"
        :customWidth="'800'"
        :min-height="'55vh'"
        :noTextResize="true"
        @pagechanged="pageChangedHandler"
        @sorted="_orderBy => (orderBy = _orderBy)"
        @limitchanged="limitChangedHandler"
        @checkClicked="toggleCheck"
        @messageButtonClicked="messageButtonClicked"
      >
        <template v-slot:messageButton="slotProps">
          <div class="flex justify-center">
            <svgicon name="chat" width="20" class="text-gray-600 fill-current" />
          </div>
        </template>

        <template v-slot:checker="slotProps">
          <input :id="slotProps.item" v-model="chosenLocums" type="checkbox" :value="slotProps.item" />
          <label :for="slotProps.item" />
        </template>

        <template v-slot:status_slot="slotProps">
          <div class="text-center text-xs" :class="statusStyle(slotProps.item.status)">
            {{ slotProps.item.status }}
          </div>
        </template>

        <template v-slot:compliance_slot="slotProps">
          <div class="text-center text-xs" :class="complianceStatusStyle(slotProps.item.compliance_status)">
            {{ slotProps.item.compliance_status }}
          </div>
        </template>

        <template v-slot:registration_type_slot="slotProps">
          <div class="text-center text-xs">
            {{ registrationType(slotProps.item.referrer_domain) }}
          </div>
        </template>
      </AppTableNew>

      <div v-if="count === 0 && !loading" class="mt-2 w-full text-center">
        <span>{{ hasFilter ? 'No locums found.' : 'No registered locums.' }}</span>
      </div>
    </template>

    <transition name="fade" mode="out-in">
      <div v-if="sendMessageModal && chosenLocums.length > 0" class="message-modal md:w-2/3 lg:w-1/2 xl:w-1/3">
        <SendMessageModal :user="chosenLocums[0]" @close="sendMessageModal = false" />
      </div>
    </transition>

    <div v-if="sendMessageModal" class="shield" @click="sendMessageModal = false" />

    <nuxt-child @updateLocumUsers="getAllLocumUsers" @locumUserUpdated="locumUserUpdatedHandler" />
  </section>
</template>

<script>
import debounce from 'lodash.debounce'
import AppTableNew from '@/components/Base/AppTableNew'
import AppInputSmall from '@/components/Base/AppInputSmall'
import AppButton from '@/components/Base/AppButton'
import SendMessageModal from '@/components/Messages/SendMessageModal'

export default {
  components: {
    AppTableNew,
    AppInputSmall,
    AppButton,
    SendMessageModal
  },

  data() {
    return {
      loading: false,
      currentPage: 1,
      filterStatus: null,
      filterCompliances: null,
      search: '',
      limit: 15,
      orderBy: ['created_at_in_gb_formatted:desc'],
      count: 0,
      locumUsers: [],

      locumStatuses: [
        {
          label: 'Active',
          value: 'Active'
        },
        {
          label: 'Dormant',
          value: 'Dormant'
        },
        {
          label: 'Inactive',
          value: 'Inactive'
        },
        {
          label: 'Bogus',
          value: 'Bogus'
        },
        {
          label: 'Deactivated',
          value: 'Deactivated'
        },
        {
          label: 'Account Suspension',
          value: 'Account Suspension'
        },
        {
          label: 'Compliance Suspension',
          value: 'Compliance Suspension'
        }
      ],

      complianceStatuses: [
        {
          label: 'Empty',
          value: 'Empty'
        },
        {
          label: 'Incomplete',
          value: 'Incomplete'
        },
        {
          label: 'Pending',
          value: 'Pending'
        },
        {
          label: 'Expiring',
          value: 'Expiring'
        },
        {
          label: 'Expired',
          value: 'Expired'
        },
        {
          label: 'Rejected',
          value: 'Rejected'
        },
        {
          label: 'Compliant',
          value: 'Compliant'
        }
      ],

      filterModal: false,

      chosenLocums: [],

      sendMessageModal: false
    }
  },

  computed: {
    authAdminPermissions() {
      return this.$store.getters['permissions']
    },
    columns() {
      return [
        // {
        //   name: 'Check',
        //   dataIndex: 'checker',
        //   class: 'text-center',
        //   slotName: 'checker',
        //   eventName: 'checkClicked',
        //   width: 80,
        //   order: 1
        // },
        {
          name: 'Message',
          dataIndex: 'messageButton',
          class: 'text-center',
          slotName: 'messageButton',
          eventName: 'messageButtonClicked',
          width: 80,
          order: 1
        },
        {
          name: 'User ID',
          dataIndex: 'id',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '140px',
          width: 100
        },
        {
          name: 'Name',
          dataIndex: 'name',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '120px',
          maxWidth: '550px'
        },
        {
          name: 'E-Mail Address',
          dataIndex: 'email',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '120px',
          maxWidth: '550px'
        },
        {
          name: 'Profession',
          dataIndex: 'profession_name',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '550px'
        },
        {
          name: 'Date Signed-up',
          dataIndex: 'created_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '170px',
          width: 130
        },
        {
          name: 'Sign-up verified',
          dataIndex: 'email_verified_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '170px',
          width: 130
        },
        {
          name: 'Status',
          dataIndex: 'status',
          class: 'md:text-center',
          sortable: true,
          slot: true,
          slotName: 'status_slot',
          flex: '1 0 0',
          minWidth: '150px',
          maxWidth: '170px',
          width: 150
        },
        {
          name: 'Compliance Status',
          dataIndex: 'compliance_status',
          class: 'md:text-center',
          sortable: true,
          slot: true,
          slotName: 'compliance_slot',
          flex: '1 0 0',
          minWidth: '150px',
          maxWidth: '170px',
          width: 130
        },
        {
          name: 'Registration Type',
          dataIndex: 'referrer_domain',
          class: 'md:text-center',
          sortable: true,
          slot: true,
          slotName: 'registration_type_slot',
          flex: '1 0 0',
          minWidth: '150px',
          maxWidth: '170px',
          width: 130
        }
      ]
    },

    offset() {
      return this.limit * (this.currentPage - 1)
    },

    hasFilter() {
      return this.search || this.filterStatus || this.filterCompliances
    },

    totalPages() {
      return Math.ceil(this.count / this.limit)
    },

    orderByValue: {
      get() {
        return this.orderBy.length > 0 ? this.orderBy[0] : null
      },
      set(orderBy) {
        this.orderBy = [orderBy]
      }
    }
  },

  watch: {
    // filterStatus () {
    // 	this.currentPage = 1
    //   this.getAllLocumUsers()
    // },

    // filterCompliances () {
    // 	this.currentPage = 1
    //   this.getAllLocumUsers()
    // },

    search() {
      this.searchSubmit()
    },

    orderBy() {
      this.currentPage = 1
      this.getAllLocumUsers()
    }
  },

  mounted() {
    this.$socket.on('updateLocumStatus', this.locumUserUpdatedHandler)

    this.count = 0
    this.locumUsers = []
    this.getAllLocumUsers()
  },

  destroyed() {
    this.$socket.removeListener('updateLocumStatus', this.locumUserUpdatedHandler)
  },

  methods: {
    messageButtonClicked(item) {
      console.log('messageButtonClicked', item)

      this.$axios
        .get(`/api/v1/conversations?locum_user_id=${item.id}`)
        .then(res => {
          if (res.data.data.conversations.length > 0) {
            this.$router.push(`/messages/${res.data.data.conversations[0].id}`)
          } else {
            this.$router.push(`/messages/create/${item.id}`)
          }
        })
        .catch(err => {
          console.log('err', err.response || err)
          if (err.response.data.message) {
            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'danger',
              text: [`${err.response.data.message}`]
            })
          }
        })
    },

    toggleCheck(item) {
      const index = this.chosenLocums.findIndex(locum => {
        return locum.id === item.id
      })

      if (index > -1) {
        this.chosenLocums.splice(index, 1)
      } else {
        this.chosenLocums.push(item)
      }
    },

    submitFilters() {
      this.currentPage = 1
      this.getAllLocumUsers()
    },

    getAllLocumUsers() {
      const filters = {}

      if (this.search) {
        filters.search = this.search
      }

      if (this.filterStatus) {
        filters.status = this.filterStatus
      }

      if (this.filterCompliances) {
        filters.compliance_status = this.filterCompliances
      }

      this.loading = true

      Promise.all([
        this.$axios
          .get('/api/v1/admin/locum-users/count', {
            params: {
              ...filters
            }
          })
          .then(response => response.data.data.count),
        this.$axios
          .get('/api/v1/admin/locum-users', {
            params: {
              ...filters,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset
            }
          })
          .then(response => response.data.data.users)
      ])
        .then(responses => {
          const [count, locumUsers] = responses

          this.count = count
          this.locumUsers = locumUsers
        })
        .finally(() => {
          this.loading = false
        })
    },

    searchSubmit: debounce(function() {
      this.currentPage = 1
      this.getAllLocumUsers()
    }, 500),

    filterReset() {
      this.search = null
      this.filterStatus = null
      this.filterCompliances = null

      this.getAllLocumUsers()
    },

    pageChangedHandler(page) {
      this.currentPage = page
      this.getAllLocumUsers()
    },

    limitChangedHandler(limit) {
      this.currentPage = 1
      this.limit = limit
      this.getAllLocumUsers()
    },

    locumUserUpdatedHandler(locumUser) {
      const index = this.locumUsers.findIndex(({ id }) => id === locumUser.id)

      if (index > -1) {
        this.locumUsers.splice(index, 1, locumUser)
      }
    },

    statusStyle(status) {
      switch (status) {
        case 'Active':
          return 'text-green-700'
        case 'Inactive':
          return 'text-gray-700'
        case 'Deactivated':
          return 'text-black'
        case 'Account Suspension':
          return 'text-red-600'
        case 'Compliance Suspension':
          return 'text-red-600'
        case 'Dormant':
          return 'text-gray-500'
        case 'Bogus':
          return 'text-gray-600'
        default:
          return
      }
    },

    complianceStatusStyle(status) {
      switch (status) {
        case 'Empty':
          return 'text-gray-400'
        case 'Incomplete':
          return 'text-orange-600'
        case 'Pending':
          return 'text-yellow-800'
        case 'Expiring':
          return ' text-red-400'
        case 'Expired':
          return 'text-red-500'
        case 'Rejected':
          return 'text-orange-700'
        case 'Compliant':
          return 'text-green-700'
        default:
          return
      }
    },

    registrationType(type) {
      let registrationType = ''
      if (type === 'Practice') {
        registrationType = 'Referred by Practice'
      } else if (type === 'Locum') {
        registrationType = 'Referred by Locum'
      } else {
        registrationType = 'Organic'
      }

      return registrationType
    }
  }
}
</script>

<style>
.page-button {
  background: linear-gradient(to top, #f2d024, #efde86);
}

.page-button-disabled {
  background: linear-gradient(to top, #6b717e, #6b7386);
  cursor: not-allowed;
}

.page-button:active {
  transform: translate(2px, 2px);
}
</style>
