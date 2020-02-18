<template>
	<nuxt-link
		v-if="nuxtLink"
		:to="nuxtLink"
		class="flex items-center text-black rounded-lg py-2 px-4 font-bold focus:outline-none transition-hover"
		:class="[
			disabled
				? 'hover:text-gray-700 bg-gray-500'
				: 'bg-sunglow hover:bg-sunglow-dark',
			inClass
		]"
		:style="inStyle"
	>
		<template v-if="icon">
			<svgicon :name="icon" :width="iconSize" class="mr-2" :color="iconColor" />
		</template>
		<span>{{ label }}</span>
	</nuxt-link>
	<!-- : 'bg-sunglow hover:bg-sunglow-dark', -->
	<button
		v-else
		@click.prevent="$emit('click')"
		:disabled="disabled"
		class="flex items-center text-black rounded-lg py-2 px-4 font-bold focus:outline-none transition-hover"
		:class="[
			disabled && 'text-gray-700 bg-gray-500 cursor-not-allowed',
			background && !disabled ? getBackground(background) : '',
			inClass
		]"
		:style="inStyle"
	>
		<template v-if="icon">
			<svgicon :name="icon" :width="iconSize" class="mr-2 fill-current" />
		</template>
		<span>{{ label }}</span>
	</button>
</template>
<script>
export default {
	props: {
		label: {
			type: String,
			default: "Save"
		},
		inClass: {
			type: String
		},
		inStyle: {
			type: String
		},
		disabled: {
			type: Boolean,
			default: false
		},
		icon: {
			type: String
		},
		iconSize: {
			type: String,
			default: "21"
		},
		iconColor: {
			type: String
		},
		nuxtLink: [String, Array, Object],
		background: {
			type: String,
			default: "sunglow"
		}
	},
	methods: {
		getBackground(value) {
			let singleBackground = [
				"sunglow",
				"waterloo",
				"charade",
				"trout",
				"transparent",
				"white",
				"black"
			];
			console.log(singleBackground.includes(value));
			if (singleBackground.includes(value)) {
				return `bg-${value} hover:bg-${value}-dark`;
			} else {
				return `bg-${value}-600 hover:bg-${value}-700`;
			}
		}
	}
};
</script>
<style>
.button {
	color: #000;
	background: linear-gradient(to top, #f2d024, #efde86);
}
.button:hover {
	color: #000;
	background: linear-gradient(to top, #e6c520, #f1d130);
}
.button:active {
	transform: translate(2px, 2px);
}
.disabled-button {
	color: #9e9e9e;
	background: linear-gradient(to top, #ccc, #ddd);
	cursor: not-allowed;
}

.disabled-button:hover {
	background: linear-gradient(to top, #bbbbbb, #cccccc);
}
</style>
