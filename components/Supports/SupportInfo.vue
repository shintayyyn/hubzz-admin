<template>
    <div>
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white">
        <nuxt-link to="/supports" class="text-white p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="text-white fill-current"/>
        </nuxt-link>
      </div>
      <!-- HEADER -->
      <div class="flex flex-wrap overflow-hidden pl-4">
        <!-- <div class="px-1 w-1/8 overflow-hidden">
          <div class="self-end">
            <button class="inline-flex py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow">
              <svgicon
                  name="reply"
                  width="21"
                  height="21"
                  color="black"
              ></svgicon>
              <span class="pt-1 pl-1">Reply?</span>
            </button>
          </div>
        </div>

        <div class="px-1 w-1/8 overflow-hidden">
          <div class="self-end">
            <button
              class="inline-flex py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow"
            >
              <svgicon
                  name="forward"
                  width="21"
                  height="21"
                  color="black"
              ></svgicon>
              <span class="pt-1 pl-1">Forward?</span>
            </button>
          </div>
        </div> -->
        <div class="flex text-white w-full m-2 border-b border-sunglow">
          <div class="flex flex-wrap overflow-hidden lg:-mx-1">
            <div class="w-full xl:w-1/2 overflow-hidden lg:my-1 lg:px-1">
              <div>
                <span>From: </span> 
                <span class="m-2">{{email.sender.email}}</span></div>
              <div>Domain: {{email.sender.domain}}</div>
            </div>
            <div class="w-full xl:w-1/2 overflow-hidden lg:my-1 lg:px-1">
              <div>Date: {{$moment(email.sender.created_at).format('MMM DD,YYYY | HH:MM:ss') }}</div>
            </div>
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
  }
};
</script>
<style>
  
</style>