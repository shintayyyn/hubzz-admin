<template>
	<div class="w-screen h-screen flex flex-col overflow-auto" style="background-color: #55565A;">
		<AppNotification />
		<PopUpNotification />
		<nuxt />
	</div>
</template>

<script>
import AppNotification from "@/components/AppNotification"
import PopUpNotification from "@/components/PopUpNotification"
export default {
	components: {
		AppNotification,
		PopUpNotification
	},
}
</script>

<style>
</style>
