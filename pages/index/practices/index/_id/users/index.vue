<template>
	<div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
		<div style="width: calc(100%);" class="flex-1 flex flex-col self-end bg-trout shadow-lg">
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
                  class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
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
          </div>
        </div>
      </div>
      <!--DEFAULT TABS END HERE-->

		<!--TABLE STARTS HERE-->
		<!--TAB 4-->
        <div class="flex flex-col rounded-lg p-6 sm:p-6">
          <div class="w-full overflow-hidden">
            <nuxt-link :to="`/practices/${specificPractice.id}/users/new-practice-user/${surgeries.id}`">
              <button
                class="inline-flex no-underline  py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow float-left" no-underline
              >Add User
              </button>
              
            </nuxt-link>
          </div>

          <div class="w-full overflow-hidden">
            <div class="flex flex-col">
              <!-- HEADER -->
              <div class="flex">
                <div style="width: 20%;">
                  <div class="flex text-white text-sm p-4">
                    <strong>Full Name</strong>
                  </div>
                </div>
                <div style="width: 30%;">
                  <div class="flex text-white text-sm p-4">
                    <strong>Email Address</strong>
                  </div>
                </div>
                <div style="width: 20%">
                  <div class="flex text-white text-sm p-4">
                    <strong>Role</strong>
                  </div>
                </div>
                <div style="width: 20%;">
                  <div class="flex text-white text-sm p-4">
                    <strong>Sign-Up Verified</strong>
                  </div>
                </div>
                <div style="width: 20%;">
                  <div class="flex text-white text-sm p-4">
                    <strong>Status</strong>
                  </div>
                </div>
              </div>
              <!-- HEADER -->

              <!-- BODY -->
              <nuxt-link
                v-for="(user, index) in usersInPractice"
                :key="`user-${index}`"
                :to="`/practices/${specificPractice.id}/users/edit-user/${user.id}`"
                class="flex no-underline rounded-lg bg-waterloo hover:bg-waterloo-light my-2"
              >
                <div style="width: 20%;">
                  <div class="flex text-white text-sm p-4">
                    <span>{{ user.personal_detail.name }}</span>
                  </div>
                </div>
                <div style="width: 30%;">
                  <div class="flex text-white text-sm p-4">
                    <span>{{ user.email }}</span>
                  </div>
                </div>
                <div style="width: 20%;">
                  <div class="flex text-white text-sm p-4">
                    <span>{{ user.practice_detail.practice_role }}</span>
                  </div>
                </div>
                <div style="width: 20%;">
                  <div class="flex text-white text-sm p-4">
                    <span>{{ user.actived_at ? $moment(user.actived_at).format('MMM D, YYYY | hh:mm A') : null}}</span>
                  </div>
                </div>
                <div style="width: 20%" class="py-2">
                
                    <span class="inline-flex no-underline py-2 text-sm text-black rounded-full shadow"
                    :class="`${user.actived_at ? 'bg-green text-white lg:px-8 sm:px-2' : 'bg-yellow text-black lg:px-6 sm:px-2' }`"
                    >{{ user.actived_at ? 'Active' : 'Disabled' }}
                    </span>
                </div>
              </nuxt-link>
              <!-- BODY -->
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

<style>

</style>