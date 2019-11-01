<template>
  <div class="admin-user-modal p-4 md:p-8 shadow-lg text-white">
    <div @click="goBack()" class="cursor-pointer">
      <svgicon name="arrow-left-solid" height="32" widht="32" class="text-white hover:text-sunglow fill-current"/>
    </div>
    <div class="flex flex-col rounded-lg my-2">
      <div class="w-full overflow-hidden">
        <div class="flex flex-wrap -mx-1 overflow-hidden">
          <div class="my-1 px-1 overflow-hidden">
            <button
              class="rounded-lg py-3 px-4 text-black text-sm"
              :class="tab1 === true ? 'bg-sunglow hover:bg-yellow-500' : 'text-white'"
              @click="tab1=true,tab2=false"
            >
              <strong>User Info</strong>
            </button>
          </div>
          <div v-if="authAdminPermissions.includes('Edit Admin Account')" class="my-1 px-1 overflow-hidden">
            <button
              class="rounded-lg py-3 px-4 text-black text-sm"
              :class="tab2 === true ? 'bg-sunglow hover:bg-yellow-500' : 'text-white'"
              @click="tab2=true,tab1=false"
            >
              <strong>Edit Info</strong>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- tab 1 VIEW -->
    <div v-if="tab1" class="flex text-white bg-waterloo my-2 p-2 shadow rounded-lg text-sm w-full md:w-3/5 lg:w-2/5">
      <div class="w-full overflow-hidden text-gray-300 leading-tight text-sm p-2">
        <p class="font-semibold">E-mail Address</p>
        <p class="mx-1 mb-2">{{user.email}}</p>
        <p class="font-semibold">Name</p>
        <p class="mx-1 mb-2">{{user.personal_detail.name}}</p>
        <p class="font-semibold">Role</p>
        <p class="mx-1">{{user.admin_detail ? user.admin_detail.role.name : 'N/A'}}</p>

      </div>
    </div>

    <!-- tab 2 EDIT -->
    <div v-if="tab2 && authAdminPermissions.includes('Edit Admin Account')"
      class="flex text-white bg-waterloo my-2 p-2 shadow rounded-lg text-sm w-full md:w-3/5 lg:w-2/5">
      <div class="w-full overflow-hidden text-gray-300 text-sm p-2">
        <div class="flex items-center justify-between  whitespace-no-wrap flex-wrap">E-Mail Address 
            <span v-if="formError.emailError" class="bg-red-500 px-2 py-1 rounded leading-none">{{formError.emailError}}</span>
        </div>
        <input
          class="appearance-none bg-transparent border-b w-full text-white mr-3 mb-3 py-3 px-2 leading-tight focus:outline-none"
          :class="`${toPutAdminUser.email !== '' ? 'focus:border-sunglow' :'focus:border-red-500'}`"
          type="text"
          placeholder="example@example.com"
          v-model='toPutAdminUser.email'
          @blur="processEmail(toPutAdminUser.email)"
          aria-label="Email"
        >
        <label>Title</label>
        <input
          class="appearance-none bg-transparent border-b w-full text-white mr-3 mb-3 py-3 px-2 leading-tight focus:outline-none focus:border-sunglow"
          type="text"
          v-model="toPutAdminUser.title"
          placeholder="Mr. / Mrs. / Dr. / etc....."
          aria-label="Title"
        >
        <div class="flex items-center justify-between  whitespace-no-wrap flex-wrap">First Name
            <span v-if="!toPutAdminUser.first_name" class="bg-red-500 px-2 py-1 rounded leading-none">Please enter your First Name</span>
        </div>
        <input
          class="appearance-none bg-transparent border-b w-full text-white mr-3 mb-3 py-3 px-2 leading-tight focus:outline-none"
          :class="`${toPutAdminUser.first_name !== '' ? 'focus:border-sunglow' :'focus:border-red-500'}`"
          type="text"
          v-model="toPutAdminUser.first_name"
          placeholder="Jane"
          aria-label="First Name"
        >
        <div class="flex items-center justify-between  whitespace-no-wrap flex-wrap">Last Name 
          <span v-if="!toPutAdminUser.last_name" class="bg-red-500 px-2 py-1 rounded leading-none">Please enter your Last Name</span>
        </div>
        <input
          class="appearance-none bg-transparent border-b w-full text-white mr-3 mb-3 py-3 px-2 leading-tight focus:outline-none"
          :class="`${toPutAdminUser.last_name !== '' ? 'focus:border-sunglow' :'focus:border-red-500'}`"
          type="text"
          v-model="toPutAdminUser.last_name"
          placeholder = "Doe"
          aria-label="Last name"
        > 
        <label>Suffix</label>
        <input
          class="appearance-none bg-transparent border-b w-full text-white mr-3 mb-3 py-3 px-2 leading-tight focus:outline-none focus:border-sunglow"
          type="text"
          v-model="toPutAdminUser.suffix"
          placeholder="Ph.D"
          aria-label="Suffix"
        >
        
        <div class="flex items-center justify-between  whitespace-no-wrap flex-wrap">New Password
          <span v-if="!toPutAdminUser.password" class="bg-red-500 px-2 py-1 rounded leading-none">Required</span>
        </div>
        <input
          class="appearance-none bg-transparent border-b w-full text-white mr-3 mb-3 py-3 px-2 leading-tight focus:outline-none"
          :class="`${toPutAdminUser.password !== '' ? 'focus:border-sunglow' :'focus:border-red-500'}`"
          type="password"
          aria-label="oldpassword"
          v-model="toPutAdminUser.password"
        >
        <div class="flex items-center justify-between  whitespace-no-wrap flex-wrap">Confirm New Password
          <span v-if="!toPutAdminUser.password_confirmation" class="bg-red-500 px-2 py-1 rounded leading-none">Required</span>
        </div>
        <input
          class="appearance-none bg-transparent border-b w-full text-white mr-3 mb-3 py-3 px-2 leading-tight focus:outline-none"
          :class="`${toPutAdminUser.password_confirmation !== '' ? 'focus:border-sunglow' :'focus:border-red-500'}`"
          type="password"
          aria-label="newpassword"
          v-model="toPutAdminUser.password_confirmation"
        >
        <div class="flex items-center justify-between  whitespace-no-wrap flex-wrap">Role
          <span v-if="!toPutAdminUser.role_id" class="bg-red-500 px-2 py-1 rounded leading-none">Required</span>
        </div>
        <select 
          v-model="toPutAdminUser.role_id"
          class="appearance-none w-full mb-4 bg-transparent border-b border-gray-300 px-4 py-2 pr-8 leading-tight focus:outline-none"
          :class="`${toPutAdminUser.role_id !== '' ? 'focus:border-sunglow' :'focus:border-red-600'}`"
        >
          <option value disabled selected>Select Role</option>
          <option v-for="(role, index) in adminRoles "
          :key="index"
          :value="role.id">
            {{ role.name }}
          </option>
        </select>
        <button
          class="bg-sunglow hover:bg-yellow-500 rounded-lg mt-3 py-3 px-4 text-black font-semibold text-sm focus:outline-none"
          @click.prevent ="checkForm(user.id,toPutAdminUser)"
          >Save Changes</button>
      </div>
    </div>
   
  </div>
</template>
<script>
export default {
  data(){
    return{
      user:'',
      adminRoles: [],
      formError:{}, 
      errors:[],
      errorPass:[],
      tab1:true,
      tab2:false,
      toPutAdminUser:{
        email:'',
        password:'',
        password_confirmation:'',
        title:'',
        first_name:'',
        last_name:'',
        suffix:'',
        role_id:''
      },
    }
  },

  async asyncData({app, store, route}){
    try{
      let response = await app.$axios.$get(`/api/v1/admin/admin-users/${route.params.id}`)
      const user = response.data.user
      response = await app.$axios.$get(`/api/v1/admin/admin-roles`)
      const adminRoles = response.data.roles
      console.log(" admin" ,adminRoles)
      return{
        user,
        toPutAdminUser:{
            email:user.email
        },
        adminRoles
      }
    }catch(err){
      store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
      console.log('get admin user error!!!', err)
    }
  },
  computed:{
    authAdminPermissions() {
      return this.$store.getters["auth/permissions"]
    },
  },
  methods:{
    getAdminUsers(){
      this.$store.dispatch("adminusers/fetchAdminUsers",{})
      this.$store.dispatch("adminusers/fetchAdminUsers",{
        limit:8
      })
    },
    goBack(){
      const query = {
        ...this.$route.query
      }
      this.$router.push({path:'/user-management',query})
    },
    processForm(userInfo){
      if(!userInfo.first_name){
        this.formError.fnameError = "Please Input your First Name"
      }
      if(!userInfo.last_name){
        this.formError.lnameError = "Please input your Last Name"
      }
    },
    processEmail(inputEmail){
      this.formError = {
        emailError:''
      }
      if(!inputEmail) {
        this.formError.emailError = "Required"
      } else if(!this.validEmail(inputEmail)) {
        this.formError.emailError = "Please input a Valid E-Mail Address"       
      }
    },

    checkForm(uID,userInfo) {
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
      if(!userInfo.password){
        userInfo.password = ''
        this.errors.push("Please type your new password.")
      }
      if(!userInfo.password_confirmation){
        userInfo.password_confirmation = ''
        this.errors.push("Please type again your new password.")
      }
      if(userInfo.password_confirmation !== userInfo.password){
        this.errors.push("Please ensure that inputted passwords match.")
      }
      if(userInfo.password.length < 6 || userInfo.password_confirmation < 6){
        this.errors.push("Password must be at least 6 characters")
      }
      if(!this.errors.length){
        this.toPutAdminUserInfo(uID,userInfo)
      }
    },

    validEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },

    async toPutAdminUserInfo(user_id, toPutUserInfo){
      console.log('to admin user',toPutUserInfo)
      await this.$axios.$put(`/api/v1/admin/admin-users/${user_id}`,toPutUserInfo).then(()=>{
        this.$store.commit('SET_NOTIFICATION',{ enabled: true, status:'success', text:'Edit Admin User Success!'})
      }).catch((err)=>{
        console.log('edit admin user error!',err)
        this.$store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
      })
      await this.getAdminUsers()
    }
  }
}
</script>
<style>
.admin-user-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.admin-user-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px orange;
  transition: all 0.3s ease-in-out;
  background-color:#505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .admin-user-modal {
    width: 80%;
  }
}
</style>