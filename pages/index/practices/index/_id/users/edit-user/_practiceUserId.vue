<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div
      style="width: calc(100% - 0px);"
      class="flex-1 flex flex-col self-end bg-trout shadow-lg "
    >
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link :to="`/practices/${specificPractice.id}/users`" class="text-white p-1">
          <svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
        </nuxt-link>
      </div>
      <div class="flex flex-col rounded-lg pl-6">
        <div class="w-full overflow-hidden">
          <div class="flex flex-wrap -mx-1 overflow-hidden">
            <div class="my-1 px-1 overflow-hidden">
              <button
                class="bg-sunglow hover:bg-yellow-darker rounded-lg py-3 px-4 text-black text-sm"
                @click="tab1=true,tab2=false"
              >
                <strong>General</strong>
              </button>
            </div>
            <div class="my-1 px-1 overflow-hidden">
              <button
                class="bg-sunglow hover:bg-yellow-darker rounded-lg py-3 px-4 text-black text-sm"
                @click="tab2=true,tab1=false"
              >
                <strong>Change Password</strong>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex sm:p-2">
        <div
          v-if="tab1"
          class="flex text-white bg-waterloo m-4 py-2 px-3 shadow rounded-lg text-sm sm:w-full lg:w-2/5"
        >
          <div class="w-full overflow-hidden text-grey-light text-sm p-2">
            <p class="flex py-1">E-Mail Address</p>
            <input
              class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none focus:border-orange"
              type="text"
              :placeholder="specificPracticeUser.email"
              aria-label="Full name"
            >
            <p class="flex py-1">Title</p>
            <input
              class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none focus:border-orange"
              type="text"
              :placeholder="specificPracticeUser.personal_detail.title"
              aria-label="Full name"
            >
            <p class="flex py-1">First Name</p>
            <input
              class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none focus:border-orange"
              type="text"
              :placeholder="specificPracticeUser.personal_detail.first_name"
              aria-label="Full name"
            >
            <p class="flex py-1">Last Name</p>
            <input
              class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none focus:border-orange"
              type="text"
              :placeholder="specificPracticeUser.personal_detail.last_name"
              aria-label="Full name"
            >
            <p class="flex py-1">Suffix</p>
            <input
              class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none focus:border-orange"
              type="text"
              :placeholder="specificPracticeUser.personal_detail.suffix"
              aria-label="Full name"
            >
            <p class="flex py-1">Role</p>
            <select
              class="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:border-orange"
            >
              <option>Partner</option>
              <option>Practice Manager</option>
              <option>Practice Staff</option>
            </select>
            <p class="flex py-1">Sign-Up verified by e-mail</p>
            <p class="p-2">{{specificPracticeUser.email ? specificPracticeUser.email_verified_at: 'Not yet verified'}}</p>
            <p class="flex py-1">Status</p>
            <select
              class="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:border-orange"
            >
              <option>Active</option>
              <option>Disabled</option>
            </select>
            <button
                class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow float-left"
              >Save Changes</button>
          </div>
        </div>
        <div v-if="tab2" class="flex text-white">
          <div class="flex text-white text-sm bg-waterloo m-4 py-2 px-3 shadow rounded-lg">
            <div class="overflow-hidden text-grey-light text-sm p-2">
              <p class="flex py-1">New Password</p>
              <input
                class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none focus:border-orange"
                type="password"
                aria-label="oldpassword"
                v-model="toChangePassword.newPassword"
              >
              <p class="flex py-1">Confirm New Password</p>
              <input
                class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none focus:border-orange"
                type="password"
                aria-label="newpassword"
                v-model="toChangePassword.confirmNewPassword"
              >
              <button
                class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow float-left"
                @click.prevent="toChangeUserPassword(specificPracticeUser.id,toChangePassword)"
                >Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nuxt-child/>
  </div>
</template>

<script>
export default {
  data() {
    return { 
      userTabs: 0, 
      tab1: true, 
      tab2: false,
      specificPracticeUser:[],
      specificPractice:[],
      toChangePassword:{
        newPassword:'',
        confirmNewPassword:''
      }

      };
  },
  async asyncData({app, route}){
    try{
      let response = await app.$axios.get(`/api/v1/admin/practice-users/${route.params.practiceUserId}`)
      const specificPracticeUser = response.data.data.user
      const specificPractice = response.data.data.user.practice_detail.practice

      return{
        specificPracticeUser,
        specificPractice
      }

    }catch(err){
      console.log("index practice user index create asyncData err", err);
    } 
  },

  methods: {
    async toChangeUserPassword(userID,toChangePassword){
      try{
        const response = this.$axios.put(`/api/v1/admin/users/${userID}/change-password`,{
          password:toChangePassword.newPassword,
          password_confirmation:toChangePassword.confirmNewPassword
        })
        alert('Saved')
      }catch(err){
        alert('Something went wrong!')
        console.log("index put locum detail compliance documents error");
      }
    }
  }
};
</script>

<style>
</style>
