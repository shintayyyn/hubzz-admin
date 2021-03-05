<template>
  <div
    class="sidebar bg-charade"
    :class="{ 'toggled-left': $store.state.toggled_sidebar }"
  >
    <!-- LINKS WRAPPER -->
    <div class="sidebar-nav pt-8 xl:pt-10">
      <div class="flex flex-row justify-center pb-4">
        <div class="flex justify-center">
          <img src="~/assets/images/hubzz_logo.png" class="w-3/5"/>
        </div>
        
        <!-- <button
          class="close-button cursor-pointer focus:outline-none text-2xl font-bold text-yellow-500 px-4"
          @click="close"
        >
          X
        </button> -->
        <button
            class="absolute top-0 right-0 my-2 mx-3 close-button cursor-pointer focus:outline-none text-2xl font-bold text-sunglow hover:text-sunglow-dark transition-hover"
            @click="close"
          >
            <svgicon name="times-solid" class="fill-current" width="18" />
        </button>
      </div>

      <!-- LINKS -->
      <div v-for="(navigationTab, index) in navigationTabs" :key="index" class="text-sm relative">
        <span v-if="navigationTab.active" class="absolute ml-3 mt-4 p-1.5 h-1.5 rounded-sm bg-sunglow"/>

        <nuxt-link :to="navigationTab.route">
          <div
            class="block no-underline pl-4 py-3 mx-4 transition-hover"
            :class="navigationTab.active ? 'text-white font-bold' : 'text-gray-500 hover:text-white hover:font-bold'"
            @click="close"
          >
            <span>{{ navigationTab.name }}</span>

            <span v-if="navigationTab.name === 'Locums' && unseenLocumNotificationsCount > 0" class="text-white rounded-sm p-1 bg-red-700"> 
              {{ unseenLocumNotificationsCount }}
            </span>

            <span v-if="navigationTab.name === 'Practices' && unseenPracticeNotificationsCount > 0" class="text-white rounded-sm p-1 bg-red-700"> 
              {{ unseenPracticeNotificationsCount }}
            </span>

            <!-- <span v-if="navigationTab.name === 'Inquiries' && unacknowledgedCount > 0" class="text-white rounded-sm p-1 bg-red-700"> 
              {{ unacknowledgedCount }}
            </span> -->

            <span v-if="navigationTab.name === 'Change Email Requests' && pendingChangeEmailRequestIds.length > 0" class="text-white rounded-sm p-1 bg-red-700"> 
              {{ pendingChangeEmailRequestIds.length }}
            </span>
          </div>
        </nuxt-link>
      </div>
      <!-- LINKS END HERE -->

      <!-- SIGN OUT -->
      <div class="text-sm relative">
        <button
          class="block no-underline pl-4 py-3 mx-4 transition-hover"
          :class="
            `/${$route.path.split('/')[1]}` == '/sign-out'
              ? 'text-yellow-500'
              : 'text-white hover:text-gray-400'
          "
          @click.prevent="signout"
        >
          <span class="font-sans">Sign Out</span>
        </button>
      </div>
      <!-- SIGN OUT ENDS HERE -->
    </div>
    <!-- LINKS WRAPPER ENDS HERE -->
  </div>
</template>

<script>
export default {
  props: {
    unseenLocumNotificationsCount: {
      type: Number,
      default: 0,
    },

    unseenPracticeNotificationsCount: {
      type: Number,
      default: 0,
    },
  },

  data () {
    return {
      menu: [],
      // GET SUPPORTS BADGE
      params: {
        acknowledged: false
      },
      supportsBadge: 0,
    }
  },

  computed: {
    authAdminPermissions () {
			return this.$store.getters["permissions"]
    },

    unacknowledgedCount () {
      return this.$store.state.supports.unacknowledgedCount
    },

    pendingChangeEmailRequestIds () {
      return this.$store.getters['pendingChangeEmailRequestIds']
    },

    navigationTabs () {
      let defaultLists = [
        {
          name: "Dashboard",
          route: "/",
          order: 1,
          active: this.$route.name === 'index',
        },
      ]

      let addedLists = []

      if(this.authAdminPermissions.includes('View Locums') 
        || this.authAdminPermissions.includes('View Locum Jobs')
        || this.authAdminPermissions.includes('View Locum Compliance Detail')
        || this.authAdminPermissions.includes('View Reports')
      ){
        addedLists.push({
          name: "Locums",
          route: "/locums",
          order: 2,
          active: `/${this.$route.path.split('/')[1]}` === '/locums',
        })
      }

      if(this.authAdminPermissions.includes('View Practices')
        || this.authAdminPermissions.includes('View Surgery Management')
        || this.authAdminPermissions.includes('View Practice Sessions')
        || this.authAdminPermissions.includes('View Practice Users')
        || this.authAdminPermissions.includes('View Practice Documents')
        || this.authAdminPermissions.includes('View Reports')){
        addedLists.push({
          name: "Practices",
          route: "/practices",
          order: 3,
          active: `/${this.$route.path.split('/')[1]}` === '/practices',
        })
      }

      if(this.authAdminPermissions.includes('View Hubzz Invoices')
        || this.authAdminPermissions.includes('View Reports')){
        addedLists.push({
          name: "Billing",
          route: "/billings/hubzz-billing",
          order: 4,
          active: `/${this.$route.path.split('/')[1]}` === '/billings',
        })
      }

      if(this.authAdminPermissions.includes('View Reports')){
        addedLists.push({
          name: "Reports",
          route: "/reports",
          order: 5,
          active: `/${this.$route.path.split('/')[1]}` === '/reports',
        })
      }

      if(this.authAdminPermissions.includes('View Standard Terms')){
        addedLists.push({
          name: "Standard Terms",
          route: "/standard-terms",
          order: 6,
          active: `/${this.$route.path.split('/')[1]}` === '/standard-terms',
        })
      }
      
      if(this.authAdminPermissions.includes('View Referral Lottery')){
        addedLists.push({
          name: "Referral Lottery",
          route: "/referral-lottery",
          order: 7,
          active: `/${this.$route.path.split('/')[1]}` === '/referral-lottery',
        })
      }

      if(this.authAdminPermissions.includes('View FAQ')){
        addedLists.push({
          name: "FAQs",
          route: "/faqs",
          order: 8,
          active: `/${this.$route.path.split('/')[1]}` === '/faqs',
        })
      }

      if(this.authAdminPermissions.includes('View Terms and Conditions & Privacy Policy')){
        addedLists.push({
          name: "Terms and Conditions",
          route: "/terms-and-conditions",
          order: 9,
          active: `/${this.$route.path.split('/')[1]}` === '/terms-and-conditions',
        })
      }

      // if(this.authAdminPermissions.includes('View Inquiries Messages')){
      //   addedLists.push({
      //     name: "Inquiries",
      //     route: "/inquiries",
      //     order: 10,
      //     active: `/${this.$route.path.split('/')[1]}` === '/inquiries',
      //   })
      // }
    
      if(this.authAdminPermissions.includes('View Admin Accounts')
        || this.authAdminPermissions.includes('View Roles')){
        addedLists.push({
          name: "User Management",
          route: "/user-management",
          active: `/${this.$route.path.split('/')[1]}` === '/user-management',
          order: 11,
        })
      }

      if (this.authAdminPermissions.includes('View Change Email Requests')) {
        addedLists.push({
          name: "Change Email Requests",
          route: "/change-email-requests",
          active: `/${this.$route.path.split('/')[1]}` === '/change-email-requests',
          order: 12,
        })
      }

      if (this.authAdminPermissions.includes('View Compliance Document Reject Reasons')) {
        addedLists.push({
          name: "Compliance Document Reject Reasons",
          route: "/compliance-document-reject-reasons",
          active: `/${this.$route.path.split('/')[1]}` === '/compliance-document-reject-reasons',
          order: 13,
        })
      }
      
      addedLists.push({
        name: "Test Script",
        route: "/test-script",
        active: `/${this.$route.path.split('/')[1]}` === '/test-script',
        order: 14,
      })
      // =================INCLUDE BILLINGS PERMISSIONS, FAQS================
      // if(this.authAdminPermissions.includes(''))
      
      // if (domain === "Super Admin") {
      //   addedLists = [
      //     { name: "Compliance", route: "/compliance" },
      //     { name: "Users", route: "/compliance" },
      //     { name: "Compliance Documents", route: "/compliance" },
      //     { name: "Profession Categories", route: "/compliance" },
      //     { name: "Profession", route: "/compliance" },
      //     { name: "Qualifications", route: "/compliance" },
      //     { name: "Practice Types", route: "/compliance" },
      //     { name: "Clinical Commissioning Groups", route: "/compliance" },
      //     { name: "Surgeries", route: "/compliance" }
      //   ];
      // }

      const navigationTabs = [...defaultLists, ...addedLists]
      navigationTabs.sort((a, b) => a.order - b.order)
      // let defaultMenu = [
      //   { name: "Dashboard", route: "/" },
      //   {
      //     name: "Users",
      //     toggle: false,
      //     subMenu: [
      //       { name: "Locums", route: "/locums" },
      //       { name: "Practices", route: "/practices" },
      //       { name: "User Management", route: "/user-management" }
      //     ]
      //   },
      //   { name: "Reports", route: "/reports" },
      //   { name: "Billing", route: "/billings" },
      //   { name: "FAQs", route: "/faqs" },
      //   { name: "Terms and Conditions", route: "/terms-and-conditions" },
      //   { name: "Inquiries", route: "/inquiries" }
      // ]

      // this.menu = [...defaultMenu]

      return navigationTabs
    },
  },

  async created () {
    // $auth.user.domain
    if (this.$auth.loggedIn) {
      this.$axios.$get(`/api/v1/admin/supports/count`, {
        params: {
          acknowledged: false,
        }
      }).then(res => {
        this.$store.commit("supports/SET_UNACKNOWLEDGED_EMAILS_COUNT", res.data.count)
      })
    }
  },

  mounted () {
    this.$store.dispatch('pendingChangeEmailRequestIds')
    this.$socket.on('Admin Notification Change Email Request Pending', this.adminNotificationChangeEmailRequestPendingHandler)
    this.$socket.on('Admin Notification Change Email Request Rejected', this.adminNotificationChangeEmailRequestRejectedHandler)
    this.$socket.on('Admin Notification Change Email Request Accepted', this.adminNotificationChangeEmailRequestAcceptedHandler)
  },

  destroyed () {
    this.$socket.removeListener('Admin Notification Change Email Request Pending', this.adminNotificationChangeEmailRequestPendingHandler)
    this.$socket.removeListener('Admin Notification Change Email Request Rejected', this.adminNotificationChangeEmailRequestRejectedHandler)
    this.$socket.removeListener('Admin Notification Change Email Request Accepted', this.adminNotificationChangeEmailRequestAcceptedHandler)
  },

  methods: {
    adminNotificationChangeEmailRequestPendingHandler (changeEmailRequest) {
      const {
        id: changeEmailRequestId,
      } = changeEmailRequest

      const pendingChangeEmailRequestIds = JSON.parse(JSON.stringify(this.pendingChangeEmailRequestIds))

      const index = pendingChangeEmailRequestIds.findIndex(id => id === changeEmailRequestId)

      if (index === -1) {
        pendingChangeEmailRequestIds.push(changeEmailRequestId)

        this.$store.commit('pendingChangeEmailRequestIds', pendingChangeEmailRequestIds)
      }
    },

    removeChangeEmailRequestPendingId (changeEmailRequestId) {
      const pendingChangeEmailRequestIds = JSON.parse(JSON.stringify(this.pendingChangeEmailRequestIds))

      const index = pendingChangeEmailRequestIds.findIndex(id => id === changeEmailRequestId)

      if (index > -1) {
        pendingChangeEmailRequestIds.splice(index, 1)

        this.$store.commit('pendingChangeEmailRequestIds', pendingChangeEmailRequestIds)
      }
    },

    adminNotificationChangeEmailRequestRejectedHandler ({ id }) {
      this.removeChangeEmailRequestPendingId(id)
    },

    adminNotificationChangeEmailRequestAcceptedHandler ({ id }) {
      this.removeChangeEmailRequestPendingId(id)
    },

    signout () {
      this.$emit("modal", true)
      // this.$store.commit('TOGGLE_SIGNOUT', true)
    },
    close () {
      this.$store.commit("TOGGLE_SIDEBAR", false)
      document.body.style.overflow = "auto"
    }
  }
}
</script>

<style scoped>
  .sidebar {
    position: fixed;
    margin-left: -200px;
    width: 200px;
    height: 100%;
    overflow: auto;
    border-right: solid 1px#ccc;
    transition: all 0.3s ease-in-out;
    background-color: rgb(2, 4, 12);
    z-index: 55;
  }
  .toggled-left {
    margin-left: 0;
  }
  .close-button {
    display: block;
  }
  @media screen and (min-width: 1200px) {
    .sidebar {
      margin-left: 0;
    }
    .close-button {
      display: none;
    }
  }
  .rotate {
    transform: rotate(-90deg);
    transition: transform 0.3s ease-in-out;
  }

  .arrow {
    transform: rotate(90deg);
    transition: transform 0.3s ease-in-out;
  }
</style>
