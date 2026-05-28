import Vue from "vue"
Vue.mixin({
	methods: {
		scrollToTop () {
			window.scrollTo(0, 0)
		},
		CheckEmptyField (inputField, fieldName) {
			let trimmedFieldName = fieldName
			if (fieldName.includes('_id')) {
				trimmedFieldName = fieldName.replace(/_id/g, "")
			}
			let displayFieldName = trimmedFieldName.charAt(0).toUpperCase() + trimmedFieldName.slice(1).replace(/_/g, " ")
			
			let index = this.formError.findIndex(item => item.field === fieldName)
			
			if (index >= 0) {
				this.formError.splice(index, 1)
			}

			if (!this.formError) {
				return
			}
			
			if (!(inputField instanceof Array) && !inputField) {
				this.formError.push({
					field: fieldName,
					message: `${displayFieldName} is required`
				})
			}
			if (inputField instanceof Array && !inputField.length) {
				this.formError.push({
					field: fieldName,
					message: `${displayFieldName} is required`
				})
			}
			if (typeof inputField === "boolean" && inputField === false) {
				this.formError.push({
					field: fieldName,
					message: `${displayFieldName} is required`
				})
			}
			if (fieldName.includes("password")) {
				if (inputField.length < 6) {
					this.formError.push({
						field: fieldName,
						message: "Password Must Be At Least 6 Characters"
					})
				}
			}
			if (fieldName === 'email') {
				let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				if (!re.test(String(inputField).toLowerCase())) {
					this.formError.push({
						field: fieldName,
						message: "This is not a valid email"
					})
				}
			}
		},
		Validate (form, lists) {
			let items = Object.entries(form)
			for (const [key, value] of items) {
				let trimmedFieldName = key
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
							})
						}
						if (lists && !lists.includes(key)) {
							this.formError.push({
								field: key,
								message: `${displayFieldName} is required`
							})
						}
					}
				} else {
					if (!value || value.toString().trim().length === 0) {
						if (!lists) {
							this.formError.push({
								field: key,
								message: `${displayFieldName} is required`
							})
						}
						if (lists && !lists.includes(key)) {
							this.formError.push({
								field: key,
								message: `${displayFieldName} is required`
							})
						}
					}
				}
			}

			// console.log("formError", this.formError)

			if (this.formError && this.formError.length) {
				this.scrollToTop()
			}
		},
		ValidateSamePassword (password, password_confirmation) {
			if (
				password &&
				password_confirmation &&
				password !== password_confirmation
			) {
				return {
					field: "password_confirmation",
					message: "The Password must be the same"
				}
			}
		},
		ValidateEmail (email) {
			let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			if (email && !re.test(String(email).toLowerCase())) {
				return {
					field: "email",
					message: "This is not a valid email"
				}
			}
		},
		isNumber (e) {
			// for input type number to avoid entering 'e'
			e = e ? e : window.event
			let charCode = (e.which) ? e.which : e.keyCode
			console.log("charCode", charCode)
			if (charCode === 101 || charCode === 43 || charCode === 45) {
				e.preventDefault()
			} else {
				return true
			}
		},

		inputNumberOnly (e) {
			// numbers only [0-9]
			e = (e) ? e : window.event
			var charCode = (e.which) ? e.which : e.keyCode
			if ((charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 96 || charCode > 105) && (charCode < 37 || charCode > 40))) {
				e.preventDefault()
			} else {
				return true
			}
		},

		isNumberDash (e) {
      var charCode = (e.which) ? e.which : e.keyCode
      // && charCode != 45 
      if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        e.preventDefault()
      }
      return true
		},
		
		alphaNumeric (e) {
			// numbers only [0-9]
			e = (e) ? e : window.event
			var charCode = (e.which) ? e.which : e.keyCode
			let specialKeys = [8, 9, 46, 36, 35, 37, 39]
			if ((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || charCode == 32 || ((charCode >= 97 && charCode <= 122) && ![109, 106, 111, 107].includes(charCode)) || (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode)) {
				return true
			} else {
				e.preventDefault()
			}
		},
		datesToJobParts (dates) {
      const datesDays = dates
        .reduce((datesDays, date) => {
          datesDays[date] = this.$moment(date, 'YYYY-MM-DD').format('dddd')
          return datesDays
        }, {})

      const jobParts = []

      const dayOrder = {
        Monday: 0,
        Tuesday: 1,
        Wednesday: 2,
        Thursday: 3,
        Friday: 4,
        Saturday: 5,
        Sunday: 6,
      }

      dates.forEach((date) => {
        if (jobParts.length === 0) {
          jobParts.push({
            dates: [
              date,
            ],
          })
        } else {
          const lastJobPart = jobParts[jobParts.length - 1]

          const {
            dates: jobPartDates,
          } = lastJobPart

          const lastDate = jobPartDates[jobPartDates.length - 1]

          const lastDateDay = datesDays[lastDate]

          const lastDateDayOrder = dayOrder[lastDateDay]

          const dateDay = datesDays[date]

          const dateDayOrder = dayOrder[dateDay]

          const daysDifference = this.$moment(date, 'YYYY-MM-DD').diff(this.$moment(lastDate, 'YYYY-MM-DD'), 'days')

          const validDaysDifference = dayOrder.Sunday - lastDateDayOrder

          if (lastDateDayOrder <= dateDayOrder && validDaysDifference >= daysDifference) {
            lastJobPart.dates.push(date)
          } else {
            jobParts.push({
              dates: [
                date,
              ],
            })
          }
        }
      })

      return jobParts
    },
	}
})
