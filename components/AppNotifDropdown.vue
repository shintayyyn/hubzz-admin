<template>
  <transition name="fade" mode="in-out">
    <div
      class="absolute bg-waterloo text-white right-0 border border-waterloo-dark shadow container transition-hover z-50"
      :class="showAll ? 'modal top-0' : 'dropdown left-0 mx-auto sm:left-auto sm:mx-0'"
    >
      <div
        class="border-b border-waterloo-dark px-2 py-1 flex justify-between"
        :class="showAll ? '' : 'text-sm'"
      >
        <p class="font-bold">
          Notifications
        </p>
        <div
          v-if="notifications.length > 0"
          class="flex items-center"
          :class="showAll ? 'text-sm' : 'text-xs'"
        >
          <p class="cursor-pointer" @click="markAllAsRead">
            Mark all as read
          </p>
          <span v-if="showAll" class="px-1 font-bold">·</span>
          <span v-if="showAll" class="cursor-pointer" @click="showAll = false">Close</span>
        </div>
      </div>
      <div
        v-for="(item, index) in notifications"
        :key="index"
        class="p-2 border-b border-waterloo-dark flex items-center justify-between"
        :class="item.seen ? '' : 'bg-waterloo-light'"
      >
        <div class="w-full pr-2">
          <p>{{ item.title }}</p>
          <p class="text-sm">
            {{ item.message }}
          </p>
        </div>
        <div class>
          <p
            :title="item.seen ? 'Mark as unread' : 'Mark as read'"
            class="p-1 rounded-full cursor-pointer transition-hover"
            :class="item.seen ? 'border hover:bg-white' : 'bg-white border hover:bg-transparent'"
            @click="item.seen = !item.seen"
          />
        </div>
      </div>
      <p
        v-if="!showAll"
        class="cursor-pointer text-sm text-center py-1"
        @click="showAll = !showAll"
      >
        Show All Notifications
      </p>
      <p
        v-if="showAll"
        class="cursor-pointer text-sm text-center py-1 absolute bottom-0 w-full bg-waterloo-dark"
      >
        Load More
      </p>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    notifications: {
        type: Object,
        default: () => null,
      }
  },
	data () {
		return {
			// notifications: [
			// 	{
			// 		title: "Sample title 1",
			// 		message: "This is the message",
			// 		seen: false,
			// 		date: "03/04/2020"
			// 	},
			// 	{
			// 		title: "Sample title 2",
			// 		message: "This is the message",
			// 		seen: true,
			// 		date: "03/04/2020"
			// 	}
			// ],
			showAll: false
		}
	},
	watch: {
		showAll () {
			this.$emit("showAll")
		}
	},
	methods: {
		markAllAsRead () {
			this.notifications.forEach(item => {
				item.seen = true
			})
		}
	}
}
</script>
<style scoped>
.container {
}
.dropdown {
	width: 94%;
}
.modal {
	height: 100vh;
}
@media screen and (min-width: 640px) {
	.container {
		min-width: 380px;
		max-width: 380px;
	}
	.dropdown {
		width: auto;
	}
}
</style>