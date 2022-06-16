<template>
  <div class="flex" :class="wrapperClass">
    <transition name="fade">
      <div v-if="messageSent && !$route.name.includes('messages')" class="message-modal bg-blue-500 text-white p-4 rounded-lg font-bold text-center">
        Message Sent to {{ user.personal_detail.name }}
      </div>
    </transition>

    <div v-if="messageSent" class="bg-white h-full w-full absolute opacity-50" />

    <div class="relative message-box border-t w-full p-2" :class="hasDeletedOrDeactivatedUser ? 'disabled' : ''">
      <textarea
        v-model="message"
        class="resize-none w-full text-sm focus:outline-none"
        :class="inClass"
        placeholder="Type your message here"
        @keydown.enter.exact.prevent
        @keyup.enter.exact="sendMessage()"
        @keydown.enter.shift.exact="newline"
      />

      <p
        class="flex items-center text-xs absolute bottom-0 right-0 mr-4"
        :class="message.length > textLimit ? 'text-red-600 font-bold' : 'text-gray-600'"
      >
        <transition name="fade">
          <svgicon v-if="message.length > textLimit" name="exclamation-mark" width="12" height="12" class="mr-1" color="red" />
        </transition>
        <span>{{ trimmedMessage(message).length }}/{{ textLimit }}</span>
      </p>
    </div>

    <button
      :disabled="hasDeletedOrDeactivatedUser || trimmedMessage(message).length === 0 || trimmedMessage(message).length > textLimit"
      :class="
        hasDeletedOrDeactivatedUser || trimmedMessage(message).length === 0 || trimmedMessage(message).length > textLimit
          ? 'cursor-not-allowed bg-gray-500'
          : 'bg-blue-500 hover:bg-blue-600 '
      "
      class="px-8 text-white focus:outline-none"
      @click="sendMessage()"
    >
      Send
    </button>
  </div>
</template>

<script>
export default {
  props: {
    inClass: {
      type: String,
      default: () => null
    },

    wrapperClass: {
      type: String,
      default: () => null
    },

    user: {
      type: Object,
      default: () => null
    },

    messageModal: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      message: '',
      hasDeletedOrDeactivatedUser: false,
      textLimit: 250,
      messageSent: false,
      conversations: []
    }
  },

  methods: {
    setHasDeletedUser() {
      let conversation = this.conversations && this.conversations.find(conversation => conversation.id === parseInt(this.$route.params.slug))

      this.hasDeletedOrDeactivatedUser =
        conversation &&
        conversation.conversation_member_users.some(conversationMemberUser => {
          if (
            conversationMemberUser.domain === 'Practice' &&
            (['Deleted', 'Deactivated'].includes(conversationMemberUser.practice_user_status) ||
              ['Deleted', 'Deactivated'].includes(conversationMemberUser.practice_status))
          ) {
            return true
          }

          if (conversationMemberUser.domain === 'Locum' && ['Deleted', 'Deactivated'].includes(conversationMemberUser.locum_user_status)) {
            return true
          }

          return !conversationMemberUser.email
        })
    },

    newline() {
      this.message = `${this.message}`
    },

    trimmedMessage(message) {
      return message.replace(/^\s*/, '').replace(/\s*$/, '')
    },

    async sendMessage() {
      if (this.trimmedMessage(this.message) && this.trimmedMessage(this.message).length <= this.textLimit) {
        try {
          const response = await this.$axios.post(`/api/v1/conversations`, {
            user_id: this.user.id,
            message: this.message
          })

          if (this.user.id) {
            this.messageSent = true
            // setTimeout(() => {
            //   this.messageSent = false
            // }, 1000)
          }

          const conversation = response.data.data.conversation

          this.message = ''

          this.$emit('newMessageInConversation', conversation)

          if (!this.messageModal) {
            this.$router.push(`/messages/${conversation.id}`)
          }
        } catch (err) {
          console.log('err', err.response || err)

          let message = null

          if (err.response) {
            if (err.response.status === 400 && err.response.data.error_messages) {
              message = err.response.data.error_messages.map(({ message }) => message).join(', ')
            } else {
              message = err.response.data.message
            }
          } else if (err.request) {
            message = 'Something went wrong!'
          } else {
            message = err.message
          }

          if (message) {
            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'danger',
              text: message
            })
          }
        }
      }
    }
  }
}
</script>

<style>
.message-box::-webkit-scrollbar {
  width: 8px;
}

.message-box::-webkit-scrollbar-thumb {
  background: #ccc;
}

.message-box::-webkit-scrollbar-track {
  background: #eee;
}

.message-box.disabled {
  position: relative;
}

.message-box.disabled::after {
  content: '';
  position: absolute;
  background-color: rgba(215, 215, 215, 0.5);
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: not-allowed;
}

.message-modal {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 60;
}

@media screen and (max-width: 767px) {
  .message-modal {
    min-width: 85%;
  }
}
</style>
