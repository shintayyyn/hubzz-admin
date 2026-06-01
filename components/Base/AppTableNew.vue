<template>
  <section class="relative">
    <div class="relative">
      <AppLoading :loading="loading" spinner />

      <div class="relative flex flex-col overflow-x-auto w-full" :style="tableStyle">
        <!-- HEADER -->
        <div
          v-if="disabledHeadings === false"
          :style="`min-width: ${customWidth}px`"
          class="row flex justify-start font-bold leading-none text-xs py-2 border-l border-r border-t"
        >
          <div
            v-for="(column, index) in columns"
            :key="`${column}-${index}`"
            class="flex-1 flex items-center"
            :class="getHeadingClasses(column)"
            :style="getHeadingStyle(column)"
            @click="column.sortable && sort(column.dataIndex)"
          >
            <span class="px-2">{{ column.name || column.title }}</span>
            <svgicon v-if="column.sortable" :name="sortIcon(column.dataIndex)" height="12" width="12" />
          </div>
        </div>

        <div v-for="(item, rowIndex) in items" :key="item.id" :style="getRowStyle()" class="row">
          <component :is="getRowComponent(item)" v-bind="getRowBindings(item)">
            <div class="flex justify-start items-center text-xs py-2 border-l border-r stripe-hover" :class="getRowClasses(item, rowIndex)">
              <div
                v-for="(column, index) in columns"
                :key="index"
                :ref="`col${index}`"
                class="flex-1 px-1 break-word hyphens h-full"
                :class="column.class"
                :style="getCellStyle(column, index, rowIndex)"
                style="line-height:20px; "
              >
                <template v-if="Array.isArray(dataCell(item, column))">
                  <div v-for="(cellItem, cellIndex) in dataCell(item, column)" :key="`${cellItem}-${cellIndex}`">
                    {{ cellItem }}
                  </div>
                </template>

                <template v-else>
                  <template v-if="column.slotName">
                    <div v-if="isDirectActionSlot(column)" @click.prevent.stop="$emit(column.eventName, item)">
                      <slot :name="column.slotName" :item="item" />
                    </div>

                    <div v-else :class="column.disableLink ? 'pointer-events-none' : ''">
                      <slot :name="column.slotName" :item="item" @click="$emit(column.eventName, item)" />
                    </div>
                  </template>

                  <template v-if="column.dataIndex === 'actions'">
                    <template v-if="isDropdownColumn(column)">
                      <div class="relative" @click="toggleDropdown(rowIndex)">
                        <div class="flex items-center w-full">
                          <div class="flex flex-col relative w-full">
                            <div
                              class="cursor-pointer rounded flex items-center justify-between px-2 text-xs border border-gray-500 bg-white"
                              :class="isDropdownOpen(rowIndex) ? 'bg-white' : ''"
                            >
                              <span>{{ column.initialDropdown ? column.initialDropdown : 'Select Action' }}</span>
                              <span v-if="!isDropdownOpen(rowIndex)"><svgicon name="caret-down" width="8" /></span>
                            </div>
                            <div v-if="isDropdownOpen(rowIndex)" class="absolute bottom-0 " :class="getDropdownClasses(rowIndex)">
                              <slot name="actions" :item="item" @click="$emit('click', item)" />
                            </div>
                          </div>
                          <span v-if="isDropdownOpen(rowIndex)" class="p-1 bg-orange-400 ml-1 rounded">
                            <svgicon name="left-arrow" style="transform:rotate(180deg)" width="8" />
                          </span>
                        </div>
                      </div>
                    </template>
                    <slot v-else name="actions" :item="item" @click="$emit('click', item)" />
                  </template>

                  <template v-if="column.dataIndex === 'shared'">
                    <slot name="shared" :item="item" @click="$emit('click', item)" />
                  </template>

                  <template v-if="column.dataIndex === 'actions-button'">
                    <slot name="actions-button" :item="item" />
                  </template>

                  <template v-if="!column.slotName">
                    <template v-if="column.class && column.class.includes('localDate') && dataCell(item, column) !== '(none)'">
                      {{ dataCell(item, column) | localDate }}
                    </template>
                    <template v-else-if="column.class && column.class.includes('currency') && dataCell(item, column) !== '(none)'">
                      {{ dataCell(item, column) | currency }}
                    </template>
                    <template v-else-if="column.class && column.class.includes('fileSize') && dataCell(item, column) !== '(none)'">
                      {{ dataCell(item, column) | fileSize }}
                    </template>
                    <template v-else>
                      {{ dataCell(item, column) }}
                    </template>
                  </template>
                </template>
              </div>
            </div>
          </component>
        </div>
      </div>
    </div>

    <div v-if="!loading && total > perPage && disabledPagination === false" class="w-full">
      <AppPagination
        :total="total"
        :totalPages="totalPages"
        :currentPage="currentPage"
        :loading="loading"
        :perPage="perPage"
        @pagechanged="pagechanged"
        @limitchanged="limitchanged"
      />
    </div>
  </section>
</template>

<script>
import AppPagination from '@/components/Base/AppPagination'
import AppLoading from '@/components/Base/AppLoading'

const DEFAULT_MIN_HEIGHT = '60vh'
const DEFAULT_COLUMN_WIDTH = '100px'
const COMPACT_COLUMN_WIDTH = '50px'
const CHECKER_SLOT = 'checker'
const MESSAGE_BUTTON_SLOT = 'messageButton'
const DROPDOWN_CLASS = 'dropdown'
const INVOICE_NUMBER_COLUMN = 'Invoice Number'
const NON_CLICKABLE_STATUS = 'To Be Invoiced'
const NON_CLICKABLE_TYPE = 'Private'

export default {
  components: {
    AppLoading,
    AppPagination
  },

  props: {
    total: {
      type: Number,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    currentPage: {
      type: Number,
      default: 1
    },
    perPage: {
      type: Number,
      default: 15
    },
    columns: {
      type: Array,
      required: true
    },
    orderBy: {
      type: Array,
      required: false
    },
    routerLink: {
      type: [String, Function]
    },
    routerId: {
      type: String
    },
    customWidth: {
      type: [String, Number],
      default: null
    },
    customItemsWidth: {
      type: String,
      default: null
    },
    minHeight: {
      type: String
    },
    noTextResize: {
      type: Boolean,
      default: false
    },
    disabledHeadings: {
      type: Boolean,
      default: false
    },
    disabledPagination: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      params: [],
      dropdownIndex: null
    }
  },

  computed: {
    totalPages() {
      return Math.ceil(this.total / this.perPage)
    },
    tableStyle() {
      return `min-height: ${this.minHeight ? this.minHeight : DEFAULT_MIN_HEIGHT}`
    }
  },

  mounted() {
    this.params = this.orderBy
  },

  methods: {
    getHeadingClasses(column) {
      const columnClasses = column.class ? column.class.split(' ') : []

      return [
        columnClasses.includes('text-center') && 'justify-center text-center',
        columnClasses.includes('md:text-center') && 'md:justify-center md:text-center',
        column.class && column.class,
        column.sortable && 'cursor-pointer'
      ]
    },
    getHeadingStyle(column) {
      return `min-width: ${this.getColumnMinWidth(column, [CHECKER_SLOT])}; ${this.getColumnMaxWidth(column)}`
    },
    getRowStyle() {
      return `${this.customWidth ? `min-width: ${this.customWidth}px` : ``}`
    },
    getRowClasses(item, rowIndex) {
      return [
        this.isClickable(item) ? 'cursor-pointer ' : 'opacity-60 cursor-not-allowed',
        rowIndex % 2 === 0 ? 'stripe-gray' : 'bg-white',
        rowIndex === this.items.length - 1 ? 'border-b' : ''
      ]
    },
    getRowComponent(item) {
      return this.isClickable(item) ? 'nuxt-link' : 'div'
    },
    getRowBindings(item) {
      if (!this.isClickable(item)) {
        return {}
      }

      return {
        to: this.getRouterLink(item)
      }
    },
    getRouterLink(item) {
      if (this.routerLink && {}.toString.call(this.routerLink) === '[object Function]') {
        return this.routerLink(item)
      }

      return {
        path: `${this.routerLink}/${this.routerId ? item[this.routerId] : item.id}`,
        query: { ...this.$route.query }
      }
    },
    getCellStyle(column, index, rowIndex) {
      return `min-width: ${this.getColumnMinWidth(column, [CHECKER_SLOT, MESSAGE_BUTTON_SLOT])}; ${this.getColumnMaxWidth(column)}; ${
        column.dataIndex !== 'actions' ? this.countLines(index, column.width, rowIndex) : ''
      }`
    },
    getColumnMinWidth(column, compactSlots) {
      return column.slotName && compactSlots.includes(column.slotName) ? COMPACT_COLUMN_WIDTH : DEFAULT_COLUMN_WIDTH
    },
    getColumnMaxWidth(column) {
      return column.width ? `max-width: ${column.width}px` : ''
    },
    isDirectActionSlot(column) {
      return column.slotName === CHECKER_SLOT || column.slotName === MESSAGE_BUTTON_SLOT
    },
    isDropdownColumn(column) {
      return column.class.includes(DROPDOWN_CLASS)
    },
    isDropdownOpen(rowIndex) {
      return this.dropdownIndex !== null && this.dropdownIndex === rowIndex
    },
    toggleDropdown(rowIndex) {
      this.dropdownIndex = this.isDropdownOpen(rowIndex) ? null : rowIndex
    },
    getDropdownClasses(rowIndex) {
      return this.items.length > 1 && this.total > this.perPage - 5 && rowIndex === this.items.length - 1 ? 'dropdown-up' : DROPDOWN_CLASS
    },
    isClickable(item) {
      if (!this.routerLink) return false
      if (this.routerId && item[this.routerId] === null) return false

      const invoiceCol = this.columns.find(c => c.name === INVOICE_NUMBER_COLUMN)
      if (invoiceCol && this.dataCell(item, invoiceCol) === '(none)') {
        return false
      }

      const currentStatus = item.invoice_status || item.status
      if (currentStatus === NON_CLICKABLE_STATUS) {
        return false
      }
      if (item.type === NON_CLICKABLE_TYPE) {
        return false
      }
      return true
    },

    sort(dataIndex) {
      if (!this.params.some(item => item.includes(`${dataIndex}`))) {
        this.params = []
        this.params.push(`${dataIndex}:desc`)
      } else {
        let index = this.params.findIndex(item => item === `${dataIndex}:desc`)
        if (index >= 0) {
          this.params.splice(index, 1, `${dataIndex}:asc`)
        } else {
          this.params.splice(
            this.params.findIndex(item => item === `${dataIndex}:asc`),
            1
          )
        }
      }
      this.$emit('sorted', this.params)
    },
    checkClicked(item) {
      this.$emit('toggleCheck', item)
    },
    pagechanged(e) {
      this.$emit('pagechanged', e)
    },
    limitchanged(limit) {
      this.$emit('limitchanged', limit)
    },
    sortIcon(dataIndex) {
      if (Array.isArray(this.params) && this.params.length > 0) {
        return this.params.some(orderBy => orderBy === dataIndex || orderBy === `${dataIndex}:asc`)
          ? 'sort-ascend'
          : this.params.some(orderBy => orderBy === `${dataIndex}:desc`)
          ? 'sort-descend'
          : 'sort'
      } else {
        return ''
      }
    },
    dataCell(item, column) {
      if (column.column instanceof Function) {
        return column.column(item)
      }

      var dataIndexArr = column.dataIndex.split('.')
      let str = null
      if (Array.isArray(item[dataIndexArr[0]])) {
        str = []
        item[dataIndexArr[0]].forEach(item => {
          if (item[dataIndexArr[2]]) {
            str.push(item[dataIndexArr[1]][dataIndexArr[2]])
          } else {
            str.push(item[dataIndexArr[1]])
          }
        })
      } else {
        str = ''
        if (dataIndexArr.length === 1) {
          str = item[dataIndexArr[0]]
        }
        if (dataIndexArr.length === 2 && item[dataIndexArr[0]]) {
          str = item[dataIndexArr[0]][dataIndexArr[1]]
        }
        if (dataIndexArr.length === 3 && item[dataIndexArr[0]] && item[dataIndexArr[0]][dataIndexArr[1]]) {
          str = item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]]
        }
        if (
          dataIndexArr.length === 4 &&
          item[dataIndexArr[0]] &&
          item[dataIndexArr[0]][dataIndexArr[1]] &&
          item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]]
        ) {
          str = item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][dataIndexArr[3]]
        }
        if (
          dataIndexArr.length === 5 &&
          item[dataIndexArr[0]] &&
          item[dataIndexArr[0]][dataIndexArr[1]] &&
          item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][dataIndexArr[3]]
        ) {
          str = item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][dataIndexArr[3]][dataIndexArr[4]]
        }
        if (
          dataIndexArr.length === 6 &&
          item[dataIndexArr[0]] &&
          item[dataIndexArr[0]][dataIndexArr[1]] &&
          item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][dataIndexArr[3]] &&
          item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][dataIndexArr[3]][dataIndexArr[4]]
        ) {
          str = item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][dataIndexArr[3]][dataIndexArr[4]][dataIndexArr[5]]
        }
      }
      if (str === false) {
        str = 'No'
      }
      if (str === true) {
        str = 'Yes'
      }
      if (str === null) {
        str = '(none)'
      }
      return str
    },
    countLines(index, width, rowIndex) {
      if (this.noTextResize) return
      let el = null
      if (this.$refs[`col${index}`]) {
        el = this.$refs[`col${index}`].find((item, ind) => ind === rowIndex)
        if (el) {
          let colHeight = el.offsetHeight
          let lineHeight = parseInt(el.style.lineHeight)
          let lines = colHeight / lineHeight
          if (lines && lines > 1) {
            return `font-size: ${12 - lines}px; line-height: ${12 - lines + 4}px;`
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.row {
  min-width: 1200px;
}
.stripe-gray {
  background-color: #f8f8f8;
}
.stripe-hover:hover {
  background-color: #fee8c7;
}
.table-font-size {
  font-size: 100vb;
  max-height: 50px;
}
.dropdown,
.dropdown-up {
  z-index: 1;
  width: 100%;
  /* margin-top: -4px; */
}
.dropdown {
  top: 0;
}
.dropdown-up {
  bottom: 0;
}
</style>
