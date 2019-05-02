<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div
      style="width: calc(100% - 70px);"
      class="flex-1 flex flex-col self-end bg-trout shadow-lg "
    >
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link to="/practices/_id/" class="text-white p-1">
          <svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
        </nuxt-link>
      </div>
      <div class="flex flex-col rounded-lg pl-6">
        <div class="w-full overflow-hidden">
          <div class="flex flex-wrap -mx-1 overflow-hidden">
            <div class="my-1 px-1 overflow-hidden">
              <button
                class="bg-grey-dark hover:bg-grey-darker rounded-lg py-3 px-4 text-white text-xs"
                @click="tab1=true,tab2=false"
              >
                <strong>General</strong>
              </button>
            </div>
            <div class="my-1 px-1 overflow-hidden">
              <button
                class="bg-grey-dark hover:bg-grey-darker rounded-lg py-3 px-4 text-white text-xs"
                @click="tab2=true,tab1=false"
              >
                <strong>Change Password</strong>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex sm:p-2">
        <!-- <b-tabs pills v-model="userTabs">
        <b-tab v-if="tab1" title="General" :title-link-class="linkClass2(0)" active>-->
        <div
          v-if="tab1"
          class="flex text-white bg-waterloo m-4 py-2 px-3 shadow rounded-lg text-xs sm:w-full lg:w-2/5"
        >
          <div class="w-full overflow-hidden text-grey-light text-xs p-2">
            <p class="flex">E-Mail Address</p>
            <input
              class="appearance-none bg-transparent border-none w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder="kpabad.halcyondigital@gmail.com"
              aria-label="Full name"
            >
            <p class="flex">Title</p>
            <input
              class="appearance-none bg-transparent border-none w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder="Mr"
              aria-label="Full name"
            >
            <p class="flex">First Name</p>
            <input
              class="appearance-none bg-transparent border-none w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder="Alvin"
              aria-label="Full name"
            >
            <p class="flex">Last Name</p>
            <input
              class="appearance-none bg-transparent border-none w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder="Abad"
              aria-label="Full name"
            >
            <p class="flex">Suffix</p>
            <input
              class="appearance-none bg-transparent border-none w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder="Ph.D."
              aria-label="Full name"
            >
            <p class="flex">Role</p>
            <select
              class="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option>Partner</option>
              <option>Practice Manager</option>
              <option>Practice Staff</option>
            </select>
            <p class="flex">Sign-Up verified by e-mail</p>
            <p class="p-2">01/04/2019</p>
            <p class="flex">Status</p>
            <select
              class="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option>Active</option>
              <option>Disabled</option>
            </select>
            <button
                class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow float-left"
              >Save Changes</button>
          </div>
        </div>
        <!-- </b-tab> -->
        <!-- <b-tab title="Change Password" :title-link-class="linkClass2(1)"> -->
        <div v-if="tab2" class="flex text-white">
          <div class="flex text-white text-xs bg-waterloo m-4 py-2 px-3 shadow rounded-lg">
            <div class="overflow-hidden text-grey-light text-xs p-2">
              <p class="flex">Old Password</p>
              <input
                class="appearance-none bg-transparent border-none w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
                type="password"
                aria-label="oldpassword"
              >
              <p class="flex">New Password</p>
              <input
                class="appearance-none bg-transparent border-none w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
                type="password"
                aria-label="newpassword"
              >
            </div>
          </div>
        </div>
        <!-- </b-tab> -->
        <!-- </b-tabs> -->
      </div>
    </div>
    <nuxt-child/>
  </div>
</template>

<script>
export default {
  data() {
    return { userTabs: 0, tab1: true, tab2: false };
  },
  methods: {}
};
</script>

<style>
</style>
