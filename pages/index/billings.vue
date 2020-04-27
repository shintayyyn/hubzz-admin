<template>
  <div class="flex-1 flex flex-col py-2 px-2 md:px-6 overflow-auto">
    <div class="px-2 text-2xl md:text-4xl text-white">
      Billing
    </div>
    <div class="px-2 flex justify-between items-center flex-wrap">
      <div /> 
      <AppButton
        class="mr-2"
        :label="$route.name.includes('bulk-billings') ? 'Create HUBZZ Billing Individually' : 'Create HUBZZ Billing by Bulk'"
        :icon="$route.name.includes('bulk-billings') ? 'edit' : 'add-rectangle'"
        @click="goToTab()"
      />
    </div>
    <nuxt-child />
  </div>
</template>

<script>
import AppButton from "@/components/Base/AppButton"
export default {
	components: {
		AppButton,
  },
  methods: {
    goToTab () {
			console.log('route', this.$route.name)
			if (this.$route.name.includes('bulk-billings')) {
				this.$router.push(`/billings`)
			} else {
				this.$router.push(`/billings/bulk-billings`)
			}
		}
  }
}
</script>

<style>
.md\:table-cell:first-child {
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
}
.md\:table-cell:last-child {
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
}
</style>
