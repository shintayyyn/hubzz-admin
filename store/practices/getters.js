export default {
	getAllPractices(state) {
		let users = [];
		state.allPractices.forEach(user => {
			console.log("user", user);
			users.push({
				...user,
				practice_name: user.surgery.name,
				practice_code: user.surgery.code,
				practice_type: user.type
			});
		});
		return users;
	},
	getAllSpokes(state) {
		return state.practiceSpokes;
	},
	getPracticeUsers(state) {}
};
