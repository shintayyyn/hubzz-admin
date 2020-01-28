<template>
	<div class="relative flex flex-col bg-trout">
		<AppSideBar @modal="showLogoutModal = $event" />
		<transition name="drop" mode="out-in">
			<SignOut v-if="showLogoutModal" @modal="showLogoutModal = $event" />
		</transition>
		<div class="signout-shield" v-if="showLogoutModal" @click="showLogoutModal = false"></div>
		<div class="sidebar-shield" v-if="$store.state.toggled_sidebar" @click="close"></div>
		<AppNotification />
		<div class="content h-screen flex flex-col justify-between">
			<AppHeader />
			<nuxt class="overflow-y-auto" />
		</div>
	</div>
</template>

<script>
import AppNotification from "~/components/AppNotification";
import AppHeader from "~/components/AppHeader";
import AppSideBar from "~/components/AppSideBar";
import SignOut from "~/components/Auth/SignOut";
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
		doNotClose() {
			return this.$store.state.notification.doNotClose;
		}
	},

	watch: {
		notify(value) {
			if (value && !this.doNotClose) {
				setTimeout(() => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: false,
						status: "",
						text: ""
					});
				}, 2000);
			}
		},
		mounted() {
			const user = this.$auth.user;
			console.log("user", user);
			this.$store.commit("SET_ADMIN_USER_PERMISSIONS", user);
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
.content {
	margin-left: 0;
	min-height: 100vh;
	max-height: 100%;
	overflow-x: hidden;
}
.sidebar-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #31343d;
	opacity: 0.75;
	z-index: 499;
}

.signout-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 511;
}

@media screen and (min-width: 1200px) {
	.content {
		margin-left: 200px;
	}

	.sidebar-shield {
		display: none;
	}
}
</style>
