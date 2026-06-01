<template>
  <div v-on-clickaway="toggledOff" class="flex flex-col py-2 mb-2 md:mb-4">
    <div class="relative flex flex-row flex-no-wrap justify-between">
      <label :for="name" class="text-xs sm:text-sm py-1 font-bold">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
    </div>
    <div class="flex flex-col py-1 justify-start">
      <input
        ref="search"
        v-model="search"
        type="text"
        class="border-b-2 bg-transparent focus:border-yellow-400 focus:outline-none p-2 font-bold text-xs sm:text-sm w-full"
        :class="[error ? 'border-red-500' : '', inClass]"
        :style="inStyle"
        @focus="toggledOn"
        @keydown="handleKeyDownEvent"
        @input="$emit('input', $event.target.value)"
        @blur="$emit('blur')"
      />
      <transition name="drop-down">
        <div v-if="error" class="bg-red-300 text-red-700 py-1 px-2 text-xs">
          {{ error.message.charAt(0).toUpperCase() + error.message.slice(1).replace(/_/g, ' ') }}
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div v-if="showLists" class="relative z-10">
        <div class="w-full absolute bg-white shadow-md">
          <div
            v-for="(item, index) in predictions"
            :key="index"
            class="flex flex-row flex-no-wrap justify-start p-2 text-xs border-b-2 cursor-pointer"
            :class="{ 'bg-white': activeIndex === index }"
            @mouseover="activeIndex = index"
            @click="add()"
          >
            <div>{{ item.label }}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import debounce from 'lodash.debounce'
import { mixin as clickaway } from 'vue-clickaway'

const DEFAULT_URL = '/api/v1/postcodes'
const PREDICTION_LIMIT = 5
const PRACTICE_STATUSES = ['Active', 'Dormant']

export default {
  mixins: [clickaway],
  props: {
    value: [String, Number, Object],
    name: String,
    label: String,
    urlIndex: String,
    dataIndex: String,
    error: Object,
    inStyle: String,
    inClass: String,
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      search: '',
      showLists: false,
      predictions: [],
      activeIndex: 0
    }
  },
  computed: {
    url() {
      return this.urlIndex ? this.urlIndex : DEFAULT_URL
    },
    isPracticeDataIndex() {
      return this.dataIndex === 'practices'
    },
    filteredItems() {
      return this.predictions
    }
  },
  watch: {
    value(post_code) {
      this.search = post_code
    },
    search(value) {
      if (value) {
        this.getPredictions(value)
      } else {
        this.showLists = false
      }
    }
  },
  created() {
    this.search = this.value
  },
  methods: {
    add() {
      let selectedPostCode = this.predictions[this.activeIndex]
      this.predictions = []
      this.showLists = false
      if (this.dataIndex === 'practices') {
        this.$emit('input', selectedPostCode.value)
      } else {
        this.$emit('input', selectedPostCode.label)
      }
    },
    getPredictionParams(input) {
      return {
        search: input,
        offset: 0,
        limit: PREDICTION_LIMIT,
        detailed: this.isPracticeDataIndex ? false : null,
        status: this.isPracticeDataIndex ? PRACTICE_STATUSES.slice() : null
      }
    },
    getResponseItems(res) {
      if (this.dataIndex) {
        return res.data[this.dataIndex]
      }
      return res.data.postcode_coordinates
    },
    getPredictionLabel(item) {
      return this.dataIndex ? item.name : item.postcode
    },
    resetPredictions() {
      this.predictions = []
      this.showLists = false
    },
    setPredictions(items) {
      if (items.length > 0) {
        items.forEach(item => {
          this.predictions.push({
            label: this.getPredictionLabel(item),
            value: item.id
          })
        })
        this.showLists = true
      } else {
        this.resetPredictions()
      }
    },
    getPredictions: debounce(function(input) {
      const params = this.getPredictionParams(input)
      this.predictions = []
      this.$axios.$get(this.url, { params }).then(res => {
        console.log('params', params)
        this.setPredictions(this.getResponseItems(res))
      })
    }, 250),
    toggledOn() {
      if (this.search.length) {
        this.showLists = true
      }
    },
    toggledOff() {
      this.showLists = false
    },
    handleKeyDownEvent() {
      if (!this.showLists) {
        return
      }
      if (event.key === 'ArrowUp') {
        if (this.activeIndex === 0) {
          this.activeIndex = 4
        } else {
          this.activeIndex--
        }
      }
      if (event.key === 'ArrowDown') {
        if (this.activeIndex === 4) {
          this.activeIndex = 0
        } else {
          this.activeIndex++
        }
      }
      if (event.key === 'Enter') {
        this.add()
      }
      if (event.key === 'Escape' || event.key === 'Tab') {
        this.toggledOff()
      }
    }
  }
}
</script>
<style scoped>
.option-list {
  transition: all 0.3s ease-in-out;
  height: 0;
}
.slide-down {
  transition: all 0.3s ease-in-out;
  height: 200px;
}
</style>
