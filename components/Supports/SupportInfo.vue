<template>
    <div>
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white">
        <div @click="goBack()" class="text-white p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="text-white fill-current"/>
        </div>
      </div>
      <!-- HEADER -->
      
      <div class="flex flex-wrap overflow-hidden pl-4">
        <div class="text-xs text-white italic">
            (Dev's notes: Do you want to reply to support messages through the platform? or have the replies be done manually outside the platform? )
          </div>
        <div class="flex-col text-white w-full m-2 border-b border-sunglow">
          <div class="my-2">
            <span>Date Sent:</span>
            <span class="mx-2">{{$moment(email.sender.created_at).format('MMM DD,YYYY | HH:MM:ss') }}</span>
          </div>
          <div>
            <div>From: </div> 
            <div class="m-2">{{email.sender.email}}</div>
          </div>
          <div>
            <div>Domain:</div>
            <div class="m-2">{{email.sender.domain}}</div>
          </div>
           
        </div>
       
      </div>
      <div class="m-4">
        <div class="flex flex-col bg-white py-2 px-4 rounded-lg w-full h-full">
          <div class="m-8">
            {{email.message}}
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  props:['email'],
  data() {
    return {
    };
  },
  methods:{
    goBack(){
      const query = {
          ...this.$route.query
      }
      this.$router.push({path:'/supports',query})
    },
  }
};
</script>
<style>
  
</style>