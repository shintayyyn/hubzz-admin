<template>
  <div>
    <transition name="slide" mode="out-in">
			<div class="practice-modal shadow-lg">
				<AddPracticeSurgery />
			</div>
		</transition>
  </div>
</template>

<script>
import AddPracticeSurgery from "@/components/Practices/AddPracticeSurgery";
export default {
  components: {
    AddPracticeSurgery
  }
}
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