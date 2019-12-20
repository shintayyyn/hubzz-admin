<template>
	<section class="relative">
		<div class="relative">
			<AppLoading :loading="loading" :message="loadingMessage" spinner />
			<div class="flex flex-col w-full px-2 py-2 md:mt-4 overflow-x-auto">
				<div
					:style="`min-width: ${customWidth}px`"
					class="row hidden md:flex justify-start font-bold leading-none text-sm text-white"
				>
					<div
						class="flex-1 flex items-center px-2"
						v-for="(column, index) in columns"
						:key="`${column}-${index}`"
						:class="[
							column.class &&
								column.class.includes('text-center') &&
								'justify-center',
							column.sortable && 'cursor-pointer'
						]"
						@click="column.sortable && sort(column.dataIndex)"
					>
						<span class="pr-1">{{ column.name }}</span>
						<svgicon
							v-if="column.sortable"
							:name="sortIcon(column.dataIndex)"
							height="12"
							width="12"
							color="#fff"
						/>
					</div>
				</div>
				<div
					v-for="item in items"
					:key="item.id"
					class="row py-2"
					:style="`min-width: ${customWidth}px`"
				>
					<nuxt-link
						:to="{
							path: `${routerLink}/${item.id}`,
							query: { ...$route.query }
						}"
						:event="!routerLink ? '' : 'click'"
					>
						<div
							class="flex flex-col md:flex-row items-start md:items-center justify-start shadow-md rounded-lg py-3 bg-waterloo text-white border-l-8 border-sunglow md:border-none"
							:class="
								routerLink
									? 'transition-hover hover:bg-waterloo-dark'
									: 'cursor-default'
							"
						>
							<div
								v-for="(column, index) in columns"
								:key="index"
								class="flex flex-col md:block flex-1 truncate px-2 leading-tight py-1 md:py-0"
								:class="[
									column.class &&
										column.class.includes('text-center') &&
										'md:text-center md:items-center md:justify-center',
									column.customClass
								]"
							>
								<span class="md:hidden pr-1 font-bold">{{ column.name }}</span>
								<template v-if="Array.isArray(dataCell(item, column))">
									<div
										v-for="(item, index) in dataCell(item, column)"
										:key="`${item}-${index}`"
										:class="column.customClass"
									>{{ item }}</div>
								</template>
								<template v-else>
									<template v-if="column.slotName">
										<div @click="$emit(column.eventName, item)">
											<slot :name="column.slotName" v-bind:item="item">dsa</slot>
										</div>
									</template>
									<template v-else>
										<template
											v-if="
												column.class &&
													column.class.includes('localDate') &&
													dataCell(item, column) !== 'Unavailable'
											"
										>{{ dataCell(item, column) | localDate }}</template>
										<template v-else>{{ dataCell(item, column) }}</template>
									</template>
								</template>
							</div>
						</div>
					</nuxt-link>
				</div>
			</div>
		</div>
		<div class="px-2 w-full">
			<AppPagination
				:total="total"
				:totalPages="totalPages"
				:currentPage="currentPage"
				@pagechanged="pagechanged"
				@limitchanged="limitchanged"
				:loading="loading"
				:perPage="perPage"
			/>
		</div>
	</section>
</template>
<script>
import AppPagination from "@/components/Base/AppPagination";
import AppLoading from "@/components/Base/AppLoading";
export default {
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
		loadingMessage: {
			type: String,
			default: "Loading"
		},
		currentPage: {
			type: Number,
			default: 1
		},
		perPage: {
			type: Number,
			default: 10
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
			type: String
		},
		customWidth: {
			type: Number
		}
	},
	components: {
		AppLoading,
		AppPagination
	},
	computed: {
		totalPages() {
			return Math.ceil(this.total / this.perPage);
		}
	},
	data() {
		return {
			params: []
		};
	},
	created() {},
	mounted() {
		console.log("orderBy", this.orderBy);
		this.params = this.orderBy;
	},
	methods: {
		sort(dataIndex) {
			if (!this.params.some(item => item.includes(`${dataIndex}`))) {
				this.params = [];
				this.params.push(`${dataIndex}:desc`);
				console.log("dataIndex", dataIndex);
				console.log("params", this.params);
				// this.$router.push({query: this.params})
			} else {
				let index = this.params.findIndex(item => item === `${dataIndex}:desc`);
				if (index >= 0) {
					this.params.splice(index, 1, `${dataIndex}:asc`);
				} else {
					this.params.splice(
						this.params.findIndex(item => item === `${dataIndex}:asc`),
						1
					);
				}
			}
			this.$emit("sorted", this.params);
		},
		pagechanged(e) {
			this.$emit("pagechanged", e, this.params);
		},
		limitchanged(limit) {
			this.$emit("limitchanged", limit);
		},
		sortIcon(dataIndex) {
			if (!this.params.some(item => item.includes(dataIndex))) {
				return "sort";
			} else {
				let index = this.params.findIndex(item => item === `${dataIndex}:desc`);
				if (index >= 0) {
					return "sort-descend";
				} else {
					return "sort-ascend";
				}
			}
		},
		dataCell(item, column) {
			var dataIndexArr = column.dataIndex.split(".");
			let str = null;

			if (Array.isArray(item[dataIndexArr[0]])) {
				str = [];
				item[dataIndexArr[0]].forEach(item => {
					str.push(item[dataIndexArr[1]][dataIndexArr[2]]);
				});
			} else {
				str = "";
				let itemArray = null;
				let itemStr = null;
				let dataIndex = null;
				if (dataIndexArr.length === 1) {
					str = item[dataIndexArr[0]];
				}
				if (dataIndexArr.length === 2 && item[dataIndexArr[0]]) {
					str = item[dataIndexArr[0]][dataIndexArr[1]];
				}
				if (
					dataIndexArr.length === 3 &&
					item[dataIndexArr[0]] &&
					item[dataIndexArr[0]][dataIndexArr[1]]
				) {
					str = item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]];
				}
				if (
					dataIndexArr.length === 4 &&
					item[dataIndexArr[0]] &&
					item[dataIndexArr[0]][dataIndexArr[1]] &&
					item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]]
				) {
					str =
						item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][
							dataIndexArr[3]
						];
				}
				if (
					dataIndexArr.length === 5 &&
					item[dataIndexArr[0]] &&
					item[dataIndexArr[0]][dataIndexArr[1]] &&
					item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][
						dataIndexArr[3]
					]
				) {
					str =
						item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][
							dataIndexArr[3]
						][dataIndexArr[4]];
				}
				if (
					dataIndexArr.length === 6 &&
					item[dataIndexArr[0]] &&
					item[dataIndexArr[0]][dataIndexArr[1]] &&
					item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][
						dataIndexArr[3]
					] &&
					item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][
						dataIndexArr[3]
					][dataIndexArr[4]]
				) {
					str =
						item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][
							dataIndexArr[3]
						][dataIndexArr[4]][dataIndexArr[5]];
				}
			}
			if (str === false) {
				str = "No";
			}
			if (str === true) {
				str = "Yes";
			}
			if (str === null) {
				str = "Unavailable";
			}
			return str;
		}
	}
};
</script>
<style scoped>
@media screen and (min-width: 768px) {
	.row {
		min-width: 1200px;
	}
}
.loading-shield {
	opacity: 0.5;
}
</style>
