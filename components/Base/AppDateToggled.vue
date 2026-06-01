<template>
  <div class="flex flex-col py-2 mb-2 md:mb-4">
    <div class="relative flex flex-row flex-no-wrap justify-between">
      <label :for="name" class="text-xs sm:text-sm py-1 font-bold">{{ label }}</label>
      <div v-if="error" class="absolute right-0 bg-red-500 p-1 text-xs sm:text-sm text-white rounded">
        {{ error.message }}
      </div>
    </div>
    <div class="flex flex-row justify-start mt-1">
      <div class="flex flex-col w-full">
        <input
          :value="value ? $moment(value).format('DD/MM/YYYY') : $moment().format('DD/MM/YYYY')"
          type="input"
          :placeholder="format"
          class="border-b-2 focus:border-yellow-400 focus:outline-none py-2 font-bold text-xs sm:text-sm w-full text-center"
          :class="{ inClass, 'border-red-500': error }"
          :style="inStyle"
          :format="format"
          :disabled="disabled"
          @keypress="validateInput($event)"
          @input="$emit('input', $event.target.value)"
        />
        <transition name="drop-down">
          <div v-if="error" class="text-red-500 py-1 text-xs text-white">
            {{ error.message.charAt(0).toUpperCase() + error.message.slice(1).replace(/_/g, ' ') }}
          </div>
        </transition>
      </div>
    </div>
    <transition name="fade">
      <div class="md:static z-10 flex justify-center">
        <div class="rounded-b-lg calendar bg-white shadow-md">
          <div class="p-2 flex flex-row flex-no-wrap justify-start items-center border-b-2 border-yellow-500">
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
              <span
                class="mr-1"
                :class="selectedYear == yearLists[0] && selectedMonth == 1 ? 'cursor-not-allowed' : 'cursor-pointer'"
                @click="adjustMonth('previous')"
              >
                <svgicon name="arrow-left" height="12" width="12" :color="selectedYear == yearLists[0] && selectedMonth == 1 ? 'gray' : ''" />
              </span>
              <span
                class="ml-1"
                :class="
                  (isBefore && selectedYear == $moment().format('YYYY') && parseInt(selectedMonth) == parseInt($moment().format('M'))) ||
                    (selectedYear == yearLists[yearLists.length - 1] && selectedMonth == 12)
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
                "
                @click="adjustMonth('next')"
              >
                <svgicon
                  name="arrow-right"
                  height="12"
                  width="12"
                  :color="
                    (isBefore && selectedYear == $moment().format('YYYY') && parseInt(selectedMonth) == parseInt($moment().format('M'))) ||
                      (selectedYear == yearLists[yearLists.length - 1] && selectedMonth == 12)
                      ? 'gray'
                      : ''
                  "
                />
              </span>
            </div>
          </div>

          <div class="flex flex-no-wrap justify-between text-xs sm:text-sm mx-1 mt-4">
            <div class="w-full text-center font-bold">
              Mo
            </div>
            <div class="w-full text-center font-bold">
              Tu
            </div>
            <div class="w-full text-center font-bold">
              We
            </div>
            <div class="w-full text-center font-bold">
              Th
            </div>
            <div class="w-full text-center font-bold">
              Fr
            </div>
            <div class="w-full text-center font-bold">
              Sa
            </div>
            <div class="w-full text-center font-bold">
              Su
            </div>
          </div>

          <div class="flex flex-no-wrap justify-between m-1">
            <div class="flex flex-col w-full">
              <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 6">
                <div class="date-cell">
                  &nbsp;
                </div>
              </div>
              <div v-for="(item, index) in daysInMonth" :key="index">
                <div
                  v-if="item.day === 1"
                  class="rounded-full relative p-1 flex justify-center items-center date-cell"
                  :class="{
                    'border-yellow-500 border-2': isSame(item.fullDate),
                    'text-gray-500': isDisabled(item.fullDate),
                    'cursor-pointer hover:bg-gray-400': !isDisabled(item.fullDate),
                    'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date, item)
                  }"
                  @click="select(item.fullDate)"
                >
                  <div class="text-xs md:text-sm z-10">
                    {{ item.date }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col w-full">
              <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 5">
                <div class="date-cell">
                  &nbsp;
                </div>
              </div>
              <div v-for="(item, index) in daysInMonth" :key="index">
                <div
                  v-if="item.day === 2"
                  class="rounded-full relative p-1 flex justify-center items-center date-cell"
                  :class="{
                    'border-yellow-500 border-2': isSame(item.fullDate),
                    'text-gray-500': isDisabled(item.fullDate),
                    'cursor-pointer hover:bg-gray-400': !isDisabled(item.fullDate),
                    'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date, item)
                  }"
                  @click="select(item.fullDate)"
                >
                  <div class="text-xs md:text-sm z-10">
                    {{ item.date }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col w-full">
              <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 4">
                <div class="date-cell">
                  &nbsp;
                </div>
              </div>
              <div v-for="(item, index) in daysInMonth" :key="index">
                <div
                  v-if="item.day === 3"
                  class="rounded-full relative p-1 flex justify-center items-center date-cell"
                  :class="{
                    'border-yellow-500 border-2': isSame(item.fullDate),
                    'text-gray-500': isDisabled(item.fullDate),
                    'cursor-pointer hover:bg-gray-400': !isDisabled(item.fullDate),
                    'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date)
                  }"
                  @click="select(item.fullDate)"
                >
                  <div class="text-xs md:text-sm z-10">
                    {{ item.date }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col w-full">
              <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 3">
                <div class="date-cell">
                  &nbsp;
                </div>
              </div>
              <div v-for="(item, index) in daysInMonth" :key="index">
                <div
                  v-if="item.day === 4"
                  class="rounded-full relative p-1 flex justify-center items-center date-cell"
                  :class="{
                    'border-yellow-500 border-2': isSame(item.fullDate),
                    'text-gray-500': isDisabled(item.fullDate),
                    'cursor-pointer hover:bg-gray-400': !isDisabled(item.fullDate),
                    'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date)
                  }"
                  @click="select(item.fullDate)"
                >
                  <div class="text-xs md:text-sm z-10">
                    {{ item.date }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col w-full">
              <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 2">
                <div class="date-cell">
                  &nbsp;
                </div>
              </div>
              <div v-for="(item, index) in daysInMonth" :key="index">
                <div
                  v-if="item.day === 5"
                  class="rounded-full relative p-1 flex justify-center items-center date-cell"
                  :class="{
                    'border-yellow-500 border-2': isSame(item.fullDate),
                    'text-gray-500': isDisabled(item.fullDate),
                    'cursor-pointer hover:bg-gray-400': !isDisabled(item.fullDate),
                    'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date)
                  }"
                  @click="select(item.fullDate)"
                >
                  <div class="text-xs md:text-sm z-10">
                    {{ item.date }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col w-full">
              <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 1">
                <div class="date-cell">
                  &nbsp;
                </div>
              </div>
              <div v-for="(item, index) in daysInMonth" :key="index">
                <div
                  v-if="item.day === 6"
                  class="rounded-full relative p-1 flex justify-center items-center date-cell"
                  :class="{
                    'border-yellow-500 border-2': isSame(item.fullDate),
                    'text-gray-500': isDisabled(item.fullDate),
                    'cursor-pointer hover:bg-gray-400': !isDisabled(item.fullDate),
                    'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date)
                  }"
                  @click="select(item.fullDate)"
                >
                  <div class="text-xs md:text-sm z-10">
                    {{ item.date }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col w-full">
              <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 0">
                <div class="date-cell">
                  &nbsp;
                </div>
              </div>
              <div v-for="(item, index) in daysInMonth" :key="index">
                <div
                  v-if="item.day === 0"
                  class="rounded-full relative p-1 flex justify-center items-center date-cell"
                  :class="{
                    'border-yellow-500 border-2': isSame(item.fullDate),
                    'text-gray-500': isDisabled(item.fullDate),
                    'cursor-pointer hover:bg-gray-400': !isDisabled(item.fullDate),
                    'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date)
                  }"
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
let months = [
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
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    error: {
      type: Object,
      default: null
    },
    inStyle: {
      type: String,
      default: ''
    },
    inClass: {
      type: String,
      default: ''
    },
    // disabled all dates past the current date
    isAfter: Boolean,
    isBefore: Boolean,
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    disabled: Boolean
  },
  data() {
    return {
      months,
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
      // this.value = this.$moment(this.value).format('YYYY-MM-DD')
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
        if (this.startDate) {
          return this.$moment(date)
            .subtract(1, 'd')
            .isBefore(this.startDate)
        }
        return this.$moment(date, 'MM-DD-YYYY')
          .subtract(1, 'd')
          .isBefore(this.$moment(newDate, 'MM-DD-YYYY'))
      }
    },

    adjustMonth(type) {
      const currentYear = parseInt(this.selectedYear)
      const currentMonth = parseInt(this.selectedMonth)
      const todayYear = parseInt(this.$moment().format('YYYY'))
      const todayMonth = parseInt(this.$moment().format('M'))
      const minYear = Math.min(...this.yearLists.map(Number))
      const maxYear = Math.max(...this.yearLists.map(Number))

      if (type === 'previous') {
        // Stop at Jan of the minimum year
        if (currentYear <= minYear && currentMonth === 1) return
        // Stop at current month if isAfter
        if (currentYear === todayYear && currentMonth === todayMonth && this.isAfter) return

        if (currentMonth > 1) {
          this.selectedMonth = currentMonth - 1
        } else {
          this.selectedMonth = 12
          this.selectedYear = currentYear - 1
        }
      }

      if (type === 'next') {
        // Stop at current month/year if isBefore
        if (this.isBefore && currentYear === todayYear && currentMonth === todayMonth) return
        // Stop at Dec of the maximum year
        if (currentYear >= maxYear && currentMonth === 12) return

        if (currentMonth === 12) {
          this.selectedYear = currentYear + 1
          this.selectedMonth = 1
        } else {
          this.selectedMonth = currentMonth + 1
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
