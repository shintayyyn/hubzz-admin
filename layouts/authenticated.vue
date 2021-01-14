<template>
  <div class="relative flex flex-col bg-trout">
    <AppSideBar
      :unseenLocumNotificationsCount="unseenLocumNotificationsCount"
      :unseenPracticeNotificationsCount="unseenPracticeNotificationsCount"
      @modal="(value) => showLogoutModal = value"
    />
    
    <transition name="drop" mode="out-in">
      <SignOut v-if="showLogoutModal" @modal="(value) => showLogoutModal = value" @logout="logout" />
    </transition>
    
    <div v-if="showLogoutModal" class="signout-shield" @click="showLogoutModal = false" />

    <div v-if="sessionExpiring" class="signout-shield" />

    <div v-if="$store.state.toggled_sidebar" class="sidebar-shield" @click="closeSideBar" />

    <transition name="drop" mode="out-in">
      <SessionExpiring @logout="logout" />
    </transition>

    <AppNotification />
    
    <PopUpNotification
      :sortedPopUpNotifications="sortedPopUpNotifications"
      @clearPopUpNotifications="clearPopUpNotifications"
      @goToNotification="goToNotification"
      @closePopUpNotification="closePopUpNotification"
    />
    
    <div class="content h-screen flex flex-col justify-between">
      <AppHeader
        :unseenNotificationsCount="unseenNotificationsCount"
        :notifications="sortedNotifications"
        @loadMoreNotifs="loadMoreNotifs"
        @seenAllNotifications="seenAllNotifications"
        @goToNotification="goToNotification"
      />

      <nuxt class="overflow-y-auto" />
    </div>
  </div>
</template>

<script>
  import AppNotification from "~/components/AppNotification"
  import PopUpNotification from "@/components/PopUpNotification"
  import AppHeader from "~/components/AppHeader"
  import AppSideBar from "~/components/AppSideBar"
  import SignOut from "~/components/Auth/SignOut"
  import SessionExpiring from "~/components/Auth/SessionExpiring"
  
  export default {
    components: {
      AppNotification,
      PopUpNotification,
      AppHeader,
      AppSideBar,
      SignOut,
      SessionExpiring,
    },

    data () {
      return {
        showLogoutModal: false,
        showSessionExpiringModal: false,

        unseenNotifications: [],
        notifications: [],
        notificationTypeNames: [
          'Admin Notification Locum Compliance',
          'Admin Notification Locum Invoice Disputed',
          'Admin Notification Locum Profile Updated',
          'Admin Notification Locum Registration',
          'Admin Notification Locum Dormanted',
          'Admin Notification Locum Invoice Approved Disputed',

          'Admin Notification Practice Hub Accepted',
          'Admin Notification Practice Hub Created',
          'Admin Notification Practice Hub Deleted',
          'Admin Notification Practice Hub Rejected',

          'Admin Notification Practice Invoice Detail Updated',
          'Admin Notification Practice Profile Updated',
          'Admin Notification Practice Invoice Paid',
          'Admin Notification Practice Invoice PastDue',
          'Admin Notification Practice Invoice Unpaid',
          'Admin Notification Practice Invoice Past Due',

          'Admin Notification Practice Registration',
          'Admin Notification Practice Created',
          'Admin Notification Practice Dormanted',
          'Admin Notification Practice Surgery Created',
          'Admin Notification Practice Surgery Deleted',
          'Admin Notification Practice Surgery TerminationRequested',
          'Admin Notification Practice Surgery Updated',
        ],

        popUpNotifications: [],

        locumSideBarNotificationsTypeNames: [
          'Admin Notification Locum Compliance',
          'Admin Notification Locum Registration',
          'Admin Notification Locum Profile Updated',
          'Admin Notification Locum Dormanted',
        ],

        practiceSideBarNotificationsTypeNames: [
          'Admin Notification Practice Registration',
          'Admin Notification Practice Created',
          'Admin Notification Practice Invoice Detail Updated',
          'Admin Notification Practice Surgery Created',
          'Admin Notification Practice Dormanted',
        ],

        billingSideBarNotificationsTypeNames: [
          'Admin Notification Locum Invoice Disputed',
          'Admin Notification Locum Invoice Approved Disputed',
          'Admin Notification Practice Invoice Past Due',
        ],
      }
    },

    computed: {
      unseenNotificationsCount () {
        return this.unseenNotifications.length
      },

      unseenLocumNotificationsCount () {
        return this.unseenNotifications
          .filter(unseenNotification => this.locumSideBarNotificationsTypeNames.includes(unseenNotification.notification_type_name))
          .length
      },

      unseenPracticeNotificationsCount () {
        return this.unseenNotifications
          .filter(unseenNotification => this.practiceSideBarNotificationsTypeNames.includes(unseenNotification.notification_type_name))
          .length
      },

      sessionExpiring () {
        return this.$store.getters["sessionExpiring"]
      },

      sortedNotifications () {
        return [...this.notifications].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      },

      sortedPopUpNotifications () {
        return [...this.popUpNotifications].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      },
    },

    mounted () {
      this.$loggedOutBroadcastChannel.addEventListener('message', this.loggedOutHandler)

      this.notificationTypeNames.forEach((notificationTypeName) => {
        this.$socket.on(notificationTypeName, this.newNotificationHandler)
      })

      this.initializeNotifications()
    },

    destroyed () {
      this.$loggedOutBroadcastChannel.removeEventListener('message', this.loggedOutHandler)

      this.notificationTypeNames.forEach((notificationTypeName) => {
        this.$socket.removeListener(notificationTypeName, this.newNotificationHandler)
      })
    },

    methods: {
      newNotificationHandler (payload) {
        const { notification, } = payload

        if (!notification) {
          return
        }

        if (!notification.seen) {
          this.unseenNotifications.push({
            id: notification.id,
            notification_type_name: notification.notification_type && notification.notification_type.name,
          })
        }

        this.popUpNotifications.push(notification)

        this.notifications.push(notification)
      },

      goToNotification (notification) {
        this.$router.push(notification.url)

        this.closePopUpNotification(notification)
      },

      closePopUpNotification (notification) {
        const index = this.popUpNotifications.findIndex(({ id }) => id === notification.id)

        if (index > -1) {
          this.popUpNotifications.splice(index, 1)
        }

        const notificationId = notification.id

        if (!notification.seen) {
          this.$axios.put(`/api/v1/admin/me/notifications/${notificationId}/seen`).then((response) => {
            const index = this.unseenNotifications.findIndex(({ id }) => id === notificationId)

            if (index > -1) {
              this.unseenNotifications.splice(index, 1)
            }

            const updatedNotification = response.data.data.notification

            const notificationIndex = this.notifications.findIndex(({ id }) => id === notificationId)

            if (notificationIndex > -1) {
              this.notifications.splice(notificationIndex, 1, updatedNotification)
            }
          })
        }
      },

      clearPopUpNotifications () {
        const notificationIds = this.popUpNotifications.map(({ id }) => id)

        if (notificationIds.length > 0) {
          this.$axios.put('/api/v1/admin/me/notifications/seen-many', {
            id: notificationIds,
          }).then(() => {
            this.unseenNotifications = this.unseenNotifications.filter(({ id }) => !notificationIds.includes(id))

            notificationIds.forEach(seenNotificationId => {
              const index = this.notifications.findIndex(({ id }) => id === seenNotificationId)

              if (index > -1) {
                const notification = this.notifications[index]

                notification.seen = true
                notification.seen_at = this.$moment.utc().toISOString()

                this.notifications.splice(index, 1, notification)
              }
            })
          })
        }

        this.popUpNotifications = []
      },

      initializeNotifications () {
        Promise.all([
          this.$axios.get(`/api/v1/admin/me/notifications`, {
            params: {
              seen: false,
              id_and_notification_type_only: true,
            },
          }).then(res => {
            this.unseenNotifications = res.data.data.notifications
          }),

          this.$axios.get(`/api/v1/admin/me/notifications`, {
            params: {
              order_by: "created_at:desc",
              limit: 10,
            },
          }).then(res => {
            this.notifications = res.data.data.notifications
          }),
        ])
      },

      loadMoreNotifs () {
        this.$axios.get(`/api/v1/admin/me/notifications`, {
          params: {
            order_by: "created_at:desc",
            limit: 10,
            offset: this.notifications.length,
          },
        }).then(res => {
          res.data.data.notifications.forEach(item => {
            this.notifications.push(item)
          })
        })
      },

      seenAllNotifications () {
        this.$axios.$put(`/api/v1/admin/me/notifications/seen-all`).then(() => {
          this.notifications
            .filter(notification => !notification.seen)
            .forEach(notification => (notification.seen = true))

          this.unseenNotifications = []
        })
      },

      logout () {
        this.$axios
          .post('/api/v1/admin/logout')
          .then(() => {
            console.log('Socket Logged Out')
            console.log('One Signal Logged Out')
          })
          .catch(err => {
            console.log('err', err.response || err)
            if (err.response.data.message) {
              this.$store.commit('SET_NOTIFICATION', {
                enabled: true,
                status: 'danger',
                text: [`${err.response.data.message}`]
              })
            }
          })
          .finally(() => {
            return this.loggedOutHandler()
          })
          .then(() => {
            this.$loggedOutBroadcastChannel.postMessage()
          })
          .catch(err => {
            console.log('err', err.response || err)
            if (err.response.data.message) {
              this.$store.commit('SET_NOTIFICATION', {
                enabled: true,
                status: 'danger',
                text: [`${err.response.data.message}`]
              })
            }
          })
      },

      loggedOutHandler () {
        return this.$auth.logout().finally(() => {
          this.$auth.$storage.setUniversal('_token.local', '')
          this.$router.push('/sign-in')
        })
      },

      closeSideBar () {
        this.$store.commit('TOGGLE_SIDEBAR', false)
        document.body.style.overflow = 'auto'
      },

    },

  }
</script>

<style>
	.content {
		margin-left: 0;
		min-height: 100vh;
		max-height: 100%;
		overflow-x: hidden;
	}
	.sidebar-shield {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #31343d;
		opacity: 0.75;
		z-index: 499;
	}

	.signout-shield {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #333;
		opacity: 0.5;
		z-index: 511;
	}

	@media screen and (min-width: 1200px) {
		.content {
			margin-left: 200px;
		}

		.sidebar-shield {
			display: none;
		}
	}
</style>
