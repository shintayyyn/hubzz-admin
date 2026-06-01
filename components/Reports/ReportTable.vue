<template>
  <div class="relative">
    <div class="__report_table w-full flex text-xs whitespace-no-wrap overflow-x-auto mt-1">
      <div v-for="columnDetail in columnDetails" :key="`columnDetail_${columnDetail.key}`" :style="columnStyle(columnDetail)">
        <div class="flex bg-waterloo text-white font-bold">
          <div class="flex-1 p-2 flex justify-between items-center">
            <div class="whitespace-no-wrap">
              {{ columnDetail.title }}
            </div>
            <button v-if="columnDetail.sort_key" class="px-1 ml-2" @click="setOrderBy(columnDetail.sort_key)">
              <svgicon :name="getSortIconName(columnDetail.sort_key)" height="12" width="12" color="white" />
            </button>
          </div>
        </div>

        <div
          v-for="(item, index) in items"
          :key="`key_${columnDetail.key}_${getItemKey(item, index)}`"
          class="flex bg-white"
          :class="[
            columnDetail.justify ? `justify-${columnDetail.justify}` : 'justify-start',
            index !== item.length - 1 ? 'border-dotted border-b border-gray-800' : ''
          ]"
        >
          <template v-if="columnDetail.slotName">
            <slot :name="columnDetail.slotName" :item="item" />
          </template>
          <span v-else class="whitespace-no-wrap p-2">&nbsp;{{ columnDetail.column(item, index) }}</span>
        </div>
        <div v-if="loading && items.length === 0">
          <div v-for="(item, index) in limit" :key="`limit_${index}`" class="flex bg-white">
            <span class="whitespace-no-wrap p-2">&nbsp;</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="absolute inset-0 flex flex-col items-center justify-center shadow-md bg-gray-200 opacity-50">
      <svgicon name="loader" color="white" width="60" height="60" />
      <span class="text-2xl">Loading...</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    limit: {
      type: Number,
      default: 10
    },
    loading: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      required: true
    },
    orderBy: {
      type: Array,
      default: () => []
    },
    columnDetails: {
      type: Array,
      default: () => []
    },
    getItemKey: {
      type: Function,
      default: (item, index) => index
    }
  },

  computed: {
    getColumnOrderByDirection() {
      return column => {
        const index = this.orderBy.findIndex(orderBy => {
          const { col } = this.parseOrderBy(orderBy)
          return col === column
        })

        if (index > -1) {
          const { dir } = this.parseOrderBy(this.orderBy[index])

          return dir === 'desc' ? 'desc' : 'asc'
        }

        return null
      }
    },

    columnStyle() {
      return columnDetail => {
        return {
          flexGrow: columnDetail.flexGrow,
          flexShrink: columnDetail.flexShrink,
          flexBasis: columnDetail.flexBasis,
          minWidth: columnDetail.minWidth,
          maxWidth: columnDetail.maxWidth
        }
      }
    }
  },

  methods: {
    parseOrderBy(orderByValue) {
      const [_col, _dir] = orderByValue.split(':')
      const col = _col ? _col.toLowerCase() : null
      const dir = _dir ? _dir.toLowerCase() : null

      return { col, dir }
    },

    getSortIconName(column) {
      const direction = this.getColumnOrderByDirection(column)

      if (direction === 'asc') {
        return 'sort-ascend'
      }

      if (direction === 'desc') {
        return 'sort-descend'
      }

      return 'sort'
    },

    setOrderBy(column) {
      let orderBy = [...this.orderBy]

      const index = orderBy.findIndex(orderBy => {
        const { col } = this.parseOrderBy(orderBy)
        return col === column
      })

      if (index > -1) {
        let direction = this.getColumnOrderByDirection(column)

        orderBy.splice(index, 1)

        if (direction === 'asc') {
          orderBy = [`${column}:desc`]
        }
      } else {
        orderBy = [column]
      }

      this.$emit('setOrderBy', orderBy)
    }
  }
}
</script>

<style>
.__report_table::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.__report_table::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.__report_table::-webkit-scrollbar-track:hover {
  background: rgba(0, 0, 0, 0.116);
  border-radius: 3px;
}

.__report_table::-webkit-scrollbar-thumb {
  background: #a1a8b9;
  border-radius: 3px;
}

.__report_table::-webkit-scrollbar-thumb:hover {
  background: #7b8396;
}
</style>
