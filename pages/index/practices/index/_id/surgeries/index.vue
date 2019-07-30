<template>
	<div class="fixed lg:absolute overflow-x-hidden overflow-y-auto pin-t pin-b pin-r pin-l flex flex-col">
		<div class="page-overlap flex-1 flex flex-col w-full self-end bg-trout shadow-lg">
			<!-- HEADER -->
			<div class="flex justify-between text-sm text-white py-2 px-6">
				<nuxt-link :to="{path:`/practices`,query: $route.query }" class="text-white p-1">
				<svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
				</nuxt-link>
			</div>

			<!-- DEFAULT TABS -->
			<div class="flex flex-col rounded-lg pl-6 mt-2 " >
				<div class="w-full">
					<div class="flex flex-wrap -mx-1">
						<div class="my-1 px-1">
							<div class="my-2 rounded-lg">
								<nuxt-link
								class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
								:to="{path:`/practices/${specificPractice.id}`,query: $route.query}">
								<strong>Practice</strong>
								</nuxt-link>
							</div>
						</div>
						<div class="my-1 px-1">
							<div class="my-2 rounded-lg">
								<nuxt-link
								class="bg-grey-dark hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
								:to="{path:`/practices/${specificPractice.id}/surgeries`,query: $route.query}">
								<strong>Surgeries</strong>
								</nuxt-link>
							</div>
						</div>
						<div class="my-1 px-1">
							<div class="my-2 rounded-lg">
								<nuxt-link
								class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
								:to="{path:`/practices/${specificPractice.id}/sessions/available`,query: $route.query}">
								<strong>Sessions</strong>
								</nuxt-link>
							</div>
						</div>
						<div class="my-1 px-1">
							<div class="my-2 rounded-lg">
								<nuxt-link
								class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
								:to="{path:`/practices/${specificPractice.id}/users`,query: $route.query}">
								<strong>Users</strong>
								</nuxt-link>
							</div>
						</div>
						<div class="my-1 px-1">
							<div class="my-2 rounded-lg">
								<nuxt-link
								class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
								:to="{path:`/practices/${specificPractice.id}/documents`,query: $route.query}">
								<strong>Documents</strong>
								</nuxt-link>
							</div>
						</div>
						<div class="my-1 px-1">
							<div class="my-2 rounded-lg">
								<nuxt-link
								class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
								:to="{path:`/practices/${specificPractice.id}/rates`,query: $route.query}">
								<strong>Rates</strong>
								</nuxt-link>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!--DEFAULT TABS END HERE-->

			<div class="flex p-4 overflow-hidden">
				<div>
					<nuxt-link
						:to="{path: `/practices/${specificPractice.id}/surgeries/add-surgery`}"
						class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow float-right"
					>Add Surgery
					</nuxt-link>
				</div>
			</div>
			<!-- TABLE RESPONSIVE-->
			<div class="table border-separate overflow-x-auto px-6" style="border-spacing: 0 10px;"> 
				<!-- HEADER -->
				<div class="hidden md:table-row font-bold text-white text-sm py-4"> 
				<div class="table-cell p-2 align-middle">Practice Name</div> 
				<div class="table-cell p-2 align-middle">Practice Code</div>
				<div class="table-cell p-2 align-middle">Practice Location</div>
				</div>
				<!-- END HEADER -->
				<!-- BODY -->
				<div
				v-for="(childSurgery,index) in childSurgeries"
				:key="`childSurgery-${index}`"
				class="flex flex-wrap justify-between px-2 py-2 border-l-8 border-yellow-dark md:border-l-0 md:table-row my-2 text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light" 
				>
					<div class="flex flex-col sm:w-full md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
						<strong class="block md:hidden text-sm uppercase">Practice Name</strong>
						<span class="whitespace-no-wrap">{{ childSurgery.surgery ? childSurgery.surgery.name :null }}</span>
					</div>
					<div class="flex items-center sm:w-full md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
						<strong class=" block md:hidden text-sm uppercase pr-2 align-middle">Practice Code:</strong>
						<span class=" break-all">{{ childSurgery.surgery ? childSurgery.surgery.code :'null' }}</span>
					</div>
					<div class="flex flex-col sm:w-full md:w-auto md:table-cell px-1 md:py-4 align-middle">
						<strong class="block md:hidden text-sm uppercase">Practice Location</strong>
						<div class="text-white text-sm px-2 py-1">
							<span>{{ childSurgery.surgery.address ? childSurgery.surgery.address.line_1 :null }}</span><br>
							<span>{{ childSurgery.surgery.address ? childSurgery.surgery.address.line_2 :null }}</span><br>
							<span>{{ childSurgery.surgery.address ? childSurgery.surgery.address.line_3 :null }}</span><br>
						</div>
					</div>
				</div>
				<!-- END BODY -->
			</div>
			<!-- END TABLE -->

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
.page-overlap{
    width: calc(100% - 70px);
  }

  @media screen and (min-width: 1200px) {
    .page-overlap{
      width: calc(100% - 200px);
    }
  }
</style>