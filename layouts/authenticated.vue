<template>
  <div class="h-screen relative flex flex-col">
    <!-- LOGOUT MODAL -->
    <div
      class="h-full w-full flex flex-col absolute"
      :style="`z-index: ${showLogoutModal ? 100 : -100}; opacity: ${showLogoutModal ? 1 : 0};`"
    >
      <div class="flex flex-col self-center py-2 px-10 md:px-24 rounded-lg bg-sunglow">
        <div>
          <span class="text-sm p-2">Proceed to sign-out?</span>
        </div>
        <div class="flex justify-center my-1">
          <button class="py-2 px-4 text-sm rounded-lg border border-white mx-1 shadow" @click="logout">Yes</button>
          <button
            class="px-4 py-2 text-sm rounded-lg border border-white mx-1 shadow"
            @click="showLogoutModal = false"
          >Cancel</button>
        </div>
      </div>
    </div>
    <!-- LOGOUT MODAL ENDS HERE-->
    <div class="w-full flex-1 flex overflow-hidden min-w-0">
      <!-- SIDEBAR -->
      <div
        class="sidebar flex flex-col pt-4 xl:pt-16 h-full bg-charade min-w-0"
        :class="`${sideBarOpen ? 'toggle-left absolute' : ''}`"  
      >
      <div class="toggle w-full">
        <button class="mt-6 mx-8 text-yellow-dark text-2xl font-bold focus:outline-none" @click="toggleSideBar">X</button>
      </div>
      <div class="py-4 " @click="toggleSideBar">
        <nuxt-link
          class="text-sm px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'dashboard' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/"
        >Dashboard</nuxt-link>
      </div>

        <nuxt-link
          v-if="$auth.loggedIn && $auth.user.domain === 'Super Admin'"
          class="text-sm px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'compliances' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/compliances"
        >Compliance</nuxt-link>

      <div class="py-4 " @click="toggleSideBar">
        <nuxt-link
          class="text-sm px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'locums' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/locums"
        >Locums</nuxt-link>
      </div>

        <nuxt-link
          v-if="$auth.loggedIn && $auth.user.domain === 'Super Admin'"
          class="text-sm px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'users' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/users"
        >Users</nuxt-link>

        <nuxt-link
          v-if="$auth.loggedIn && $auth.user.domain === 'Super Admin'"
          class="text-sm px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'compliance_documents' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/compliance_documents"
        >Compliance Documents</nuxt-link>

        <nuxt-link
          v-if="$auth.loggedIn && $auth.user.domain === 'Super Admin'"
          class="text-sm px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'profession_categories' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/profession_categories"
        >Profession Categories</nuxt-link>

        <nuxt-link
          v-if="$auth.loggedIn && $auth.user.domain === 'Super Admin'"
          class="text-sm px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'professions' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/professions"
        >Professions</nuxt-link>

        <nuxt-link
          v-if="$auth.loggedIn && $auth.user.domain === 'Super Admin'"
          class="text-sm px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'qualifications' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/qualifications"
        >Qualifications</nuxt-link>
      <div class="py-4 " @click="toggleSideBar">
        <nuxt-link
          class="text-sm px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'practices' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/practices"
        >Practices</nuxt-link>
      </div>
      
      <div class="py-4 " @click="toggleSideBar">
        <nuxt-link
          class="text-sm px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'reports' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/reports"
        >Reports</nuxt-link>
      </div>
      <div class="py-4 " @click="toggleSideBar">
        <nuxt-link
          class="text-sm px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'billing' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/billing"
        >Billing</nuxt-link>
      </div>
        <nuxt-link
          v-if="$auth.loggedIn && $auth.user.domain === 'Super Admin'"
          class="text-sm px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'practice-types' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/practice-types"
        >Practice Types</nuxt-link>

        <nuxt-link
          v-if="$auth.loggedIn && $auth.user.domain === 'Super Admin'"
          class="text-sm px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'clinical-commissioning-groups' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/clinical-commissioning-groups"
        >Clinical Commissioning Groups</nuxt-link>

        <nuxt-link
          v-if="$auth.loggedIn && $auth.user.domain === 'Super Admin'"
          class="text-sm px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'surgeries' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/surgeries"
        >Surgeries</nuxt-link>

      <div class="py-4 " @click="toggleSideBar">
        <nuxt-link
          v-if="$auth.loggedIn && $auth.user.domain === 'Admin'"
          class="text-sm px-6 py-4 no-underline border-l-4"
          :class="`${activeTab === 'support' ? 'text-yellow-dark border-yellow-dark' : 'text-white border-transparent'}`"
          to="/support"
        >Support</nuxt-link>
      </div>
        <button
          class="text-sm px-6 py-4 border-l-4 text-white border-transparent flex whitespace-no-wrap"
          @click="showLogoutModal = true"
        >
          <span class="pr-1 pt-1">Sign out</span> 
        <svgicon
          name="power-settings-new"
          width="21"
          height="21"
          color="transparent orange"
        ></svgicon>
        </button>

      </div>
      <!-- SIDEBAR -->

      <div class="w-full flex flex-col relative bg-trout overflow-x-auto">
        <!-- HEADER -->
        <div class="flex justify-between text-sm text-white py-2 px-6">
          <button class="toggle text-white" @click="toggleSideBar">
            <img src="~/assets/images/hbg.png">
          </button>

          <img src="~/assets/images/hubzz-icon-transparent.png">

          <div class="p-2 text-sm" v-if="$auth.loggedIn">
            <span>{{ $auth.user.email }}</span>
          </div>
        </div>
        <!-- HEADER -->

        <!-- PAGE -->
        <nuxt/>
        <!-- PAGE -->
      </div>
    </div>
      <div class="sidebar-shield" 
        :style="`${sideBarOpen ? 'z-index: 1' : ''}`"  
      ></div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      sideBarOpen: false,
      showLogoutModal: false
    };
  },

  computed: {
    activeTab() {
      if (this.$route.name && this.$route.name.includes("compliances")) {
        return "compliances";
      }

      if (this.$route.name && this.$route.name.includes("practices")) {
        return "practices";
      }

      if (this.$route.name && this.$route.name.includes("locums")) {
        return "locums";
      }

      if (this.$route.name && this.$route.name.includes("reports")) {
        return "reports";
      }

      if (this.$route.name && this.$route.name.includes("billing")) {
        return "billing";
      }

      if (this.$route.name && this.$route.name.includes("users")) {
        return "users";
      }

      if (this.$route.name && this.$route.name.includes("compliance_documents")) {
        return "compliance_documents";
      }

      if (this.$route.name && this.$route.name.includes("profession_categories")) {
        return "profession_categories";
      }

      if (this.$route.name && this.$route.name.includes("professions")) {
        return "professions";
      }

      if (this.$route.name && this.$route.name.includes("qualifications")) {
        return "qualifications";
      }

      if (this.$route.name && this.$route.name.includes('practice-types')) {
        return 'practice-types'
      }

      if (this.$route.name && this.$route.name.includes('clinical-commissioning-groups')) {
        return 'clinical-commissioning-groups'
      }

      if (this.$route.name && this.$route.name.includes('surgeries')) {
        return 'surgeries'
      }

      if (this.$route.name && this.$route.name.includes('support')) {
        return 'support'
      }


      if (this.$route.name && this.$route.name.includes("index")) {
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

      this.$store.dispatch('logout')
    },
  },
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

.subpage-enter {
  transform: translateX(120px);
  opacity: 0;
}

.subpage-enter-active {
  transition: 0.8s ease;
}

.sidebar{
  margin-left: -200px;
  width: 200px;
  height: 100%;
  overflow: auto;
  transition: all 0.3s ease-in-out;
  z-index: 99;
}

.toggle-left{
  margin-left: 0;
}

.sidebar-shield{
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, .5);
  z-index: -1;
}

@media screen and (min-width: 1200px){
  .sidebar{
    margin-left: 0;
    position: relative;
}

.sidebar-shield{
  display: none;
}

  .toggle{
    display: none;
  }
  
} 
</style>
