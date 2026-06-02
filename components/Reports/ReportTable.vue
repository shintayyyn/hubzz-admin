<template>
  <div class="relative">
    <div class="__report_table w-full flex text-xs whitespace-no-wrap overflow-x-auto mt-1">
      <div v-for="column in columnDetails" :key="`columnDetail_${column.key}`" :style="getColumnStyle(column)">
        <!-- HEADER -->
        <div class="flex bg-waterloo text-white font-bold">
          <div class="flex-1 p-2 flex justify-between items-center">
            <div class="whitespace-no-wrap">
              {{ column.title }}
            </div>

            <button v-if="column.sort_key" class="px-1 ml-2" @click="setOrderBy(column.sort_key)">
              <svgicon :name="getSortIconName(column.sort_key)" height="12" width="12" color="white" />
            </button>
          </div>
        </div>

        <!-- ROWS -->
        <div v-for="(item, index) in items" :key="`key_${column.key}_${getItemKey(item, index)}`" class="flex bg-white" :class="getRowClass(column)">
          <template v-if="column.slotName">
            <slot :name="column.slotName" :item="item" />
          </template>

          <span v-else class="whitespace-no-wrap p-2"> &nbsp;{{ column.column(item, index) }} </span>
        </div>

        <!-- SKELETON -->
        <div v-if="loading && items.length === 0">
          <div v-for="n in limit" :key="`limit_${n}`" class="flex bg-white">
            <span class="whitespace-no-wrap p-2">&nbsp;</span>
          </div>
        </div>
      </div>
    </div>

    <!-- LOADING OVERLAY -->
    <div v-if="loading" class="absolute inset-0 flex flex-col items-center justify-center shadow-md bg-gray-200 opacity-50">
      <svgicon name="loader" color="white" width="60" height="60" />
      <span class="text-2xl">Loading...</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    limit: { type: Number, default: 10 },
    loading: { type: Boolean, default: false },
    items: { type: Array, required: true },
    orderBy: { type: Array, default: () => [] },
    columnDetails: { type: Array, default: () => [] },
    getItemKey: { type: Function, default: (item, index) => index }
  },

  computed: {
    orderMap() {
      const map = {}

      this.orderBy.forEach(o => {
        const { col, dir } = this.parseOrderBy(o)
        if (col) map[col] = dir
      })

      return map
    },

    columnStyle() {
      return column => ({
        flexGrow: column.flexGrow,
        flexShrink: column.flexShrink,
        flexBasis: column.flexBasis,
        minWidth: column.minWidth,
        maxWidth: column.maxWidth
      })
    }
  },

  methods: {
    parseOrderBy(value = '') {
      const [col, dir] = value.split(':')
      return {
        col: col ? col.toLowerCase() : null,
        dir: dir ? dir.toLowerCase() : null
      }
    },

    getSortIconName(column) {
      const dir = this.getColumnOrderByDirection(column)

      if (dir === 'asc') return 'sort-ascend'
      if (dir === 'desc') return 'sort-descend'
      return 'sort'
    },

    getColumnOrderByDirection(column) {
      return this.orderMap[column] || null
    },

    setOrderBy(column) {
      let orderBy = [...this.orderBy]

      const index = orderBy.findIndex(o => this.parseOrderBy(o).col === column)

      if (index > -1) {
        const current = this.getColumnOrderByDirection(column)
        orderBy.splice(index, 1)

        if (current === 'asc') {
          orderBy = [`${column}:desc`]
        }
      } else {
        orderBy = [`${column}:asc`]
      }

      this.$emit('setOrderBy', orderBy)
    },

    getColumnStyle(column) {
      return {
        flexGrow: column.flexGrow,
        flexShrink: column.flexShrink,
        flexBasis: column.flexBasis,
        minWidth: column.minWidth,
        maxWidth: column.maxWidth
      }
    },

    getRowClass(column) {
      return [column.justify ? `justify-${column.justify}` : 'justify-start', 'border-b border-dotted border-gray-800']
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
