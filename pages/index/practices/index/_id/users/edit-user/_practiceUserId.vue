<template>
  <div class="fixed lg:absolute pin-t pin-b pin-r pin-l flex flex-col overflow-x-hidden overflow-y-auto">
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
                class="bg-sunglow hover:bg-yellow-dark rounded-lg py-3 px-4 text-black text-sm"
                @click="tab1=true,tab2=false"
              >
                <strong>General</strong>
              </button>
            </div>
            <div class="my-1 px-1 overflow-hidden">
              <button
                class="bg-sunglow hover:bg-yellow-dark rounded-lg py-3 px-4 text-black text-sm"
                @click="tab2=true,tab1=false"
              >
                <strong>Change Password</strong>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex sm:p-2">
        <div v-if="tab1"
          class="flex text-white bg-waterloo m-4 py-2 px-3 shadow rounded-lg text-sm w-full md:w-3/5 lg:w-2/5"
        >
          <div class="w-full overflow-hidden text-grey-light text-sm p-2">
            
            <div class="flex py-1">E-Mail Address 
              <span v-if="formError.emailError" class="bg-red p-1 ml-4 -mt-1 rounded float-right">{{formError.emailError}}</span>
            </div>
            <input
              class="appearance-none bg-transparent border-b w-full text-white mr-3 mb-3 py-3 px-2 leading-tight focus:outline-none"
              :class="`${toPutPracticeUser.email !== '' ? 'focus:border-orange' :'focus:border-red'}`"
              type="text"
              placeholder="example@example.com"
              v-model='toPutPracticeUser.email'
              @blur="processEmail(toPutPracticeUser.email)"
              aria-label="Email"
            >
            <p class="flex py-1">Title</p>
            <input
              class="appearance-none bg-transparent border-b w-full text-white mr-3 mb-3 py-3 px-2 leading-tight focus:outline-none focus:border-orange"
              type="text"
              v-model="toPutPracticeUser.title"
              placeholder="Mr. / Mrs. / Dr. / etc....."
              aria-label="Title"
            >
            <div class="flex py-1">First Name
              <span v-if="!toPutPracticeUser.first_name" class="bg-red p-1 ml-4 rounded">Please enter your First Name</span>
            </div>
            <input
              class="appearance-none bg-transparent border-b w-full text-white mr-3 mb-3 py-3 px-2 leading-tight focus:outline-none"
              :class="`${toPutPracticeUser.first_name !== '' ? 'focus:border-orange' :'focus:border-red'}`"
              type="text"
              v-model="toPutPracticeUser.first_name"
              placeholder="Jane"
              aria-label="First Name"
            >
            <div class="flex py-1">Last Name 
              <span v-if="!toPutPracticeUser.last_name" class="bg-red p-1 ml-4 rounded">Please enter your Last Name</span>
            </div>
            <input
              class="appearance-none bg-transparent border-b w-full text-white mr-3 mb-3 py-3 px-2 leading-tight focus:outline-none"
              :class="`${toPutPracticeUser.last_name !== '' ? 'focus:border-orange' :'focus:border-red'}`"
              type="text"
              v-model="toPutPracticeUser.last_name"
              placeholder = "Doe"
              aria-label="Last name"
            > 
            <p class="flex py-1">Suffix</p>
            <input
              class="appearance-none bg-transparent border-b w-full text-white mr-3 mb-3 py-3 px-2 leading-tight focus:outline-none focus:border-orange"
              type="text"
              v-model="toPutPracticeUser.suffix"
              placeholder="Ph.D"
              aria-label="Suffix"
            >
            <div class="flex py-1">Role 
              <span v-if="!toPutPracticeUser.practice_role" class="bg-red p-1 ml-4 rounded">Required</span>
            </div>
            <select
              class="block appearance-none text-black w-full bg-white border border-grey-light hover:border-grey px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none "
              :class="`${toPutPracticeUser.practice_role !== '' ? 'focus:border-orange': 'focus:border-red'}`"
              v-model="toPutPracticeUser.practice_role"
            >
              <option>Partner</option>
              <option>Practice Manager</option>
              <option>Practice Staff</option>
            </select>
            <p class="flex py-1">Sign-Up verified by e-mail</p>
            <p class="p-2">{{specificPracticeUser.email ? specificPracticeUser.email_verified_at: 'Not yet verified'}}</p>
            <p class="flex py-1">Status</p>
            <select
              class="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none"
              v-model="toPutPracticeUser.status"
            >
              <option>Active</option>
              <option>Disabled</option>
            </select>
            <button
              class="bg-sunglow hover:bg-yellow-dark rounded-lg mt-3 py-3 px-4 text-black text-sm"
              @click.prevent ="checkForm(specificPracticeUser.id,toPutPracticeUser)"
            >Save Changes</button>
          </div>

            
        </div>
        <div v-if="tab2" class="flex text-white">
          <div class="flex text-white text-sm bg-waterloo m-4 py-2 px-3 shadow rounded-lg">
            <div class="overflow-hidden text-grey-light text-sm p-2">
              <div v-if="errorPass[0]" class="p-2 rounded text-black bg-sunglow mb-2">
                {{errorPass[0]}}
              </div>
              <div class="flex py-1">New Password
                <span v-if="!toChangePassword.newPassword" class="bg-red p-1 ml-4 rounded">Required</span>
              </div>
              <input
                class="appearance-none bg-transparent border-b w-full text-white mr-3 mb-3 py-3 px-2 leading-tight focus:outline-none"
                :class="`${toChangePassword.newPassword !== '' ? 'focus:border-orange' :'focus:border-red'}`"
                type="password"
                aria-label="oldpassword"
                v-model="toChangePassword.newPassword"
              >
              <div class="flex py-1">Confirm New Password
                <span v-if="!toChangePassword.confirmNewPassword" class="bg-red p-1 ml-4 rounded">Required</span>
              </div>
              <input
                class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
                :class="`${toChangePassword.confirmNewPassword !== '' ? 'focus:border-orange' :'focus:border-red'}`"
                type="password"
                aria-label="newpassword"
                v-model="toChangePassword.confirmNewPassword"
              >
              <button
                class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow float-left"
                @click.prevent="checkPasswordInfo(specificPracticeUser.id,toChangePassword)"
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
      formError:{}, 
      errors:[],
      errorPass:[],
      userTabs: 0, 
      tab1: true, 
      tab2: false,
      specificPracticeUser:[],
      specificPractice:[],
      toPutPracticeUser:{},
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
        specificPractice,
        toPutPracticeUser:{
          email:specificPracticeUser.email,
          title:specificPracticeUser.personal_detail.title,
          first_name:specificPracticeUser.personal_detail.first_name,
          last_name:specificPracticeUser.personal_detail.last_name,
          suffix:specificPracticeUser.personal_detail.suffix,
          practice_role:specificPracticeUser.practice_detail.practice_role,
          status:specificPracticeUser.status
        },    
      }

    }catch(err){
      console.log("index practice user index create asyncData err", err);
    } 
  },

 

  methods: {
    processForm:function(userInfo){
      if(!userInfo.first_name){
        this.formError.fnameError = "Please Input your First Name"
      }
      if(!userInfo.last_name){
        this.formError.lnameError = "Please input your Last Name"
      }
      
    },
    processEmail:function(inputEmail){
      this.formError = {
        emailError:''
      }
      if(!inputEmail) {
       this.formError.emailError = "Required"
      } else if(!this.validEmail(inputEmail)) {
       this.formError.emailError = "Please input a Valid E-Mail Address"       
      }
    },

    checkForm:function(uID,userInfo) {
      this.errors = []
      if(!userInfo.first_name){
        this.errors.push("Please input your First Name.")
      }
      if(!userInfo.last_name){
        this.errors.push("Please input your Last Name")
      }
      if(!userInfo.email) {
        this.errors.push("Please input your E-mail")
      } else if(!this.validEmail(userInfo.email)) {
        this.errors.push("Please input a Valid E-Mail Address")        
      }
      if(!this.errors.length){
        
        this.toPutPracticeUserInfo(uID,userInfo)
      }

    },

    validEmail:function(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      console.log("whatthefuuuuuukkk")
      return re.test(email);
    },
    

    checkPasswordInfo:function(uID,changePass){
      this.errorPass = [];     

      if(!changePass.newPassword){
        changePass.newPassword = ''
        this.errorPass.push("Please type your new password.")
      }
      if(!changePass.confirmNewPassword){
        changePass.confirmNewPassword = ''
        this.errorPass.push("Please type again your new password.")
      }
      if(changePass.confirmNewPassword !== changePass.newPassword){
        this.errorPass.push("Please ensure that inputted passwords match.")
      }
      if(changePass.newPassword.length < 6 || changePass.confirmNewPassword < 6){
        this.errorPass.push("Password must be at least 6 characters")
      }
      if(!this.errorPass.length){
        this.toChangeUserPassword(uID,changePass)
      }

    },

    async toPutPracticeUserInfo(userID,toPutPracticeUser){
      try{
        await this.$axios.put(`/api/v1/admin/practice-users/${userID}`,{
          email:toPutPracticeUser.email,
          title:toPutPracticeUser.title,
          first_name:toPutPracticeUser.first_name,
          last_name:toPutPracticeUser.last_name,
          suffix:toPutPracticeUser.suffix,
          practice_role:toPutPracticeUser.practice_role,
          status:toPutPracticeUser.status
        })
        // alert('Saved')
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'alert', text: 'Saved Changes' })
      }catch(err){
        // alert('Something went wrong!')
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
        console.log("index put locum detail compliance documents error", err);
      }
    },

    async toChangeUserPassword(userID,toChangePassword){
      try{
        console.log(toChangePassword.newPassword)
        console.log(toChangePassword.confirmNewPassword)
        await this.$axios.put(`/api/v1/admin/users/${userID}/change-password`,{
          password:toChangePassword.newPassword,
          password_confirmation:toChangePassword.confirmNewPassword
        })
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'alert', text: 'Saved Changes' })
        // alert('Saved')
      }catch(err){
        // alert('Something went wrong!')
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
        console.log("index put locum detail compliance documents error",err);
      }
    },

  },

};
</script>

<style>
</style>
