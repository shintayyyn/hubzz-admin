<template>
  <section class="header">
    <div class="flex justify-between items-center text-sm text-white px-4 md:px-6">
      <button class="toggle text-white focus:outline-none" @click="toggleSideBar">
        <img src="~/assets/images/hbg.png">
      </button>

      <div class="flex flex-row py-2 cursor-pointer">
        <div class="m-2 mt-3 text-xl md:text-4xl">
          {{ headerName }}
        </div>
      </div>

      <div class="flex justify-right">
        <div class="m-4 sm:relative">
          <div class="flex flex-col relative cursor-pointer" @click="showDropdownNotifications = !showDropdownNotifications">
            <div>
              <svgicon
                name="notification"
                width="30"
                height="30"
                :color="showDropdownNotifications ? '#ffc72c' : 'white'"
              />
            </div>

            <div
              v-if="unseenNotificationsCount > 0"
              class="absolute bottom-0 z-50 -mb-3 -mr-3 py-1 px-2 ml-4 bg-red-700 text-xs flex items-center justify-center rounded-full"
            >
              {{ unseenNotificationsCount }}
            </div>
          </div>
          
          <div v-if="showDropdownNotifications">
            <div v-on-clickaway="onClickaway" class="notification-modal mx-auto sm:mx-0 overflow-hidden">
              <!-- <div class="flex flex-row-reverse">
								<div class="p-1 m-1 mx-2 mt-1" @click="showDropdownNotifications = false">
									<svgicon name="times-solid" width="15" height="15" color="white" />
								</div>
							</div>-->
              <div class="flex flex-row mx-4 items-center justify-between pt-4">
                <div class>
                  <p class="text-xl font-bold tracking-normal">
                    Notifications
                  </p>
                </div>
                <div
                  v-if="unseenNotificationsCount"
                  class="text-white hover:text-gray-500 mt-1 cursor-pointer"
                  @click="$emit('seenAllNotifications')"
                >
                  Mark All as Read
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
                    class="inline-block w-full p-3 mb-2 shadow-md text-white bg-waterloo hover:bg-waterloo-light transition-hover rounded-lg cursor-pointer"
                    :class="item.seen === true ? 'text-gray-400' : 'border-2 border-orange-500'"
                    @click="$emit('goToNotification', item)"
                  >
                    <div class="w-full flex flex-col leading-tight sm:my-1 pt-1">
                      <span class="uppercase text-xs font-bold pb-2">{{ item.title }}</span>
                      <span>{{ item.description }}</span>
                    </div>

                    <span class="text-xs text-gray-400">{{ item.created_at_in_gb_formatted }}{{ true ? ` (${item.id})` : '' }}</span>
                  </div>
                </div>

                <div v-if="notifications.length === 0">
                  No New Notifications
                </div>
              </div>

              <div class="flex justify-center m-4">
                <p class="text-white hover:text-gray-500 cursor-pointer px-2" @click="$emit('loadMoreNotifs')">
                  Show More
                </p>
              </div>
            </div>
          </div>
        </div>

        <nuxt-link v-if="$auth.loggedIn" to="/account" class="flex flex-row py-2 text-sm cursor-pointer">
          <div>
            <img
              src="~/assets/images/default-user-image.png"
              class="rounded-full"
              width="48px"
              height="48px"
            >
          </div>

          <div class="hidden md:block ml-2 mt-2 text-white">
            {{ $auth.user.email }}

            <div class="font-hairline text-xs">
              My Account
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
  </section>
</template>

<script>
import { mixin as clickaway } from "vue-clickaway"

export default {
  mixins: [clickaway],
  
  props: {
    unseenNotificationsCount: {
      type: Number,
      default: 0,
    },

    notifications: {
      type: Array,
      default: () => [],
    },
  },

	data () {
		return {
			showDropdownNotifications: false,
		}
	},
  
	computed: {
		headerName () {
			if (this.$route.name.includes('index-locums')) return 'Locums'
			else if (this.$route.name.includes('index-practices')) return 'Practices'
			else if (this.$route.name.includes('index-billings')) return 'Billings'
			else if (this.$route.name.includes('index-reports')) return 'Reports'
			else if (this.$route.name.includes('index-standard-terms'))
				return 'Standard Terms'
			else if (this.$route.name.includes('index-referral-lottery'))
				return 'Referral Lottery'
			else if (this.$route.name.includes('index-faqs'))
				return 'Frequently Asked Questions'
			else if (this.$route.name.includes('index-tncs'))
				return 'Terms and Conditions'
			else if (this.$route.name.includes('index-inquiries')) return 'Inquiries'
			else if (this.$route.name.includes('index-user-management'))
				return 'User Management'
			else if (this.$route.name.includes('index-change-email-requests'))
				return 'Change Email Requests'
			else if (
				this.$route.name.includes('index-compliance-document-reject-reasons')
			)
				return 'Compliance Document Reject Reasons'
			else if (this.$route.name.includes('index-test-script'))
				return 'Test Script'
			else return 'Dashboard'
		}
  },

	methods: {
		onClickaway () {
      this.showDropdownNotifications = false
		},

		toggleSideBar () {
			this.$store.commit("TOGGLE_SIDEBAR", true)
			document.body.style.overflow = "hidden"
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
    background-color: #393c42;
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
</style>
