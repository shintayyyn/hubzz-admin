<template>
	<section class="bg_page w-full h-full">
		<div class="flex flex-col lg:flex-row h-full">
			<div class="w-full xl:w-2/5 bg-logo flex justify-center items-center p-4 md:p-8">
				<div class="__logo">
					<img class="mx-auto md:my-auto" src="~/assets/images/hubzz_logo.png" />
				</div>
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

.bg-logo .__logo {
	max-width: 28vw;
}

@media (min-width: 1200px) {
	.bg-logo .__logo{
      max-width: 20vw;
	}
}
</style>