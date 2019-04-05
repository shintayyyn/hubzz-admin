<template>
  <div class="w-screen h-screen relative flex flex-col">
    <!-- LOGOUT MODAL -->
    <div
      class="h-full w-full flex flex-col absolute"
      :style="`z-index: ${showLogoutModal ? 100 : -100}; opacity: ${showLogoutModal ? 1 : 0};`"
    >
      <div class="flex flex-col self-center py-2 px-24 rounded-lg bg-sunglow">
        <div>
          <span class="text-sm p-2">Proceed to sign-out?</span>
        </div>
        <div class="flex">
          <button class="p-2 text-xs rounded-lg border border-white mx-1 shadow" @click="logout">Yes</button>
          <button
            class="p-2 text-xs rounded-lg border border-white mx-1 shadow"
            @click="showLogoutModal = false"
          >Cancel</button>
        </div>
      </div>
    </div>
    <!-- LOGOUT MODAL -->

    <div class="w-full flex-1 flex">
      <!-- SIDEBAR -->
      <div
        class="flex flex-col pt-16 h-full bg-charade"
        style="transition: .8s;"
        :style="`width: ${sideBarOpen ? 'auto' : '0'}; min-width: ${sideBarOpen ? '180px' : '0'}`"
      >
        <nuxt-link
          class="text-xs px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'dashboard' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/"
        >Dashboard</nuxt-link>
        <nuxt-link
          class="text-xs px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'roles' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/roles"
        >Roles</nuxt-link>
        <nuxt-link
          class="text-xs px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'professions' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/professions"
        >Professions</nuxt-link>
        <nuxt-link
          class="text-xs px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'qualifications' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/qualifications"
        >Qualifications</nuxt-link>
        <nuxt-link
          class="text-xs px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'compliance' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/compliance"
        >Compliance</nuxt-link>
        <nuxt-link
          class="text-xs px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'practices' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/practices"
        >Practices</nuxt-link>
        <nuxt-link
          class="text-xs px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'locums' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/locums"
        >Locums</nuxt-link>
        <nuxt-link
          class="text-xs px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'reports' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/reports"
        >Reports</nuxt-link>
        <nuxt-link
          class="text-xs px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'billing' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/billing"
        >Billing</nuxt-link>
        <button
          class="text-xs px-6 py-4 border-l-4 text-white border-transparent flex whitespace-no-wrap"
          @click="showLogoutModal = true"
        >
          Sign out
          <i
            class="material-icons"
            style="color:#FFC72C; padding: 0 5px; font-size:18px; "
          >&#xE8AC;</i>
        </button>
      </div>
      <!-- SIDEBAR -->

      <div class="w-full flex flex-col bg-trout relative">
        <!-- HEADER -->
        <div class="flex justify-between text-sm text-white py-2 px-6">
          <button class="text-white" @click="toggleSideBar">
            <img src="~/assets/images/hbg.png">
          </button>

          <img src="~/assets/images/hubzz-icon-transparent.png">

          <div class="p-2 text-xs" v-if="$auth.loggedIn">
            <span>{{ $auth.user.email }}</span>
          </div>
        </div>
        <!-- HEADER -->

        <!-- PAGE -->
        <nuxt/>
        <!-- PAGE -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sideBarOpen: true,
      showLogoutModal: false
    };
  },

  computed: {
    activeTab() {
      if (this.$route.name.includes("roles")) {
        return "roles";
      }

      if (this.$route.name.includes("professions")) {
        return "professions";
      }
      if (this.$route.name.includes("qualifications")) {
        return "qualifications";
      }

      if (this.$route.name.includes("compliance")) {
        return "compliance";
      }
      if (this.$route.name.includes("practices")) {
        return "practices";
      }
      if (this.$route.name.includes("locums")) {
        return "locums";
      }
      if (this.$route.name.includes("reports")) {
        return "reports";
      }
      if (this.$route.name.includes("billing")) {
        return "billing";
      }
      if (this.$route.name.includes("index")) {
        return "dashboard";
      }
    }
  },

  methods: {
    toggleSideBar() {
      this.sideBarOpen = !this.sideBarOpen;
    },

    logout() {
      this.showLogoutModal = false;

      this.$axios.post("/api/v1/logout").finally(() => {
        this.$auth.logout().then(() => {
          this.$router.push("/sign-in");
        });
      });
    }
  }
};
</script>

<style>
.page-enter {
  transform: translateX(120px);
  opacity: 0;
}

.page-enter-active {
  transition: 0.8s ease;
}

.subpage-enter,
.subpage-fade-leave-active {
  transform: translateX(120px);
  opacity: 0;
}

.subpage-enter-active,
.subpage-fade-leave-to {
  transition: 0.8s ease;
  z-index: 100;
}
</style>
