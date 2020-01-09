<template>
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout mt-4">
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link :to="{path:`/practices/${practice.id}/practice-users`,query:$route.query}" class="text-white p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="text-white hover:text-sunglow fill-current"/>
        </nuxt-link>
      </div>
      <!-- TABS -->
      <div class="flex flex-col rounded-lg pl-6">
        <div class="w-full overflow-hidden">
          <div class="flex flex-wrap -mx-1 overflow-hidden">
            <div class="my-1 px-1 overflow-hidden">
              <button
                class="rounded-lg py-3 px-4 text-sm"
                :class="tab1 === true ? 'bg-sunglow hover:bg-yellow-500 text-black' : 'text-white'"
                @click="tab1=true,tab2=false"
              >
                <strong>General</strong>
              </button>
            </div>
            <div v-if="authAdminPermissions.includes('Edit Practice User')" class="my-1 px-1 overflow-hidden">
              <button
                class="rounded-lg py-3 px-4 text-sm"
                :class="tab2 === true ? 'bg-sunglow hover:bg-yellow-500 text-black' : 'text-white'"
                @click="tab2=true,tab1=false"
              >
                <strong>Change Password</strong>
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- TABS END HERE -->

      <div class="flex sm:p-2 max-w-lg">
        <!-- TAB 1 -->
        <div v-if="tab1" class="flex text-white bg-waterloo m-4 py-2 px-3 shadow rounded-lg text-sm w-full">
          <div v-if="authAdminPermissions.includes('Edit Practice User')" class="w-full overflow-hidden text-gray-300 text-sm p-2">
            
            
            <div class="flex py-1">E-Mail Address</div>
            <input
              class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
              :class="errorMessage('email') ? 'border-red-800' :'focus:border-yellow'"
              type="text"
              placeholder="example@example.com"
              v-model='toPutPracticeUser.email'
					    @blur="CheckEmptyField(toPutPracticeUser.email, 'email')"
              aria-label="Email"
            >
            <div v-if="formError.filter(item => item.field === 'email')"
              class="text-red-800 text-xs capitalize pt-1"
            >
              {{ errorMessage("email") }}
            </div>

            <p class="flex py-1">Title</p>
            <input
              class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none focus:border-yellow"
              type="text"
              v-model="toPutPracticeUser.title"
              placeholder="Mr. / Mrs. / Dr. / etc....."
              aria-label="Title"
            >
            
            
            <div class="flex py-1">First Name</div>
            <input
              class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
              :class="errorMessage('first_name') ? 'border-red-800' :'focus:border-yellow'"
              type="text"
              v-model="toPutPracticeUser.first_name"
              placeholder="Jane"
              aria-label="First Name"
					    @blur="CheckEmptyField(toPutPracticeUser.first_name, 'first_name')"
            >
            <div v-if="formError.filter(item => item.field === 'first_name')"
              class="text-red-800 text-xs capitalize pt-1"
            >
              {{ errorMessage("first_name") }}
            </div>
            
            
            <div class="flex py-1">Last Name</div>
            <input
              class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
              :class="errorMessage('last_name') ? 'border-red-800' :'focus:border-yellow'"
              type="text"
              v-model="toPutPracticeUser.last_name"
              placeholder = "Doe"
              aria-label="Last name"
					    @blur="CheckEmptyField(toPutPracticeUser.last_name, 'last_name')"
            >
            <div v-if="formError.filter(item => item.field === 'last_name')"
              class="text-red-800 text-xs capitalize pt-1"
            >
              {{ errorMessage("last_name") }}
            </div>


            <p class="flex py-1">Suffix</p>
            <input
              class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none focus:border-yellow"
              type="text"
              v-model="toPutPracticeUser.suffix"
              placeholder="Ph.D"
              aria-label="Suffix"
            >
            
            
            <div class="flex py-1">Role</div>
            <select
              class="block appearance-none text-black w-full bg-white border border-gray-300 hover:border-gray px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none "
              :class="errorMessage('practice_role') ? 'border-red-800' :'focus:border-yellow'"
              v-model="toPutPracticeUser.practice_role"
					    @blur="CheckEmptyField(toPutPracticeUser.practice_role, 'practice_role')"
            >
              <option>Partner</option>
              <option>Practice Manager</option>
              <option>Practice Staff</option>
            </select>
            <div v-if="formError.filter(item => item.field === 'practice_role')"
              class="text-red-800 text-xs capitalize pt-1"
            >
              {{ errorMessage("practice_role") }}
            </div>


            <p class="flex py-1">Sign-Up verified by e-mail</p>
            <p class="p-2" :class="user.email && 'bg-waterloo-light rounded'">{{user.email ? $moment(user.email_verified_at).format('ddd, YYYY MMM DD, HH:MM A'): 'Not yet verified'}}</p>
            <p class="flex py-1">Status</p>
            <select
              class="text-black block appearance-none w-full bg-white border border-gray-300 hover:border-gray-300 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none"
              :class="errorMessage('status') ? 'border-red-800' :'focus:border-yellow'"
              v-model="toPutPracticeUser.status"
					    @blur="CheckEmptyField(toPutPracticeUser.status, 'status')"
            >
              <option>Active</option>
              <option>Disabled</option>
            </select>
            <div v-if="formError.filter(item => item.field === 'status')"
              class="text-red-800 text-xs capitalize pt-1"
            >
              {{ errorMessage("status") }}
            </div>

            <button
              class="bg-sunglow font-semibold hover:bg-yellow-500 rounded-lg mt-3 py-3 px-4 text-black text-sm"
              @click.prevent ="checkForm(user.id,toPutPracticeUser)"
            >Save Changes</button>
          </div>
          <div v-if="!authAdminPermissions.includes('Edit Practice User')" class="w-full overflow-hidden text-gray-400 text-sm p-2">
            <div class="flex py-2">E-Mail Address</div>
            <div class="flex px-2 text-white">{{toPutPracticeUser.email}}</div>
            <div class="flex py-2">Title</div>
            <div class="flex px-2 text-white">{{toPutPracticeUser.title ? toPutPracticeUser.title : 'N/A' }}</div>
            <div class="flex py-2">First Name</div>
            <div class="flex px-2 text-white">{{toPutPracticeUser.first_name ? toPutPracticeUser.first_name : 'N/A' }}</div>
            <div class="flex py-2">Last Name</div>
            <div class="flex px-2 text-white">{{toPutPracticeUser.last_name ? toPutPracticeUser.last_name : 'N/A' }}</div>
            <div class="flex py-2">Suffix </div>
            <div class="flex px-2 text-white">{{toPutPracticeUser.suffix ? toPutPracticeUser.suffix : 'N/A' }}</div>
            <div class="flex py-2">Role </div>
            <div class="flex px-2 text-white">{{toPutPracticeUser.practice_role ? toPutPracticeUser.practice_role : 'N/A' }}</div>
            <div class="flex py-2">Status </div>
            <div class="flex px-2 text-white">{{toPutPracticeUser.status ? toPutPracticeUser.status : 'N/A' }}</div>
          </div>
        </div>
        
        <!-- TAB 2 -->
        <div v-if="tab2" class="flex text-white w-full">
          <div class="flex text-white text-sm bg-waterloo m-4 py-2 px-3 shadow rounded-lg w-full">
            <div class="overflow-hidden text-gray-300 text-sm p-2 w-full">
              <div class="flex items-center py-1">New Password</div>
              <input
                class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
                :class="errorMessage('password') ? 'border-red-800' :'focus:border-yellow'"
                type="password"
                aria-label="password"
                v-model="toChangePassword.password"
					      @blur="CheckEmptyField(toChangePassword.password, 'password')"
              >
              <div v-if="formError.filter(item => item.field === 'password')"
                class="text-red-800 text-xs capitalize pt-1"
              >
                {{ errorMessage("password") }}
              </div>
              <div class="flex items-center py-1">Confirm New Password</div>
              <input
                class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
                :class="errorMessage('password_confirmation') ? 'border-red-800' :'focus:border-yellow'"
                type="password"
                aria-label="password_confirmation"
                v-model="toChangePassword.password_confirmation"
					      @blur="CheckEmptyField(toChangePassword.password_confirmation, 'password_confirmation')"
              >
              <div v-if="formError.filter(item => item.field === 'password_confirmation')"
                class="text-red-800 text-xs capitalize pt-1"
              >
                {{ errorMessage("password_confirmation") }}
              </div>
              <button
                class="inline-flex font-semibold no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow float-left"
                @click.prevent="checkPasswordInfo(user.id,toChangePassword)"
                >Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
</template>
<script>
export default {
  props:['user'],
  data(){
    return{
        practice:null,
        formError:[], 
        errors:[],
        errorPass:[],
        userTabs: 0, 
        tab1: true, 
        tab2: false,
        toPutPracticeUser:{},
        toChangePassword:{
            password:'',
            password_confirmation:''
        }
    }
  },
  created(){
    this.practice = this.user.practice_detail.practice,
    console.log("specificUserPractice",this.practice),
    this.toPutPracticeUser ={
        email:this.user.email,
        title:this.user.personal_detail.title,
        first_name:this.user.personal_detail.first_name,
        last_name:this.user.personal_detail.last_name,
        suffix:this.user.personal_detail.suffix,
        practice_role:this.user.practice_detail.practice_role,
        status:this.user.status
    },
    console.log("Route name: ",this.$route.name) 
  },
  computed: {
    authAdminPermissions() {
      return this.$store.getters["permissions"]
    },
  },
  watch: {
    "toPutPracticeUser.email"(value) {
      const error = this.ValidateEmail(value);
      if (error) {
        this.formError.push(error);
      } else {
        let index = this.formError.findIndex(item => item.field === "email");
        let errors = this.formError.filter(item => item.field === "email");
        if (index >= 0) {
          this.formError.splice(index, errors.length);
        }
      }
    },
    "toChangePassword.password"(value) {
      if (value && value.length < 6) {
        this.formError.push({
          field: "password",
          message: "Password Must Be Atleast 6 Characters"
        });
      } else {
        let index = this.formError.findIndex(
          item => item.message === "Password Must Be Atleast 6 Characters"
        );
        let error = this.formError.filter(
          item => item.message === "Password Must Be Atleast 6 Characters"
        );
        if (index >= 0) {
          this.formError.splice(index, error.length);
        }
      }
    },
    "toChangePassword.password_confirmation"(value) {
      const error = this.ValidateSamePassword(this.toChangePassword.password, value);
      if (error) {
        this.formError.push(error);
      } else {
        let index = this.formError.findIndex(
          item => item.field === "password_confirmation"
        );
        let errors = this.formError.filter(
          item => item.field === "password_confirmation"
        );
        if (index >= 0) {
          this.formError.splice(index, errors.length);
        }
      }
    }
  },
  methods: {
    errorMessage(field, message) {
			if (this.formError.find(error => error.field === field.toString())) {
				let error = this.formError.find(
					error => error.field === field.toString()
				);
				return message ? message : error.message;
			}
			return;
		},
    checkForm:function(uID,userInfo) {
      this.formError = []
      this.Validate(this.toPutPracticeUser, ["title", "suffix"])
      console.log("errrrer", this.formError)
      // if(!userInfo.first_name){
      //   this.errors.push("Please input your First Name.")
      // }
      // if(!userInfo.last_name){
      //   this.errors.push("Please input your Last Name")
      // }
      // if(!userInfo.email) {
      //   this.errors.push("Please input your E-mail")
      // } else if(!this.validEmail(userInfo.email)) {
      //   this.errors.push("Please input a Valid E-Mail Address")        
      // }
      if(!this.formError.length){
        
        this.toPutPracticeUserInfo(uID,userInfo)
      }

    },
    checkPasswordInfo:function(uID,changePass){
      this.Validate(this.toChangePassword)
      if(!this.formError.length){
        this.toChangeUserPassword(uID,changePass)
      }
    },

    async toPutPracticeUserInfo(userID,toPutPracticeUser){
      try{
        const response = await this.$axios.put(`/api/v1/admin/practice-users/${userID}`,{
          email:toPutPracticeUser.email,
          title:toPutPracticeUser.title,
          first_name:toPutPracticeUser.first_name,
          last_name:toPutPracticeUser.last_name,
          suffix:toPutPracticeUser.suffix,
          practice_role:toPutPracticeUser.practice_role,
          status:toPutPracticeUser.status
        })
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved Changes' })
      }catch(err){
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: err.response.data.message })
        console.log("index put locum detail compliance documents error", err);
      }
    },

    async toChangeUserPassword(userID,toChangePassword){
      try{
        console.log(toChangePassword.password)
        console.log(toChangePassword.password_confirmation)
        await this.$axios.put(`/api/v1/admin/users/${userID}/change-password`,{
          password:toChangePassword.password,
          password_confirmation:toChangePassword.password_confirmation
        })
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved Changes' })
      }catch(err){
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: err.response.data.message })
        console.log("index put locum detail compliance documents error",err);
      }
    },

  },

}
</script>
<style>

</style>