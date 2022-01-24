<template>
  <div class="flex flex-col py-2 mb-2 md:mb-4">
    <div class="relative flex flex-row flex-no-wrap justify-between">
      <label :for="name" class="text-xs sm:text-sm py-1 font-bold">{{ label }}</label>
      <div
        v-if="error"
        class="absolute right-0 bg-red-500 p-1 text-xs sm:text-sm  rounded"
      >
        {{ error.message }}
      </div>
    </div>
    <div class="flex flex-row justify-start mt-1">
      <div class="flex flex-col w-full">
        <input
          :value="value ? $moment(value).format('MM/YYYY') : $moment().format('MM/YYYY')"
          type="input"
          :placeholder="format"
          class="bg-transparent border-b-2 focus:border-yellow-400 focus:outline-none py-2 font-bold text-xs sm:text-sm w-full text-center"
          :class="{ inClass, 'border-red-500': error}"
          :style="inStyle"
          :format="format"
          :disabled="disabled"
          @keypress="validateInput($event)"
          @input="$emit('input', $event.target.value)"
        >
        <transition name="drop-down">
          <div
            v-if="error"
            class="text-red-500 py-1 text-xs "
          >
            {{ error.message.charAt(0).toUpperCase() + error.message.slice(1).replace(/_/g, " ") }}
          </div>
        </transition>
      </div>
    </div>
    <transition name="fade">
      <div class="md:static z-10 flex justify-center">
        <div class="rounded-b-lg calendar shadow-md">
          <div
            class="p-2 flex flex-row flex-no-wrap justify-center items-center border-b-2 border-yellow-500"
          >
            <select
              v-model="selectedMonth"
              class="mr-1 text-xs sm:text-sm py-1 px-1 cursor-pointer bg-transparent border-b-2 focus:outline-none"
            >
              <option
                v-for="(month, index) in filteredMonths"
                :key="index"
                :value="month.value"
                class="text-black"
              >
                {{ month.label }}
              </option>
            </select>
            <select
              v-model="selectedYear"
              class="ml-1 text-xs sm:text-sm py-1 px-1 cursor-pointer bg-transparent border-b-2 focus:outline-none"
            >
              <option
                v-for="(year, index) in yearLists"
                :key="index"
                :value="year"
                class="text-black"
              >
                {{ year }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { mixin as clickaway } from "vue-clickaway"
let months = [
	{ label: "Jan", value: "1" },
	{ label: "Feb", value: "2" },
	{ label: "Mar", value: "3" },
	{ label: "Apr", value: "4" },
	{ label: "May", value: "5" },
	{ label: "Jun", value: "6" },
	{ label: "Jul", value: "7" },
	{ label: "Aug", value: "8" },
	{ label: "Sep", value: "9" },
	{ label: "Oct", value: "10" },
	{ label: "Nov", value: "11" },
	{ label: "Dec", value: "12" }
]
export default {
	mixins: [clickaway],
	props: {
		value: String,
		name: String,
		label: String,
		error: Object,
		inStyle: String,
		inClass: String,
		// disabled all dates past the current date
		isAfter: Boolean,
    isBefore: Boolean,
		format: {
			type: String,
			default: "YYYY-MM"
		},
		disabled: Boolean
	},
	data () {
		return {
			modal: false,
			months,
			monthLists: [],
			yearLists: [],
			selectedMonth: this.$moment().utc().subtract(1, 'month').format("M"),
			selectedYear: this.$moment().utc().subtract(1, 'month').format("YYYY"),
			daysInMonth: []
		}
	},
	computed: {
		filteredMonths () {
			if (this.selectedYear === this.$moment().format("YYYY")) {
				if (this.isAfter) {
					return this.months.filter(
						month =>
							parseInt(month.value) >= parseInt(this.$moment().format("M"))
					)
				}
				if (this.isBefore) {
          return this.months.filter(
            month =>
              parseInt(month.value) < parseInt(this.$moment().format("M"))
          )
				}
			}
			return this.months
		}
	},
	watch: {
		selectedMonth (value) {
      this.select(value)
		},
		selectedYear (value) {
      this.select(value)
		}
	},
	created () {
		if (this.value) {
			this.selectedMonth = this.$moment(this.value, this.format).format("M")
			this.selectedYear = this.$moment(this.value, this.format).format("YYYY")
		}
		this.getMonthLists()
		this.getYearLists()
		this.getDaysInMonth(this.selectedMonth, this.selectedYear)
	},
	methods: {
		getMonthLists () {
			for (let i = this.selectedMonth; i <= this.months.length; i++) {
				this.monthLists.push(`${i}`)
			}
		},
		getYearLists () {
			if (!this.isAfter) {
				for (let i = 0; i <= 5; i++) {
					this.yearLists.push(
						this.$moment(this.selectedYear, "YYYY")
							.subtract(i, "years")
							.format("YYYY")
					)
				}
			}
			// for (let i = 0; i <= 10; i++) {
			// 	this.yearLists.push(
			// 		this.$moment(this.selectedYear, "YYYY")
			// 			.add(i, "years")
			// 			.format("YYYY")
			// 	)
			// }

			this.yearLists.sort(function (a, b) {
				return a - b
			})
		},
		isDisabled (date) {
			let newDate = this.$moment.utc().format("MM-DD-YYYY")
			if (this.isBefore) {
				if (this.startDate) {
					return this.$moment(date).isAfter(this.startDate)
				}
				return this.$moment(date, "MM-DD-YYYY").isAfter(
					this.$moment(newDate, "MM-DD-YYYY")
				)
			}
			if (this.isAfter) {
				if (this.startDate) {
					return this.$moment(date).subtract(1, 'd').isBefore(this.startDate)
				}
				return this.$moment(date, "MM-DD-YYYY").subtract(1, 'd').isBefore(
					this.$moment(newDate, "MM-DD-YYYY")
				)
			}
		},
		getDaysInMonth (month, selectedYear) {
			let date = this.$moment(`${selectedYear}-${month}-01`, "YYYY-MM-DD")
			let days = []
			while (date.format("M") === month) {
				days.push({
					day: parseInt(date.format("d")),
					date: parseInt(date.format("D")),
					fullDate: date.format("MM-DD-YYYY")
				})
				date = date.add(1, "days")
			}
			this.daysInMonth = days
		},
		validateInput (e) {
			if ((e.key >= 0 && e.key <= 9) || e.key === "/") {
				return
			} else {
				e.preventDefault()
			}
		},
		select (dateYear) {
      const regex = new RegExp(/^[12][0-9]{3}$/)
      const testYear = regex.test(dateYear)
     
			if (!this.isDisabled(dateYear)) {
        if (testYear === true) {
          this.$emit(
            "input",
            this.$moment(`${this.selectedMonth}-${dateYear}`,"MM-YYYY").format(this.format)
          )
        } else {
          this.$emit(
            "input",
            this.$moment(dateYear, "MM-YYYY").format(this.format)
          )
        }
				
			}
		}
	}
}
</script>
<style scoped>
.calendar {
	min-width: 230px;
	height: auto;
}
@media screen and (min-width: 468px) {
	.calendar {
		width: 330px;
	}
}
@media screen and (min-width: 468px) {
	.date-cell {
		height: 2.5rem;
	}
}
@media screen and (min-width: 640px) {
	.date-cell {
		height: 3rem;
	}
}
</style>


