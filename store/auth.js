export const mutations = {
  SET_ADMIN_USER_PERMISSIONS(state, payload) {
    state.user.admin_detail.roles
  }
}

export const getters = {
  permissions(state) {
    const adminRoles = state.user.admin_detail.roles
    let toSetAdminPermissions = []

    if(state.user && state.user.admin_detail && state.user.admin_detail.roles){
      for(let i = 0; i < adminRoles.length; i++ ){
        state.user.admin_detail.roles[i].permissions.map(item => {
          let existingPermission = toSetAdminPermissions.find(existing => existing.id == item.id)
          if(!existingPermission) {
            toSetAdminPermissions = toSetAdminPermissions.concat(item)
          }
        })
      }
    }
    return toSetAdminPermissions.map(item => item.name)
  }
}