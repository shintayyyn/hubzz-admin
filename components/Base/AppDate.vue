<template>
  <div v-on-clickaway="toggledOff" class="flex flex-row items-center py-2 leading-normal flex-wrap">
    <div v-if="label || required" class="relative flex flex-row flex-no-wrap justify-between pr-2">
      <label :for="name" class="text-xs sm:text-sm py-1 font-bold">
        {{ label }}
      </label>
    </div>
    <div class="flex flex-row justify-start mt-1">
      <div class="flex flex-col w-full">
        <input
          :value="value && $moment(value).format('DD/MM/YYYY')"
          type="input"
          :placeholder="customPlaceHolder ? customPlaceHolder : 'DD/MM/YYYY'"
          class="border-b-2 focus:border-yellow-400 focus:outline-none py-1 font-bold sm:text-sm w-full text-center"
          :class="{ inClass, 'bg-orange-300': required, 'border-red-500': error }"
          :style="inStyle"
          :format="format"
          :disabled="disabled"
          @click="modal = true"
          @keypress="validateInput($event)"
        />
        <transition name="drop-down">
          <div v-if="error" class="bg-red-300 text-red-700 py-1 px-2 text-xs">
            {{ formattedErrorMessage }}
          </div>
        </transition>
      </div>
    </div>
    <transition name="fade">
      <div v-if="modal" class="relative z-10 flex justify-start w-full">
        <div class="absolute top-0 rounded-b-lg calendar bg-white shadow-md">
          <div class="p-1 flex flex-row flex-no-wrap justify-start items-center border-b-2 border-yellow-500">
            <div class="m-1 w-1/2 flex flex-no-wrap">
              <select v-model="selectedMonth" class="mr-1 text-xs sm:text-sm py-1 px-1 cursor-pointer bg-transparent border-b-2 focus:outline-none">
                <option v-for="(month, index) in filteredMonths" :key="index" :value="month.value" class="text-black">
                  {{ month.label }}
                </option>
              </select>
              <select v-model="selectedYear" class="ml-1 text-xs sm:text-sm py-1 px-1 cursor-pointer bg-transparent border-b-2 focus:outline-none">
                <option v-for="(year, index) in yearLists" :key="index" :value="year" class="text-black">
                  {{ year }}
                </option>
              </select>
            </div>
            <div class="m-1 w-1/2 flex flex-no-wrap justify-end">
              <span class="mr-1" :class="canGoPreviousMonth ? 'cursor-pointer' : 'cursor-not-allowed'" @click="adjustMonth('previous')">
                <svgicon name="arrow-left" height="12" width="12" :color="canGoPreviousMonth ? '' : 'gray'" />
              </span>
              <span class="ml-1" :class="canGoNextMonth ? 'cursor-pointer' : 'cursor-not-allowed'" @click="adjustMonth('next')">
                <svgicon name="arrow-right" height="12" width="12" :color="canGoNextMonth ? '' : 'gray'" />
              </span>
            </div>
          </div>

          <div class="flex flex-no-wrap justify-between text-xs sm:text-sm mx-1 mt-4">
            <div v-for="weekday in weekdayColumns" :key="weekday.label" class="w-full text-center font-bold">
              {{ weekday.label }}
            </div>
          </div>

          <div class="flex flex-no-wrap justify-between m-1">
            <div v-for="column in calendarColumns" :key="column.label" class="flex flex-col w-full">
              <div v-if="column.hasLeadingBlank">
                <div class="date-cell">
                  &nbsp;
                </div>
              </div>
              <div v-for="(item, index) in column.days" :key="index">
                <div
                  class="rounded-full relative p-1 flex justify-center items-center date-cell"
                  :class="getDateClasses(item)"
                  @click="select(item.fullDate)"
                >
                  <div class="text-xs md:text-sm z-10">
                    {{ item.date }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'

const months = [
  { label: 'Jan', value: '1' },
  { label: 'Feb', value: '2' },
  { label: 'Mar', value: '3' },
  { label: 'Apr', value: '4' },
  { label: 'May', value: '5' },
  { label: 'Jun', value: '6' },
  { label: 'Jul', value: '7' },
  { label: 'Aug', value: '8' },
  { label: 'Sep', value: '9' },
  { label: 'Oct', value: '10' },
  { label: 'Nov', value: '11' },
  { label: 'Dec', value: '12' }
]

const weekdayColumns = [
  { label: 'Mo', day: 1, leadingBlankThreshold: 6 },
  { label: 'Tu', day: 2, leadingBlankThreshold: 5 },
  { label: 'We', day: 3, leadingBlankThreshold: 4 },
  { label: 'Th', day: 4, leadingBlankThreshold: 3 },
  { label: 'Fr', day: 5, leadingBlankThreshold: 2 },
  { label: 'Sa', day: 6, leadingBlankThreshold: 1 },
  { label: 'Su', day: 0, leadingBlankThreshold: 0 }
]

export default {
  mixins: [clickaway],
  props: {
    customPlaceHolder: String,
    value: String,
    name: String,
    label: String,
    error: Object,
    inStyle: String,
    inClass: String,
    isAfter: Boolean,
    isBefore: Boolean,
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    isAfterDate: {
      type: String,
      default: null
    },
    disabled: Boolean,
    required: Boolean
  },
  data() {
    return {
      modal: false,
      months,
      weekdayColumns,
      selectedMonth: this.$moment.utc().format('M'),
      selectedYear: this.$moment.utc().format('YYYY'),
      daysInMonth: []
    }
  },
  computed: {
    yearLists() {
      const years = []
      const currentYear = parseInt(this.$moment().format('YYYY'))
      const minYear = 2022

      if (this.isBefore) {
        for (let year = minYear; year <= currentYear; year++) {
          years.push(year.toString())
        }
      } else if (this.isAfter) {
        for (let i = 0; i <= 10; i++) {
          years.push(
            this.$moment()
              .add(i, 'years')
              .format('YYYY')
          )
        }
      } else {
        // no restriction — show past and future
        for (let year = minYear; year <= currentYear + 10; year++) {
          years.push(year.toString())
        }
      }

      return years
    },

    firstSundayIndex() {
      return this.daysInMonth.findIndex(({ day }) => day === 0)
    },

    formattedErrorMessage() {
      if (!this.error || !this.error.message) {
        return ''
      }

      return this.error.message.charAt(0).toUpperCase() + this.error.message.slice(1).replace(/_/g, ' ')
    },

    minYearInList() {
      return Math.min(...this.yearLists.map(Number))
    },

    maxYearInList() {
      return Math.max(...this.yearLists.map(Number))
    },

    todayYear() {
      return parseInt(this.$moment().format('YYYY'))
    },

    todayMonth() {
      return parseInt(this.$moment().format('M'))
    },

    selectedYearNumber() {
      return parseInt(this.selectedYear)
    },

    selectedMonthNumber() {
      return parseInt(this.selectedMonth)
    },

    canGoPreviousMonth() {
      if (this.selectedYearNumber <= this.minYearInList && this.selectedMonthNumber === 1) {
        return false
      }

      if (this.selectedYearNumber === this.todayYear && this.selectedMonthNumber === this.todayMonth && this.isAfter) {
        return false
      }

      return true
    },

    canGoNextMonth() {
      if (this.isBefore && this.selectedYearNumber === this.todayYear && this.selectedMonthNumber === this.todayMonth) {
        return false
      }

      if (this.selectedYearNumber >= this.maxYearInList && this.selectedMonthNumber === 12) {
        return false
      }

      return true
    },

    calendarColumns() {
      return this.weekdayColumns.map(column => ({
        ...column,
        hasLeadingBlank: this.firstSundayIndex < column.leadingBlankThreshold,
        days: this.daysInMonth.filter(item => item.day === column.day)
      }))
    },

    filteredMonths() {
      if (this.selectedYear === this.$moment().format('YYYY')) {
        if (this.isAfter) {
          return this.months.filter(month => parseInt(month.value) >= parseInt(this.$moment().format('M')))
        }
        if (this.isBefore) {
          return this.months.filter(month => parseInt(month.value) <= parseInt(this.$moment().format('M')))
        }
      }
      return this.months
    }
  },
  watch: {
    selectedMonth(value) {
      this.getDaysInMonth(value.toString(), this.selectedYear)
    },
    selectedYear(value) {
      // set selected month to this current month if selected year === current year
      if (value === this.$moment().format('YYYY')) {
        this.selectedMonth = this.filteredMonths[0].value
      }
      this.getDaysInMonth(this.selectedMonth.toString(), value)
    }
  },
  created() {
    // get current month and year
    if (this.value) {
      this.selectedMonth = this.$moment(this.value, this.format).format('M')
      this.selectedYear = this.$moment(this.value, this.format).format('YYYY')
    }
    this.getDaysInMonth(this.selectedMonth, this.selectedYear)
  },
  methods: {
    isSelectedDate(date) {
      let selectedDate = `${this.selectedYear}-${this.selectedMonth}-${date}`
      return this.$moment(selectedDate, 'YYYY-MM-D').isSame(this.value)
    },
    getDateClasses(item) {
      const disabled = this.isDisabled(item.fullDate)

      return {
        'border-yellow-500 border-2': this.isSame(item.fullDate),
        'text-gray-500': disabled,
        'cursor-pointer hover:bg-gray-400': !disabled,
        'bg-yellow-500 border-yellow-500 border-2': this.isSelectedDate(item.date)
      }
    },
    isSame(date) {
      let newDate = this.$moment().format('MM-DD-YYYY')
      return this.$moment(date, 'MM-DD-YYYY').isSame(newDate)
    },
    isDisabled(date) {
      let newDate = this.$moment.utc().format('MM-DD-YYYY')
      if (this.isBefore) {
        if (this.startDate) {
          return this.$moment(date).isAfter(this.startDate)
        }
        return this.$moment(date, 'MM-DD-YYYY').isAfter(this.$moment(newDate, 'MM-DD-YYYY'))
      }
      if (this.isAfter) {
        return this.$moment(date, 'MM-DD-YYYY')
          .subtract(1, 'd')
          .isBefore(this.$moment(newDate, 'MM-DD-YYYY'))
      }
      if (this.isAfterDate) {
        return this.$moment(date)
          .subtract(1, 'd')
          .isBefore(this.isAfterDate)
      }
    },
    toggledOff() {
      // get to the selected date
      if (this.value) {
        let month = this.$moment(this.value, 'YYYY-MM-DD').format('M')
        let year = this.$moment(this.value, 'YYYY-MM-DD').format('YYYY')
        this.selectedMonth = month
        this.selectedYear = year
      }
      this.modal = false
    },
    adjustMonth(type) {
      if (type === 'previous') {
        if (!this.canGoPreviousMonth) return

        if (this.selectedMonthNumber > 1) {
          this.selectedMonth = this.selectedMonthNumber - 1
        } else {
          this.selectedMonth = 12
          this.selectedYear = this.selectedYearNumber - 1
        }
      }

      if (type === 'next') {
        if (!this.canGoNextMonth) return

        if (this.selectedMonthNumber === 12) {
          this.selectedYear = this.selectedYearNumber + 1
          this.selectedMonth = 1
        } else {
          this.selectedMonth = this.selectedMonthNumber + 1
        }
      }
    },
    getDaysInMonth(month, selectedYear) {
      let date = this.$moment(`${selectedYear}-${month}-01`, 'YYYY-MM-DD')
      let days = []
      while (date.format('M') === month) {
        days.push({
          day: parseInt(date.format('d')),
          date: parseInt(date.format('D')),
          fullDate: date.format('MM-DD-YYYY')
        })
        date = date.add(1, 'days')
      }
      this.daysInMonth = days
    },
    validateInput(e) {
      if ((e.key >= 0 && e.key <= 9) || e.key === '/') {
        return
      } else {
        e.preventDefault()
      }
    },
    select(date) {
      if (!this.isDisabled(date)) {
        this.modal = false
        this.$emit('input', this.$moment(date, 'MM-DD-YYYY').format(this.format))
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
