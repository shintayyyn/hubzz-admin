export default {
	getAllPractices (state) {
		return state.allPractices
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

			if (notif.notificationType === 'Admin Notification Practice Created') {
				switch (notif.notificationType) {
					case 'Admin Notification Practice Created':
						message = 'A Practice has been created and needs to be verified'
						break
					default:
						message = ''
				}

				notifObj = {
					...notif,
					id: notif.payload.id,
					user_id: notif.payload.practice_user_id,
					status: notif.payload.practice.status,
					notification_type: notif.notificationType,
					type: 'Admin Practice Creation',
					message
				}
				notifications.push(notifObj)
			}

			if (notif.notificationType === 'Admin Notification Practice Surgery Created') {
				switch (notif.payload.invitation_accepted) {
					case false:
						message = 'A Practice Hub has invited a Practice Spoke'
						break
					case true:
						message = 'A Practice Spoke has accepted a Practice Hub'
						break
					default:
						message = ''
				}

				notifObj = {
					...notif,
					id: notif.payload.id,
					practice_id: notif.payload.practice_id,
					child_practice_id: notif.payload.child_practice_id,
					status: notif.payload.invitation_accepted_at === null ? 'Invited' : 'Accepted',
					notification_type: notif.notificationType,
					type: 'Admin Practice Surgery Creation',
					message
				}
				notifications.push(notifObj)
			}
		})
		return notifications
	},
}
