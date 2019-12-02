<template>
  <div class="admin-user-modal p-4 md:p-8 shadow-lg text-white ">
    <div @click="goBack()" class="cursor-pointer">
      <svgicon name="arrow-left-solid" height="32" widht="32" class="text-white hover:text-sunglow fill-current"/>
    </div>
    <div class="flex flex-col rounded-lg my-2">
      <div class="w-full overflow-hidden">
        <div class="flex flex-wrap -mx-1 overflow-hidden">
          <div class="my-1 px-1 overflow-hidden">
            <button
              class="rounded-lg py-3 px-4 text-black text-sm transition-hover"
              :class="tab1 === true ? 'bg-sunglow hover:bg-yellow-500' : 'text-white'"
              @click="tab1=true,tab2=false"
            >
              <strong>User Info</strong>
            </button>
          </div>
          <div v-if="authAdminPermissions.includes('Edit Admin Account')" class="my-1 px-1 overflow-hidden">
            <button
              class="rounded-lg py-3 px-4 text-black text-sm transition-hover"
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
      <div v-if="tab1" class="flex text-white bg-waterloo my-2 p-2 shadow rounded-lg text-sm max-w-lg transition-hover">
        <div class="w-full overflow-hidden text-gray-300 leading-tight text-sm p-2">
          <p class="font-semibold">E-mail Address</p>
          <p class="mx-1 mb-2">{{user.email}}</p>
          <p class="font-semibold">Name</p>
          <p class="mx-1 mb-2">{{user.personal_detail.name}}</p>
          <p class="font-semibold">Role</p>
          <div v-if="user.admin_detail.roles.length > 0">
            <p class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-500"
              v-for="adminRoles in user.admin_detail.roles"
                :key="adminRoles.id + '-name'">
                {{adminRoles ? adminRoles.name:null}}
            </p>
          </div>

        </div>
      </div>
       <!-- tab 2 EDIT -->
      <div v-if="tab2 && authAdminPermissions.includes('Edit Admin Account')"
        class="flex text-white bg-waterloo my-2 p-2 shadow rounded-lg text-sm max-w-lg transition-hover">
        <div class="w-full overflow-hidden text-gray-300 text-sm p-2">
          <div class="mb-3">
            <div>E-Mail Address </div>
            <input
              class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
              :class="errorMessage('email') ? 'border-red-800' :'focus:border-sunglow'"
              type="text"
              placeholder="example@example.com"
              v-model='toPutAdminUser.email'
              aria-label="Email"
              @blur="CheckEmptyField(toPutAdminUser.email, 'email')"
            >
            <span v-if="errorMessage('email')" class="text-red-800 text-xs leading-none capitalize">{{ errorMessage('email')}}</span>
          </div>
          <div class="mb-3">
            <label class="">Title</label>
            <input
              class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none focus:border-sunglow"
              type="text"
              v-model="toPutAdminUser.title"
              placeholder="Mr. / Mrs. / Dr. / etc....."
              aria-label="Title"
            >
          </div>
          <div class="mb-3">
            <div class="">First Name</div>
            <input
              class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
              :class="errorMessage('first_name') ? 'border-red-800' :'focus:border-sunglow'"
              type="text"
              v-model="toPutAdminUser.first_name"
              placeholder="Jane"
              aria-label="First Name"
              @blur="CheckEmptyField(toPutAdminUser.first_name, 'first_name')"
            >
            <span v-if="errorMessage('first_name')" class="text-red-800 text-xs leading-none capitalize">{{ errorMessage('first_name')}}</span>
          </div>
          <div class="mb-3">
            <div class="">Last Name</div>
            <input
              class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
              :class="errorMessage('last_name') ? 'border-red-800' :'focus:border-sunglow'"
              type="text"
              v-model="toPutAdminUser.last_name"
              placeholder = "Doe"
              aria-label="Last name"
              @blur="CheckEmptyField(toPutAdminUser.last_name, 'last_name')"
            > 
            <span v-if="errorMessage('last_name')" class="text-red-800 text-xs leading-none capitalize">{{ errorMessage('last_name')}}</span>
          </div>
          <div class="mb-3">
            <label>Suffix</label>
            <input
              class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none focus:border-sunglow"
              type="text"
              v-model="toPutAdminUser.suffix"
              placeholder="Ph.D"
              aria-label="Suffix"
            >
          </div>
          <div class="mb-3">
            <div class="">New Password</div>
            <input
              class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
              :class="errorMessage('password') ? 'border-red-800' :'focus:border-sunglow'"
              type="password"
              aria-label="oldpassword"
              v-model="toPutAdminUser.password"
              @blur="CheckEmptyField(toPutAdminUser.password, 'password')"
            >
            <span v-if="errorMessage('password', 'Enter your new password')" class="text-red-800 text-xs leading-none capitalize">{{errorMessage('password', 'Enter your new password')}}</span>
          </div>
          <div class="mb-3">
            <div class="">Confirm New Password</div>
            <input
              class="appearance-none bg-transparent border-b w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
              :class="errorMessage('password_confirmation') ? 'border-red-800' :'focus:border-sunglow'"
              type="password"
              aria-label="newpassword"
              v-model="toPutAdminUser.password_confirmation"
              @blur="CheckEmptyField(toPutAdminUser.password_confirmation, 'password_confirmation')"
            >
            <span v-if="errorMessage('password_confirmation')" class="text-red-800 text-xs leading-none capitalize">{{ errorMessage('password_confirmation')}}</span>
          </div>

          <div class="flex flex-col py-1 mt-2">
            <div class="relative pb-1">
              <span>Admin Role/s </span>
              <span class="text-xs">(hold ctrl + click to choose)</span>
            </div>
            <select
              class="w-full text-black focus:outline-none"
              multiple="true"
              v-bind:class="{ 'fix-height': multiple === 'true' }"
              v-model="toPutAdminUser.roles_id"
              @blur="
                CheckEmptyField(toPutAdminUser.roles_id, 'roles_id')
              "
            >
              <option
                class="px-2 py-1"
                v-for="item in adminRoles"
                :key="item.id"
                :value="item"
                >{{ item.label }}</option
              >
            </select>
            <div
              v-if="formError.filter(item => item.field === 'roles_id')"
              class="text-red-500 text-xs pt-1"
            >
              {{ errorMessage("roles_id") }}
            </div>
            <div class="flex items-start flex-wrap py-1">
              <div
                v-for="(practice_type, index) in toPutAdminUser.roles_id"
                :key="`practice_type-${index}`"
                class="inline-flex items-center mt-1 mr-2 bg-yellow-500 rounded-lg p-2 text-black"
              >
                {{toPutAdminUser.roles_id[index].label}}
              </div>
            </div> 
          </div>

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
      formError:[], 
      multiple: true,
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
        roles_id:[],
      },
    }
  },

  async asyncData({app, store, route}){
    try{
      let response = await app.$axios.$get(`/api/v1/admin/admin-users/${route.params.id}`)
      const user = response.data.user
      // response = await app.$axios.$get(`/api/v1/admin/admin-roles`)
      
      // const adminRoles = response.data.roles
      return{
        user,
        toPutAdminUser:{
            email:user.email,
            password:'',
            password_confirmation:'',
            title:'',
            first_name:'',
            last_name:'',
            suffix:'',
            roles_id:[],
        },
        // adminRoles
      }
    }catch(err){
      store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
      console.log('get admin user error!!!', err)
    }
  },
  async created() {
    await this.$axios.$get(`/api/v1/admin/admin-roles`).then(res => {
      res.data.roles.forEach(item => {
        this.adminRoles.push({value: item.id, label: item.name})
      })
      let default_role = res.data.roles.find((item, index) => index === 0)
    });
  },
  computed:{
    authAdminPermissions() {
      return this.$store.getters["auth/permissions"]
    },
  },
  watch: {
    "toPutAdminUser.email"(value) {
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
    "toPutAdminUser.password"(value) {
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
    "toPutAdminUser.password_confirmation"(value) {
      const error = this.ValidateSamePassword(this.toPutAdminUser.password, value);
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

    errorMessage(field, message) {
      if (this.formError.find(error => error.field === field.toString())) {
        let error = this.formError.find(
          error => error.field === field.toString()
        );
        return message ? message : error.message;
      }
      return;
    },

    checkForm(uID,userInfo) {
      console.log("error on save",userInfo)
      this.formError = []
      this.Validate(this.toPutAdminUser, ["title", "suffix"])

      if(!this.formError.length){
        this.toPutAdminUserInfo(uID,userInfo)
      }
    },

    validEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },

    async toPutAdminUserInfo(user_id, toPutUserInfo){
      console.log('to admin user',toPutUserInfo)
      toPutUserInfo.roles_id = toPutUserInfo.roles_id.map(
        item => item.value
      );
      await this.$axios.$put(`/api/v1/admin/admin-users/${user_id}`,toPutUserInfo).then(()=>{
        this.$store.commit('SET_NOTIFICATION',{ enabled: true, status:'success', text:'Edit Admin User Success!'})
      }).catch((err)=>{
        console.log('edit admin user error!',err)
        this.$store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
      })
      await this.getAdminUsers()
      this.$router.push('/user-management')
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
  border-left: solid 2px yellow;
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