<template>
  <div class="flex-1 flex flex-col py-2 px-2 md:px-6 overflow-y-auto">
    <div class="text-lg md:text-2xl text-white">
      <span>Change Email Requests</span>
    </div>

    <div class="mt-2">
      <div class="flex justify-start overflow-x-auto">
        <nuxt-link
          to="/locum-change-email-requests"
          style="font-family:Nunito"
          class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="true ? 'border rounded-lg text-black border-sunglow bg-sunglow' : 'text-white'"
        >
          <span>Locum</span>
        </nuxt-link>
        <nuxt-link
          v-if="false"
          to="/practice-change-email-requests"
          style="font-family:Nunito"
          class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="false ? 'border rounded-lg text-black border-sunglow bg-sunglow' : 'text-white'"
        >
          <span>Practice</span>
        </nuxt-link>
      </div>
    </div>

    <div class="mt-2 flex flex-col md:flex-row justify-between md:items-center">
      <div class="flex py-2">
        <div class="relative">
          <input
            v-model="search"
            style="width: 250px;"
            class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo"
            placeholder="Search Locum by Name or E-Mail"
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
            v-model="filterStatus"
            class="w-full md:w-auto outline-none rounded-lg border-2 border-transparent text-sm text-white p-1 pr-6 focus:hubzz-yellow bg-waterloo"
          >
            <option :value="null">
              All
            </option>
            <option>Pending</option>
            <option>Accepted</option>
            <option>Rejected</option>
          </select>
        </div>
        <div class="relative md:hidden flex flex-col justify-end md:flex-row md:items-center md:items-end pt-2 md:p-2 md:py-0">
          <label class="text-sm text-white md:pr-2">Sort by</label>
          <select
            v-model="sort"
            class="w-full md:w-auto outline-none rounded-lg border-2 border-transparent text-sm text-white p-1 pr-6 focus:hubzz-yellow bg-waterloo"
          >
            <option value selected>
              Name
            </option>
            <option>Email</option>
            <option>Profession</option>
            <option>Requested At</option>
            <option>Accepted At</option>
            <option>Rejected At</option>
          </select>
        </div>
      </div>
    </div>

    <AppTable
      :total="count"
      :items="locumChangeEmailRequests"
      :currentPage="page"
      :perPage="limit"
      :columns="columns"
      :loading="loading"
      :routerLink="`/locums`"
      :orderBy="orderBy"
      @pagechanged="pagechanged"
      @limitchanged="limitchanged"
      @sorted="sorted"
    >
      <template v-slot:status_slot="slotProps">
        <div
          class="px-4 py-1 rounded-full w-32 text-center mx-auto my-1"
          :class="statusStyle(slotProps.item.status)"
        >
          <span>{{ slotProps.item.status }}</span>
        </div>
      </template>
    </AppTable>

    <div v-if="count === 0" class="mt-2 w-full text-center text-white">
      <span>No locum change email requests.</span>
    </div>

    <nuxt-link
      v-if="false"
      class="locum-shield"
      :to="{ name: 'index-locum-change-email-requests' }"
    />

    <nuxt-child />
  </div>
</template>

<script>
  import AppTable from "@/components/Base/AppTable"

  export default {

    components: {
      AppTable,
    },

    data () {
      return {
        loading: false,
        limit: 10,
        page: 1,
        search: '',
        filterStatus: null,
        sort: null,
        orderBy: [],
        count: 0,
        locumChangeEmailRequests: [],
      }
    },

    computed: {

      columns () {
        return [
          {
            name: "ID",
            dataIndex: "id",
            class: "text-center",
            sortable: true
          },
          {
            name: "Name",
            dataIndex: "name",
            class: "text-center",
            sortable: true
          },
          {
            name: "E-Mail Address",
            dataIndex: "email",
            class: "text-center",
            sortable: true
          },
          {
            name: "Profession",
            dataIndex: "profession_name",
            class: "text-center",
            sortable: true
          },
          {
            name: "Status",
            dataIndex: "status",
            class: "text-center",
            slot: true,
            slotName: "status_slot"
          },
          {
            name: "Requested At",
            dataIndex: "created_at",
            class: "text-center",
            sortable: true
          },
          {
            name: "Accepted At",
            dataIndex: "accepted_at",
            class: "text-center",
            sortable: true
          },
          {
            name: "Rejected At",
            dataIndex: "rejected_at",
            class: "text-center",
            sortable: true
          },
        ]
      },

    },

    mounted () {
      this.getLocumChangeEmailRequests()
    },

    methods: {
      searchSubmit () {
        console.log('searchSubmit')
      },

      statusStyle (status) {
        switch (status) {
          case "Accepted":
            return "bg-green-500 text-white"
          case "Pending":
            return "bg-gray-500 text-gray-700"
          case "Rejected":
            return "bg-red-800 text-red-400"
          default:
            return
        }
      },

      pagechanged () {
        console.log('pagechanged')
      },

      limitchanged () {
        console.log('limitchanged')
      },

      sorted () {
        console.log('sorted')
      },

      getLocumChangeEmailRequests () {
        this.loading
        Promise.all([
          this.$axios.get('/api/v1/admin/locum-change-email-requests/count')
            .then(response => response.data.data.count),
          this.$axios.get('/api/v1/admin/locum-change-email-requests')
            .then(response => response.data.data.locum_change_email_requests),
        ]).then((responses) => {
          console.log('responses', responses)
          const [
            count,
            locumChangeEmailRequests,
          ] = responses

          this.count = count
          this.locumChangeEmailRequests = locumChangeEmailRequests
        }).catch((err) => {
          console.log('err', err)
        }).finally(() => {
          this.loading = false
        })
      },

    },
  }
</script>
