<template>
  <div class="flex-1 flex flex-col py-2 px-4 md:px-6 overflow-y-auto">
    <div class="flex flex-row justify-start overflow-x-auto border-b border-yellow-500 pt-1">
      <nuxt-link
        :to="`/account`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path == `/account` ? 'border-b-4 border-yellow-500' : 'text-gray-600'"
        >General</nuxt-link
      >
      <nuxt-link
        :to="`/account/change-password`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path == `/account/change-password` ? 'border-b-4 border-yellow-500' : 'text-gray-600'"
        >Change Password</nuxt-link
      >
    </div>
    <nuxt-child />
  </div>
</template>
