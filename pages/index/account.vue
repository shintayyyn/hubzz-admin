<template>
    <div class="flex-1 flex flex-col overflow-hidden py-2 mx-6">
        <div class="text-4xl text-white">Account</div>
        <div class="flex flex-col rounded-lg pl-6">
            <div class="w-full overflow-hidden">
                <div class="flex flex-wrap -mx-1 overflow-hidden">
                    <div class="my-1 px-1 overflow-hidden">
                        <button
                            class="bg-sunglow hover:bg-yellow-500 rounded-lg py-3 px-4 text-black text-sm"
                            @click="tab1=true,tab2=false"
                        >
                            <strong>General</strong>
                        </button>
                    </div>
                    <div class="my-1 px-1 overflow-hidden">
                        <button
                            class="bg-sunglow hover:bg-yellow-500 rounded-lg py-3 px-4 text-black text-sm"
                            @click="tab2=true,tab1=false"
                        >
                            <strong>Change Password</strong>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex sm:p-2">
            <div v-if="tab1">
                <div class="w-full p-4 mt-4 mx-4 text-white bg-waterloo rounded-lg">
                    <div class="font-semibold">
                        E-Mail Address
                    </div>
                    <div class="text-sm m-4">
                        {{user.email}}
                    </div>
                </div>
            </div>
            <div v-if="tab2">
                 <div v-if="tab2" class="flex text-white">
                    <div class="flex text-white text-sm bg-waterloo m-4 py-2 px-3 shadow rounded-lg">
                        <div class="overflow-hidden text-gray-300 text-sm p-2">
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
                            @click.prevent="checkPasswordInfo(user.id,toChangePassword)"
                            >Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                user:'',
                tab1:true,
                tab2:false,
                errors:[],
                errorPass:[],
                toChangePassword:{
                    newPassword:'',
                    confirmNewPassword:''
                }
            }
        },
        async asyncData({app,route}){
            try{
                let response = await app.$axios.get(`/api/v1/admin/me`)
                const user = response.data.data.user
                return{
                    user
                }
            }catch(err){
                store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
                console.log("get user error",err)
            }
        },
        methods:{
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
            async toChangeUserPassword(userID,toChangePassword){
                try{
                    await this.$axios.put(`/api/v1/admin/users/${userID}/change-password`,{
                        password:toChangePassword.newPassword,
                        password_confirmation:toChangePassword.confirmNewPassword
                    })
                    this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'alert', text: 'Password Succesfully Changed' })
                    // alert('Saved')
                }catch(err){
                    // alert('Something went wrong!')
                    this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
                    console.log("change password error",err);
                }
            },
        }
        
    }
</script>
<style>
</style>