<template>
  <div class="fixed inset-y-0 right-0 m-0 w-full h-full xl:w-10/12 z-512 overflow-auto border-l-2 border-sunglow bg-trout p-2 md:p-4 shadow-lg" style="transition: all 0.3s ease-in-out;">
    <div class="flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link :to="{ name: 'index-test-script' }" class="text-white hover:text-sunglow p-1" draggable="false">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="py-4">
        <div class="mx-2 md:mx-4 text-white">
          <div class="text-lg font-bold">
            Active and Dormant Locums
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
          :routerLink="routerLink"
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
        </AppTable>

        <div v-if="count === 0 && !loading" class="mt-2 w-full text-center text-white">
          <span>{{ 'No locums.' }}</span>
        </div>
      </div>
    </div>

    <nuxt-link
      v-if="$route.name !== 'index-test-script-locum-dormant-status-index'"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      :to="{ name: 'index-test-script-locum-dormant-status-index' }"
      draggable="false"
    />

    <nuxt-child @refreshLocumUserTable="getLocumUsers" />
  </div>
</template>

<script>
  import debounce from 'lodash.debounce'
  
  import AppTable from '@/components/Base/AppTable'

  export default {
    components: {
      AppTable,
    },

    data () {
      return {
        loading: false,
				currentPage: 1,
        limit: 10,
        orderBy: [
          'created_at_in_gb_formatted:desc',
        ],
        count: 0,
        locumUsers: [],
      }
    },

    computed: {
      routerLink () {
        return (locumUser) => {
          return {
            name: 'index-test-script-locum-dormant-status-index-locumUserId',
            params: {
              locumUserId: locumUser.id,
            },
          }
        }
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
						name: 'E-Mail Address',
						dataIndex: 'email',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '120px',
            maxWidth: '350px',
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
						name: 'Last application date',
						dataIndex: 'last_job_application_date_in_gb_formatted',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '170px',
					},
          { 
            name: 'Override Date Signed-up',
            dataIndex: 'override_created_at_in_gb_formatted',
            class: 'md:text-center',
            sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '170px',
          },
          { 
            name: 'Override last application date',
            dataIndex: 'override_last_job_application_date_in_gb_formatted',
            class: 'md:text-center',
            sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '170px',
          },
          { 
            name: 'Dormant Date',
            dataIndex: 'dormanted_at_in_gb_formatted',
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
				]
      },

      offset () {
        return this.limit * (this.currentPage - 1)
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

		mounted () {
      this.$socket.on("updateLocumStatus", this.locumUserUpdatedHandler)
    
      this.count = 0
      this.locumUsers = []
			this.getLocumUsers()
    },
    
    destroyed () {
      this.$socket.removeListener("updateLocumStatus", this.locumUserUpdatedHandler)
    },

		methods: {

			getLocumUsers () {
        const filters = {
          status: [
            'Active',
            'Dormant',
          ],
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
        this.getLocumUsers()
			}, 500),
    
      pageChangedHandler (page) {
        this.currentPage = page
        this.getLocumUsers()
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
      
		},
  }
</script>
