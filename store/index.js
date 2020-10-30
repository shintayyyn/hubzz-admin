export const state = () => ({
  pendingChangeEmailRequestIds: [],

  socket_id: '',
  notification: {
    enabled: false,
    status: '',
    text: '',
    duration: "",
  },
  toggled_sidebar: false,
  totalPages: 0,
  session_expiring: false,
})

export const getters = {
  sessionExpiring (state) {
    return state.session_expiring
  },

  pendingChangeEmailRequestIds (state) {
    return state.pendingChangeEmailRequestIds
  },

  getAdminUserMe (state) {
    return state.admin_user_logged_in
  },
  permissions (state) {
    if (!state.auth.loggedIn) {
      return []
    }

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
  },
}

export const mutations = {
  pendingChangeEmailRequestIds (state, pendingChangeEmailRequestIds) {
    state.pendingChangeEmailRequestIds = pendingChangeEmailRequestIds
  },

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
  SESSION_EXPIRING (state, payload) {
    state.session_expiring = payload
  }
}

export const actions = {
  async initializeSessionListener ({ commit }) {
    this.$socket.on('Admin Session Refresh', async () => {
      console.log('session refresh')
			commit('SESSION_EXPIRING', false)
    })
    
    this.$socket.on('Admin Session Expiring', async () => {
      console.log('session expiring')
			commit('SESSION_EXPIRING', true)
    })
    
    this.$socket.on('Admin Session Expired', async () => {
			console.log('session expired')
      // this.$router.push(`/session-expired`)
      this.$auth.logout().finally(() => {
        this.$auth.$storage.setUniversal('_token.local', '')
        this.$router.push('/sign-in')
      })
      commit("SET_NOTIFICATION", {
        enabled: true,
        status: "danger",
        text: "Session Expired",
        duration: 5000,
      })
      
    })
  },

  pendingChangeEmailRequestIds ({ commit }) {
    return this.$axios.get('/api/v1/admin/change-email-requests', {
      params: { status: 'Pending', id_only: true, limit: 1000000 },
    }).then(response => commit('pendingChangeEmailRequestIds', response.data.data.change_email_requests))
  },

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
