<template>
  <div class="relative">
    <div class="__content_management_table w-full flex whitespace-no-wrap overflow-x-auto mt-1">
      <div v-for="(columnDetail, columnDetailIndex) in columnDetails" :key="`columnDetail_${columnDetail.key}`" :style="columnStyle(columnDetail)">
        <div class="flex text-white font-bold p-2">
          <div class="flex-1 p-1 flex justify-between items-center">
            <div class="whitespace-no-wrap">
              <span>{{ columnDetail.title }}</span>
              <span>&nbsp;</span>
            </div>
            <button v-if="columnDetail.sort_key" class="px-1 ml-2" @click="setOrderBy(columnDetail.sort_key)">
              <span v-if="getColumnOrderByDirection(columnDetail.sort_key) === null">
                <svgicon name="sort" height="12" width="12" color="white" />
              </span>
              <span v-if="getColumnOrderByDirection(columnDetail.sort_key) === 'asc'">
                <svgicon name="sort-ascend" height="12" width="12" color="white" />
              </span>
              <span v-if="getColumnOrderByDirection(columnDetail.sort_key) === 'desc'">
                <svgicon name="sort-descend" height="12" width="12" color="white" />
              </span>
            </button>
          </div>
        </div>

        <div @mouseout="hoveredIndex = -1">
          <template
            v-for="(item, index) in items"
          >
            <nuxt-link
              v-if="getItemLink(item, index)"
              :ref="`key_${columnDetail.key}_${getItemKey(item, index)}`"
              :key="`key_${columnDetail.key}_${getItemKey(item, index)}`"
              :to="getItemLink(item, index)"
              class="flex bg-waterloo text-white mb-2 p-2 transitions-colors duration-150 ease-liner"
              :class="[
                columnDetail.justify ? `justify-${columnDetail.justify}` : 'justify-start',
                columnDetailIndex === 0 ? 'rounded-l-lg' : '',
                columnDetailIndex === columnDetails.length - 1 ? 'rounded-r-lg' : '',
                hoveredIndex === index ? 'bg-waterloo-dark' : '',
              ]"
              @mouseover.native="hoveredIndex = index"
              @dragstart.native.prevent
            >
              <span
                class="whitespace-no-wrap p-1 cursor-default cursor-text select-text"
                @click.prevent
                @dblclick="$refs[`key_${columnDetail.key}_${getItemKey(item, index)}`][0].$el.click()"
              >
                <span>&nbsp;</span>
                <span>{{ columnDetail.column(item, index) }}</span>
              </span>
            </nuxt-link>
            <span
              v-if="!getItemLink(item, index)"
              :key="`key_${columnDetail.key}_${getItemKey(item, index)}`"
              class="flex bg-waterloo text-white mb-2 p-2 transitions-colors duration-150 ease-liner"
              :class="[
                columnDetail.justify ? `justify-${columnDetail.justify}` : 'justify-start',
                columnDetailIndex === 0 ? 'rounded-l-lg' : '',
                columnDetailIndex === columnDetails.length - 1 ? 'rounded-r-lg' : '',
              ]"
              @mouseover="hoveredIndex = index"
            >
              <span
                class="whitespace-no-wrap p-1 cursor-default cursor-text select-text"
                @click.prevent
              >
                <span>&nbsp;</span>
                <span>{{ columnDetail.column(item, index) }}</span>
              </span>
            </span>
          </template>
        </div>
        
        <div v-for="(item, index) in limit" v-if="loading && items.length === 0" :key="`limit_${index}`" class="flex bg-waterloo text-white mb-2 p-2">
          <span class="whitespace-no-wrap p-1">&nbsp;</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="absolute inset-0 flex flex-col items-center justify-center shadow-md bg-gray-800">
      <svgicon name="loader" color="white" width="60" height="60" />
      <span class="text-white text-2xl">Loading...</span>
    </div>
  </div>
</template>

<script>
  export default {

    props: {
      limit: {
        type: Number,
        default: 10,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      items: {
        type: Array,
        required: true,
      },
      orderBy: {
        type: Array,
        default: () => [],
      },
      columnDetails: {
        type: Array,
        default: () => [],
      },
      getItemKey: {
        type: Function,
        default: (item, index) => index,
      },
      getItemLink: {
        type: Function,
        default: () => '/compliance-documents',
      },
    },
    data () {
      return {
        hoveredIndex: -1,
      }
    },

    computed: {
      getColumnOrderByDirection () {
        return column => {
          const index = this.orderBy.findIndex((orderBy) => {
            const [_col] = orderBy.split(":")
            const col = _col ? _col.toLowerCase() : null
            return col === column
          })

          if (index > -1) {
            const _dir = this.orderBy[index].split(":")[1]

            return _dir && _dir.toLowerCase() === 'desc' ? 'desc' : 'asc'
          }

          return null
        }
      },

      columnStyle () {
        return (columnDetail) => {
          return {
            flexGrow: columnDetail.flexGrow,
            flexShrink: columnDetail.flexShrink,
          }
        }
      },
    },

    methods: {
      setOrderBy (column) {
        let orderBy = [...this.orderBy]

        const index = orderBy.findIndex((orderBy) => {
          const [_col] = orderBy.split(":")
          const col = _col ? _col.toLowerCase() : null
          return col === column
        })

        if (index > -1) {
          let direction = this.getColumnOrderByDirection(column)

          orderBy.splice(index, 1)

          if (direction === "asc") {
            // orderBy.push(`${column}:desc`)
            orderBy = [`${column}:desc`]
          }
        } else {
          // orderBy.push(column)
          orderBy = [column]
        }

        this.$emit('setOrderBy', orderBy)
      },
    },
  }

</script>

<style>
  .__content_management_table::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  .__content_management_table::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }

  .__content_management_table::-webkit-scrollbar-track:hover {
    background: rgba(0, 0, 0, 0.116);
    border-radius: 3px;
  }

  .__content_management_table::-webkit-scrollbar-thumb {
    background: #a1a8b9;
    border-radius: 3px;
  }

  .__content_management_table::-webkit-scrollbar-thumb:hover {
    background: #7b8396;
  }
</style>
