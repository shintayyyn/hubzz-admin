<template>
  <transition name="slide">
    <div
      v-if="locumNotifications.length > 0 || practiceNotifications.length > 0 || billingNotifications.length > 0"
      class="job-notification"
    >
      <div
        class="my-2 mt-1 flex items-center"
        :class="toggleNotification ? 'justify-between' : 'justify-end'"
      >
        <button
          v-if="toggleNotification"
          class="bg-yellow-500 px-4 py-1 rounded-lg hover:bg-yellow-400 transition-hover text-xs focus:outline-none"
          @click="clearNotifications"
        >Mark all as read</button>
        <svgicon
          name="notification"
          class="w-6 h-6 mr-2 cursor-pointer"
          color="#ffc72c"
          style="transform: rotate(15deg)"
          :class="toggleNotification ? 'opacity-100' : 'opacity-50 hover:opacity-100 transition-hover'"
          @click="toggleNotification = !toggleNotification"
        />
      </div>
      <transition name="slide">
        <template v-if="toggleNotification">
          <div class="notifications overflow-y-auto">
            <transition-group name="drop" mode="out-in">
              <template v-for="notification in notifications">
                <div
                  :key="`${notification.id}-${notification.notification_type}`"
                  class="cards relative mx-1 my-2 p-3 flex flex-wrap bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md text-xs md:text-sm opacity-100 md:opacity-75 hover:opacity-100 transition-hover cursor-pointer"
                  @click="goTo(notification)"
                >
                  <span
                    class="absolute top-0 right-0 cursor-pointer py-2 px-4 rounded-full text-lg font-bold hover:text-gray-700"
                    @click.prevent.stop="close(notification.id, notification.type, notification.notification_type)"
                  >x</span>
                  <div class="flex flex-wrap w-48 md:w-64">
                    <div class="flex flex-col items-start my-1 w-full">
                      <div class="flex flex-wrap">
                        <div
                          v-if="!notification.billingStatus"
                          class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase"
                          :class="bgStatus(notification.status ? notification.status : '')"
                        >{{ notification.status ? notification.status : '' }}</div>
                        <div
                          class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase"
                        >{{ notification.status_tag }}</div>
                      </div>
                      <div
                        v-if="notification.type === 'Jobs' && notification.billingStatus"
                        class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase mt-1"
                        :class="bgStatus(notification.billingStatus)"
                      >{{ notification.billingStatus }}</div>
                      <div
                        v-if="notification.status !== 'Draft' && notification.type === 'Billings'"
                        class="font-bold md:text-md leading-none mr-1 uppercase pt-4 truncate-title"
                        style="-webkit-box-orient: vertical"
                      >{{ notification.invoice_number }}</div>
                      <div
                        v-else
                        class="font-bold md:text-md leading-tight mr-1 uppercase pt-4 truncate-title"
                        style="-webkit-box-orient: vertical"
                      >{{ notification.title }}</div>
                    </div>
                    <div class="w-full">
                      <div class="leading-tight pt-1">{{ notification.message }}</div>
                      <div
                        v-if="notification.type === 'Jobs' && notification.platform_job"
                        class="leading-tight mt-2"
                      >
                        <div class="font-bold">Extra Information:</div>
                        <div
                          class="mt-1 truncate-info"
                        >{{ notification.platform_job.extra_information }}</div>
                      </div>
                      <div
                        class="leading-tight text-xs pt-2 text-right text-gray-600"
                      >{{notification.notif_date}}</div>
                    </div>
                  </div>
                </div>
              </template>
            </transition-group>
          </div>
        </template>
      </transition>
    </div>
  </transition>
</template>
<script>
export default {
  data() {
    return {
      toggleNotification: true,
      showFocus: false
    };
  },
  computed: {
    locumNotifications () {
      return this.$store.getters["locums/getLocumNotifications"];
    },
    practiceNotifications () {
      return this.$store.getters["practices/getPracticeNotifications"];
    },
    billingNotifications () {
      return this.$store.getters["billings/getBillingNotifications"];
    },
    // jobNotifications () {
    //   if (this.$auth.loggedIn && this.$auth.user.domain === "Practice") {
    //     return this.$store.getters["jobs/getPracticeJobNotifications"]
    //   }
    //   return this.$store.getters["jobs/getLocumJobNotifications"]
    // },
    
    url() {
      return this.$auth.user.domain === "Practice" ? "/sessions" : "/jobs";
    },
    notifications() {
      return [
        ...this.locumNotifications,
        ...this.practiceNotifications,
        ...this.billingNotifications,
      ].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    }
  },
  watch: {
    notify() {
      if (!this.$store.state.notification.closable) {
        setTimeout(() => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: false,
            status: "",
            text: "",
            closable: false
          });
        }, 2000);
      }
    },
    locumNotifications() {
      this.notifications.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );
    },
    practiceNotifications() {
      this.notifications.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );
    },
    billingNotifications() {
      this.notifications.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );
    },
    jobNotifications() {
      this.notifications.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );
    },
    notifications(value) {
      value.forEach(item => {
        item.notif_date = this.$moment()
          .utc()
          .format("DD/MM/YYYY, HH:mm:ss");
        // if (!item.updated_at) {
        //   item.updated_at = this.$moment()
        //     .utc()
        //     .format("MM-DD-YYYY h:mm a")
        // } else if (item.updated_at) {
        //   item.updated_at = this.$moment(
        //     item.updated_at,
        //     "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
        //   )
        //     .utc()
        //     .format("MM-DD-YYYY h:mm a")
        // }
      });
      this.notifications.sort(
        (a, b) => new Date(b.notif_date) - new Date(a.notif_date)
      );
    }
  },
  created() {},
  methods: {
    show(id) {
      return this.$router.push({
        path: `${this.url}/${id}`
      });
    },
    proceed(id) {
      return this.$router.push({
        path: `${this.url}/${id}`
      });
    },
    async goTo(notification) {
      console.log("4", notification);
      console.log("5", notification.status);
      let type = notification.type;
      let id = notification.id;
      let status = notification.status
        ? notification.status
        : notification.locum_status;
      let dateStart = notification.date_start;
      // path url
      let url = "";
      if (type === "Admin Locum Billing Disputed") {
        url = `/billings/hubzz-billing/${notification.payload.practice_id}/invoices-by-locums/${notification.id}`
      } else if (type === "Admin Practice Invoice Past Due") {
        url = `/billings/hubzz-billing/${notification.payload.practice_id}/practice-hubzz-invoices/${notification.id}`
      } else if (type === "Admin Locum Compliance") {
        url = `/locums/${notification.payload.locum_user_id}/locum-compliance/${notification.id}`
      } else if (type === "Admin Locum Profile") {
        url = `/locums/${notification.id}`
      } else if (type === "Admin Practice Creation" || type === "Admin Practice Profile") {
        url = `/practices/${notification.id}`
      } else if (type === "Admin Practice Surgery Creation") {
        if (notification.status === "Invited") {
          url = `/practices/${notification.practice_id}/practice-surgeries/${notification.id}`
        }
        if (notification.status === "Accepted") {
          url = `/practices/${notification.child_practice_id}/practice-hub`
        }
      }
      if (url) {
        setTimeout(() => {
          this.$router.push(url);
        }, 500);
      }
      this.close(id, type, notification.notification_type);
      // await this.$axios.$put(`/api/v1/admin/notifications/${notification.id}/seen`)
    },
    close(id, type, notificationType) {
      console.log("id", id);
      if (type === "Admin Locum Billing Disputed" || type === "Admin Practice Invoice Past Due") {
        this.$store.commit("billings/REMOVE_BILLING_NOTIFICATION", id);
      }
      if (type === "Admin Locum Compliance" || type === "Admin Locum Profile") {
        this.$store.commit(
          "locums/REMOVE_LOCUM_NOTIFICATION",id);
      }
      if (type === "Admin Practice Creation" || type === "Admin Practice Profile") {
        this.$store.commit("practices/REMOVE_PRACTICE_NOTIFICATION", id);
      }

      if (type === "Admin Practice Surgery Creation") {
        this.$store.commit("practices/REMOVE_PRACTICE_NOTIFICATION", id);
      }
    },
    status(status) {
      // return status === "Matched" ? "AVAILABLE" : status.toUpperCase()
    },
    bgStatus(status) {
      let str = "";
      switch (status) {
        case "Issued":
        case "Live":
        case "Available":
        case "Matched":
        case "Draft":
        case "Invited":
        case "Dormant":
          str = "bg-yellow-500";
          break;
        case "Applied":
        case "Pending":
          str = "bg-orange-400 text-white";
          break;
        case "Paid":
        case "Completed":
        case "Approved":
        case "Active":
          str = "bg-green-500 text-white";
          break;
        case "Allocated":
        case "Accepted":
          str = "bg-green-300";
          break;
        case "Ongoing":
          str = "bg-green-500";
          break;
        case "Reminder":
          str = "bg-gray-500";
          break;
        default:
          str = "bg-red-500 text-white";
      }
      return str;
    },
    clearNotifications() {
      this.$store.commit("locums/CLEAR_LOCUM_NOTIFICATIONS");
      this.$store.commit("practices/CLEAR_PRACTICE_NOTIFICATIONS");
      this.$store.commit("billings/CLEAR_BILLING_NOTIFICATIONS");
    }
  }
};
</script>
<style>
.job-notification {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 700;
  display: flex;
  flex-direction: column;
  max-height: 95%;
  margin: 50px 20px 0;
  padding: 0 4px 10px;
}
.notifications:hover .cards {
  opacity: 1;
}
.notifications::-webkit-scrollbar {
  display: none;
}

@media screen and (min-width: 1200px) {
  .job-notification {
    margin-left: 200px;
  }
}

@media screen and (min-width: 480px) {
  .job-notification {
    margin: 50px 5% 0;
  }
}

@media screen and (min-width: 320px) {
  .job-notification {
    margin: 50px 3% 0;
  }
}
.truncate-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s linear;
}
.truncate-title:hover {
  display: block;
}

.truncate-info {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s linear;
}
</style>
