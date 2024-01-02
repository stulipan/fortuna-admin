<template>
    <div>

<!--      v-model="value"-->
        <multiselect
                :value="value"
                @input="updateValue"

                :id="id"
                :options="options"
                :multiple="multiple"
                :label="label"
                :track-by="trackBy"
                :searchable="searchable"
                :clearOnSelect="clearOnSelect"
                :hideSelected="hideSelected"
                :placeholder="placeholder"
                :blockKeys="blockKeys"
                :allowEmpty="allowEmpty"
                :resetAfter="resetAfter"
                :internalSearch="internalSearch"
                :close-on-select="closeOnSelect"
                :custom-label="customLabel"
                :taggable="taggable"
                @select="selectOption"
                @tag="addTag"
                @remove="option => removeOption(option)"
                :tagPosition="tagPosition"
                :max="max"
                :preserveSearch="preserveSearch"
                :showLabels="showLabels"
                :loading="loading"
                :disabled="disabled"
                :maxHeight="maxHeight"
                :open-direction="openDirection"
                :showNoResults="showNoResults"
                :tabindex="tabindex"
                :optionHeight="optionHeight"
                :class="[ className, {'mb-2': true}]"

                :selectGroupLabel="selectGroupLabel"
                :deselectGroupLabel="deselectGroupLabel"
                :selectLabel="selectLabel"
                :deselectLabel="deselectLabel"
                :selectedLabel="selectedLabel"
                :tagPlaceholder="tagPlaceholder"
        >
            <span slot="noResult">{{noResultLabel}}</span>
            <template slot="selection" slot-scope="{ values }">
                <span class="multiselect__placeholder" v-if="values.length">{{ placeholder }}</span>
            </template>
            <template slot="option" slot-scope="props">
                <div class="custom-control custom-checkbox">
                    <input type="checkbox" :checked="isSelected(props.option)" class="custom-control-input mr-2">
                    <label class="custom-control-label">{{ getOptionLabel(props.option) }}</label>
                </div>
            </template>
        </multiselect>
        <div class="">
            <div class="vertical-form-row">
                <div v-for="tag in value" class="vertical-col" :key="tag.id">
                    <div class="filter-tag">
                      <div class="filter-tag-content">
                        <div class="">
                          <slot>{{ tag.name }}</slot>
                        </div>
                        <a href="#" @click.stop.prevent="handleTagClick(tag)" class="stretched-link"></a>
                      </div>

<!--                        <div class="filter-tag-content">{{option.name}}</div>-->
                        <a href="#" @click.stop.prevent="removeOption(tag)" class="filter-tag-button">
                          <i class="fa-solid fa-xmark"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Multiselect from 'vue-multiselect'
    import multiselectMixin from 'vue-multiselect'
    export default {
        name: 'multiselect-bellow',
        mixins: [multiselectMixin],
        components: {
            Multiselect,
        },
        props: {
            // id: [Number, String],
            // options: Array,
            // value: [Object, Array, String, Number],
            // multiple: Boolean,
            // trackBy: String,
            // clearOnSelect: {
            //     type: Boolean,
            //     default: true
            // },
            // hideSelected: {
            //     type: Boolean,
            //     default: false
            // },
            // placeholder: String,
            // allowEmpty: {
            //     type: Boolean,
            //     default: true
            // },
            // resetAfter: Boolean,
            // closeOnSelect: {
            //     type: Boolean,
            //     default: true
            // },
            // taggable: {
            //     type: Boolean,
            //     default: false
            // },
            // tagPlaceholder: String,
            // tagPosition: {
            //     type: String,
            //     default: 'top'
            // },
            // max: Number,
            // preserveSearch: Boolean,
            // showLabels: Boolean,
            // loading: Boolean,
            // disabled: Boolean,
            // maxHeight: Number,
            // openDirection: String,
            // showNoResults: Boolean,
            // tabindex: Number,
            // optionHeight: Number,

            noResultLabel: String,
            myClass: String,

            // /**
            //  * Function to interpolate the custom label
            //  * @default false
            //  * @type {Function}
            //  */
            // customLabel: {
            //     type: Function,
            //     default (option, label) {
            //         if (isEmpty(option)) return ''
            //         return label ? option[label] : option
            //     }
            // },
        },
        data () {
            return {
                className: this.myClass,
            }
        },
        computed: {
            selectedOptions() {
                // return this.value.map(el => this.customLabel(el, this.label));
              return this.value;
            },
        },
        watch: {
        },
        methods: {
          updateValue(value) {
            this.$emit('input', value);
          },
          selectOption(option) {
            // this.$emit('select', this.value);
            this.$emit('option-selected', option);
          },
          removeOption (option) {
            // console.log(ev);
            console.log(option);
            // console.log(this.value.indexOf(option[this.trackBy]));

            // const index = typeof option === 'object'
            //   ? this.value.indexOf(option[this.trackBy])
            //   : this.value.indexOf(option);
            // this.value.splice(index, 1);   // 'this.value' holds the array of selected options

            this.$emit('option-removed', option);
          },
          isSelected(option) {
            const index = typeof option === 'object'
                ? this.value.findIndex(el => el.id === option.id)
                : this.value.indexOf(option);
            return -1 === index ? false : true;
          },
          addTag(newTagText) {
            this.$emit('option-added', newTagText);
          },
          handleTagClick(tag) {
            this.$emit('tag-clicked', tag)
          },
        },
       mounted() {
       }
    }
</script>

<style scoped>
</style>
