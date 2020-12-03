<template>
	<section class="header">
		<!-- HEADER -->
		<div class="flex justify-between items-center text-sm text-white px-4 md:px-6">
			<button class="toggle text-white focus:outline-none" @click="toggleSideBar">
				<img src="~/assets/images/hbg.png" />
			</button>

			<div class="flex flex-row py-2 cursor-pointer">
				<!-- <div>
					<img src="~/assets/images/hubzz-icon-transparent.png" />
				</div> -->
				<div class="m-2 mt-3 text-xl md:text-4xl">
					{{ headerName }}
				</div>
			</div>

			<div class="flex justify-right">
				<div class="m-4 sm:relative">
					<div class="flex flex-col relative cursor-pointer" @click="checkNotifications()">
						<div>
							<svgicon
								name="notification"
								width="30"
								height="30"
								:color="notificationToggle === true ? '#ffc72c' : 'white'"
							/>
						</div>

						<div
							v-if="notificationsCount > 0"
							class="absolute bottom-0 z-50 -mb-3 -mr-3 py-1 px-2 ml-4 bg-red-700 text-xs flex items-center justify-center rounded-full"
						>{{ notificationsCount }}</div>
					</div>
					<div v-if="notificationToggle === true">
						<div class="notification-modal mx-auto sm:mx-0 overflow-hidden" v-on-clickaway="onClickaway">
							<!-- <div class="flex flex-row-reverse">
								<div class="p-1 m-1 mx-2 mt-1" @click="notificationToggle = false">
									<svgicon name="times-solid" width="15" height="15" color="white" />
								</div>
							</div>-->
							<div class="flex flex-row mx-4 justify-between pt-4">
								<div class>
									<p class="text-xl font-bold tracking-normal">Notifications</p>
								</div>
								<div
									class="text-white hover:text-gray-500 mt-1 cursor-pointer"
									@click="clearAllNotifications()"
								>Mark All as Read</div>
							</div>

							<div class="m-2 overflow-y-auto overflow-x-hidden px-2" style="max-height: 500px;">
								<div v-if="notifications.length > 0">
									<div
										v-for="(item, index) in notifications"
										:key="`item-${index}`"
										class="inline-block w-full p-3 mb-2 shadow-md text-white bg-waterloo hover:bg-waterloo-light transition-hover rounded-lg cursor-pointer"
										:class="item.seen === true ? 'text-gray-400' : 'border-2 border-orange-500'"
										@click="goTo(item)"
									>
										<div class="w-full flex flex-col leading-tight sm:my-1 pt-1">
											<!-- <span class="uppercase text-xs font-bold">{{ item.notification_type.domain }}</span> -->
											<span class="uppercase text-xs font-bold pb-2">{{ item.title }}</span>
											<!-- <span class="uppercase text-xs font-bold">{{ item.notification_type.name }}</span> -->
											<span>{{ item.description }}</span>
										</div>
										<span class="text-xs text-gray-400">{{ item.created_at_in_gb_formatted }}</span>
									</div>
								</div>
								<div v-else>No New Notifications</div>
							</div>
							<div class="flex justify-center m-4">
								<p
									class="text-white hover:text-gray-500 cursor-pointer px-2"
									@click="showMoreNotifs()"
								>Show More</p>
							</div>
						</div>
					</div>
				</div>

				<nuxt-link
					v-if="$auth.loggedIn"
					to="/account"
					class="flex flex-row py-2 text-sm cursor-pointer"
				>
					<div>
						<img
							src="~/assets/images/default-user-image.png"
							class="rounded-full"
							width="48px"
							height="48px"
						/>
					</div>
					<div class="hidden md:block ml-2 mt-2 text-white">
						{{ $auth.user.email }}
						<div class="font-hairline text-xs">My Account</div>
					</div>
				</nuxt-link>
			</div>
			<!-- <div>
        <AppNotifDropdown :notifications="notifications"/>
			</div>-->
		</div>
		<!-- HEADER -->
	</section>
</template>
<script>
// import AppNotifDropdown from "@/components/AppNotifDropdown"
import { mixin as clickaway } from "vue-clickaway";
export default {
	mixins: [clickaway],
	components: {
		// AppNotifDropdown,
	},

	watch: {
		"$route.name" (value) {
			if (value.includes('index-locums'))
				this.headerName = 'Locums'
			else if (value.includes('index-practices'))
				this.headerName = 'Practices'
			else if (value.includes('index-billings'))
				this.headerName = 'Billings'
			else if (value.includes('index-reports'))
				this.headerName = 'Reports'
			else if (value.includes('index-standard-terms'))
				this.headerName = 'Standard Terms'
			else if (value.includes('index-referral-lottery'))
				this.headerName = 'Referral Lottery'
			else if (value.includes('index-faqs'))
				this.headerName = 'Frequently Asked Questions'
			else if (value.includes('index-tncs'))
				this.headerName = 'Terms and Conditions'
			else if (value.includes('index-inquiries'))
				this.headerName = 'Inquiries'
			else if (value.includes('index-user-management'))
				this.headerName = 'User Management'
			else if (value.includes('index-change-email-requests'))
				this.headerName = 'Change Email Requests'
			else if (value.includes('index-compliance-document-reject-reasons'))
				this.headerName = 'Compliance Document Reject Reasons'
			else
				this.headerName = 'Dashboard' 
		}	
	},

	data () {
		return {
			// HEADER NAME
			headerName: 'Dashboard',

			currentPage: 1,
			totalPages: 0,
			// 10 PER PAGER OR NOTIFICATIONS PER SEE-MORE
			notifParams: {
				user_id: this.$auth.user.id,
				order_by: "created_at:desc",
				limit: 10,
				offset: 0
			},
			notificationToggle: false,
			notificationsCount: 0,
			notifications: [],

			notificationTypeNames: [
				"Admin Notification Locum Compliance",
				"Admin Notification Locum Invoice Disputed",
				"Admin Notification Locum Profile Updated",
				"Admin Notification Locum Registration",
				"Admin Notification Practice Hub Accepted",
				"Admin Notification Practice Hub Created",
				"Admin Notification Practice Hub Deleted",
				"Admin Notification Practice Hub Rejected",
				"Admin Notification Practice Invoice Detail Updated",
				"Admin Notification Practice Invoice Paid",
				"Admin Notification Practice Invoice PastDue",
				"Admin Notification Practice Invoice Unpaid",
				"Admin Notification Practice Registration",
				"Admin Notification Practice Surgery Created",
				"Admin Notification Practice Surgery Deleted",
				"Admin Notification Practice Surgery TerminationRequested",
				"Admin Notification Practice Surgery Updated"
			]
		};
	},

	async created () {
		if (this.$route.name.includes('index-locums'))
			this.headerName = 'Locums'
		else if (this.$route.name.includes('index-practices'))
			this.headerName = 'Practices'
		else if (this.$route.name.includes('index-billings'))
			this.headerName = 'Billings'
		else if (this.$route.name.includes('index-reports'))
			this.headerName = 'Reports'
		else if (this.$route.name.includes('index-standard-terms'))
			this.headerName = 'Standard Terms'
		else if (this.$route.name.includes('index-referral-lottery'))
			this.headerName = 'Referral Lottery'
		else if (this.$route.name.includes('index-faqs'))
			this.headerName = 'Frequently Asked Questions'
		else if (this.$route.name.includes('index-tncs'))
			this.headerName = 'Terms and Conditions'
		else if (this.$route.name.includes('index-inquiries'))
			this.headerName = 'Inquiries'
		else if (this.$route.name.includes('index-user-management'))
			this.headerName = 'User Management'
		else if (this.$route.name.includes('index-change-email-requests'))
			this.headerName = 'Change Email Requests'
		else if (this.$route.name.includes('index-compliance-document-reject-reasons'))
			this.headerName = 'Compliance Document Reject Reasons'
		else
			this.headerName = 'Dashboard'
		
		const params = {
			user_id: this.$auth.user.id,
			seen: false
		}
		
		await this.$axios
			.$get(`/api/v1/admin/notifications/count`, {
				params
			})
			.then(res => {
				this.notificationsCount = res.data.count;
				this.totalPages = Math.ceil(this.notificationsCount / 10);
			});
		await this.$axios
			.$get(`/api/v1/admin/notifications`, {
				params: this.notifParams
			})
			.then(res => {
				this.notifications = res.data.notifications;
			});
	},

	mounted() {
		this.setSocketNotificationListener();
	},

	destroyed() {
		this.removeSocketNotificationListener();
	},

	methods: {
		close() {
			console.log("banana");
		},
		onClickaway() {
			if (this.notificationToggle) {
				this.notificationToggle = false;
			}
		},
		setSocketNotificationListener() {
			this.notificationTypeNames.forEach(notificationTypeName => {
				this.$socket.on(notificationTypeName, this.newNotificationHandler);
			});
		},

		removeSocketNotificationListener() {
			this.notificationTypeNames.forEach(notificationTypeName => {
				this.$socket.removeListener(
					notificationTypeName,
					this.newNotificationHandler
				);
			});
		},

		newNotificationHandler() {
			this.getNotifications().catch(err => {
				console.log("err", err.response || err);
			});
		},

		async getNotifications() {
			const params = {
				user_id: this.$auth.user.id,
				seen: false
			};

			await this.$axios
				.$get(`/api/v1/admin/notifications/count`, { params })
				.then(res => {
					this.notificationsCount = res.data.count;
					console.log("notif count", res.data.count);
				});

			console.log("notifparams", this.notifParams);

			await this.$axios
				.$get(`/api/v1/admin/notifications`, {
					params: this.notifParams
				})
				.then(res => {
					this.notifications = res.data.notifications;
					console.log("notifs", this.notifications);
				});
		},

		async checkNotifications() {
			this.notificationToggle = !this.notificationToggle;
			await this.getNotifications();
		},

		async showMoreNotifs() {
			let params = {
				order_by: this.notifParams.order_by,
				limit: 10,
				offset: 10 * (parseInt(this.currentPage) - 1)
			};
			await this.$axios
				.$get(`/api/v1/admin/notifications`, {
					params
				})
				.then(res => {
					// this.notifications = [
					//   ...this.notifications,
					//   res.data.notifications,
					// ]
					res.data.notifications.forEach(item => {
						this.notifications.push(item);
					});
					console.log("notifications", this.notifications);
				});
		},

		async clearAllNotifications() {
			await this.$axios
				.$put(`/api/v1/admin/notifications/seen-all`, {
					user_id: this.$auth.user.id
				})
				.then(res => {
					console.log("result", res);
				})
				.finally(() => {
					this.notificationsCount = 0;
				});
		},

		async goTo(item) {
			console.log("notif item", item);
			console.log("notif name", item.notification_type.name);
			console.log("notif domain", item.notification_type.domain);
			console.log("notif payload type", item.payload_type);
			console.log("notif payload", item.payload);

			if (item.notification_type.domain === "Admin") {
				this.$router.push(item.url);
			}
			if (item.notification_type.domain === "Practice") {
				if (item.url.includes("sessions")) {
					this.$router.push(
						`/practices/${item.user.practice.id}/practice-sessions/${item.payload.id}`
					);
				}
			}

			await this.$axios
				.$put(`/api/v1/admin/notifications/${item.id}/seen`)
				.then(res => {
					this.getNotifications();
				});
		},

		toggleSideBar() {
			this.$store.commit("TOGGLE_SIDEBAR", true);
			document.body.style.overflow = "hidden";
		}
	}
};
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
