<template>
  <div class="flex-1 flex flex-col overflow-auto">
    <transition name="drop" mode="out-in">
      <AppConfirm
        v-if="showConfirmCancelModal === true"
        :message="'Are you sure you want to delete this user?'"
        @cancel="showConfirmCancelModal = false"
        @confirm="performAction()"
      />
    </transition>
    <div class="flex flex-wrap items-center text-sm mb-3">
      <AppButton
        v-if="authAdminPermissions.includes('Create Admin Account')"
        :label="'Create Admin Account'"
        :icon="'add-user'"
        :iconSize="'16'"
        class="my-1 mt-3 mr-2"
        @click=";(modal = true), (deleteAdminUser = false)"
      />
      <template v-if="authAdminPermissions.includes('Delete Admin Account') && total > 0">
        <AppButton
          v-if="authAdminPermissions.includes('Delete Admin Account')"
          class="my-1 mt-3"
          :label="deleteAdminUser ? 'Done' : 'Delete Admin User'"
          :icon="deleteAdminUser ? 'circle-check' : 'garbage'"
          :iconSize="deleteAdminUser ? '21' : '16'"
          :customTheme="[deleteAdminUser ? 'bg-green-500' : 'bg-red-600 text-white', 'text-white py-1 px-2']"
          @click="deleteAdminUser = !deleteAdminUser"
        />
      </template>
    </div>
    <AppTableNew
      v-if="total !== 0"
      :total="itemCount"
      :items="adminUsers"
      :currentPage="currentPage"
      :perPage="limit"
      :columns="columns"
      :loading="loading"
      :customWidth="'500'"
      :routerLink="`/user-management`"
      @pagechanged="pagechanged"
    >
      <template v-slot:delete="slotProps">
        <div class="flex px-4 py-1 rounded-full text-center w-32 md:mx-auto mt-1 md:mt-0">
          <AppButton
            v-if="authAdminPermissions.includes('Delete Admin Account')"
            :label="'Delete'"
            :icon="'delete-user'"
            :iconSize="'16'"
            :customTheme="'bg-red-600 text-white'"
            @click="toDeleteAdminUser(slotProps.item.id)"
          />
          <span v-else class="text-sm text-gray-500">You</span>
        </div>
      </template>
    </AppTableNew>

    <div v-if="modal" class="new-user-shield" @click="modal = false" />
    <transition name="slide" mode="out-in">
      <!-- <div class="new-user-modal" > -->
      <CreateUser v-if="modal" :registeeType="'admin'" @close="modal = false" />
      <!-- </div> -->
    </transition>
  </div>
</template>

<script>
import CreateUser from '@/components/UserManagement/CreateUser'
import AppConfirm from '@/components/Base/AppConfirm'
import AppButton from '@/components/Base/AppButton'
import AppTableNew from '@/components/Base/AppTableNew'
export default {
  components: {
    CreateUser,
    AppConfirm,
    AppButton,
    AppTableNew
  },
  data() {
    return {
      loading: false,
      limit: 10,
      currentPage: 1,
      params: {},
      search: '',

      // itemCount:'',
      // adminUsers:{},
      adminCreate: true,
      adminAccountId: '',
      modal: false,
      confirmCancel: false,
      adminId: '',
      deleteAdminUser: false,
      showConfirmCancelModal: false,
      columns: [],
      defaultColumns: [
        {
          name: 'E-mail',
          dataIndex: 'email',
          class: 'text-center'
          // flex: '1 0 0',
          // width: 300,
        },
        {
          name: 'Name',
          dataIndex: 'personal_detail.name',
          class: 'text-center'
          // flex: '1 0 0',
          // width: 200,
        },
        //new
        {
          name: 'Role/s',
          // dataIndex: "admin_detail.role.name",
          column: item => {
            return item.admin_detail?.roles?.map(role => role.name).join(', ') ?? '—'
          },
          class: 'text-center'
          // flex: '1 0 0',
          // width: 300,
        }
      ]
    }
  },
  computed: {
    authAdminPermissions() {
      return this.$store.getters['permissions']
    },
    socketId() {
      return this.$store.state.socket_id
    },
    loadingAdminUsers() {
      return this.$store.state.adminusers.loading_admin_users
    },
    adminUsers() {
      return this.$store.getters['adminusers/getAdminUsers']
    },
    itemCount() {
      return this.$store.state.adminusers.itemCount
    },
    totalPages() {
      return Math.ceil(this.itemCount / this.itemsPerPage)
    },
    total() {
      return this.adminUsers.length
    }
  },
  watch: {
    deleteAdminUser(value) {
      if (value === true) {
        this.columns = [
          {
            name: 'Delete',
            slot: true,
            slotName: 'delete',
            dataIndex: '',
            class: 'text-center'
          },
          ...this.defaultColumns
        ]
      } else {
        this.columns = [...this.defaultColumns]
      }
    }
  },
  async asyncData({ app, store, route }) {
    try {
      await store.commit('adminusers/TOGGLE_LOADING', true)
      let { page = 1, search = '' } = route.query

      page = parseInt(page)
      const limit = 10
      const offset = page * limit - limit
      const params = { limit, offset }

      if (search) {
        params.search = search
      }
      const getAdminUsersCount = await app.$axios.$get(`/api/v1/admin/admin-users/count`, { params })
      const getAdminUsers = await app.$axios.$get(`/api/v1/admin/admin-users`, {
        params
      })

      let response = await getAdminUsersCount
      const itemCount = response.data.count

      response = await getAdminUsers
      const adminUsers = response.data.users

      //store users and count here
      await store.commit('adminusers/SET_ADMIN_COUNT', itemCount)
      await store.commit('adminusers/SET_ADMIN_USERS', adminUsers)
      await store.commit('adminusers/TOGGLE_LOADING', false)
      return {
        itemsPerPage: limit,
        currentPage: page,
        search
        //itemCount, //store
        //adminUsers //store
      }
    } catch (err) {
      store.commit('SET_NOTIFICATION', {
        enabled: true,
        status: 'danger',
        text: 'Something went wrong!'
      })
      console.log('get users error', err)
    }
  },
  created() {
    this.columns = [...this.defaultColumns]
  },
  watchQuery: ['page', 'search'],
  methods: {
    getQuery() {
      const query = {
        ...this.$route.query
      }
      const offset = parseInt(query.page) * 10 - 10
      return offset
    },
    getAdmins(params) {
      this.$store.dispatch('adminusers/fetchAdminUsers', {
        limit: 10,
        search: params.search,
        offset: this.getQuery()
      })
    },
    toDeleteAdminUser(userId) {
      this.adminAccountId = userId
      this.showConfirmCancelModal = true
    },
    async performAction() {
      if (this.adminAccountId) {
        await this.$axios
          .$delete(`/api/v1/admin/admin-users/${this.adminAccountId}`)
          .then(res => {
            console.log(res)
            this.$store.getters['adminusers/getAdminUsers']
            this.$emit('close')
            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'success',
              text: 'Admin Account Successfully Deleted'
            })
          })
          .catch(err => {
            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'danger',
              text: err.response.data.message
            })
          })
      }
      this.showConfirmCancelModal = false
    },
    pagechanged(e) {
      const query = {
        ...this.$route.query,
        page: e || 1
      }
      this.$router.push({ query })
      this.getAdmins(this.params)
    }
  }
}
</script>
<style>
.new-user-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
/* .new-user-modal {
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
	.new-user-modal {
		width: 70%;
	}
} */
</style>
