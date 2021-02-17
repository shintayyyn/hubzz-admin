<template>
  <div class="w-screen h-screen flex flex-col overflow-auto">
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
