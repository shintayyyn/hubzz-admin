<template>
  <div class="relative flex flex-col bg-trout">
    <AppSideBar @modal="showLogoutModal = $event"/>
    <transition name="drop" mode="out-in">
      <SignOut v-if="showLogoutModal" @modal="showLogoutModal = $event" />
    </transition>
    <div class="sidebar-shield" v-if="$store.state.toggled_sidebar" @click="close"></div>
    <AppNotification />
    <div class="content bg-trout">
      <AppHeader />
      <nuxt/>
    </div>
    <!-- LOGOUT MODAL -->
      <!-- <div
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
      </div> -->
    <!-- LOGOUT MODAL ENDS HERE-->

  </div>
</template>

<script>
import AppNotification from '~/components/AppNotification'
import AppHeader from '~/components/AppHeader'
import AppSideBar from '~/components/AppSideBar'
import SignOut from '~/components/Auth/SignOut'
export default {
  components: {
    AppNotification,
    AppHeader,
    AppSideBar,
    SignOut
  },
  data() {
    return {
      showLogoutModal: false
    };
  },

  computed: {
    notify() {
      return this.$store.state.notification.enabled;
    },
  },

  watch: {
    notify(value) {
      if (value) {
        setTimeout(() => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: false,
            status: "",
            text: ""
          });
        }, 2000);
      }
    },
    $route(value) {
      this.$store.commit("TOGGLE_SIDEBAR", false);
      document.body.style.overflow = "auto";
    }
  },
  methods: {
      close() {
        this.$store.commit("TOGGLE_SIDEBAR", false);
        document.body.style.overflow = "auto";
      }
    }
};
</script>

<style>
.content{
  margin-left: 0;
  min-height: 100vh;
  max-height: 100%;
}
.sidebar-shield{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 499;
}

@media screen and (min-width: 1200px ){
  .content{
    margin-left: 200px;
  }

  .sidebar-shield{
    display: none;
  }

}
</style>
