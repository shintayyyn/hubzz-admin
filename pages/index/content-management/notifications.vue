<template>
  <div class="flex-1 flex flex-col py-2 px-4 md:px-6">
    <div class="text-xl md:text-2xl text-white">
      Notifications
    </div>

    <div class="flex flex-col md:flex-row justify-between md:items-center">
      <div class="flex py-2">
        <div class="relative">
          <input
            v-model="search"
            class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo"
            placeholder="Search user name, email, username"
            style="width: 300px;"
            @keyup="searchSubmit"
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
    </div>

    <template v-if="false">
      <ContentManagementTable
        :limit="limit"
        :items="notifications"
        :getItemKey="(item) => item.id"
        :getItemLink="(item) => `/content-management/notifications/${item.id}`"
        :columnDetails="columnDetails"
        :orderBy="orderBy"
        :loading="loading"
        @setOrderBy="(value) => orderBy = value"
      />
  
      <div class="w-full flex flex-wrap justfify-between items-center">
        <div class="flex-1 flex flex-wrap justify-between pt-2 md:py-2 text-sm">
          <div class="text-gray-500 w-full md:w-auto text-center md:text-left">
            <div class="whitespace-no-wrap">
              {{ itemCountInfo }}
            </div>
            <div class="whitespace-no-wrap">
              Page: {{ Math.min(activePage, pages) }} / {{ pages }}
            </div>
          </div>
        </div>
  
        <ContentManagementPagination
          :count="count"
          :pages="pages"
          :page="activePage"
          :maxPage="7"
          @page="(page) => activePage = page"
        />
      </div>
    </template>

    <AppTableNew
      :total="count"
      :items="notifications"
      :currentPage="activePage"
      :perPage="limit"
      :columns="columnDetails"
      :loading="loading"
      :routerLink="(item) => `/content-management/notifications/${item.id}`"
      :orderBy="orderBy"
      @pagechanged="(page) => activePage = page"
      @limitchanged="(_limit) => limit = _limit"
      @sorted="(_orderBy) => orderBy = _orderBy"
      :noTextResize="true"
    />

    <nuxt-link
      v-if="$route.name !== 'index-content-management-notifications'"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      to="/content-management/notifications"
    />
  
    <nuxt-child
      @notificationCreated="notificationCreatedHandler"
      @notificationUpdated="notificationUpdatedHandler"
      @notificationDeleted="notificationDeletedHandler"
    />
  </div>
</template>

<script>
  import debounce from "lodash.debounce"

  import AppTableNew from "@/components/Base/AppTableNew"
  import ContentManagementTable from '@/components/ContentManagement/ContentManagementTable'
  import ContentManagementPagination from '@/components/ContentManagement/ContentManagementPagination'

  export default {
    components: {
      AppTableNew,
      ContentManagementTable,
      ContentManagementPagination,
    },

    data () {
      return {
        loading: false,
        count: 0,
        notifications: [],
        orderBy: [
          'created_at:desc',
        ],
        limit: 10,
        activePage: 1,
        search: '',
      }
    },

    computed: {
      itemCountInfo () {
        const firstItem = Math.min(this.limit * this.activePage - this.limit + 1, this.count)
        const lastItem = Math.min(this.limit * this.activePage - this.limit + this.notifications.length, this.count)
        

        return `Showing ${firstItem} to ${lastItem} of ${this.count} items`
      },

      offset () {
        return Math.max(this.activePage * this.limit - this.limit + this.notifications.length, 0)
      },

      columnDetails () {
        return [
          {
            title: 'ID',
            key: 'id',
            sort_key: 'id',
            column: (item) => item.id,
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'User',
            key: 'user_name',
            sort_key: 'user_name',
            column: (item) => item.user ? item.user.name : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Notification Type',
            key: 'notification_type_name',
            sort_key: 'notification_type_name',
            column: (item) => item.notification_type ? item.notification_type.name : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Payload Type',
            key: 'payload_type',
            sort_key: null,
            column: (item) => item.payload_type,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Title',
            key: 'title',
            sort_key: null,
            column: (item) => item.title,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Description',
            key: 'description',
            sort_key: null,
            column: (item) => item.description,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
            width: '200',
          },
          {
            title: 'Url',
            key: 'url',
            sort_key: null,
            column: (item) => item.url,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Seen At',
            key: 'seen_at',
            sort_key: 'seen_at',
            column: (item) => item.seen_at ? this.$moment(item.seen_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS').format('DD/MM/YYYY | HH:mm') : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          // {
          //   title: 'Created At',
          //   key: 'created_at',
          //   sort_key: 'created_at',
          //   column: (item) => item.created_at ? this.$moment(item.created_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS').format('DD/MM/YYYY | HH:mm') : '',
          //   justify: 'start',
          //   flexGrow: 1,
          //   flexShrink: 0,
          // },
          {
            title: 'Created At (DST)',
            key: 'created_at',
            sort_key: 'created_at',
            column: (item) => item.created_at_in_gb_formatted ? item.created_at_in_gb_formatted : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Practice ID',
            key: 'user_practice_id',
            sort_key: 'user_practice_id',
            column: (item) => item.user && item.user.practice? item.user.practice.id : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Practice',
            key: 'user_practice_name',
            sort_key: 'user_practice_name',
            column: (item) => item.user && item.user.practice? item.user.practice.name : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'User ID',
            key: 'user_id',
            sort_key: 'user_id',
            column: (item) => item.user ? item.user.id : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'User Email',
            key: 'user_email',
            sort_key: 'user_email',
            column: (item) => item.user ? item.user.email : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'User Username',
            key: 'user_username',
            sort_key: 'user_username',
            column: (item) => item.user ? item.user.username : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
        ]
      },

      pages () {
        return Math.max(Math.ceil(this.count / this.limit), 1)
      },
    },

    watch: {
      orderBy () {
        this.activePage = 1
        this.getNotifications()
      },

      limit () {
        this.activePage = 1
        this.getNotifications()
      },

      activePage () {
        this.getNotifications()
      },
    },

    mounted () {
      this.search = ''
      this.getNotifications()
    },
    
    methods: {
      searchSubmit: debounce(function () {
        this.activePage = 1
        this.getNotifications()
      }, 500),

      getNotifications () {
        this.loading = true
        // this.count = 0
        this.notifications = []

        const params = {}

        const search = this.search

        if (search) {
          params.search = search
        }

        Promise.all([
          this.$axios.get('/api/v1/admin/notifications/count', {
            params: {
              ...params,
            }
          }).then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/notifications', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.notifications
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          if (!search || search === this.search) {
            const [
              count,
              notifications,
            ] = results

            this.count = count
            this.notifications = notifications
          }
        }).catch((err) => {
          console.log('err', err)
          this.$nuxt.error(err)
        }).finally(() => {
          this.loading = false
        })
      },

      loadMoredNotifications (limit) {
        const params = {}

        const search = this.search

        if (search) {
          params.search = search
        }

        this.$axios.get('/api/v1/admin/notifications', {
          params: {
            ...params,
            order_by: this.orderBy,
            limit,
            offset: this.offset,
          },
        }).then((responses) => {
          responses.data.data.notifications.forEach((notification) => {
            this.notifications.push(notification)
          })
        }).catch((err) => {
          console.log('err', err)
        })
      },

      notificationCreatedHandler (data) {
        const {
          notification
        } = data

        if (this.search === '') {
          this.count++

          if (this.activePage === this.pages && this.notifications.length < this.limit) {
            this.notifications.push(notification)
          }
        }
      },

      notificationUpdatedHandler (data) {
        const {
          notification
        } = data

        const index = this.notifications.findIndex(({ id }) => id === notification.id)

        if (index > -1) {
          this.notifications.splice(index, 1, notification)
        }
      },

      notificationDeletedHandler (data) {
        const {
          id,
        } = data

        this.count--

        if (this.activePage > this.pages) {
          this.activePage = this.pages
        } else {
          const index = this.notifications.findIndex((notification) => notification.id === id)

          if (index > -1) {
            this.notifications.splice(index, 1)

            if (this.offset < this.count) {
              this.loadMoredNotifications(1)
            }
          }
        }
      },
    },

  }
</script>
