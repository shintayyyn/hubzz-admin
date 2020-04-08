export default {
	getAllPractices (state) {
		let users = []
		state.allPractices.forEach(user => {
			users.push({
				...user,
				practice_name: user.surgery.name,
				practice_code: user.surgery.code
			})
		})
		return users
	},
	getAllSpokes (state) {
		return state.practiceSpokes
	},
	getPracticeNotifications (state) {
		let notifications = []
		state.practiceNotifications.forEach(notif => {
			console.log('notif', notif)
			let message = ''
			let notifObj = null

			switch (notif.notificationType) {
				case 'Admin Notification Practice Created':
					message = 'A Practice has been created and needs to be verified'
					break
				default:
					message = ''
			}

			notifObj = {
				...notif,
				id: notif.practice.id,
				message
				// status
			}
			notifications.push(notifObj)
		})
		return notifications
	}

}
