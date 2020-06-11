export default {
  getAllBillablePractices (state) {
		let practices = []
		state.allBillablePractices.forEach(practice => {
			practices.push({
				...practice,
				practice_name: practice.surgery.name,
				practice_code: practice.surgery.code
			})
		})
		return practices
	},
}