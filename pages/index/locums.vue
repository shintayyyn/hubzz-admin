<template>
  <div class="flex-1 flex flex-col py-2 px-2 md:px-6 overflow-y-auto">
    <div class="px-2 text-xl md:text-4xl text-white">
      Locums
    </div>
    <div class="px-2 flex flex-col md:flex-row justify-between md:items-center">
      <div class="flex py-2">
        <div class="relative">
          <input
            v-model="search"
            style="width: 280px;"
            class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo"
            placeholder="Search Locum by Name"
            @keyup.enter="searchSubmit"
          >
          <button
            v-if="search"
            class="absolute top-0 right-0 bottom-0 mr-3 md:mr-1"
            @click="(search = ''), searchSubmit()"
          >
            <svgicon
              name="times-solid"
              height="12"
              width="12"
              class="text-white hover:text-yellow-500 fill-current -mx-2 md:-mx-6"
            />
          </button>
        </div>
      </div>
      <div class="flex flex-col w-full justify-end">
        <div
          class="md:w-full relative flex flex-col md:flex-row justify-end md:items-center md:items-end md:py-2 py-0"
        >
          <label class="text-sm text-white md:pr-2">Filter by Status</label>
          <select
            id="grid-state"
            v-model="filterStatus"
            class="w-full md:w-auto outline-none rounded-lg border-2 border-transparent text-sm text-white p-1 pr-6 focus:hubzz-yellow bg-waterloo"
          >
            <option :value="null">
              All
            </option>
            <option>Active</option>
            <option>Dormant</option>
            <option>Inactive</option>
            <option>Bogus</option>
            <option>Deactivated</option>
            <option>Suspended</option>
          </select>
        </div>
        <div
          class="md:w-full relative flex flex-col md:flex-row justify-end md:items-center md:items-end md:py-2 py-0 pt-2"
        >
          <label class="text-sm text-white md:pr-2">Filter by Compliance Status</label>
          <select
            id="grid-state"
            v-model="filterCompliances"
            class="w-full md:w-auto outline-none rounded-lg border-2 border-transparent text-sm text-white p-1 pr-6 focus:hubzz-yellow bg-waterloo"
          >
            <option :value="null">
              All
            </option>
            <option>Empty</option>
            <option>Incomplete</option>
            <option>Pending</option>
            <option>Expiring</option>
            <option>Expired</option>
            <option>Rejected</option>
            <option>Compliant</option>
          </select>
        </div>
        <div
          class="relative md:hidden flex flex-col justify-end md:flex-row md:items-center md:items-end pt-2 md:p-2 md:py-0"
        >
          <label class="text-sm text-white md:pr-2">Sort by</label>
          <select
            v-model="orderByValue"
            class="w-full md:w-auto outline-none rounded-lg border-2 border-transparent text-sm text-white p-1 pr-6 focus:hubzz-yellow bg-waterloo"
          >
            <option value="id">
              ID (asc)
            </option>
            <option value="id:desc">
              ID (desc)
            </option>
            <option value="name">
              Name (asc)
            </option>
            <option value="name:desc">
              Name (desc)
            </option>
            <option value="email">
              E-Mail Address (asc)
            </option>
            <option value="email:desc">
              E-Mail Address (desc)
            </option>
            <option value="profession">
              Profession (asc)
            </option>
            <option value="profession:desc">
              Profession (desc)
            </option>
            <option value="created_at">
              Date Signed-up (asc)
            </option>
            <option value="created_at:desc">
              Date Signed-up (desc)
            </option>
            <option value="status">
              Status (asc)
            </option>
            <option value="status:desc">
              Status (desc)
            </option>
            <option value="compliance_status">
              Compliance Status (asc)
            </option>
            <option value="compliance_status:desc">
              Compliance Status (desc)
            </option>
          </select>
        </div>
      </div>
    </div>

    <AppTable
      v-if="count !== 0"
      :total="count"
      :items="locumUsers"
      :currentPage="currentPage"
      :perPage="limit"
      :columns="columns"
      :loading="loading"
      :routerLink="`/locums`"
      :orderBy="orderBy"
      @pagechanged="(value) => currentPage = value"
      @sorted="(value) => orderBy = value"
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
    </AppTable>

    <div v-if="count === 0 && !loading" class="mt-2 w-full text-center text-white">
      <span>{{ hasFilter ? 'No locums found.' : 'No registered locums.' }}</span>
    </div>

    <div
      v-if="$route.name.includes('index-locums-id')"
      class="locum-shield"
      @click="$router.push({ path: `/locums`, query: $route.query })"
    />

    <nuxt-child @updateLocumUsers="getAllLocumUsers" />
  </div>
</template>

<script>
	import debounce from 'lodash.debounce'
	import AppTable from '@/components/Base/AppTable'

	export default {

		components: {
			AppTable
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
          'created_at:desc',
        ],
        count: 0,
        locumUsers: [],
			}
		},

		computed: {

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
						sortable: true,
            flex: '1 0 0',
            minWidth: '120px',
            maxWidth: '550px',
					},
					{
						name: 'E-Mail Address',
						dataIndex: 'email',
						sortable: true,
            flex: '1 0 0',
            minWidth: '120px',
            maxWidth: '550px',
					},
					{
						name: 'Profession',
						dataIndex: 'profession_name',
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
      
			currentPage () {
        this.getAllLocumUsers()
      },
		},

		mounted () {
      this.count = 0
      this.locumUsers = []
			this.getAllLocumUsers()
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
      
			statusStyle (status) {
				switch (status) {
					case 'Active':
						return 'bg-green-500 text-white'
					case 'Inactive':
						return 'bg-gray-500 text-gray-700'
					case 'Deactivated':
						return 'bg-red-800 text-red-400'
					case 'Suspended':
						return 'bg-red-600 text-white'
					case 'Dormant':
						return 'bg-orange-500 text-white'
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
