<template>
  <div>
    <!-- HEADER -->
    <div class="flex justify-between text-sm text-white">
      <div @click="goBack()" class="text-white p-1 mb-3 cursor-pointer">
        <svgicon
          name="arrow-left-solid"
          height="32"
          width="32"
          class="text-white hover:text-sunglow fill-current"
        />
      </div>
    </div>
    <!-- HEADER -->

    <div class="flex flex-wrap overflow-hidden md:px-4">
      <div class="text-xs text-white italic">
        (Dev's notes: Do you want to reply to support messages through the
        platform? or have the replies be done manually outside the platform? )
      </div>
      <div
        class="flex-col text-white w-full m-2 pb-3 border-b border-sunglow text-sm md:text-base"
      >
        <div class="flex my-1">
          <span class="w-24 pr-3">Date Sent:</span>
          <span class="font-bold">{{
            $moment(email.sender.created_at).format("MMM DD, YYYY | HH:MM:ss")
          }}</span>
        </div>
        <div class="flex my-1">
          <span class="w-24 pr-3">From: </span>
          <span class="font-bold">{{ email.sender.email }}</span>
        </div>
        <div class="flex my-1">
          <div class="w-24 pr-3">Domain:</div>
          <div class="font-bold">{{ email.sender.domain }}</div>
        </div>
      </div>
    </div>
    <div class="my-2 md:mx-6">
      <div
        class="flex flex-col bg-waterloo text-white py-2 px-4 w-full h-full break-words"
      >
        {{ email.message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["email"],
  data() {
    return {};
  },
  methods: {
    goBack() {
      const query = {
        ...this.$route.query
      };
      this.$router.push({ path: "/inquiries", query });
    }
  }
};
</script>
<style></style>
