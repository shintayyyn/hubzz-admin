<template>
	<div class="absolute pin-t pin-b pin-r pin-l flex flex-col overflow-auto">
		<div style="width: calc(100%);" class="flex-1 flex flex-col w-full self-end bg-trout shadow-lg">
			<!-- HEADER -->
			<div class="flex justify-between text-sm text-white py-2 px-6">
				<nuxt-link :to="{path:`/practices`,query: $route.query }" class="text-white p-1">
				<svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
				</nuxt-link>
			</div>
			<!-- TABS -->
			<div class="flex flex-col rounded-lg pl-6 mt-2 " >
				<div class="flex flex-wrap -mx-1 w-full">
					<div class="my-1 px-1">
						<div class="my-2 rounded-lg">
							<nuxt-link
								class="hover:bg-grey rounded-lg p-3 text-white text-sm"
								:to="{path:`/practices/${specificPractice.id}`,query: $route.query}">
								<strong>Practice</strong>
							</nuxt-link>
						</div>
					</div>
					<div class="my-1 px-1">
						<div class="my-2 rounded-lg">
							<nuxt-link
								class="bg-grey-dark hover:bg-grey rounded-lg p-3 text-white text-sm"
								:to="{path:`/practices/${specificPractice.id}/surgeries`,query: $route.query}">
								<strong>Surgeries</strong>
							</nuxt-link>
						</div>
					</div>
					<div class="my-1 px-1 overflow-</b-tabs>hidden">
						<div class="my-2 rounded-lg">
							<nuxt-link
								class="hover:bg-grey rounded-lg p-3 text-white text-sm"
								:to="{path:`/practices/${specificPractice.id}/sessions`,query: $route.query}">
								<strong>Sessions</strong>
							</nuxt-link>
						</div>
					</div>
					<div class="my-1 px-1">
						<div class="my-2 rounded-lg">
							<nuxt-link
								class="hover:bg-grey rounded-lg p-3 text-white text-sm"
								:to="{path:`/practices/${specificPractice.id}/users`,query: $route.query}">
								<strong>Users</strong>
							</nuxt-link>
						</div>
					</div>
					<div class="my-1 px-1">
						<div class="my-2 rounded-lg">
							<nuxt-link
								class="hover:bg-grey rounded-lg p-3 text-white text-sm"
								:to="{path:`/practices/${specificPractice.id}/documents`,query: $route.query}">
								<strong>Documents</strong>
							</nuxt-link>
						</div>
					</div>
				</div>
			</div>
			<!--TABS END HERE-->

			<div class="flex p-4 overflow-hidden">
				<div>
					<nuxt-link
						:to="{path: `/practices/${specificPractice.id}/surgeries/add-surgery`}"
						class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow float-right"
					>Add Surgery
					</nuxt-link>
				</div>
			</div>

			<!--TABLE STARTS HERE-->
			<!--TABLE-->
			<div class="flex flex-col p-4 ">
				<!--HEADERS-->
				<div class="flex">
					<div style="width:25%">
						<div class="flex text-white text-sm p-2">
						<strong>Practice Name</strong>
						</div>
					</div>
					<div style="width:25%">
						<div class="flex text-white text-sm p-2">
						<strong>Practice Code</strong>
						</div>
					</div>
					<div style="width:25%">
						<div class="flex text-white text-sm p-2">
						<strong>Practice Location</strong>
						</div>
					</div>
				</div>
				<!--HEADERS END HERE-->
				<div v-for="(childSurgery,index) in childSurgeries"
					:key="`childSurgery-${index}`"
					class="flex no-underline rounded-lg bg-waterloo my-2"
					>	
					<div style="width: 25%;">
						<div class="flex text-white text-sm p-4">
						<span>{{ childSurgery.surgery ? childSurgery.surgery.name :null }}</span>
						</div>
					</div>
					<div style="width: 25%;">
						<div class="flex text-white text-sm p-4">
						<span>{{ childSurgery.surgery ? childSurgery.surgery.code :'null '}}</span>
						</div>
					</div>
				
					<div style="width: 20%;">
						<div class="text-white text-sm p-4">
						<span>{{ childSurgery.surgery.address ? childSurgery.surgery.address.line_1 :null }}</span><br>
						<span>{{ childSurgery.surgery.address ? childSurgery.surgery.address.line_2 :null }}</span><br>
						<span>{{ childSurgery.surgery.address ? childSurgery.surgery.address.line_3 :null }}</span><br>
						</div>
					</div>
				
				</div>
			</div>
			

		</div>
		<nuxt-child/>
	</div>
</template>

<script>
export default{
	  transition: "subpage",

  data() {
    return {
	  specificPractice:[],
	  childSurgeries:[]
    };
  },

  async asyncData({ app, route }) {
    try {
      let response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}`)
      const specificPractice = response.data.data.practice
      const childSurgeries = response.data.data.practice.practice_children

	  console.table(childSurgeries)

      return{
        specificPractice,
       	childSurgeries
      }
    } catch (err) {
      console.log("index practices index _id index asyncData err", err);
    }
  },
}

</script>

<style>

</style>