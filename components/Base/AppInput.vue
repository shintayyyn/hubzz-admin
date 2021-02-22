<template>
  <section>
    <!-- text / email / password / time / select / textarea / multicheckbox / number -->
    <template
      v-if="
        [
          'text',
          'time',
          'email',
          'password',
          'select',
          'textarea',
          'multi-checkbox',
          'number',
          'numberText',
          'numberDash'
        ].includes(type)
      "
    >
      <div class="flex flex-col py-3">
        <div
          class="relative flex justify-between flex-wrap leading-none"
        >
          <label :for="name" class="text-xs sm:text-sm py-1 pr-2 font-bold">{{ label }} <span v-if="required" class="text-red-500">*</span></label>
          
          <div v-if="info || error" class="flex items-center">
            <div
              v-if="info"
              class="bg-gray-300 text-black rounded px-1 md:px-4 py-1 text-xs sm:text-sm"
            >
              {{ info }}
            </div>
            <div
              v-if="error && (type.includes('checkbox'))"
              class="text-red-700 py-1 text-xs"
            >
              {{
                error.message.charAt(0).toUpperCase() +
                  error.message.slice(1).replace(/_/g, " ")
              }}
            </div>
          </div>
        </div>

        <!-- multi-checkbox -->
        <template v-if="type === 'multi-checkbox'">
          <div
            v-for="(item, index) in lists"
            :key="index"
            class="flex flex-row justify-start items-center mt-1"
          >
            <input
              :id="`${name}-${index}`"
              :value="item.value"
              type="checkbox"
              :checked="Array.isArray(value) ? value.includes(item.value) : value"
              :class="inClass"
              :style="inStyle"
              @input="inputMultiCheck"
            >
            <label
              :for="`${name}-${index}`"
              class="text-xs sm:text-sm flex items-center"
            >{{ item.label }}</label>
          </div>
        </template>

        <template v-else>
          <div class="flex flex-row justify-start">
            <template
              v-if="
                ['text', 'time', 'email', 'number', 'numberDash', 'numberText'].includes(type)
              "
            >
              <div class="flex flex-col w-full">
                <input
                  :value="value"
                  :type="type"
                  :placeholder="placeholder"
                  class="bg-transparent border-b-2 focus:outline-none py-3 font-bold text-xs sm:text-sm w-full"
                  :class="[
                    error ? 'border-red-500' : 'focus:border-yellow-500', 
                    disabled ? 'border-gray-500 text-gray-500 cursor-not-allowed' : 'cursor-pointer',
                    inClass
                  ]"
                  :maxlength="limit"
                  :max="maxInput"
                  :style="inStyle"
                  :checked="value"
                  :disabled="disabled"
                  :min="type === 'number' && 0"
                  step="any"
                  @input="$emit('input', $event.target.value)"
                  @keypress="type === 'number' ? isNumber($event) : type === 'numberDash' || type === 'numberText' ? isNumberDash($event) : $emit('keypress')"
                  @blur="$emit('blur')"
                >
                <div v-if="error" class="text-red-700 py-1 text-xs">
                  {{
                    error.message.charAt(0).toUpperCase() +
                      error.message.slice(1).replace(/_/g, " ")
                  }}
                </div>
              </div>
            </template>

            <template v-if=" type === 'password' ">
              <div class="relative w-full mb-4">
                <input
                  class="w-full bg-transparent py-2 outline-none border-b-2 pr-6"
                  :value="value"
                  :type="togglePassword()"
                  :placeholder="placeholder"
                  :class="[error ? 'border-red-500' : 'focus:border-yellow-500', inClass]"
                  :style="inStyle"
                  @input="$emit('input', $event.target.value)"
                  @keypress.enter="$emit('submit')"
                  @blur="$emit('blur')"
                  @focus="showPasswordFocus = true"
                >
                <button class="absolute right-0 h-full" :class="error && '-mt-2'" tabindex="-1" @click="passwordToggle = !passwordToggle">
                  <svgicon v-if="togglePassword() === 'password'" name="eye" width="20" height="20" class="hover:text-gray-500 fill-current" />
                  <svgicon v-else name="hide-eye" width="20" height="20" class="hover:text-gray-500 fill-current" />
                </button>
                
                <div v-if="error" class="text-red-700 py-1 text-xs">
                  {{
                    error.message.charAt(0).toUpperCase() +
                      error.message.slice(1).replace(/_/g, " ")
                  }}
                </div>
              </div>
            </template>

            <!-- select -->
            <template v-if="type === 'select'">
              <div class="flex flex-col w-full items-start">
                <div
                  class="flex w-full relative customized-select pt-4 pb-5"
                  :class="multiple ? 'flex-col' : 'items-center'"
                >
                  <select
                    ref="inputSelect"
                    :value="value"
                    class="appearance-none border-b-2 focus:border-yellow-400 focus:outline-none py-2 font-bold text-xs sm:text-sm w-full"
                    :class="[
                      error && !disabled && 'border-red-500',
                      disabled ? 'border-gray-500 text-gray-500 cursor-not-allowed' : 'cursor-pointer',
                      multiple ? 'bg-white mt-4' : 'bg-transparent absolute',
                      inClass
                    ]"
                    :multiple="multiple"
                    :style="inStyle"
                    :disabled="disabled"
                    @input="$emit('input', $event.target.value)"
                    @change="$emit('change', $event.target.value)"
                    @blur="$emit('blur')"
                  >
                    <option v-if="placeholder" value disabled selected>
                      {{
                        placeholder
                      }}
                    </option>
                    <option
                      v-for="(item, index) in items"
                      :key="index"
                      :value="item.value"
                      :selected="value === item.value"
                      class="text-black"
                    >
                      {{ item.label }}
                    </option>
                  </select>
                  <span v-if="!multiple" class="absolute right-0">
                    <svgicon
                      name="arrow-up"
                      class="h-full w-10 p-2 fill-current"
                      style="transform: rotate(180deg)"
                    />
                  </span>
                </div>
                <div
                  v-if="error && (type === 'select' || type.includes('checkbox'))"
                  class="text-red-700 py-1 text-xs w-full mt-2"
                >
                  {{
                    error.message.charAt(0).toUpperCase() +
                      error.message.slice(1).replace(/_/g, " ")
                  }}
                </div>
              </div>
            </template>

            <!-- text area -->
            <template v-if="type === 'textarea'">
              <div class="flex flex-col w-full">
                <textarea
                  id
                  :cols="cols"
                  :rows="rows"
                  :value="value"
                  :placeholder="placeholder"
                  class="bg-transparent border-b-2 focus:border-yellow-400 focus:outline-none py-4 px-2 font-bold text-xs sm:text-sm w-full"
                  :class="[
                    error ? 'border-red-500' : '',
                    resize ? '' : 'resize-none',
                    inClass
                  ]"
                  @input="$emit('input', $event.target.value)"
                  @blur="$emit('blur', $event)"
                />
                <div
                  v-if="error"
                  class="text-red-700 py-1 text-xs"
                >
                  {{
                    error.message.charAt(0).toUpperCase() +
                      error.message.slice(1).replace(/_/g, " ")
                  }}
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </template>

    <!-- single checkbox -->
    <template v-if="type === 'single-checkbox'">
      <div class="flex flex-col py-2 mb-2">
        <div class="flex justify-end">
          <div
            v-if="error"
            class="rounded-lg bg-red-500 bg-red-300 text-red-700 py-1 px-2 text-xs sm:text-sm text-white"
          >
            {{
              error.message.charAt(0).toUpperCase() +
                error.message.slice(1).replace(/_/g, " ")
            }}
          </div>
        </div>
        <div class="flex flex-row flex-no-wrap justify-start items-center">
          <input
            :id="name"
            type="checkbox"
            :checked="value"
            :disabled="disabled"
            :class="inClass"
            :style="inStyle"
            @change="$emit('input', $event.target.checked)"
          >
          <label
            :for="name"
            class="text-xs sm:text-sm py-1 flex items-center"
          >{{ label }}</label>
        </div>
      </div>
    </template>

    <!-- multiemail -->
    <template v-if="type === 'multiemail'">
      <div class="flex flex-col py-2 mb-3 md:mb-6">
        <div class="relative flex flex-row flex-wrap justify-between">
          <div class="flex flex-wrap justify-start">
            <label :for="name" class="text-xs sm:text-sm py-1">{{
              label
            }}</label>
            <span class="ml-2 bg-gray-300 rounded px-4 py-1 text-xs">Seperate with commas</span>
          </div>
          <div
            v-if="error"
            class="absolute right-0 bg-red-500 py-1 px-2 text-xs sm:text-sm text-white"
          >
            {{
              error.message.charAt(0).toUpperCase() +
                error.message.slice(1).replace(/_/g, " ")
            }}
          </div>
        </div>
        <div class="flex flex-row justify-start">
          <input
            :value="value"
            type="email"
            :placeholder="placeholder"
            class="border-b-2 focus:border-yellow-400 focus:outline-none py-4 font-bold text-xs sm:text-sm w-full"
            :class="[error ? 'border-red-600' : '', inClass]"
            :style="inStyle"
            @input="$emit('input', $event.target.value)"
          >
        </div>
      </div>
    </template>

    <!-- search -->
    <template v-if="type === 'search'">
      <div v-if="type === 'search'" class="flex flex-col">
        <div
          v-if="label"
          class="relative flex flex-row flex-wrap justify-between"
        >
          <label :for="name" class="text-xs sm:text-sm py-1">{{ label }}</label>
          <div class="flex">
            <div
              v-if="info"
              class="bg-gray-300 rounded px-4 py-1 text-xs sm:text-sm"
            >
              {{ info }}
            </div>
            <div
              v-if="error"
              class="absolute right-0 bg-red-500 py-1 px-2 text-xs sm:text-sm text-white"
            >
              {{
                error.message.charAt(0).toUpperCase() +
                  error.message.slice(1).replace(/_/g, " ")
              }}
            </div>
          </div>
        </div>
        <div
          class="w-full relative flex flex-row justify-start items-center focus:border-yellow-400 rounded-lg bg-waterloo"
        >
          <input
            :value="value"
            :type="type"
            :placeholder="placeholder"
            class="appearance-none w-full rounded-lg border-2 border-transparent focus:border-sunglow text-sm p-2 bg-waterloo focus:outline-none transition-hover"
            :class="[error ? 'border-red-600' : '', inClass]"
            :style="inStyle"
            @input="$emit('input', $event.target.value)"
            @keypress.enter="$emit('submit')"
            @blur="$emit('blur')"
          >
          <span v-if="value" class="absolute right-0 h-full p-2 cursor-pointer hover:text-sunglow bg-waterloo rounded-r-lg" @click="(value='')">x</span>
        </div>
      </div>
    </template>
  </section>
</template>
<script>
export default {
  props: {
    value: [String, Boolean, Array, Number, Object],
    type: String,
    name: String,
    label: String,
    placeholder: String,
    error: Object,
    info: String,
    inStyle: String,
    inClass: String,
    required: {
			type: Boolean,
			default: false
		},
    // for select
    items: Array,
    multiple: Boolean,
    // for textarea
    cols: {
      default: 30,
      type: Number
    },
    rows: {
      default: 10,
      type: Number
    },
    resize: {
      default: true,
      type: Boolean
    },
    // for multicheckbox
    lists: {
      type: Array,
      default: () => null,
    },
    //
    disabled: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: null,
    },
    maxInput: {
      type: Number,
      default: null,
    },
  },
  data (){
    return{
      passwordValue: '',
      // show/hide password
      passwordToggle: false,
    }
  },
  computed:{
    setPassword: function () {
      return this.value
    }
  }, 
  methods: {
    togglePassword (){
      if (this.passwordToggle) {
        return 'text'
      }else{
        return 'password'
      }
    },
    // for multi checkbox
    inputMultiCheck (e) {
      if (e.target.checked) {
        this.$emit("checked", e.target.value)
      } else {
        this.$emit("unchecked", e.target.value)
      }
    },
    limitInput (e) {
      let acceptedKeys = [
        "Backspace",
        "Delete",
        "Tab",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
      ]

      if (e.target.value.length >= this.limit && !acceptedKeys.includes(e.key)) {
        e.preventDefault()
      }
    },
  }
}
</script>
