<template>
  <div class="flex justify-between text-sm text-white py-4 px-4">
    <div>
      Welcome to Hubzz!!!!!
      It seems like this is your first time logging in to HQ.
      We request you to change your password for security purposes.
      <div @click="goTo()" class="p-2 bg-red-500 cursor-pointer">
        change password now
      </div>
      
      <div @click="$emit('close')" class="p-2 bg-green-500 cursor-pointer">
        remind me later
      </div>
    </div>
    
  </div>
</template>
<script>
export default {
  props:[],
  data(){
    return{

    }
  },
  created(){

  },
  methods:{ 
    goTo(){
      this.$router.push('/account')
    }
  },
}
</script>

<style>

</style>