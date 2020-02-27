<template>
  <div class="hub-invitation-modal">
    <nuxt-link
				:to="{ path: `/practices/${$route.params.id}/practice-hub`, query }"
				class="text-white hover:text-yellow-500 p-1 mr-4"
			>
				<svgicon
					name="arrow-left-solid"
					height="32"
					width="32"
					class="hover:text-yellow-500 fill-current"
				/>
			</nuxt-link>
    Hub invitation
  </div>
</template>

<script>
export default {

}
</script>

<style>
.hub-invitation-modal {
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
	.hub-invitation-modal {
		width: 70%;
	}
}
</style>