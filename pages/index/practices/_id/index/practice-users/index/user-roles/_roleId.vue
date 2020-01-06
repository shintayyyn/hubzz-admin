<template>
  <div class="role-modal">
    <div class="flex justify-between text-sm text-white py-2 px-6">
      <nuxt-link :to="{path:`/practices/${$route.params.id}/practice-users/user-roles`,query:$route.query}" class="text-white p-1">
        <svgicon name="arrow-left-solid" height="32" width="32" class="text-white hover:text-sunglow fill-current"/>
      </nuxt-link>
      
      roleId
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>
.role-modal {
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
	.role-modal {
		width: 70%;
	}
}
</style>