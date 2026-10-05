<!-- Variant or Choice picker -->
<template>
  <div>
    <div class="row g-1">
      <div v-for="(variant, index) in variants" :key="index" class="col-md-3 col-3">
        <div class="vp vp-has-checkbox has-peekX pb-1" role="button" style="zoom: 80%;">
          <input
            type="radio"

            v-model="selectedVariant"
            :id="elementName + '_' + variant.id"
            :name="elementName"
            :required="required"
            :value="variant"
            @change="$emit('input', variant)"
          >
          <label :for="elementName + '_' + variant.id" class="vp-figure">
            <div class="vp-content">
              <div class="vp-choice-label-primaryX">{{ variant.name }}</div>
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    variants: {
      type: Array,
      required: true
    },
    name: {       // the name of the radio input element
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selectedVariant: null,
    };
  },
  computed: {
    elementId() {
      return 'vp_' + Math.random().toString(36).substr(2, 6);
    },
    elementName() {
      return this.name || this.elementId;
    }
  },
};
</script>
