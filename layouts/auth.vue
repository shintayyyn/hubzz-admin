<template>
	<section class="bg_page w-full h-full">
		<div class="flex flex-col lg:flex-row h-full">
			<div class="w-full xl:w-2/5 bg-logo flex overflow-hidden p-4 md:p-8">
				<img class="mx-auto md:my-auto" src="~/assets/images/hubzz-logo.png" />
			</div>
			<div class="w-full xl:w-3/5 overflow-x-hidden h-full">
				<nuxt />
			</div>
		</div>
	</section>
</template>
<style scoped>
.bg_page {
	background-color: #55565a;
	height: 100vh;
}
.bg-logo {
	background-size: 175%;
	background-position: top right;
	background-repeat: no-repeat;
	background-image: url("../assets/images/hubzz-bg.png");
}

.bg-logo img {
	height: 100%;
}

@media screen and (max-width: 320px) {
	.bg-logo img {
		width: 50%;
		height: auto;
	}
}

@media (min-width: 320px) {
	.bg-logo img {
		width: 40%;
	}
}
@media (min-width: 480px) {
	/* .bg-logo {
		flex: 0 0 40%;
	} */

	.bg-logo img {
		height: auto;
		width: auto;
	}
}
@media (min-width: 768px) {
	.bg-logo {
		/* flex: 0 0 25%; */
		height: 30%;
	}
}
@media (min-width: 992px) {
	.bg-logo {
		/* flex: 0 0 25%; */
		height: 100%;
	}
}
</style>