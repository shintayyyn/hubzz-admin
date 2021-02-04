<template>
  <div class="fixed inset-y-0 right-0 m-0 w-full h-full xl:w-10.5/12 z-512 overflow-auto border-l-2 border-sunglow bg-trout p-2 md:p-4 shadow-lg" style="transition: all 0.3s ease-in-out;">
    <div class="flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link :to="{ name: 'index-test-script' }" class="text-white hover:text-sunglow p-1" draggable="false">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="py-4">
        <div class="flex justify-between mx-2 md:mx-4 text-white">
          <div class="text-lg font-bold">
            Jobs
          </div>
          <div>
            <AppButton
              class="text-sm"
              :label="'Create Job'"
              :icon="'add-rectangle'"
              @click="$router.push(`/test-script/job-scripts/create-job-seed`)"
            />
          </div>
        </div>

        <AppTable
          v-if="count !== 0"
          :total="count"
          :items="jobs"
          :currentPage="currentPage"
          :perPage="limit"
          :columns="columns"
          :loading="loading"
          :routerLink="`/jobs`"
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
          <span>{{ 'No jobs.' }}</span>
        </div>
      </div>
    </div>
    <nuxt-link
      v-if="$route.name !== 'index-test-script-job-scripts'"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      :to="{ name: 'index-test-script-job-scripts' }"
      draggable="false"
    />
    <nuxt-child />
  </div>
</template>

<script>
  import debounce from 'lodash.debounce'
  
  import AppTable from '@/components/Base/AppTable'
  import AppButton from '@/components/Base/AppButton'

  export default {
    components: {
      AppTable,
      AppButton,
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
        jobs: [],
      }
    },

    computed: {
      columns () {
        return [
					{
						name: 'Job ID',
						dataIndex: 'id',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '140px',
					},
					{
						name: 'Practice Name',
						dataIndex: 'practice_name',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '120px',
            maxWidth: '350px',
					},
					{
						name: 'Date Posted',
						dataIndex: 'date_created_in_gb_formatted',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '170px',
					},
					{
						name: 'Date Start',
						dataIndex: 'datetime_start_in_gb_formatted',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '170px',
          },
          {
						name: 'Date End',
						dataIndex: 'datetime_end_in_gb_formatted',
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
      // this.$socket.on("updateLocumStatus", this.locumUserUpdatedHandler)
    
      this.count = 0
      this.jobs = []
			this.getAllJobs()
    },
    
    destroyed () {
      this.$socket.removeListener("updateLocumStatus", this.locumUserUpdatedHandler)
    },

		methods: {

			getAllJobs () {
        const filters = {
          // status: [
          //   'Active',
          //   'Dormant',
          // ],
        }

        this.loading = true

				Promise.all([
					this.$axios.get('/api/v1/admin/jobs/count', {
						params: {
							...filters,
						},
					}).then(response => response.data.data.count),
					this.$axios.get('/api/v1/admin/jobs', {
						params: {
              ...filters,
              order_by: this.orderBy,
							limit: this.limit,
							offset: this.offset,
						},
					}).then(response => response.data.data.jobs),
				]).then((responses) => {
					const [
						count,
						jobs,
					] = responses

          this.count = count
          this.jobs = jobs
				}).finally(() => {
          this.loading = false
				})
      },
      
			searchSubmit: debounce(function () {
				this.currentPage = 1
        this.getAllJobs()
			}, 500),
    
      pageChangedHandler (page) {
        this.currentPage = page
        this.getAllJobs()
      },
      
      locumUserUpdatedHandler (locumUser) {
        const index = this.jobs.findIndex(({ id }) => id === locumUser.id)

        if (index > -1) {
          this.jobs.splice(index, 1, locumUser)
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
<style>
  .card {
    min-width: 100px;
    height: 250px;
    box-sizing: content-box;
  }

  .modal {
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
    .modal {
      width: 88%;
    }
  }
</style>