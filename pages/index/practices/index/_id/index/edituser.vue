<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div
      style="width: calc(100% - 140px);"
      class="flex-1 flex flex-col self-end bg-trout shadow-lg"
    >
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link to="/practices/_id/" class="text-white p-1">
          <svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
        </nuxt-link>
      </div>
      <div class="p-4">
        <b-tabs pills v-model="userTabs">
          <b-tab title="General" :title-link-class="linkClass2(0)" active>
            <div class="flex text-white bg-waterloo m-4 py-2 px-3 shadow rounded-lg text-xs w-1/2">
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
              </div>
            </div>
          </b-tab>
          <b-tab title="Change Password" :title-link-class="linkClass2(1)">
            <div class="flex text-white">
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
          </b-tab>
        </b-tabs>
      </div>
    </div>
    <nuxt-child/>
  </div>
</template>

<script>
export default {
  data() {
    return { userTabs: 0 };
  },
  methods: {
    linkClass2(idx) {
      if (this.userTabs === idx) {
        return ["bg-secondary", "text-xs"];
      } else {
        return ["bg-transparent", "text-light", "text-xs"];
      }
    }
  }
};
</script>

<style>
</style>
