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
	getBillingNotifications (state) {
		let notifications = []
		state.billingNotifications.forEach(notif => {
			console.log('notif objkect',notif)
			let message = ''
			let notifObj = null

			if (notif.notificationType === 'Admin Notification Locum Invoice Disputed') {
				console.log('notif locuminvoice disputed')
				switch (notif.notificationType) {
					case 'Admin Notification Locum Invoice Disputed':
						message = 'A Locum Invoice has been marked Disputed.'
						break
					default: 
						message = ''
				}
	
				notifObj = {
					...notif,
					id: notif.payload.id,
					status: notif.payload.status,
					notification_type: notif.notificationType,
					type: 'Admin Locum Billing Disputed',
					message
				}
				notifications.push(notifObj)
			}

			if (notif.notificationType === 'Admin Notification Practice Invoice Past Due') {
				console.log('notif locuminvoice past due')
				switch (notif.notificationType) {
					case 'Admin Notification Practice Invoice Past Due':
						message = 'A Practice / HUBZZ invoice has past its due date.'
						break
					default: 
						message = ''
				}
	
				notifObj = {
					...notif,
					id: notif.payload.id,
					status: notif.payload.status,
					notification_type: notif.notificationType,
					type: 'Admin Practice Invoice Past Due',
					message
				}
				notifications.push(notifObj)
			}
			
		})
		return notifications
	}
}