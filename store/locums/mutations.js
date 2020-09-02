export default {
	SET_LOCUM_USER (state, payload) {
		state.locumUser = payload
	},
	SET_MANDATORY_DOCS (state, payload) {
		state.mandatoryComplianceDocuments = payload
	},
	SET_LOCUM_COMP_DOCS (state, payload) {
		state.locumCompDocs = payload
	},
	UPDATE_LOCUM_DOCUMENT (state, payload) {
		let index = state.mandatoryComplianceDocuments.findIndex(
			mandatoryCompDoc =>
				mandatoryCompDoc.locumMandatoryComplianceDocument.id ===
				payload.locumDetailComplianceDocument.id
		)
		if (index >= 0) {
			let updatedMandatoryDocument = {
				locumMandatoryComplianceDocument: payload.locumDetailComplianceDocument,
				mandatoryComplianceDocument:
					payload.locumDetailComplianceDocument.compliance_document
			}
			state.mandatoryComplianceDocuments.splice(
				index,
				1,
				updatedMandatoryDocument
			)
		}

		let index2 = state.locumUsers.findIndex(
			locumUser => locumUser.id === payload.locumUser.id
		)
		if (index2 >= 0) {
			state.locumUsers.splice(index2, 1, payload.locumUser)
		}
	},
	SET_APPROVED_DOC (state, payload) {
		let index = state.mandatoryComplianceDocuments.findIndex(
			docs => docs.id == payload.id
		)
		if (index > 0) {
			state.mandatoryComplianceDocuments.splice(index, 1, payload)
		}
	},
	SET_LOCUM_DOC_ALERT (state, payload) {
		state.locumDocAlert = payload
	},
	ADD_LOCUM_NOTIFICATION (state, payload) {
		console.log('state.locumNotifications', state.locumNotifications)
		console.log('payload', payload)
		let index = state.locumNotifications.findIndex(locumNotif =>  locumNotif.locumNotification.id === payload.locumNotification.id)
		if (index < 0) {
			state.locumNotifications.unshift(payload)
		} else if (index >= 0) {
			state.locumNotifications.splice(index, 1, payload)
		}
	},
	REMOVE_LOCUM_NOTIFICATION (state, payload) {
		state.locumNotifications = state.locumNotifications.filter(locumNotif => locumNotif.locumNotification.id !== payload)
	},
	CLEAR_LOCUM_NOTIFICATIONS (state) {
		state.locumNotifications = []
	},
}
