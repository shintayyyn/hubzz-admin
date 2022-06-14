<template>
  <div class="relative w-full flex flex-col">
    <div class="flex flex-col justify-center items-center h-full">
      <span class="font-bold text-lg">You don't have a message selected.</span>
      <span>Choose one from your existing messages, or start a new one.</span>
      <button
        class="bg-yellow-500 hover:bg-yellow-400 border-yellow-500 text-sm px-6 py-2 my-2 md:text-lg rounded-full focus:outline-none"
        @click="$router.push(`/messages/create`)"
      >
        Create Message
      </button>
    </div>
  </div>
</template>
