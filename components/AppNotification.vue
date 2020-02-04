<template>
	<div class="w-full app-notification">
		<div class="flex justify-center">
			<div
				class="rounded-b-lg py-2 px-12 flex flex-row flex-nowrap justify-center"
				:class="notificationStatus"
				v-if="$store.state.notification.enabled"
			>
				<div class="mr-2">
					<svgicon :name="notificationIcon" height="20" width="20" :color="iconSvgColor" />
				</div>
				<div class="font-bold text-sm leading-normal">{{$store.state.notification.text}}</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	computed: {
		notificationStatus() {
			switch (this.$store.state.notification.status) {
				case "success":
					return "bg-green-300";
					break;
				case "danger":
					return "bg-red-500 text-white";
					break;
				case "alert":
					return "bg-yellow-500";
					break;
				case "upload":
					return "bg-blue-500 text-white";
				default:
					return "bg-white";
			}
		},

		notificationIcon() {
			switch (this.$store.state.notification.status) {
				case "success":
					return "circle-check";
					break;
				case "danger":
					return "exclamation-mark";
					break;
				case "alert":
					return "exclamation-circle-solid";
					break;
				case "upload":
					return "cloud-upload";
					break;
				default:
					return "alert";
			}
		},

		iconSvgColor() {
			switch (this.$store.state.notification.status) {
				case "success":
					return "black black";
				case "danger":
					return "white white";
					break;
				case "upload":
					return "transparent white";
					break;
				case "info":
					return "white white";
					break;
				default:
					return "";
			}
		},

		notify() {
			return this.$store.state.notification.enabled;
		},

		closable() {
			return this.$store.state.notification.closable;
		}
	},
	watch: {
		notify(value) {
			if (!this.$store.state.notification.closable) {
				setTimeout(
					() => {
						this.$store.commit("SET_NOTIFICATION", {
							enabled: false,
							status: "",
							text: "",
							closable: false,
							duration: ""
						});
					},
					this.$store.state.notification.duration
						? this.$store.state.notification.duration
						: 2000
				);
			}
		}
	},
	methods: {
		close() {
			this.$store.commit("SET_NOTIFICATION", {
				enabled: false,
				status: "",
				text: ""
				// closable: false
			});
		}
	}
};
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
