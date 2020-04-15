<template>
  <div class="flex-1 flex flex-col py-2 px-4 md:px-6">
    <div class="text-xl md:text-2xl text-white">
      Users
    </div>

    <div v-if="false" class="flex justify-end">
      <nuxt-link
        to="/content-management/users/create"
        class="
          flex items-center text-black text-sm rounded-lg py-2 px-4
          font-bold focus:outline-none transitions-colors duration-150 ease-liner
          bg-sunglow hover:bg-sunglow-dark
        "
      >
        <span>Add User</span>
      </nuxt-link>
    </div>

    <div class="flex flex-col md:flex-row justify-between md:items-center">
      <div class="flex py-2">
        <div class="relative">
          <input
            v-model="search"
            class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo"
            placeholder="Search username, email, name"
            style="width: 250px;"
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

    <ContentManagementTable
      :limit="limit"
      :items="users"
      :getItemKey="(item) => item.id"
      :getItemLink="(item) => true ? null : `/content-management/users/${item.id}`"
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

    <nuxt-link
      v-if="$route.name !== 'index-content-management-users'"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      to="/content-management/users"
    />
  
    <nuxt-child
      @userCreated="userCreatedHandler"
      @userUpdated="userUpdatedHandler"
      @userDeleted="userDeletedHandler"
    />
  </div>
</template>

<script>
  import debounce from "lodash.debounce"

  import ContentManagementTable from '@/components/ContentManagement/ContentManagementTable'
  import ContentManagementPagination from '@/components/ContentManagement/ContentManagementPagination'

  export default {
    components: {
      ContentManagementTable,
      ContentManagementPagination,
    },

    data () {
      return {
        loading: false,
        count: 0,
        users: [],
        orderBy: [],
        limit: 10,
        activePage: 1,
        search: '',
      }
    },

    computed: {
      itemCountInfo () {
        const firstItem = Math.min(this.limit * this.activePage - this.limit + 1, this.count)
        const lastItem = Math.min(this.limit * this.activePage - this.limit + this.users.length, this.count)
        

        return `Showing ${firstItem} to ${lastItem} of ${this.count} items`
      },

      offset () {
        return Math.max(this.activePage * this.limit - this.limit + this.users.length, 0)
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
            title: 'Domain',
            key: 'domain',
            sort_key: 'domain',
            column: (item) => item.domain,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Username',
            key: 'username',
            sort_key: 'username',
            column: (item) => item.username,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Email',
            key: 'email',
            sort_key: 'email',
            column: (item) => item.email,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Name',
            key: 'name',
            sort_key: 'name',
            column: (item) => item.name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Status',
            key: 'status',
            sort_key: 'status',
            column: (item) => item.status,
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
        this.getPracticeUsers()
      },

      limit () {
        this.activePage = 1
        this.getPracticeUsers()
      },

      activePage () {
        this.getPracticeUsers()
      },
    },

    mounted () {
      this.search = ''
      this.getPracticeUsers()
    },
    
    methods: {
      searchSubmit: debounce(function () {
        this.activePage = 1
        this.getPracticeUsers()
      }, 500),

      getPracticeUsers () {
        this.loading = true
        this.count = 0
        this.users = []

        const params = {}

        const search = this.search

        if (search) {
          params.search = search
        }

        Promise.all([
          this.$axios.get('/api/v1/admin/users/count', {
            params: {
              ...params,
            }
          }).then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/users', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.users
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          if (!search || search === this.search) {
            const [
              count,
              users,
            ] = results

            this.count = count
            this.users = users
          }
        }).catch((err) => {
          console.log('err', err)
          this.$nuxt.error(err)
        }).finally(() => {
          this.loading = false
        })
      },

      loadMorePracticeUsers (limit) {
        const params = {}

        const search = this.search

        if (search) {
          params.search = search
        }

        this.$axios.get('/api/v1/admin/users', {
          params: {
            ...params,
            order_by: this.orderBy,
            limit,
            offset: this.offset,
          },
        }).then((responses) => {
          responses.data.data.users.forEach((user) => {
            this.users.push(user)
          })
        }).catch((err) => {
          console.log('err', err)
        })
      },

      userCreatedHandler (data) {
        const {
          user
        } = data

        if (this.search === '') {
          this.count++

          if (this.activePage === this.pages && this.users.length < this.limit) {
            this.users.push(user)
          }
        }
      },

      userUpdatedHandler (data) {
        const {
          user
        } = data

        const index = this.users.findIndex(({ id }) => id === user.id)

        if (index > -1) {
          this.users.splice(index, 1, user)
        }
      },

      userDeletedHandler (data) {
        const {
          id,
        } = data

        this.count--

        if (this.activePage > this.pages) {
          this.activePage = this.pages
        } else {
          const index = this.users.findIndex((user) => user.id === id)

          if (index > -1) {
            this.users.splice(index, 1)

            if (this.offset < this.count) {
              this.loadMorePracticeUsers(1)
            }
          }
        }
      },
    },

  }
</script>
