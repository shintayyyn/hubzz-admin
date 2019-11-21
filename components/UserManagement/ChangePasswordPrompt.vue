<template>
	<div class="flex justify-between h-full text-white py-8 sm:py-4 px-4">
		<div class="flex flex-col justify-center h-full">
			<div class="">
				<p class="text-center text-3xl md:text-4xl font-bold pb-3 text-sunglow">
					Welcome to Hubzz
				</p>
				<p class="w-full md:w-2/3 mx-auto text-center py-2">
					It seems like this is your first time logging in to HQ. We request you
					to change your password for security purposes.
				</p>
			</div>

			<div class="flex flex-col items-center p-4">
				<div
					@click="goTo()"
					class="w-full sm:w-2/3 md:w-1/2 px-4 py-2 bg-green-500 transition-hover hover:bg-green-600 cursor-pointer text-center my-2 rounded"
				>
					Change Password Now
				</div>

				<div
					@click="$emit('close')"
					class="w-full sm:w-2/3 md:w-1/2 px-4 py-2 border-2 border-gray-400 transition-hover hover:bg-gray-400 hover:text-gray-700 text-gray-400 cursor-pointer text-center my-2 rounded"
				>
					Remind Me Later
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: [],
	data() {
		return {};
	},
	created() {},
	methods: {
		goTo() {
			this.$router.push("/account");
		}
	}
};
</script>

<style></style>
