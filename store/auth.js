export const mutations = {
  SET_ADMIN_USER_PERMISSIONS(state, payload) {
    state.user.admin_detail.role.permissions
  }
}

export const getters = {
  permissions(state) {
    return state.user && state.user.admin_detail && state.user.admin_detail.role ? state.user.admin_detail.role.permissions.map(item => item.name) : []
  }
}