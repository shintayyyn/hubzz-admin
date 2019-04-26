<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div
      style="width: calc(100% - 70px);"
      class="flex-1 flex flex-col self-end bg-trout shadow-lg sm:p-2"
    >
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link to="/practices/_id/" class="text-white p-1">
          <svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
        </nuxt-link>
      </div>
      <div class="text-white pl-4 pt-2">
        <strong>Create User</strong>
      </div>
      <div class="flex text-white bg-waterloo m-4 py-2 px-3 shadow rounded-lg text-xs sm:w-max lg:w-1/2">
        <div class="w-full overflow-hidden text-grey-light text-xs p-2">
          <p class="flex">Title</p>
          <input
            class="appearance-none bg-transparent border-none w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Jane Doe"
            aria-label="Full name"
          >
          <p class="flex">First Name</p>
          <input
            class="appearance-none bg-transparent border-none w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Jane Doe"
            aria-label="Full name"
          >
          <p class="flex">Last Name</p>
          <input
            class="appearance-none bg-transparent border-none w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Jane Doe"
            aria-label="Full name"
          >
          <p class="flex">Suffix</p>
          <input
            class="appearance-none bg-transparent border-none w-full text-white mr-3 py-3 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Jane Doe"
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
          <p class>E-Mail Address</p>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
          >
          <p class="flex">Password</p>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Username"
          >
        </div>
      </div>
    </div>
    <nuxt-child/>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>
