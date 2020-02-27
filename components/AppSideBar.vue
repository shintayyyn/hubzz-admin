<template>
  <div
    class="sidebar bg-charade"
    :class="{ 'toggled-left': $store.state.toggled_sidebar }"
  >
    <div class="sidebar-nav">
      
      <!-- LINKS WRAPPER -->
      <div class="xl:mt-24">
        <!-- CLOSE BUTTON -->
        <div
          class="close-button cursor-pointer text-2xl font-bold text-sunglow px-4 mt-4"
          @click="close"
        >
          X
        </div>
        <!-- CLOSE BUTTON ENDS HERE -->

        <!-- LINKS -->
        <div
          v-for="(item, index) in lists"
          :key="index"
          class="text-sm relative"
        >
          <span
            class="absolute inset-y-0 left-0 border-solid bg-sunglow w-1 h-full"
            v-if="`/${$route.path.split('/')[1]}` == item.route"
          ></span>
          <nuxt-link :to="item.route">
            <div
              @click="close"
              class="block font-sans no-underline p-4"
              :class="`/${$route.path.split('/')[1]}` == item.route ? 
                'text-yellow-500': 
                'text-white hover:text-gray-500'"
              >
              <span>{{ item.name }}</span>
              <span v-if="item.name === 'Inquiries' && unacknowledgedCount > 0" class="rounded-lg p-1 px-2 bg-red-700"> 
                {{unacknowledgedCount}}
              </span>
            </div>
            
          </nuxt-link>
        </div>
        <!-- LINKS END HERE -->

        <!-- SIGN OUT -->
        <div class="text-sm relative">
          <span
            class="absolute left-0 border-solid bg-yellow-500 w-1 h-full"
            v-if="`/${$route.path.split('/')[1]}` == '/sign-out'"
          ></span>
          <button
            @click.prevent="signout"
            class="block no-underline p-4 focus:outline-none"
            :class="
              `/${$route.path.split('/')[1]}` == '/sign-out'
                ? 'text-yellow-500'
                : 'text-white hover:text-gray-400'
            "
          >
            <span class="font-sans">Sign Out</span>
          </button>
        </div>
        <!-- SIGN OUT ENDS HERE -->
      </div>
      <!-- LINKS WRAPPER ENDS HERE -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      lists: [],
      menu: [],
      // GET SUPPORTS BADGE
      params: {
        acknowledged: false
      },
      supportsBadge: 0
    };
  },
  computed: {
    unacknowledgedCount() {
      return this.$store.state.supports.unacknowledgedCount
    }
  },
  async created() {
    // $auth.user.domain
    if (this.$auth.loggedIn) {
      const acknowledged = false
      const params = { acknowledged }

      this.$axios.$get(`/api/v1/admin/supports/count`,{ params }).then(res => {
        this.$store.commit("supports/SET_UNACKNOWLEDGED_EMAILS_COUNT",res.data.count)
      })

      let domain = this.$auth.user.domain;
      let addedLists = [];
      let defaultLists = [
        { name: "Dashboard", route: "/" },
        { name: "Locums", route: "/locums" },
        { name: "Practices", route: "/practices" },
        { name: "Reports", route: "/reports" },
        { name: "Billing", route: "/billings" },
        { name: "FAQs", route: "/faqs" },
        { name: "Terms and Conditions", route: "/tncs" },
        { name: "Standard Terms", route: "/standard-terms" },
        { name: "Inquiries", route: "/inquiries" },
        { name: "User Management", route: "/user-management" },
        { name: 'Referral Lottery', route: "/referral-lottery"}
      ];

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

      this.lists = [...defaultLists, ...addedLists];

      let defaultMenu = [
        { name: "Dashboard", route: "/" },
        {
          name: "Users",
          toggle: false,
          subMenu: [
            { name: "Locums", route: "/locums" },
            { name: "Practices", route: "/practices" },
            { name: "User Management", route: "/user-management" }
          ]
        },
        { name: "Reports", route: "/reports" },
        { name: "Billing", route: "/billings" },
        { name: "FAQs", route: "/faqs" },
        { name: "Terms and Conditions", route: "/tncs" },
        { name: "Inquiries", route: "/inquiries" }
      ];

      this.menu = [...defaultMenu];
    }
  },
  methods: {
    signout() {
      this.$emit("modal", true);
      // this.$store.commit('TOGGLE_SIGNOUT', true)
    },
    close() {
      this.$store.commit("TOGGLE_SIDEBAR", false);
      document.body.style.overflow = "auto";
    }
  }
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  margin-left: -200px;
  width: 200px;
  height: 100%;
  overflow: auto;
  transition: all 0.3s ease-in-out;
  z-index: 500;
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
