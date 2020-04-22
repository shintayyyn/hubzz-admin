<template>
  <div class="flex-1 flex flex-col py-2 px-4 md:px-6">
    <div class="text-xl md:text-2xl text-white">
      Emails
    </div>

    <div class="flex flex-col md:flex-row justify-between md:items-center">
      <div class="flex py-2">
        <div class="relative">
          <input
            v-model="search"
            class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo"
            placeholder="Search name"
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
      :items="emails"
      :getItemKey="(item) => item.id"
      :getItemLink="(item) => `/content-management/emails/${item.id}`"
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
      v-if="$route.name !== 'index-content-management-emails'"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      to="/content-management/emails"
    />
  
    <nuxt-child
      @emailCreated="emailCreatedHandler"
      @emailUpdated="emailUpdatedHandler"
      @emailDeleted="emailDeletedHandler"
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
        emails: [],
        orderBy: [],
        limit: 10,
        activePage: 1,
        search: '',
      }
    },

    computed: {
      itemCountInfo () {
        const firstItem = Math.min(this.limit * this.activePage - this.limit + 1, this.count)
        const lastItem = Math.min(this.limit * this.activePage - this.limit + this.emails.length, this.count)
        

        return `Showing ${firstItem} to ${lastItem} of ${this.count} items`
      },

      offset () {
        return Math.max(this.activePage * this.limit - this.limit + this.emails.length, 0)
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
            title: 'Email',
            key: 'email',
            sort_key: 'email',
            column: (item) => item.email,
            justify: 'start',
            flexGrow: 1,
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
            title: 'Email Type',
            key: 'email_type_name',
            sort_key: 'email_type_name',
            column: (item) => item.email_type ? item.email_type.name : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Sent At',
            key: 'sent_at',
            sort_key: 'sent_at',
            column: (item) => item.sent_at ? this.$moment(item.sent_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS').format('DD/MM/YYYY | HH:mm') : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Created At',
            key: 'created_at',
            sort_key: 'created_at',
            column: (item) => item.created_at ? this.$moment(item.created_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS').format('DD/MM/YYYY | HH:mm') : '',
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
        this.getEmails()
      },

      limit () {
        this.activePage = 1
        this.getEmails()
      },

      activePage () {
        this.getEmails()
      },
    },

    mounted () {
      this.search = ''
      this.getEmails()
    },
    
    methods: {
      searchSubmit: debounce(function () {
        this.activePage = 1
        this.getEmails()
      }, 500),

      getEmails () {
        this.loading = true
        // this.count = 0
        this.emails = []

        const params = {}

        const search = this.search

        if (search) {
          params.search = search
        }

        Promise.all([
          this.$axios.get('/api/v1/admin/emails/count', {
            params: {
              ...params,
            }
          }).then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/emails', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.emails
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          if (!search || search === this.search) {
            const [
              count,
              emails,
            ] = results

            this.count = count
            this.emails = emails
          }
        }).catch((err) => {
          console.log('err', err)
          this.$nuxt.error(err)
        }).finally(() => {
          this.loading = false
        })
      },

      loadMoredEmails (limit) {
        const params = {}

        const search = this.search

        if (search) {
          params.search = search
        }

        this.$axios.get('/api/v1/admin/emails', {
          params: {
            ...params,
            order_by: this.orderBy,
            limit,
            offset: this.offset,
          },
        }).then((responses) => {
          responses.data.data.emails.forEach((email) => {
            this.emails.push(email)
          })
        }).catch((err) => {
          console.log('err', err)
        })
      },

      emailCreatedHandler (data) {
        const {
          email
        } = data

        if (this.search === '') {
          this.count++

          if (this.activePage === this.pages && this.emails.length < this.limit) {
            this.emails.push(email)
          }
        }
      },

      emailUpdatedHandler (data) {
        const {
          email
        } = data

        const index = this.emails.findIndex(({ id }) => id === email.id)

        if (index > -1) {
          this.emails.splice(index, 1, email)
        }
      },

      emailDeletedHandler (data) {
        const {
          id,
        } = data

        this.count--

        if (this.activePage > this.pages) {
          this.activePage = this.pages
        } else {
          const index = this.emails.findIndex((email) => email.id === id)

          if (index > -1) {
            this.emails.splice(index, 1)

            if (this.offset < this.count) {
              this.loadMoredEmails(1)
            }
          }
        }
      },
    },

  }
</script>
