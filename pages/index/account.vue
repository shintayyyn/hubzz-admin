<template>
	<div class="flex-1 flex flex-col py-2 px-4 md:px-6 overflow-y-auto">
		<div class="text-xl md:text-4xl text-white">Account</div>
		<div class="my-4">
			<nuxt-link
				:to="`/account`"
				class="rounded-lg font-bold"
				:class="
					$route.path == `/account`
						? 'bg-sunglow hover:bg-sunglow-dark px-4 py-3'
						: 'px-4 py-3 text-white hover:bg-waterloo'
				"
				>General</nuxt-link
			>
			<nuxt-link
				:to="`/account/change-password`"
				class="rounded-lg font-bold"
				:class="
					$route.path == `/account/change-password`
						? 'bg-sunglow hover:bg-sunglow-dark px-4 py-3'
						: 'px-4 py-3 text-white hover:bg-waterloo'
				"
				>Change Password</nuxt-link
			>
		</div>
		<nuxt-child />
	</div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
export default {
	components: {
		AppInput,
		AppButton
	}
};
</script>
<style></style>
