<template>
	<div class="fixed lg:absolute pin-t pin-b pin-r pin-l flex flex-col overflow-y-auto overflow-x-hidden">
		<div style="width: calc(100%);" class="flex-1 flex flex-col self-end bg-trout shadow-lg">
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link :to="{path:`/practices`,query: $route.query }" class="text-white p-1">
        <svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
        </nuxt-link>
      </div>

      <!-- DEFAULT TABS -->
      <div class="flex flex-col rounded-lg pl-6 mt-2" >
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
                  class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                  v-if="!specificPractice.practice_parent"
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
                  class="bg-grey-dark hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
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

      <!--TABLE STARTS HERE-->
      <!--TAB 4-->
      <div class="flex flex-col rounded-lg px-6 py-2">
        <div class="w-full overflow-hidden">
          <nuxt-link :to="`/practices/${specificPractice.id}/users/new-practice-user/${surgeries.id}`">
            <button
              class="inline-flex no-underline  py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow float-left" no-underline
            >Add User
            </button>
            
          </nuxt-link>
        </div>

        <!-- TABLE RESPONSIVE-->
        <div class="table border-separate overflow-x-auto" style="border-spacing: 0 10px;"> 
          <!-- HEADER -->
          <div class="hidden md:table-row font-bold text-white text-sm py-4"> 
            <div class="table-cell p-2 align-middle">Full Name</div> 
            <div class="table-cell p-2 align-middle">Email Address</div>
            <div class="table-cell p-2 align-middle">Role</div>
            <div class="table-cell p-2 align-middle">Sign-Up Verified</div>
            <div class="table-cell p-2 align-middle">Status</div>
          </div>
          <!-- END HEADER -->
          <!-- BODY -->
          <nuxt-link
          v-for="(user, index) in usersInPractice"
          :key="`user-${index}`"
          :to="`/practices/${specificPractice.id}/users/edit-user/${user.id}`"
          class="flex flex-col md:flex-row sm:flex-wrap px-2 py-2 border-l-8 border-yellow-dark md:border-l-0 md:table-row my-2 text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light" 
          draggable="false"
          >
            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
              <strong class="block md:hidden text-sm uppercase">Full Name</strong>
              <span class="break-word">{{ user.personal_detail.name }}</span>
            </div>
            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
              <strong class="block md:hidden text-sm uppercase">Email Address</strong>
              <span class="break-all">{{ user.email }}</span>
            </div>
            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
              <strong class="block md:hidden text-sm uppercase">Role</strong>
              <span class="break-all">{{ user.practice_detail.practice_role }}</span>
            </div>
            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
              <strong class="block md:hidden text-sm uppercase">Sign-up Verified</strong>
              <span class="break-all">{{ user.actived_at ? $moment(user.actived_at).format('MMM D, YYYY | hh:mm A') : null }}</span>
            </div>
            <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell pl-1 pr-4 py-2 md:py-4 align-middle">
              <strong class="block md:hidden">Status</strong>
              <span class="inline-flex text-black text-sm py-2 px-8 rounded-full"
                :class="`${user.actived_at ? 'bg-green text-white lg:px-8 sm:px-2' : 'bg-yellow text-black lg:px-6 sm:px-2' }`"
                >{{ user.actived_at ? 'Active' : 'Disabled' }}
              </span>
              </div>
          </nuxt-link>
          <!-- END BODY -->
        </div>
        <!-- END TABLE -->
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
	  surgeries:[],
	  practiceUsers:[]
    };
  },

  async asyncData({ app, route }) {
    try {
    let response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}`)
    const specificPractice = response.data.data.practice
    const surgeries = response.data.data.practice.surgery
	  
	  response = await app.$axios.get(`/api/v1/admin/practice-users`)
    const practiceUsers = response.data.data.users

    const usersInPractice = practiceUsers.filter((usersInside)=>{
      return usersInside.practice_detail.practice.id === specificPractice.id
    })
    
    // console.table(usersInPractice)    
    // console.table(specificUserInPractice)
	  // console.table(practiceUsers)
    // console.log(surgeries)

    return{
      specificPractice,
      practiceUsers,
      surgeries,
      usersInPractice
    }

    } catch (err) {
      console.log("index practices index _id index asyncData err", err);
    }
  },
}

</script>