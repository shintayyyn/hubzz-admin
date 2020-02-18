<template>
	<div class="add-faq-modal shadow-lg" ref="modalContainer">
		<!-- <nuxt-child /> -->
		<div class="p-4 md:p-8 text-white">
			<div @click="goBack()" class="cursor-pointer">
				<svgicon
					name="arrow-left-solid"
					height="32"
					widht="32"
					class="text-white hover:text-sunglow fill-current"
				/>
			</div>
			<div class="mt-4 text-2xl md:text-4xl text-white">Add a FAQ for {{$route.query.domain}}s</div>
			<CreateFaq :domain="$route.query.domain" @formError="scrollToTop" @close="goBack()" />
			<div class="add-faq-shield" v-if="$route.name.includes('index-faqs-add')"></div>
			<nuxt-child />
		</div>
	</div>
</template>
<script>
import CreateFaq from "@/components/Faqs/CreateFaq";
export default {
	components: {
		CreateFaq
	},
	data() {
		return {
			// domain: "Locum"
		};
	},
	methods: {
		goBack() {
			const query = {
				...this.$route.query
			};
			if (query.job_status) {
				delete query.job_status;
			}
			if (query.domain) {
				delete query.domain;
			}
			this.$router.push({ path: "/faqs", query });
		},
		scrollHandler(e) {
			console.log(e.target.scrollTop);
		},
		scrollToTop() {
			this.$nextTick(() => {
				this.$refs.modalContainer.scrollTop = 0;
			});
		}
	}
};
</script>
<style>
.add-faq-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 511;
}
.add-faq-modal {
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
	.add-faq-modal {
		width: 80%;
	}
}
</style>