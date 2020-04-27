export const state = () => ({
  socket_id: '',
  notification: {
    enabled: false,
    status: '',
    text: ''
  },
  toggled_sidebar: false,
  totalPages: 0,
})

export const getters = {
  getAdminUserMe (state) {
    return state.admin_user_logged_in
  },
  permissions (state) {
    const adminRoles = state.auth.user.admin_detail.roles
    let toSetAdminPermissions = []

    if (state.auth.user && state.auth.user.admin_detail && state.auth.user.admin_detail.roles) {
      for (let i = 0; i < adminRoles.length; i++) {
        state.auth.user.admin_detail.roles[i].permissions.map(item => {
          let existingPermission = toSetAdminPermissions.find(existing => existing.id == item.id)
          if (!existingPermission) {
            toSetAdminPermissions = toSetAdminPermissions.concat(item)
          }
        })
      }
    }
    return toSetAdminPermissions.map(item => item.name)
  }
}

export const mutations = {
  SET_SOCKET (state, payload) {
    state.socket_id = payload
  },
  SET_NOTIFICATION (state, payload) {
    state.notification.enabled = payload.enabled
    state.notification.status = payload.status
    state.notification.text = payload.text
    state.notification.closable = payload.closable
    state.notification.duration = payload.duration
  },
  TOGGLE_SIDEBAR (state, payload) {
    state.toggled_sidebar = payload
  },
}

export const actions = {
  async joinRoom (ctx, payload) {
    try {
      await this.$axios.$post('/api/v1/socket/join-room', {
        socket_id: payload.socket_id,
        room_name: payload.room_name
      })
    } catch (err) {
      console.log('join room error!', err)
    }
  },

  async leaveRoom (ctx, payload) {
    await this.$axios.$post('api/v1/socket/leave-room', {
      socket_id: payload.socket_id,
      room_name: payload.room_name
    })
  }
}
