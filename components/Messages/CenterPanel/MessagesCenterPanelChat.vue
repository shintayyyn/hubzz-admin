<template>
  <div ref="messageContainer" class="panel-chat overflow-y-auto overflow-x-hidden h-full" @scroll="scrollHandler">
    <div class="relative flex flex-col h-full">
      <!-- CHAT -->
      <transition name="drop" mode="in-out">
        <span class="relative w-full flex justify-center">
          <button
            v-if="!noMoreMessagesToLoad && scrollIsAtTheTop"
            class="absolute text-center py-4 px-8 shadow-md text-xs text-grey-darkest font-bold my-4 rounded-full bg-white focus:outline-none hover:bg-gray-200"
            @click="loadMoreMessages()"
          >
            Load More Messages
          </button>
        </span>
      </transition>

      <transition name="fade" mode="in-out">
        <span class="w-full flex justify-center">
          <button
            v-if="hasNewMessage"
            :class="!noMoreMessagesToLoad && scrollIsAtTheTop ? 'my-20' : 'my-4'"
            class="flex fixed text-center py-4 px-6 shadow-md text-xs text-grey-darkest font-bold rounded-full bg-white focus:outline-none hover:bg-gray-200"
            @click="scrollToBottom"
          >
            <span class="pr-2">
              <svgicon name="left-arrow" class="h-4 w-4" style="transform: rotate(-90deg)" />
            </span>
            <span>New Message</span>
          </button>
        </span>
      </transition>

      <div class="py-2 md:px-4">
        <transition-group name="fade">
          <div v-for="(item, index) in conversationMessages" :key="item.id">
            <div
              :id="`message-${index}`"
              class="flex flex-col"
              :class="!['Super Admin', 'Admin'].includes(item.user.domain) ? 'items-start' : 'items-end'"
            >
              <div v-if="isMessageDeleted(item.user.id, item.deleted_by_sender, item.deleted_by_receiver)" class="flex my-1">
                <div
                  v-if="item.user.domain === 'Locum'"
                  :class="!['Super Admin', 'Admin'].includes(item.user.domain) ? '' : 'hidden'"
                  class="w-10 h-10 my-1 ml-4"
                >
                  <AppAvatar class="m-auto" :width="'40px'" :height="'40px'" :src="getAvatarUrl(item.user)" />
                </div>

                <div class="flex flex-col text-sm md:px-2">
                  <span class="text-xs px-2 text-gray-600" :class="!['Super Admin', 'Admin'].includes(item.user.domain) ? '' : 'text-right'">{{
                    isReceiver(item) ? userFullName(item) : 'You'
                  }}</span>

                  <div class="flex" :class="!['Super Admin', 'Admin'].includes(item.user.domain) ? '' : 'flex-row-reverse'">
                    <div
                      class="rounded-lg text-xs px-2 py-2 border text-gray-500 italic"
                      :class="{ 'ml-2': isReceiver(item) }"
                      @mouseover="hoverId = item.id"
                      @mouseleave="hoverId = ''"
                    >
                      This message has been removed.
                    </div>
                  </div>

                  <transition name="drop-down" mode="out-in">
                    <div v-if="item.id === hoverId" class="mx-2" :class="isReceiver(item) ? 'text-right ' : ''">
                      <span class="text-xs text-gray-500">{{ $moment(item.created_at).fromNow() }}</span>
                    </div>
                  </transition>
                </div>
              </div>

              <div
                v-else
                class="flex my-1 md:max-w-sm lg:max-w-lg"
                :class="!['Super Admin', 'Admin'].includes(item.user.domain) ? '' : 'flex-row-reverse'"
              >
                <div
                  v-if="item.user.domain === 'Locum'"
                  :class="!['Super Admin', 'Admin'].includes(item.user.domain) ? '' : 'hidden'"
                  class="w-10 h-10 my-1 ml-4"
                >
                  <AppAvatar class="m-auto" :height="'40px'" :width="'40px'" :src="getAvatarUrl(item.user)" />
                </div>

                <div class="flex flex-col text-sm px-2">
                  <span class="text-xs px-2 text-gray-600" :class="!['Super Admin', 'Admin'].includes(item.user.domain) ? '' : 'text-right'">{{
                    isReceiver(item) ? userFullName(item) : 'You'
                  }}</span>

                  <div
                    class="flex items-center"
                    :class="!['Super Admin', 'Admin'].includes(item.user.domain) ? '' : 'flex-row-reverse'"
                    @mouseover="hoverId = item.id"
                    @mouseleave="hoverId = ''"
                  >
                    <span
                      class="chat-message rounded-lg p-2 mx-2 whitespace-pre-line"
                      :class="isReceiver(item) ? 'bg-gray-300 chat-message-left' : 'chat-message-right bg-blue-500 text-white'"
                      >{{ item.message }}</span
                    >

                    <transition name="fade" mode="out-in">
                      <div
                        v-if="!isReceiver(item) && item.id === hoverId"
                        class="text-xs text-gray-500 hover:text-gray-700 font-bold cursor-pointer px-1"
                        title="Delete Message"
                        @click="conversationMessageIdToDelete = item.id"
                      >
                        X
                      </div>
                    </transition>
                  </div>

                  <transition name="drop-down" mode="out-in">
                    <div v-if="item.id === hoverId" class="mx-2" :class="isReceiver(item) ? 'text-right ' : 'ml-6'">
                      <span class="text-xs text-gray-500">{{ $moment(item.created_at).fromNow() }}</span>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>

    <AppConfirmationModal
      :label="'Do you want to delete this message?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="!!conversationMessageIdToDelete"
      @confirm="deleteMessage"
      @cancel="conversationMessageIdToDelete = null"
    />
  </div>
</template>

<script>
import AppConfirmationModal from '~/components/Base/AppConfirmationModal'
import AppAvatar from '~/components/Base/AppAvatar'
export default {
  components: {
    AppConfirmationModal,
    AppAvatar
  },

  props: {
    user: {
      type: Object,
      default: () => null
    },

    activeConversationId: {
      type: Number,
      default: 0
    },

    conversationMessages: {
      type: Array,
      default: () => []
    },

    noMoreMessagesToLoad: {
      type: Boolean,
      default: false
    },

    hasNewMessage: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      conversationMessageIdToDelete: null,
      hoverId: '',
      scrollIsAtTheBottom: false,
      scrollIsAtTheTop: true,
      scrollHeightBeforeLoadMore: 0
    }
  },

  watch: {
    conversationMessages(value, oldValue) {
      if (value.length === 0 || oldValue.length === 0 || oldValue[0].conversation_id !== value[0].conversation_id) {
        this.scrollToBottom()
        return
      }

      const hasOneNewMessage = oldValue.length + 1 === value.length && oldValue[0].id === value[0].id
      const userIsTheSender = this.$auth.user.id === value[value.length - 1].user.id

      if (hasOneNewMessage && (userIsTheSender || this.scrollIsAtTheBottom)) {
        this.scrollToBottom()
        return
      }

      this.scrollToBeforeLoadMore()
    },

    scrollIsAtTheBottom() {
      if (this.scrollIsAtTheBottom) {
        console.log('scrollIsAtTheBottom')
        this.$emit('seenNewMessage')
        console.log('scrollIsAtTheBottom qwe')
      }
    }
  },

  mounted() {
    this.scrollToBottom()
  },

  methods: {
    loadMoreMessages() {
      console.log('loadMoreMessages this.scrollHeight', this.scrollHeight)
      this.scrollHeightBeforeLoadMore = this.$refs.messageContainer.scrollHeight
      this.$emit('loadMoreMessages')
    },

    userFullName(item) {
      if (item && item.user && (item.user.domain === 'Super Admin' || item.user.domain === 'Admin')) {
        if (item.user.name) return item.user.name

        const first = item.user.first_name || ''
        const last = item.user.last_name || ''
        const full = `${first} ${last}`.trim()
        return full || 'Hubzz Admin'
      }

      let fullName

      if (this.user && this.user.id === item.user.id) {
        const conversationMemberUser = this.user

        if (
          conversationMemberUser.domain === 'Practice' &&
          (['Deleted', 'Deactivated'].includes(conversationMemberUser.practice_user_status) ||
            ['Deleted', 'Deactivated'].includes(conversationMemberUser.practice_status))
        ) {
          return 'Hubzz User'
        }

        if (conversationMemberUser.domain === 'Locum' && ['Deleted', 'Deactivated'].includes(conversationMemberUser.locum_user_status)) {
          return 'Hubzz User'
        }
      }

      if (item.user) {
        fullName = `${item.user.first_name || ''} ${item.user.last_name || ''}`.trim()
        if (fullName) return fullName
      }

      if (item.user && item.user.email) {
        return `${item.user.email}`
      }

      return 'Hubzz User'
    },

    deleteMessage() {
      this.$store.dispatch('chat/deleteMessage', this.conversationMessageIdToDelete)
      this.conversationMessageIdToDelete = null
    },

    scrollToBeforeLoadMore() {
      this.$nextTick(() => {
        console.log('scrollTo', this.scrollHeightBeforeLoadMore, this.$refs.messageContainer.scrollHeight)
        if (this.$refs.messageContainer) {
          this.$refs.messageContainer.scrollTop = this.$refs.messageContainer.scrollHeight - this.scrollHeightBeforeLoadMore
        }
      })
    },

    scrollToBottom() {
      this.$nextTick(() => {
        if (this.$refs.messageContainer) {
          this.$refs.messageContainer.scrollTop = this.$refs.messageContainer.scrollHeight
        }
      })
    },

    scrollHandler(e) {
      this.scrollIsAtTheTop = e.target.scrollHeight > e.target.clientHeight && e.target.scrollTop === 0
      this.scrollIsAtTheBottom = Math.round(e.target.offsetHeight + e.target.scrollTop) === e.target.scrollHeight
    },

    isReceiver(item) {
      return this.$auth.user.id !== item.user.id
    },

    isMessageDeleted(sender_id, sender_deleted, receiver_deleted) {
      if (sender_deleted) {
        return true
      }

      if (receiver_deleted) {
        if (sender_id === this.$auth.user.id) {
          return false
        } else {
          return true
        }
      }
    },

    getAvatarUrl(user) {
      if (!user) return require('~/assets/images/default-user-image.png')

      try {
        if (user.avatar && user.avatar.file && user.avatar.file.url) return user.avatar.file.url
        if (user.locum_user && user.locum_user.avatar && user.locum_user.avatar.file && user.locum_user.avatar.file.url)
          return user.locum_user.avatar.file.url
        if (user.practice_user && user.practice_user.avatar && user.practice_user.avatar.file && user.practice_user.avatar.file.url)
          return user.practice_user.avatar.file.url
        if (user.avatar_url) return user.avatar_url

        if (this.user && this.user.id === user.id) {
          if (this.user.avatar && this.user.avatar.file && this.user.avatar.file.url) return this.user.avatar.file.url
          if (this.user.avatar_url) return this.user.avatar_url
        }
      } catch (e) {}

      return require('~/assets/images/default-user-image.png')
    }
  }
}
</script>

<style scoped>
.message-chat:hover {
  background-color: #dee1e5;
  transition: background-color 0.5s ease-in-out;
}
.message-chat {
  background-color: white;
  transition: background-color 0.5s ease-in-out;
}
.chat-message {
  word-wrap: wrap;
  word-break: break-word;
}

.panel-chat {
  scroll-behavior: smooth;
}

.panel-chat::-webkit-scrollbar {
  width: 8px;
}

.panel-chat::-webkit-scrollbar-track {
  background: transparent;
}

.panel-chat::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 50px;
}
</style>
