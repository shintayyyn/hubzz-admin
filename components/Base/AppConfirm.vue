<template>
	<div
		class="wrapper absolute top-0 mx-auto rounded-b-lg py-4 px-6 bg-waterloo-dark text-white shadow-lg"
		:style="inStyle"
		:class="inClass"
	>
		<p>{{ message }}</p>
		<div class="flex justify-center pt-4">
			<AppButton
				:label="'Cancel'"
				class="mx-1"
				:background="'transparent'"
				:class="'border text-white hover:bg-gray-700 hover:border-none'"
				@click="$emit('cancel')"
			/>
			<AppButton :label="'Confirm'" class="mx-1" @click="$emit('confirm')" />
		</div>
	</div>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
export default {
	components: {
		AppButton
	},
	props: {
		message: {
			type: String,
			required: true
		},
		inStyle: String,
		inClass: String
	}
};
</script>

<style>
.wrapper {
	top: 0;
	left: 50%;
	transform: translate(-50%, 0);
	z-index: 512;
	max-width: 50%;
}
</style>