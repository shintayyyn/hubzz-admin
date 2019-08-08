<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
        <div class="flex justify-between text-sm text-white py-2 px-6">
            <div @click="$emit('close')" class="cursor-pointer">
                <svgicon name="arrow-left-solid" height="32" width="32" class="text-white fill-current"/>
            </div>
        </div>
        
        <div class="ml-4">
            <div class="text-white pl-4 pt-2">
                <strong>Create User</strong>
            </div>
            <div class="flex text-white bg-waterloo m-4 py-2 px-3 shadow rounded-lg text-sm sm:w-max lg:w-1/2">
                <div class="w-full overflow-hidden text-grey-light text-sm p-2">
                    <div v-if="errors[0]" class="p-2 rounded text-black bg-sunglow mb-2">
                        {{errors[0]}}
                    </div>
                    <p class="flex">Title</p>
                    <input
                        class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-orange"
                        type="text"
                        placeholder="Mr. / Mrs. / Dr. / etc....."
                        v-model='toPostPracticeUser.title'
                        aria-label="Title"
                    >
                    <div class="flex py-1">First Name
                        <span v-if="firstNameError" class="bg-red p-1 ml-4 rounded">{{firstNameError}}</span>
                    </div>
                    <input
                        class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
                        :class="`${toPostPracticeUser.first_name !== '' ? 'focus:border-orange' :'focus:border-red'}`"
                        type="text"
                        placeholder="Jane"
                        v-model='toPostPracticeUser.first_name'
                        @blur="verifyFirstName(toPostPracticeUser.first_name)"
                        aria-label="First Name"
                    >
                    <div class="flex py-1">Last Name
                        <span v-if="lastNameError" class="bg-red p-1 ml-4 rounded">{{lastNameError}}</span>
                    </div>
                    <input
                        class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
                        :class="`${toPostPracticeUser.last_name !== '' ? 'focus:border-orange' :'focus:border-red'}`"
                        type="text"
                        v-model='toPostPracticeUser.last_name'
                        @blur="verifyLastName(toPostPracticeUser.last_name)"
                        placeholder="Doe"
                        aria-label="Last Name"
                    >
                    <p class="flex">Suffix</p>
                    <input
                        class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
                        type="text"
                        placeholder="Ph.D"
                        v-model='toPostPracticeUser.suffix'
                        aria-label="Suffix"
                    >
                    <div class="flex py-1">Role
                        <span v-if="!toPostPracticeUser.practice_role" class="bg-red p-1 ml-4 rounded">Required</span>
                    </div>
                    <select
                        class="appearance-none w-full mb-4 bg-white border-b border-grey-light hover:border-grey px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                        :class="`${toPostPracticeUser.practice_role !== '' ? 'focus:border-orange' :'focus:border-red'}`"
                        v-model='toPostPracticeUser.practice_role'
                    >
                        <option>Partner</option>
                        <option>Practice Manager</option>
                        <option>Practice Staff</option>
                    </select>
                    <div class="flex py-1">E-Mail Address 
                        <span v-if="emailError" class="bg-red p-1 ml-4 -mt-1 rounded">{{emailError}}</span>
                    </div>
                    <input
                        class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
                        :class="`${toPostPracticeUser.email !== '' ? 'focus:border-orange' :'focus:border-red'}`"
                        id="email"
                        type="text"
                        v-model='toPostPracticeUser.email'
                        @blur="verifyEmail(toPostPracticeUser.email)"
                        placeholder="example@example.com"
                    >
                    <div class="flex py-1">Password
                        <span v-if="passwordError" class="bg-red p-1 ml-4 rounded">{{passwordError}}</span>
                    </div>
                    <input
                        class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
                        :class="`${toPostPracticeUser.password !== '' ? 'focus:border-orange' :'focus:border-red'}`"
                        type="password"
                        v-model='toPostPracticeUser.password'
                        @blur="verifyPassword(toPostPracticeUser.password)"
                        placeholder="Password"
                    >
                    <div class="flex py-1">Confirm Password
                        <span v-if="confirmPasswordError" class="bg-red p-1 ml-4 rounded">{{confirmPasswordError}}</span>
                    </div>
                    <input
                        class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
                        :class="`${toPostPracticeUser.password_confirmation !== '' ? 'focus:border-orange' :'focus:border-red'}`"
                        type="password"
                        v-model='toPostPracticeUser.password_confirmation'
                        @blur="verifyConfirmPassword(toPostPracticeUser.password, toPostPracticeUser.password_confirmation)"
                        placeholder="Password"
                    >
                    <button
                        class="inline-flex no-underline  py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg float-left"
                        @click.prevent="checkForm(toPostPracticeUser,surgery.id)"
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
    props:["surgery"],
    data(){
        return{
            emailError:'',
            firstNameError:'',
            lastNameError:'',
            passwordError:'',
            confirmPasswordError:'',
            errors:[],
            specificSurgery:[],
            specificPractice:[],
            toPostPracticeUser:{
                email:'',
                password:'',
                password_confirmation:'',
                title:'',
                first_name:'',
                last_name:'',
                suffix:'',
                practice_role:'Partner',
                surgery_id:''
            }
        }
  },
  

  methods:{
    verifyEmail:function(inputEmail){
      this.emailError = ''
      
      if(!inputEmail) {
       this.emailError = "Required"
      } else if(!this.validEmail(inputEmail)) {
       this.emailError = "Please input a Valid E-Mail Address"       
      }
    },
    verifyFirstName:function(inputFirstName){
      this.firstNameError = ''

      if(!inputFirstName){
        this.firstNameError = 'Required'
      }
    },
    verifyLastName:function(inputLastName){
      this.lastNameError = ''

       if(!inputLastName){
        this.lastNameError = 'Required'
      }
    },

    verifyPassword:function(inputPassword){
      this.passwordError = ''

      if(!inputPassword){
        this.passwordError = "Please type your password."
        console.log('lolwut')
      }else if(inputPassword < 6){
        this.passwordError = "Password must be at least 6 characters"
        console.log('ur mom is so ugly that everybody died')
      }
    },
    
    verifyConfirmPassword:function(inputPassword, inputConfirmPassword){
      this.confirmPasswordError = ''
      
      if(!inputConfirmPassword){
        this.confirmPasswordError = "Please type again your new password."
        console.log('lolwut')
      }else if(inputConfirmPassword !== inputPassword){
        this.confirmPasswordError = "Passwords do not match"
        console.log('i wanna die')
      }else if(inputPassword < 6 || inputConfirmPassword < 6){
        this.confirmPasswordError = "Password must be at least 6 characters"
        console.log('ur mom is so ugly that everybody died')
      }
    },

    checkForm:function(userInfo,surgID) {
      this.errors = [];
      if(!userInfo.first_name){
        this.errors.push("Please input your First Name.")
      }

      if(!userInfo.last_name){
        this.errors.push("Please input your Last Name")
      }

      if(!userInfo.email) {
        this.errors.push("Please input your E-mail");
      } else if(!this.validEmail(userInfo.email)) {
        this.errors.push("Please input a Valid E-Mail Address");        
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
        this.toPostPracticeUserInfo(userInfo,surgID)
      }

    },

    validEmail:function(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    

    async toPostPracticeUserInfo(toPostPracticeUser,toPostSurgeryID){
      try{
        await this.$axios.post(`/api/v1/admin/practice-users`,{
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
        // alert('New Practice User Created')
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'New Practice User Created' })

      }catch(err){
        console.log("index put locum detail compliance documents error.",err);
        alert('Something went wrong!')
      }
    }
  }
};
</script>

<style>

</style>
