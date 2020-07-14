<template>
  <div class="m-2">
    <AppLoading :loading="loadingPracticeUsers" :message="'Loading Practice Users'" />
    <div class="w-full overflow-hidden">
      <div v-if="authAdminPermissions.includes('Create New Practice User')">
        <button
          v-if="practice.status !== 'Deactivated'"
          class="inline-flex no-underline py-2 px-4 bg-sunglow text-sm font-semibold text-black rounded-lg shadow float-left"
          @click="show()"
        >
          Add User
        </button>
      </div>
    </div>
    <transition name="fade">
      <AppTable
        v-if="total > 0"
        :total="total"
        :items="users"
        :currentPage="currentPage"
        :perPage="params.limit"
        :columns="columns"
        :orderBy="params.order_by"
        @pagechanged="pagechanged"
        @sorted="sorted"
      >
        <template v-slot:status_slot="slotProps">
          <div
            class="px-4 py-1 rounded-full text-center w-32 mx-auto"
            :class="slotProps.item.status === 'Active' ? 'bg-green-500 text-white lg:px-8 sm:px-2' : 'bg-yellow-500 text-black lg:px-6 sm:px-2'"
          >
            {{ slotProps.item.status }}
          </div>
        </template>
        <template v-slot:actions="slotProps">
          <div 
            class="px-4 py-1 rounded-full text-center w-32 mx-auto lg:px-6 sm:px-2 cursor-pointer"
            :class="slotProps.item.status !== 'Deactivated' ? 'bg-yellow-500 text-black' : 'bg-gray-500 text-white cursor-not-allowed' " @click="slotProps.item.status !== 'Deactivated' ? $router.push({ path: `/practices/${practice.id}/practice-users/${slotProps.item.id}`}) : null"
          >
            View
          </div>
        </template>
      </AppTable>
      <template v-else>
        <div class="mt-2 w-full text-center text-white">
          This practice has no users.
        </div>
      </template>
    </transition>

    <div
      v-if="$route.name.includes('index-practices-id-index-practice-users-pracUserId') || modal"
      class="edit-practice-user-shield"
      @click="modal ? modal=false : $router.go(-1)"
    />
    <transition name="slide" mode="out-in">
      <!-- <div class="practice-user-modal shadow-lg" v-if="modal"> -->
      <CreateUser
        v-if="modal"
        :practice="practice"
        :userCount="total"
        :registeeType="'practiceUser'"
        @close="modal = false"
      />
      <!-- </div> -->
    </transition>
  </div>
</template>

<script>
  import CreateUser from "@/components/UserManagement/CreateUser"
  import AppLoading from "@/components/Base/AppLoading"
  import AppTable from "@/components/Base/AppTable"

  export default {

    components: {
      CreateUser,
      AppLoading,
      AppTable
    },
    props: {
      practice: {
        type: Object,
        required: true,
      }
    },

    data () {
      return {
        loadingPracticeUsers: false,
        modal: false,
        // total:0,
        // users:[],
        // totalPages:0,
        currentPage: 1,
        perPage: 10,

        params: {
          limit: 10,
          offset: 0,
          order_by: ["created_at:desc"]
        },

        query: null,

        columns: [
          {
            name: "Full Name",
            dataIndex: "personal_detail.name"
          },
          {
            name: "Username",
            dataIndex: "username",
            class: "text-center"
          },
          {
            name: "Email Address",
            dataIndex: "email",
            class: "text-center"
          },
          {
            name: "Role",
            dataIndex: "practice_detail.practice_role",
            class: "text-center"
          },
          {
            name: "Sign-Up Verified",
            dataIndex: "email_verified_at_in_gb_formatted",
            class: "text-center"
          },
          {
            name: "Status",
            dataIndex: "status",
            slot: true,
            slotName: "status_slot",
            class: "text-center",
            sortable: true
          },
          {
            name: "Actions",
            dataIndex: "actions",
            class: "text-center"
          }
        ]
      }
    },

    computed: {
      total () {
        return this.$store.state.practices.practiceUsersCount
      },
      users () {
        return this.$store.state.practices.practiceUsers
      },
      totalPages () {
        return this.$store.state.practices.practiceUsersPageCount
      },
      authAdminPermissions () {
        return this.$store.getters["permissions"]
      }
    },

    watch: {
      $route () {
        this.currentPage = parseInt(this.$route.query.practice_users_page)
        this.getAllPracticeUsers()
      }
    },

    beforeDestroy () {
      let query = Object.assign({}, this.$route.query)
      delete query.practice_users_page
      this.$router.push({ query })
    },

    async created () {
      this.loading = true

      let practice_id = this.practice.id

      let params = {
        practice_id
      }

      try {
        this.loadingPracticeUsers = true

        await this.$axios
          .$get(`/api/v1/admin/practice-users/count`, { params })
          .then(res => {
            this.$store.commit(
              `practices/SET_PRACTICE_USERS_COUNT`,
              res.data.count
            )
            this.perPage = 5
            let pageCount = Math.ceil(this.total / this.perPage)
            this.$store.commit(
              "practices/SET_PRACTICE_USERS_PAGE_COUNT",
              pageCount
            )
            this.getAllPracticeUsers()
          })
      } catch (err) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: err.response.data.message
        })
        console.log(err)
      }
    },

    methods: {

      async getAllPracticeUsers () {
        let practice_id = this.practice.id
        let limit = 5
        let offset = this.perPage * (parseInt(this.$route.query.practice_users_page) - 1)
        let params = {
          practice_id,
          order_by: "created_at:desc",
          limit,
          offset,
        }
        
        await this.$axios
          .$get(`/api/v1/admin/practice-users`, { params })
          .then(res => {
            this.$store.commit("practices/SET_PRACTICE_USERS", res.data.users)
          })
          .catch(err => {
            console.log("get users error!", err)
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: err.response.data.message
            })
          })
        this.loadingPracticeUsers = false
      },

      show () {
        this.modal = true
      },

      pagechanged (e) {
        const query = {
          ...this.$route.query,
          practice_users_page: e || 1
        }
        this.$router.push({ query })
        this.getAllPracticeUsers()
      },

      sorted (orderBy) {
        this.params.order_by = orderBy
        this.getAllPracticeUsers(this.params)
      },

    },

  }
</script>

<style>
  .edit-practice-user-shield {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #333;
    opacity: 0.5;
    z-index: 511;
  }
  .edit-practice-user-modal {
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
    .edit-practice-user-modal {
      width: 70%;
    }
  }
</style>