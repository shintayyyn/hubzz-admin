<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div
      style="width: calc(100% - 70px);"
      class="flex-1 flex flex-col self-end bg-trout shadow-lg sm:p-2"
    >
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link to='/practices/surgeries/surgery-add-practice' class="text-white p-1">
          <svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
        </nuxt-link>
      </div>
      <div class="text-white pl-4 pt-2">
        <strong>Create User</strong>
      </div>
      <div class="flex text-white bg-waterloo m-4 py-2 px-3 shadow rounded-lg text-sm sm:w-max lg:w-1/2">
        <div class="w-full overflow-hidden text-grey-light text-sm p-2">
          <p class="flex">Title</p>
          <input
            class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-orange"
            type="text"
            placeholder="Mr. / Mrs. / Dr. / etc....."
            v-model='toPostPracticeUser.title'
          aria-label="Title"
          >
          <p class="flex">First Name</p>
          <input
            class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-orange"
            type="text"
            placeholder="Jane Doe"
            v-model='toPostPracticeUser.first_name'
            aria-label="First Name"
          >
          <p class="flex">Last Name</p>
          <input
            class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-orange"
            type="text"
            v-model='toPostPracticeUser.last_name'
            placeholder="Jane Doe"
            aria-label="Full name"
          >
          <p class="flex">Suffix</p>
          <input
            class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-orange"
            type="text"
            placeholder="Jane Doe"
            v-model='toPostPracticeUser.suffix'
           aria-label="Full name"
          >
          <p class="flex">Role</p>
          <select
            class="appearance-none w-full mb-4 bg-white border-b border-grey-light hover:border-grey px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            v-model='toPostPracticeUser.practice_role'
          >
            <option>Partner</option>
            <option>Practice Manager</option>
            <option>Practice Staff</option>
          </select>
          <p class>E-Mail Address</p>
          <input
            class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-orange"
            id="username"
            type="text"
            v-model='toPostPracticeUser.email'
          placeholder="Email"
          >
          <p class="flex">Password</p>
          <input
            class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-orange"
            id="password"
            type="password"
            v-model='toPostPracticeUser.password'
            placeholder="Password"
          >
            <p class="flex">Repeat Password</p>
          <input
            class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-orange"
            id="password"
            type="password"
            v-model='toPostPracticeUser.password_confirmation'
            placeholder="Password"
          >
          <button
            class="inline-flex no-underline  py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg float-left"
            @click.prevent="toPostPracticeUserInfo(specificSurgery.id,toPostPracticeUser)"
          >Add Practice User
          </button>
        </div>
      </div>
    </div>
    <nuxt-child/>
  </div>
</template>

<script>
export default {
  data(){
    return{
      specificSurgery:[],
      toPostPracticeUser:{
        email:'',
        password:'',
        password_confirmation:'',
        title:'',
        first_name:'',
        last_name:'',
        suffix:'',
        practice_role:'',
        surgery_id:''
      }
    }
  },
  async asyncData({app,route}){
    try{
      
      let response = await app.$axios.get(`/api/v1/admin/surgeries/${route.params.surgeryID}`)
      const specificSurgery = response.data.data.surgery

      return{
        specificSurgery
      }
      
    }catch(err){
      console.log("index practices index create asyncData err", err);
    }
  },

  methods:{
    async toPostPracticeUserInfo(toPostSurgeryID,toPostPracticeUser){
      try{
        const response = this.$axios.post(`/api/v1/admin/practice-users`,{
          email:toPostPracticeUser.email,
          password:toPostPracticeUser.password,
          password_confirmation:toPostPracticeUser.password_confirmation,
          title:toPostPracticeUser.title,
          first_name:toPostPracticeUser.first_name,
          last_name:toPostPracticeUser.last_name,
          suffix:toPostPracticeUser.suffix,
          practice_role:toPostPracticeUser.practice_role,
          surgery_id:toPostSurgeryID
        })
        alert('New Practice User Created')

      }catch(err){
        console.log("index put locum detail compliance documents error");
        alert('Something went wrong!')
      }
    }
  }
};
</script>

<style>
</style>
