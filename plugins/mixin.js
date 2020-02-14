import Vue from "vue";
Vue.mixin({
	methods: {
		scrollToTop() {
			window.scrollTo(0, 0);
		},
		CheckEmptyField(inputField, fieldName) {
			let trimmedFieldName = fieldName;
			if (fieldName.includes('_id')) {
				trimmedFieldName = fieldName.replace(/_id/g, "")
			}
			let displayFieldName = trimmedFieldName.charAt(0).toUpperCase() + trimmedFieldName.slice(1).replace(/_/g, " ")

			if (!this.formError) {
				return
			}
			let index = this.formError.findIndex(item => item.field === fieldName);
			if (index >= 0) {
				this.formError.splice(index, 1);
			}
			if (!(inputField instanceof Array) && !inputField) {
				this.formError.push({
					field: fieldName,
					message: `${displayFieldName} is required`
				});
			}
			if (inputField instanceof Array && !inputField.length) {
				this.formError.push({
					field: fieldName,
					message: `${displayFieldName} is required`
				});
			}
			if (typeof inputField === "boolean" && inputField === false) {
				this.formError.push({
					field: fieldName,
					message: `${displayFieldName} is required`
				});
			}
			if (fieldName.includes("password")) {
				if (inputField.length < 6) {
					this.formError.push({
						field: fieldName,
						message: "Password Must Be At Least 6 Characters"
					});
				}
			}
		},
		Validate(form, lists) {
			let items = Object.entries(form);
			for (const [key, value] of items) {
				let trimmedFieldName = key;
				if (key.includes('_id')) {
					let removed_id = key.replace(/_id/g, "")
					trimmedFieldName = removed_id.charAt(0).toUpperCase() + removed_id.slice(1).replace(/_/g, " ")
				}
				let displayFieldName = trimmedFieldName
				// check if value is array
				if (Array.isArray(value)) {
					if (value.length === 0) {
						if (!lists) {
							this.formError.push({
								field: key,
								message: `${displayFieldName} is required`
							});
						}
						if (lists && !lists.includes(key)) {
							this.formError.push({
								field: key,
								message: `${displayFieldName} is required`
							});
						}
					}
				} else {
					if (!value || value.toString().trim().length === 0) {
						if (!lists) {
							this.formError.push({
								field: key,
								message: `${displayFieldName} is required`
							});
						}
						if (lists && !lists.includes(key)) {
							this.formError.push({
								field: key,
								message: `${displayFieldName} is required`
							});
						}
					}
				}
			}

			console.log("formError", this.formError)

			if (this.formError && this.formError.length) {
				this.scrollToTop()
			}
		},
		ValidateSamePassword(password, password_confirmation) {
			if (
				password &&
				password_confirmation &&
				password !== password_confirmation
			) {
				return {
					field: "password_confirmation",
					message: "The Password must be the same"
				};
			}
		},
		ValidateEmail(email) {
			let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (email && !re.test(String(email).toLowerCase())) {
				return {
					field: "email",
					message: "This is not a valid email"
				};
			}
		}
	}
});
