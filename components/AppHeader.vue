<template>
  <section class="header">
    <div class="flex justify-between md:justify-between items-center text-sm pl-4 pr-5 border border-b">
      <div class="flex flex-row py-1 text-gray-500">
        <button class="toggle focus:outline-none cursor-pointer" @click="toggleSideBar">
          <img src="~/assets/images/hbg.png" />
        </button>
        <div class="ml-2 m-1 text-md md:text-md">
          <AppBreadcrumbs />
        </div>
      </div>

      <div class="flex py-1">
        <div v-if="$auth.loggedIn" class="m-1 sm:relative">
          <AppButton
            icon="message"
            :label="'Messages'"
            class="notif-btn"
            :customTheme="'border-2 py-2 text-black'"
            :badge="unreadConversations.length"
            @click="$router.push('/messages')"
          />
        </div>

        <div class="m-1 sm:relative">
          <AppButton
            icon="bell"
            :label="'Notification'"
            class="notif-btn"
            :customTheme="'border-2 py-2 text-black'"
            :badge="unseenNotificationsCount"
            @click="showDropdownNotifications = !showDropdownNotifications"
          />
          <div v-if="showDropdownNotifications">
            <div v-on-clickaway="onClickaway" class="notification-modal mx-auto sm:mx-0 overflow-hidden shadow-md">
              <div class="flex flex-row mx-4 items-center justify-between pt-4">
                <div class>
                  <p class="text-xl font-bold tracking-normal">
                    Notifications
                  </p>
                </div>
                <div v-if="unseenNotificationsCount" class="hover:text-gray-800 mt-1 cursor-pointer" @click="$emit('seenAllNotifications')">
                  {{ seeningAllNotifications ? 'Loading...' : 'Mark All as Read' }}
                </div>
                <p v-else class="text-xs italic text-gray-400">
                  Click outside to Close
                </p>
              </div>

              <div class="m-2 overflow-y-auto overflow-x-hidden px-2" style="max-height: 500px;">
                <div v-if="notifications.length > 0">
                  <div
                    v-for="(item, index) in notifications"
                    :key="`item-${index}`"
                    class="inline-block w-full p-3 mb-2 shadow-md hover:bg-gray-200 transition-hover rounded-lg cursor-pointer"
                    :class="item.seen === true ? '' : 'border-2 border-orange-500'"
                    @click="$emit('goToNotification', item)"
                  >
                    <div class="w-full flex flex-col leading-tight sm:my-1 pt-1">
                      <span class="uppercase text-xs font-bold pb-2">{{ item.title }}</span>
                      <span>{{ item.description }}</span>
                    </div>

                    <span class="text-xs ">{{ item.created_at_in_gb_formatted }}{{ false ? ` (${item.id})` : '' }}</span>
                  </div>

                  <div v-if="true" class="flex justify-center m-4">
                    <p class="hover:text-gray-500 cursor-pointer px-2" @click="$emit('loadMoreNotifs')">
                      {{ loadingMoreNotifs ? 'Loading...' : 'Show More' }}
                    </p>
                  </div>
                </div>

                <div v-if="notifications.length === 0">
                  No New Notifications
                </div>
              </div>

              <div v-if="false" class="flex justify-center m-4">
                <p class="hover:text-gray-500 cursor-pointer px-2" @click="$emit('loadMoreNotifs')">
                  Show More
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="$auth.loggedIn" class="m-1 sm:relative">
          <AppButton
            icon="user"
            :label="'My Account'"
            class="notif-btn"
            :customTheme="'border-2 py-2 text-black'"
            @click="$router.push('/account')"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import AppButton from '@/components/Base/AppButton'
import AppBreadcrumbs from '@/components/Base/AppBreadcrumbs'
export default {
  components: {
    AppButton,
    AppBreadcrumbs
  },
  mixins: [clickaway],

  props: {
    unseenNotificationsCount: {
      type: Number,
      default: 0
    },

    notifications: {
      type: Array,
      default: () => []
    },

    seeningAllNotifications: {
      type: Boolean,
      default: false
    },

    loadingMoreNotifs: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      showDropdownNotifications: false,
      unreadConversations: []
    }
  },

  computed: {
    headerName() {
      if (this.$route.name.includes('index-locums')) return 'Locums'
      else if (this.$route.name.includes('index-practices')) return 'Practices'
      else if (this.$route.name.includes('index-billings')) return 'Billings'
      else if (this.$route.name.includes('index-reports')) return 'Reports'
      else if (this.$route.name.includes('index-standard-terms')) return 'Standard Terms'
      else if (this.$route.name.includes('index-referral-lottery')) return 'Referral Lottery'
      else if (this.$route.name.includes('index-faqs')) return 'Frequently Asked Questions'
      else if (this.$route.name.includes('index-terms-and-conditions')) return 'Terms and Conditions'
      else if (this.$route.name.includes('index-inquiries')) return 'Inquiries'
      else if (this.$route.name.includes('index-user-management')) return 'User Management'
      else if (this.$route.name.includes('index-change-email-requests')) return 'Change Email Requests'
      else if (this.$route.name.includes('index-compliance-document-reject-reasons')) return 'Compliance Document Reject Reasons'
      else if (this.$route.name.includes('index-test-script')) return 'Test Script'
      else return 'Dashboard'
    }
  },

  watch: {
    $route(route) {
      console.log('route', route)
    }
  },

  mounted() {
    this.$axios.get('/api/v1/conversations?seen=false&limit=999').then(response => {
      this.unreadConversations = response.data.data.conversations
    })

    const messageEvents = [
      'newMessage',
      'newMessageLocum',
      'newMessagePractice',
      'newMessage:locum',
      'newMessage:practice',
      'message:new',
      'new-message'
    ]
    messageEvents.forEach(evt => this.$socket.on(evt, this.newMessageInConversationHandler))
    this.$socket.on('seenConversation', this.seenConversationHandler)
  },

  destroyed() {
    const messageEvents = [
      'newMessage',
      'newMessageLocum',
      'newMessagePractice',
      'newMessage:locum',
      'newMessage:practice',
      'message:new',
      'new-message'
    ]
    messageEvents.forEach(evt => this.$socket.removeListener(evt, this.newMessageInConversationHandler))
    this.$socket.removeListener('seenConversation', this.seenConversationHandler)
  },

  methods: {
    newMessageInConversationHandler(raw) {
      const conversation = raw && raw.conversation ? raw.conversation : raw
      if (!conversation || !conversation.latest_conversation_message) return
      console.log('AppHeader newMessageInConversationHandler', conversation)

      if (conversation.latest_conversation_message.user.id !== this.$auth.user.id) {
        const index = this.unreadConversations.findIndex(({ id }) => id === conversation.id)

        if (index === -1) {
          this.unreadConversations.unshift(conversation)
        }
      }
    },

    seenConversationHandler(conversation) {
      console.log('AppHeader seenConversationHandler', conversation)

      const index = this.unreadConversations.findIndex(({ id }) => id === conversation.id)

      console.log('index', index)

      if (index > -1) {
        const unreadConversations = [...this.unreadConversations]

        unreadConversations.splice(index, 1)

        this.unreadConversations = unreadConversations
      }
    },

    onClickaway() {
      this.showDropdownNotifications = false
    },

    toggleSideBar() {
      this.$store.commit('TOGGLE_SIDEBAR', true)
      document.body.style.overflow = 'hidden'
    }
  }
}
</script>

<style>
.notification-modal {
  position: absolute;
  right: 0;
  left: 0;
  margin-top: 14px;
  /* position: fixed;
    left: 80%;
    transform: translate(-86%, -15%); */
  border-radius: 10px;
  min-width: 300px;
  width: 380px;
  max-width: 95%;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  background-color: #fff;
  z-index: 49;
}

@media screen and (min-width: 480px) {
  .notification-modal {
    min-width: 380px;
    left: unset;
  }
}

@media screen and (min-width: 768px) {
  .notification-modal {
    /* max-height: 80%; */
    min-height: 80%;
  }
}

.header {
  display: inline;
}

.toggle {
  margin-left: 0;
}

@media screen and (min-width: 1200px) {
  .dropdown-menu {
    top: 50px;
    left: -16px;
    width: 290px;
  }
  .toggle {
    display: none;
  }
}
@media (min-width: 768px) {
  .notif-btn {
    min-width: 150px;
  }
}
</style>
