<template>
  <div class="flex flex-col py-2 mb-2 md:mb-4">
    <div class="relative flex justify-between">
      <label :for="name" class="text-xs sm:text-sm py-1 font-bold">
        {{ label }}
      </label>

      <div v-if="error" class="absolute right-0 bg-red-500 p-1 text-xs sm:text-sm rounded">
        {{ error.message }}
      </div>
    </div>

    <div class="mt-1 w-full">
      <input
        :value="displayValue"
        type="text"
        :placeholder="format"
        class="bg-transparent border-b-2 focus:border-yellow-400 focus:outline-none py-2 font-bold text-xs sm:text-sm w-full text-center"
        :class="[inClass, { 'border-red-500': error }]"
        :style="inStyle"
        :disabled="disabled"
        @keypress="validateInput"
        @input="$emit('input', $event.target.value)"
      />

      <transition name="drop-down">
        <div v-if="error" class="text-red-500 py-1 text-xs">
          {{ formattedError }}
        </div>
      </transition>
    </div>

    <transition name="fade">
      <div class="md:static z-10 flex justify-center">
        <div class="rounded-b-lg calendar shadow-md">
          <div class="p-2 flex justify-center items-center border-b-2 border-yellow-500">
            <select v-model="selectedMonth" class="mr-1 text-xs sm:text-sm py-1 px-1 bg-transparent border-b-2 focus:outline-none cursor-pointer">
              <option v-for="m in filteredMonths" :key="m.value" :value="m.value">
                {{ m.label }}
              </option>
            </select>

            <select v-model="selectedYear" class="ml-1 text-xs sm:text-sm py-1 px-1 bg-transparent border-b-2 focus:outline-none cursor-pointer">
              <option v-for="y in yearLists" :key="y" :value="y">
                {{ y }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'

const MONTHS = [
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
  mixins: [clickaway],

  props: {
    value: String,
    name: String,
    label: String,
    error: Object,
    inStyle: String,
    inClass: String,
    isAfter: Boolean,
    isBefore: Boolean,
    format: { type: String, default: 'YYYY-MM' },
    disabled: Boolean
  },

  data() {
    const base = this.$moment()
      .utc()
      .subtract(1, 'month')

    return {
      MONTHS,
      selectedMonth: base.format('M'),
      selectedYear: base.format('YYYY'),
      daysInMonth: [],
      yearLists: []
    }
  },

  computed: {
    displayValue() {
      return this.value ? this.$moment(this.value).format('MM/YYYY') : this.$moment().format('MM/YYYY')
    },

    formattedError() {
      if (!this.error?.message) return ''
      return this.error.message.charAt(0).toUpperCase() + this.error.message.slice(1).replace(/_/g, ' ')
    },

    filteredMonths() {
      const currentYear = this.$moment().format('YYYY')
      const currentMonth = parseInt(this.$moment().format('M'))

      if (this.selectedYear !== currentYear) return this.MONTHS

      if (this.isAfter) {
        return this.MONTHS.filter(m => parseInt(m.value) >= currentMonth)
      }

      if (this.isBefore) {
        return this.MONTHS.filter(m => parseInt(m.value) < currentMonth)
      }

      return this.MONTHS
    }
  },

  watch: {
    selectedMonth() {
      this.select()
    },
    selectedYear() {
      this.select()
    }
  },

  created() {
    if (this.value) {
      const m = this.$moment(this.value, this.format)
      this.selectedMonth = m.format('M')
      this.selectedYear = m.format('YYYY')
    }

    this.buildYearLists()
    this.buildDays()
  },

  methods: {
    buildYearLists() {
      const base = this.$moment(this.selectedYear, 'YYYY')
      const years = []

      for (let i = 0; i <= 5; i++) {
        years.push(
          base
            .clone()
            .subtract(i, 'years')
            .format('YYYY')
        )
      }

      this.yearLists = years.sort((a, b) => a - b)
    },

    buildDays() {
      const date = this.$moment(`${this.selectedYear}-${this.selectedMonth}-01`, 'YYYY-MM-DD')
      const days = []

      while (date.format('M') === this.selectedMonth) {
        days.push({
          day: parseInt(date.format('d')),
          date: parseInt(date.format('D')),
          fullDate: date.format('MM-DD-YYYY')
        })
        date.add(1, 'days')
      }

      this.daysInMonth = days
    },

    validateInput(e) {
      const ok = (e.key >= '0' && e.key <= '9') || e.key === '/'
      if (!ok) e.preventDefault()
    },

    isDisabled(date) {
      const now = this.$moment.utc().format('MM-DD-YYYY')

      if (this.isBefore) {
        return this.startDate ? this.$moment(date).isAfter(this.startDate) : this.$moment(date, 'MM-DD-YYYY').isAfter(now)
      }

      if (this.isAfter) {
        return this.startDate
          ? this.$moment(date)
              .subtract(1, 'd')
              .isBefore(this.startDate)
          : this.$moment(date, 'MM-DD-YYYY')
              .subtract(1, 'd')
              .isBefore(now)
      }

      return false
    },

    select() {
      const isYear = /^[12][0-9]{3}$/.test(this.selectedYear)

      if (this.isDisabled(this.selectedYear)) return

      const val = isYear ? this.$moment(`${this.selectedMonth}-${this.selectedYear}`, 'MM-YYYY') : this.$moment(this.selectedYear, 'MM-YYYY')

      this.$emit('input', val.format(this.format))
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
