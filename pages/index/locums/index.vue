<template>
  <div 
    v-if="authAdminPermissions.includes('View Locums') 
      || authAdminPermissions.includes('View Locum Jobs')
      || authAdminPermissions.includes('View Locum Compliance Detail')"
    class="flex-1 flex flex-col md:px-2 overflow-y-auto"
  >
    <div class="flex flex-col md:flex-row justify-between md:items-center">
      <div class="flex flex-col w-full justify-end">
        <div class="w-full">
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
              <div class="m-3">
                <button
                  class="px-6 py-1 border-2 border-gray-400 rounded-lg font-bold text-gray-600"
                  @click="filterModal = !filterModal"
                >
                  Filters
                </button>
              </div>
            </div>
          </div>
          
          <div
            class="flex-wrap justify-start items-center w-full shadow-lg p-3 rounded-lg my-2"
            :class="filterModal ? 'flex' : 'hidden'"
          >
            <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
              <AppInput
                v-model="filterStatus"
                :type="'select'"
                :name="'locum_status'"
                :label="'Locum Status'"
                :placeholder="'Select...'"
                :items="locumStatuses"
              />
            </div>

            <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
              <AppInput
                v-model="filterCompliances"
                :type="'select'"
                :name="'compliance_status'"
                :label="'Compliance Status'"
                :placeholder="'Select...'"
                :items="complianceStatuses"
              />
            </div>

            <div class="md:px-1 flex flex-wrap w-full justify-end">
              <AppButton
                label="Reset"
                :in-style="'padding:5px 14px;margin-bottom:5px'"
                @click="filterReset"
              />

              <AppButton
                class="mx-2"
                label="Submit"
                :in-style="'padding:5px 14px;margin-bottom:5px'"
                @click="getJobs(params)"
              />
            </div>
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
      @pagechanged="pageChangedHandler"
      @sorted="(_orderBy) => orderBy = _orderBy"
    >
      <template v-slot:status_slot="slotProps">
        <div
          class="px-4 py-1 rounded-full w-32 text-center mx-auto my-1"
          :class="statusStyle(slotProps.item.status)"
        >
          {{ slotProps.item.status }}
        </div>
      </template>
      <template v-slot:compliance_slot="slotProps">
        <div
          class="px-4 py-1 rounded-full w-32 text-center mx-auto my-1"
          :class="complianceStatusStyle(slotProps.item.compliance_status)"
        >
          {{ slotProps.item.compliance_status }}
        </div>
      </template>

      <template v-slot:registration_type_slot="slotProps">
        <div
          class="px-4 py-1 rounded-full w-32 text-center mx-auto my-1"
        >
          {{ registrationType(slotProps.item.referrer_domain) }}
        </div>
      </template>
    </AppTableNew>

    <div v-if="count === 0 && !loading" class="mt-2 w-full text-center text-white">
      <span>{{ hasFilter ? 'No locums found.' : 'No registered locums.' }}</span>
    </div>

    <nuxt-child
      @updateLocumUsers="getAllLocumUsers"
      @locumUserUpdated="locumUserUpdatedHandler"
    />
  </div>
</template>

<script>
	import debounce from 'lodash.debounce'
  import AppTable from '@/components/Base/AppTable'
  import AppTableNew from '@/components/Base/AppTableNew'
  import AppInputSmall from '@/components/Base/AppInputSmall'
  import AppInput from '@/components/Base/AppInput'
  import AppButton from '@/components/Base/AppButton'
	export default {

		components: {
      AppTable,
      AppTableNew,
      AppInputSmall,
      AppInput,
      AppButton,
		},

		data () {
			return {
        loading: false,
				currentPage: 1,
				filterStatus: null,
				filterCompliances: null,
				search: '',
        limit: 10,
        orderBy: [
          'created_at_in_gb_formatted:desc',
        ],
        count: 0,
        locumUsers: [],

        locumStatuses: [
          {
            label: "All",
            value: null,
          },
          {
            label: "Active",
            value: "Active",
          },
          {
            label: "Dormant",
            value: "Dormant",
          },
          {
            label: "Inactive",
            value: "Inactive",
          },
          {
            label: "Bogus",
            value: "Bogus",
          },
          {
            label: "Deactivated",
            value: "Deactivated",
          },
          {
            label: "Account Suspension",
            value: "Account Suspension",
          },
          {
            label: "Compliance Suspension",
            value: "Compliance Suspension",
          },
        ],

        complianceStatuses: [
          {
            label: "All",
            value: null,
          },
          {
            label: "Empty",
            value: "Empty",
          },
          {
            label: "Incomplete",
            value: "Incomplete",
          },
          {
            label: "Pending",
            value: "Pending",
          },
          {
            label: "Expiring",
            value: "Expiring",
          },
          {
            label: "Expired",
            value: "Expired",
          },
          {
            label: "Rejected",
            value: "Rejected",
          },
          {
            label: "Compliant",
            value: "Compliant",
          },
        ],

        filterModal: false,
			}
		},

		computed: {
      authAdminPermissions () {
        return this.$store.getters["permissions"]
      },
      columns () {
        return [
					{
						name: 'User ID',
						dataIndex: 'id',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '140px',
					},
					{
						name: 'Name',
						dataIndex: 'name',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '120px',
            maxWidth: '550px',
					},
					{
						name: 'E-Mail Address',
						dataIndex: 'email',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '120px',
            maxWidth: '550px',
					},
					{
						name: 'Profession',
						dataIndex: 'profession_name',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '550px',
					},
					{
						name: 'Date Signed-up',
						dataIndex: 'created_at_in_gb_formatted',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '170px',
					},
					{
						name: 'Sign-up verified',
						dataIndex: 'email_verified_at_in_gb_formatted',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '170px',
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
					},
				]
      },

      offset () {
        return this.limit * (this.currentPage - 1)
      },

      hasFilter () {
        return this.search || this.filterStatus || this.filterCompliances
      },
      
			totalPages () {
				return Math.ceil(this.count / this.limit)
      },

      orderByValue: {
        get () {
          return this.orderBy.length > 0 ? this.orderBy[0] : null
        },
        set (orderBy) {
          this.orderBy = [orderBy]
        },
      },

		},

		watch: {
			filterStatus () {
				this.currentPage = 1
        this.getAllLocumUsers()
			},

			filterCompliances () {
				this.currentPage = 1
        this.getAllLocumUsers()
			},

			search () {
				this.searchSubmit()
			},
      
			orderBy () {
        this.currentPage = 1
        this.getAllLocumUsers()
      },
		},

		mounted () {
      this.$socket.on("updateLocumStatus", this.locumUserUpdatedHandler)
    
      this.count = 0
      this.locumUsers = []
			this.getAllLocumUsers()
    },
    
    destroyed () {
      this.$socket.removeListener("updateLocumStatus", this.locumUserUpdatedHandler)
    },

		methods: {
			getAllLocumUsers () {
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
					this.$axios.get('/api/v1/admin/locum-users/count', {
						params: {
							...filters,
						},
					}).then(response => response.data.data.count),
					this.$axios.get('/api/v1/admin/locum-users', {
						params: {
              ...filters,
              order_by: this.orderBy,
							limit: this.limit,
							offset: this.offset,
						},
					}).then(response => response.data.data.users),
				]).then((responses) => {
					const [
						count,
						locumUsers,
					] = responses

          this.count = count
          this.locumUsers = locumUsers
				}).finally(() => {
          this.loading = false
				})
      },
      
			searchSubmit: debounce(function () {
				this.currentPage = 1
        this.getAllLocumUsers()
      }, 500),
      
      filterReset () {
        this.search = null
        this.filterStatus = null
        this.filterCompliances = null

        this.getAllLocumUsers()
      },
    
      pageChangedHandler (page) {
        this.currentPage = page
        this.getAllLocumUsers()
      },
      
      locumUserUpdatedHandler (locumUser) {
        const index = this.locumUsers.findIndex(({ id }) => id === locumUser.id)

        if (index > -1) {
          this.locumUsers.splice(index, 1, locumUser)
        }
      },
      
			statusStyle (status) {
				switch (status) {
					case 'Active':
						return 'bg-green-500 text-white'
					case 'Inactive':
						return 'bg-gray-500 text-gray-700'
					case 'Deactivated':
						return 'bg-red-800 text-red-400'
					case 'Account Suspension':
						return 'bg-red-600 text-white'
					case 'Compliance Suspension':
						return 'bg-red-600 text-white'
					case 'Dormant':
            return 'bg-orange-500 text-white'
          case 'Bogus':
						return 'bg-gray-700 text-white'
					default:
						return
				}
			},

			complianceStatusStyle (status) {
				switch (status) {
					case 'Empty':
						return 'border border-white text-white'
					case 'Incomplete':
						return 'bg-orange-600 text-white'
					case 'Pending':
						return 'bg-yellow-500 text-yellow-800'
					case 'Expiring':
						return 'bg-red-400 text-white'
					case 'Expired':
						return 'bg-red-800 text-red-400'
					case 'Rejected':
						return 'bg-red-600 text-white'
					case 'Compliant':
						return 'bg-green-500 text-white'
					default:
						return
				}
      },

      registrationType (type) {
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
      
		},

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
