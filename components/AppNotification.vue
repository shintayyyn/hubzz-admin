<template>
  <div class="w-full app-notification">
    <div class="flex justify-center">
      <div
        v-if="$store.state.notification.enabled"
        class="rounded-b-lg py-2 px-12 flex flex-row flex-nowrap justify-center"
        :class="notificationStatus"
      >
        <div class="mr-2">
          <svgicon :name="notificationIcon" height="20" width="20" :color="iconSvgColor" />
        </div>
        <div class="font-bold text-sm leading-normal">
          {{ $store.state.notification.text }}
        </div>

        <div class="inline-block">
          <div
            v-if="closable"
            class="inline-block pl-4 text-lg font-bold text-blue-300 hover:text-white cursor-pointer"
            @click="close"
          >
            x
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        timeout: null,
      }
    },

    computed: {
      notificationStatus () {
        switch (this.$store.state.notification.status) {
          case "success":
            return "bg-green-300"
          case "danger":
            return "bg-red-500 text-white"
          case "alert":
            return "bg-yellow-500"
          case "upload":
            return "bg-blue-500 text-white"
          default:
            return "bg-white"
        }
      },

      notificationIcon () {
        switch (this.$store.state.notification.status) {
          case "success":
            return "circle-check"
          case "danger":
            return "exclamation-mark"
          case "alert":
            return "exclamation-circle-solid"
          case "upload":
            return "cloud-upload"
          default:
            return "alert"
        }
      },

      iconSvgColor () {
        switch (this.$store.state.notification.status) {
          case "success":
            return "black black"
          case "danger":
            return "white white"
          case "upload":
            return "transparent white"
          case "info":
            return "white white"
          default:
            return ""
        }
      },

      notify () {
        return this.$store.state.notification.enabled
      },

      closable () {
        return this.$store.state.notification.closable
      }
    },

    watch: {
      notify () {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }

        if (!this.$store.state.notification.closable) {
          this.timeout = setTimeout(
            () => {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: false,
                status: "",
                text: "",
                closable: false,
                duration: ""
              })
            },
            this.$store.state.notification.duration
              ? this.$store.state.notification.duration
              : 2000
          )
        }
      },
    },

    methods: {
      close () {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: false,
          status: "",
          text: ""
          // closable: false
        })
      },
    },
  }
</script>

<style>
  .app-notification {
    position: fixed;
    top: 0;
    /* left: 40%; */
    z-index: 999;
  }
  @media screen and (max-width: 600px) {
    .app-notification {
      width: 100%;
      left: 0;
    }
  }
</style>
