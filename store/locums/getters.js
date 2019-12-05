export default {
	getAllLocums(state) {
		return state.all_locums;
	},
	getLocumUsers(state) {
		let users = [];
		state.locumUsers.forEach(user => {
			users.push({
				...user,
				personal_detail_name: user.personal_detail.name,
				profession_name: user.locum_detail.profession.name
			});
		});
		return users;
	}
};
