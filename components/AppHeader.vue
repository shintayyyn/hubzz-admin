<template>
	<section class="header">
		<!-- HEADER -->
		<div class="flex justify-between items-center text-sm text-white px-4 md:px-6">
			<button class="toggle text-white focus:outline-none" @click="toggleSideBar">
				<img src="~/assets/images/hbg.png" />
			</button>
			<nuxt-link to="/" class="py-3 cursor-pointer">
				<img src="~/assets/images/hubzz-icon-transparent.png" />
			</nuxt-link>
			<div class="flex justify-right">
				<div class="m-4 cursor-pointer">
					<div @click="checkNotifications()">
						<svgicon name="notification" width="30" height="30" color="white" class="ml-2" />
					</div>
					<div v-if="notificationToggle === true">
						<div class="notification-modal overflow-hidden">
							<p class="m-4 text-lg">Notifications</p>
							<div class="m-4 overflow-y-auto overflow-x-hidden px-2" style="max-height: 500px;">
								<div v-if="sampleCount > 0">
									<div
										v-for="(item, index) in sampleNotifs"
										:key="`item-${index}`"
										class="inline-block w-full p-3 mb-2 shadow-md text-white bg-waterloo hover:bg-waterloo-light transition-hover rounded-lg"
									>
										<div class="w-full flex flex-col leading-tight sm:my-1 pt-1">
											<span class="uppercase text-xs font-bold">Locum</span>
											<span class="pb-2">{{ item.name }}</span>
											<span class="uppercase text-xs font-bold">Sample Notification</span>
											<span class>{{ item.description }}</span>
										</div>
									</div>
								</div>
								<div v-else>No New Notifications</div>
							</div>
						</div>
					</div>
				</div>

				<nuxt-link
					to="/account"
					class="flex flex-row py-2 text-sm cursor-pointer"
					v-if="$auth.loggedIn"
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
		</div>
		<!-- HEADER -->
	</section>
</template>
<script>
import AppNotifDropdown from "@/components/AppNotifDropdown";
export default {
	data() {
		return {
			notificationToggle: false,
			notificationsCount: 0,
			notifications: [],
			sampleCount: 5,
			sampleNotifs: [
				{
					id: "1",
					name: "work in progress",
					type: "in",
					description:
						"Welcome to the Krusty Krab, Where the Clock of Evolution Ticks Backwards."
				},
				{
					id: "2",
					name: "work in progress",
					type: "in",
					description:
						"Welcome to the Krusty Krab, Where the Clock of Evolution Ticks Backwards."
				},
				{
					id: "3",
					name: "work in progress",
					type: "in",
					description:
						"Welcome to the Krusty Krab, Where the Clock of Evolution Ticks Backwards."
				},
				{
					id: "4",
					name: "work in progress",
					type: "in",
					description:
						"Welcome to the Krusty Krab, Where the Clock of Evolution Ticks Backwards."
				},
				{
					id: "5",
					name: "work in progress",
					type: "in",
					description:
						"Welcome to the Krusty Krab, Where the Clock of Evolution Ticks Backwards."
				},
				{
					id: "6",
					name: "work in progress",
					type: "in",
					description:
						"Welcome to the Krusty Krab, Where the Clock of Evolution Ticks Backwards."
				}
			]
		};
	},
	async created() {
		await this.$axios.$get(`/api/v1/admin/notifications/count`).then(res => {
			this.notificationsCount = res.data.count;
		});
		await this.$axios.$get(`/api/v1/admin/notifications`).then(res => {
			this.notifications = res.data.notifications;
		});
	},
	methods: {
		async checkNotifications() {
			this.notificationToggle = !this.notificationToggle;
			await this.$axios.$get(`/api/v1/admin/notifications/count`).then(res => {
				this.notificationsCount = res.data.count;
			});
			await this.$axios.$get(`/api/v1/admin/notifications`).then(res => {
				this.notifications = res.data.notifications;
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
	position: fixed;
	left: 86%;
	top: 15%;
	transform: translate(-86%, -15%);
	border-radius: 15px;
	width: 400px;
	max-width: 95%;
	max-height: 80%;
	overflow: hidden;
	transition: all 0.3s ease-in-out;
	background-color: #393c42;
	z-index: 512;
}
@media screen and (min-width: 768px) {
	.notification-modal {
		max-height: 60%;
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
