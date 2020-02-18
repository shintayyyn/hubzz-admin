<template>
	<div class="practice-modal shadow-lg" ref="modalContainer">
		<div class="flex justify-between text-sm text-white py-4 px-4 md:px-8">
			<nuxt-link to="/practices" class="cursor-pointer">
				<svgicon
					name="arrow-left-solid"
					height="32"
					width="32"
					class="text-white hover:text-sunglow fill-current"
				/>
			</nuxt-link>
		</div>
		<div class="flex justify-start overflow-x-auto mx-6">
			<div
				@click="customSurgery=false"
				class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
				:class="customSurgery === false ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
			>Practice with Existing Surgery</div>
			<div
				@click="customSurgery=true"
				class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
				:class="customSurgery === true? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
			>Practice with Custom Surgery</div>
		</div>
		<transition name="slide" mode="out-in">
			<AddPracticeSurgery v-if="customSurgery === false" />
			<div v-if="customSurgery === true">
				<CreateUser :registeeType="'customSurgery'" @formError="handleData" />
			</div>
		</transition>
	</div>
</template>

<script>
import AddPracticeSurgery from "@/components/Practices/AddPracticeSurgery";
import CreateUser from "@/components/UserManagement/CreateUser";
export default {
	components: {
		AddPracticeSurgery,
		CreateUser
	},
	data() {
		return {
			customSurgery: false,
			scroll: 0
		};
	},
	methods: {
		handleData() {
			this.$nextTick(() => {
				this.$refs.modalContainer.scrollTop = 0;
			});
			// console.log(e);
		}
	}
};
</script>

<style>
.practice-modal {
	position: fixed;
	top: 0;
	right: 0;
	margin-right: 0%;
	width: 100%;
	height: 100%;
	overflow: auto;
	border-left: solid 2px #ffc72c;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}
@media screen and (min-width: 1200px) {
	.practice-modal {
		width: 80%;
	}
}
</style>