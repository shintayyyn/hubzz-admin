<template>
  <div class="">
    <AppLoading :loading="loadingPracticeUsers" :message="'Loading Practice Users'" />

    <div v-if="canCreatePracticeUser" class="mb-5">
      <AppButton :label="'Add User'" :icon="'add-user'" :disabled="practice.status === 'Deactivated'" @click="modal = true" />
    </div>

    <transition name="fade">
      <AppTableNew
        v-if="count > 0"
        :total="count"
        :items="practiceUsers"
        :currentPage="currentPage"
        :perPage="perPage"
        :columns="columns"
        :orderBy="orderBy"
        :customWidth="'800'"
        :router-link="`/practices/${practice.id}/practice-users`"
        @pagechanged="pagechanged"
        @sorted="sorted"
      >
      </AppTableNew>

      <template v-else>
        <div class="mt-2 w-full text-center text-white">
          This practice has no users.
        </div>
      </template>
    </transition>

    <div
      v-if="$route.name.includes('index-practices-id-index-practice-users-pracUserId') || modal"
      class="edit-practice-user-shield"
      @click="modal ? (modal = false) : $router.go(-1)"
    />

    <transition name="slide" mode="out-in">
      <CreateUser
        v-if="modal"
        :practice="practice"
        :userCount="count"
        :registeeType="'practiceUser'"
        @close="modal = false"
        @userCreated="createdPracticeUserHandler"
      />
    </transition>
  </div>
</template>

<script>
import CreateUser from '@/components/UserManagement/CreateUser'
import AppLoading from '@/components/Base/AppLoading'
import AppTableNew from '@/components/Base/AppTableNew'
import AppButton from '@/components/Base/AppButton'

export default {
  components: {
    CreateUser,
    AppLoading,
    AppTableNew,
    AppButton
  },

  props: {
    practice: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      loadingPracticeUsers: false,
      count: 0,
      practiceUsers: [],

      modal: false,
      currentPage: 1,
      perPage: 5,

      orderBy: ['created_at:desc'],

      columns: [
        {
          name: 'Full Name',
          dataIndex: 'personal_detail.name',
          class: 'text-center'
        },
        {
          name: 'Username',
          dataIndex: 'username',
          class: 'text-center'
        },
        {
          name: 'Email Address',
          dataIndex: 'email',
          class: 'text-center'
        },
        {
          name: 'Role',
          dataIndex: 'practice_detail.practice_role',
          class: 'text-center'
        },
        {
          name: 'Sign-Up Verified',
          dataIndex: 'email_verified_at_in_gb_formatted',
          class: 'text-center'
        },
        {
          name: 'Status',
          dataIndex: 'status',
          class: 'text-center',
          sortable: true
        }
      ]
    }
  },

  computed: {
    practiceId() {
      return this.practice ? this.practice.id : null
    },

    offset() {
      return this.perPage * (this.currentPage - 1)
    },

    authAdminPermissions() {
      return this.$store.getters['permissions']
    },

    canCreatePracticeUser() {
      return this.authAdminPermissions.includes('Create New Practice User')
    }
  },

  mounted() {
    this.$socket.on('createdPracticeUser', this.createdPracticeUserHandler)

    this.getPracticeUsers()
  },

  destroyed() {
    this.$socket.removeListener('createdPracticeUser', this.createdPracticeUserHandler)
  },

  methods: {
    getPracticeUsers() {
      this.loadingPracticeUsers = true
      Promise.all([
        this.$axios
          .get('/api/v1/admin/practice-users/count', {
            params: {
              practice_id: this.practiceId
            }
          })
          .then(response => response.data.data.count),

        this.$axios
          .get('/api/v1/admin/practice-users', {
            params: {
              practice_id: this.practiceId,
              order_by: this.orderBy,
              limit: this.perPage,
              offset: this.offset
            }
          })
          .then(response => response.data.data.users)
      ])
        .then(responses => {
          const [count, practiceUsers] = responses

          this.count = count
          this.practiceUsers = practiceUsers
        })
        .catch(err => {
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'danger',
            text: err.response.data.message
          })
        })
        .finally(() => {
          this.loadingPracticeUsers = false
        })
    },

    createdPracticeUserHandler() {
      this.getPracticeUsers()

      this.$emit('practiceUpdated')
    },

    pagechanged(page) {
      this.currentPage = page || 1
      this.getPracticeUsers()
    },

    sorted(orderBy) {
      this.orderBy = orderBy
      this.getPracticeUsers()
    }
  }
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
