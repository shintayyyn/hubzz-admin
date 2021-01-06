<template>
  <div class="w-screen h-screen flex flex-col overflow-auto" style="background-color: #55565A;">
    <AppNotification />
    <nuxt />
  </div>
</template>

<script>
import AppNotification from "@/components/AppNotification"
export default {
	components: {
		AppNotification,
	},
}
</script>
