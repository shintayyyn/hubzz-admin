<template>
  <section style="transition: all 0.3s ease-in-out;">
    <template v-if="$route.name === 'index-change-email-requests-id-index-index'">
      <div class="flex-1 flex flex-col self-end ">
        <AppLoading :loading="loading" spinner />

        <transition name="drop" mode="out-in">
          <AppConfirm
            v-if="changeEmailRequestToRejectId || changeEmailRequestToRejectUserId"
            :message="'Are you sure you want to reject this change email request?'"
            @cancel="changeEmailRequestToRejectId = null, changeEmailRequestToRejectUserId = null"
            @confirm="rejectChangeEmailRequest"
          />
        </transition>

        <transition name="drop" mode="out-in">
          <AppConfirm
            v-if="changeEmailRequestToAcceptUserId"
            :message="'Are you sure you want to accept this change email request?'"
            @cancel="changeEmailRequestToAcceptUserId = null"
            @confirm="acceptChangeEmailRequest"
          />
        </transition>

        <div>
          <div
            class="mx-2 md:mx-4 flex no-underline shadow-lg rounded-lg  mt-4 shadow"
            style="position:relative;"
          >
            <div class="w-4/5 overflow-hidden text-sm m-4">
              <div>
                <p class="m-2">
                  ID <span class="m-2 ">{{ changeEmailRequest ? changeEmailRequest.id : null }}</span>
                </p>
                <p class="m-2">
                  Memorable Word Category <span class="m-2 ">{{ changeEmailRequest ? changeEmailRequest.memorable_word_category_name : null }}</span>
                </p>
                <p class="m-2">
                  Memorable Word <span class="m-2 ">{{ changeEmailRequest ? changeEmailRequest.memorable_word : null }}</span>
                </p>
                <p class="m-2">
                  Memorable Date <span class="m-2 ">{{ changeEmailRequest ? changeEmailRequest.memorable_date_formatted : null }}</span>
                </p>
                <p class="m-2">
                  Memorable 6 Digit Number <span class="m-2 ">{{ changeEmailRequest ? changeEmailRequest.memorable_number : null }}</span>
                </p>
                <p class="m-2">
                  Date Of Birth <span class="m-2 ">{{ changeEmailRequest && changeEmailRequest.date_of_birth_formatted ? changeEmailRequest.date_of_birth_formatted : '(none)' }}</span>
                </p>
                <p class="m-2">
                  Profession <span class="m-2 ">{{ changeEmailRequest && changeEmailRequest.profession_name ? changeEmailRequest.profession_name : '(none)' }}</span>
                </p>
                <p class="m-2">
                  Practice <span class="m-2 ">{{ changeEmailRequest && changeEmailRequest.practice_name ? changeEmailRequest.practice_name : '(none)' }}</span>
                </p>
                <p class="m-2">
                  New E-Mail Address <span class="m-2 ">{{ changeEmailRequest ? changeEmailRequest.new_email : null }}</span>
                </p>
                <p class="m-2">
                  User Count <span class="m-2 ">{{ changeEmailRequest ? changeEmailRequest.user_count : null }}</span>
                </p>
                <p class="m-2">
                  Requested At <span class="m-2 ">{{ changeEmailRequest ? changeEmailRequest.requested_at_formatted : null }}</span>
                </p>
                <p class="m-2">
                  <span>Status</span>
                  <span
                    v-if="changeEmailRequest"
                    class="px-4 py-1 rounded-full w-32 text-center mx-auto my-1"
                    :class="changeEmailRequestStatusColorClass[changeEmailRequest.status]"
                  >{{ changeEmailRequest.status }}</span>
                </p>
                <p class="m-2">
                  Accepted At <span class="m-2 ">{{ changeEmailRequest && changeEmailRequest.accepted_at_in_gb_formatted ? changeEmailRequest.accepted_at_in_gb_formatted : 'N/A' }}</span>
                </p>
                <p class="m-2">
                  Rejected At <span class="m-2 ">{{ changeEmailRequest && changeEmailRequest.rejected_at_in_gb_formatted ? changeEmailRequest.rejected_at_in_gb_formatted : 'N/A' }}</span>
                </p>
                <div v-if="false && changeEmailRequest && changeEmailRequest.status === 'Pending'" class="m-2">
                  <span>Action</span>
                  <button
                    v-if="changeEmailRequest"
                    class="w-1/2 sm:w-auto  text-sm ml-2 py-2 px-4 border border-white focus:bg-red-600 rounded-full focus:outline-none"
                    :class="`${false ? '' : 'bg-transparent px-2 hover:bg-red-600 hover:border-red-700'}`"
                    @click.prevent="changeEmailRequestToRejectId = changeEmailRequest.id"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p class="text-sm  px-2 md:px-4 pt-8 font-semibold">
          Users
        </p>

        <div v-if="changeEmailRequest" class="w-full overflow-x-auto p-2 md:px-4 md:py-2">
          <div class="hidden md:flex items-center  justify-around font-semibold"> 
            <div class="align-middle pl-6 pr-2 w-1/6">
              ID
            </div> 
            <div class="align-middle px-2 text-center w-1/6">
              Domain
            </div>
            <div class="align-middle px-2 text-center w-1/6">
              Username
            </div>
            <div class="align-middle px-2 text-center w-1/6">
              Name
            </div>
            <div class="align-middle px-2 text-center w-1/6">
              Email
            </div>
            <div class="align-middle px-2 text-center w-1/6">
              Action
            </div>
          </div>

          <div v-for="(user, index) in changeEmailRequest.users" :key="`item-${index}`">
            <nuxt-link
              :event="false ? '' :'click'" 
              :class="false ? 'cursor-auto':' hover:-light transition-hover ' "
              :to="false ? $route : { name: 'index-change-email-requests-id-index-index-users-userId', params: { id: changeEmailRequest.id, userId: user.id } }"
              class="flex flex-col md:flex-row px-4 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0  no-underline shadow-md " 
              draggable="false"
            >
              <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 md:px-4 xl:pl-6 py-2 align-middle">
                <strong class="block md:hidden text-sm uppercase">ID</strong>
                <span :class="false ? 'truncate' : 'break-word'">{{ user && user.id ? user.id : null }}</span>
              </div>

              <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 md:px-4 py-2 align-middle md:text-center">
                <strong class="block md:hidden text-sm uppercase">Domain</strong>
                <span :class="false ? 'truncate' : 'break-word'">{{ user && user.id ? user.domain : null }}</span>
              </div>

              <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 md:px-4 py-2 align-middle md:text-center">
                <strong class="block md:hidden text-sm uppercase">Username</strong>
                <span :class="false ? 'truncate' : 'break-word'">{{ user && user.id ? user.username : null }}</span>
              </div>

              <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 md:px-4 py-2 align-middle md:text-center">
                <strong class="block md:hidden text-sm uppercase">Name</strong>
                <span :class="false ? 'truncate' : 'break-word'">{{ user && user.id ? user.name : null }}</span>
              </div>

              <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 md:px-4 py-2 align-middle md:text-center">
                <strong class="block md:hidden text-sm uppercase">Email</strong>
                <span :class="false ? 'truncate' : 'break-word'">{{ user && user.id ? user.email : null }}</span>
              </div>

              <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 md:px-4 xl:pr-4 py-2 align-middle md:text-center">
                <strong class="block md:hidden">Action</strong>

                <div class="flex md:justify-center mt-2 sm:m-0">
                  <button
                    v-if="user.change_email_request_status === 'Pending'"
                    class="w-1/2 sm:w-auto  text-sm mr-2 py-2 px-4 border border-white focus:bg-green-500 rounded-full hover:bg-green-500 focus:outline-none"
                    :class="`${false ? '' : 'bg-transparent px-2 hover:bg-green-500 hover:border-green-600 '}`"
                    @click.prevent="changeEmailRequestToAcceptUserId = user.id"
                  >
                    Accept
                  </button>
                  <button
                    v-if="user.change_email_request_status === 'Pending'"
                    class="w-1/2 sm:w-auto  text-sm mr-2 py-2 px-4 border border-white focus:bg-red-600 rounded-full hover:bg-red-600 focus:outline-none"
                    :class="`${false ? '' : 'bg-transparent px-2 hover:bg-red-600 hover:border-red-600 '}`"
                    @click.prevent="changeEmailRequestToRejectUserId = user.id"
                  >
                    Reject
                  </button>
                  <button
                    v-if="user.change_email_request_status === 'Accepted'"
                    class="w-1/2 sm:w-auto  text-sm mr-2 py-2 px-4 border border-white focus:bg-green-500 rounded-full hover:bg-green-500 focus:outline-none"
                    :class="`${true ? 'bg-green-500 border-green-500  px-4 text-center cursor-default ' : ''}`"
                  >
                    Accepted
                  </button>
                  <button
                    v-if="user.change_email_request_status === 'Rejected'"
                    class="w-1/2 sm:w-auto  text-sm ml-2 py-2 px-4 border border-white focus:bg-red-600 rounded-full focus:outline-none"
                    :class="`${true ? 'bg-red-600 border-red-600  px-4 text-center cursor-default' : ''}`"
                  >
                    Rejected
                  </button>
                </div>
              </div>
            </nuxt-link>
          </div>

          <div v-if="changeEmailRequest && changeEmailRequest.users.length === 0" class="mt-4 w-full text-center ">
            <span>No matched users.</span>
          </div>
        </div>
      </div>
    </template>
    <nuxt-child :changeEmailRequest="changeEmailRequest" />
  </section>
</template>

<script>
  import AppLoading from '@/components/Base/AppLoading'
  import AppConfirm from '@/components/Base/AppConfirm'

  export default {
    components: {
      AppLoading,
      AppConfirm,
    },

    props: {
      changeEmailRequests: {
        type: Array,
        required: true,
      },

      changeEmailRequestStatusColorClass: {
        type: Object,
        required: true,
      },
    },

    data () {
      return {
        loading: false,
        changeEmailRequest: null,
        changeEmailRequestToRejectId: null,
        changeEmailRequestToAcceptUserId: null,
        changeEmailRequestToRejectUserId: null,
      }
    },

    mounted () {
      const changeEmailRequest = this.changeEmailRequests && this.changeEmailRequests.find(({ id }) => id.toString() === this.$route.params.id.toString())

      if (changeEmailRequest) {
        this.changeEmailRequest = changeEmailRequest
        return
      }

      this.loading = true
      this.$axios.get(`/api/v1/admin/change-email-requests/${this.$route.params.id}`).then((response) => {
        this.changeEmailRequest = response.data.data.change_email_request
      }).catch((err) => {
        console.log('err', err)
        this.$nuxt.error(err)
      }).finally(() => {
        this.loading = false
        // setTimeout(() => {
        //   this.loading = false
        // }, 1500)
      })
    },

    methods: {
      responseHandler (response) {
        const changeEmailRequest = response.data.data.change_email_request

        this.changeEmailRequest = changeEmailRequest

        const changeEmailRequests = this.changeEmailRequests

        const index = changeEmailRequests.findIndex(({ id }) => id === changeEmailRequest.id)

        if (index > -1) {
          changeEmailRequests.splice(index, 1, changeEmailRequest)
          this.$emit('changeEmailRequests', changeEmailRequests)
        }

        this.changeEmailRequestToRejectId = null
        this.changeEmailRequestToAcceptUserId = null
        this.changeEmailRequestToRejectUserId = null

        this.$store.commit('pendingChangeEmailRequestIds', this.$store.getters['pendingChangeEmailRequestIds'].filter(id => id !== changeEmailRequest.id))
      },

      errorHandler (err) {
        console.log('err', err.response || err)

        let message = null

        if (err.response) {
          if (err.response.status === 400 && err.response.data.error_messages) {
            message = err.response.data.error_messages.map(({ message }) => message).join(', ')
          } else {
            message = err.response.data.message
          }
        } else if (err.request) {
          message = 'Something went wrong!'
        } else {
          message = err.message
        }

        if (message) {
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'danger',
            text: message,
          })
        }
      },

      rejectChangeEmailRequest () {
        if (this.changeEmailRequestToRejectUserId) {
          this.loading = true
          const url = `/api/v1/admin/change-email-requests/${this.$route.params.id}/users/${this.changeEmailRequestToRejectUserId}/reject`
          this.$axios.put(url).then(this.responseHandler).catch(this.errorHandler).finally(() => {
            this.loading = false
          })
          return
        }

        if (!this.changeEmailRequestToRejectId) {
          return
        }
        
        this.loading = true
        const url = `/api/v1/admin/change-email-requests/${this.changeEmailRequestToRejectId}/reject`
        this.$axios.put(url).then(this.responseHandler).catch(this.errorHandler).finally(() => {
          this.loading = false
        })
      },

      acceptChangeEmailRequest () {
        if (!this.changeEmailRequestToAcceptUserId) {
          return
        }

        this.loading = true
        const url = `/api/v1/admin/change-email-requests/${this.$route.params.id}/users/${this.changeEmailRequestToAcceptUserId}/accept`
        this.$axios.put(url).then(this.responseHandler).catch(this.errorHandler).finally(() => {
          this.loading = false
        })
      },
    },
  }
</script>
