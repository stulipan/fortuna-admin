<template>
  <div class="filter-tag">
    <div class="filter-tag-content">
<!--      <div class="">-->
<!--        <slot name="customContent">{{ tagContent }}</slot>-->
        <NuxtLink
          v-if="$nuxt"
          :to="url ? url : { path: '#', query: {} }"
          @click.stop.prevent="handleTagClick(tagContent)"
          class="btn"
        >
          <slot>{{ tagContent }}</slot>
        </NuxtLink>

        <router-link
          v-else
          :to="url ? url : '#'"
          @click.stop.prevent="handleTagClick(tagContent)"
          class="btn"
        >
          <slot>{{ tagContent }}</slot>
        </router-link>

      </div>

<!--      <NuxtLink-->
<!--        v-if="$nuxt"-->
<!--        :to="url ? url : { path: '#', query: {} }"-->
<!--        @click.stop.prevent="handleTagClick(tagContent)"-->
<!--        class="stretched-link"-->
<!--      ></NuxtLink>-->

<!--      <router-link-->
<!--        v-else-->
<!--        :to="url ? url : '#'"-->
<!--        @click.stop.prevent="handleTagClick(tagContent)"-->
<!--        class="stretched-link"-->
<!--      ></router-link>-->

<!--      <a :href="url ? url : '#'" @click.stop.prevent="handleTagClick(tagContent)" class="stretched-link"></a>-->
<!--      <a v-if="url" :href="url" class="stretched-link"></a>-->
<!--      <a v-else href="#" @click.stop.prevent="handleTagClick(tagContent)" class="stretched-link"></a>-->
<!--    </div>-->
    <button v-if="data_allowCopy" class="btn filter-tag-action" @click.stop.prevent="copyToClipboard(tagText)">
      <i class="fa-regular fa-clipboard"></i>
    </button>
    <button v-if="data_allowRemove" class="btn filter-tag-action" @click.stop.prevent="removeTag(tagContent)" :data-title="removeBtnTitle" :aria-label="removeBtnTitle">
      <i class="fa-solid fa-xmark"></i>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    tagContent: {
      type: Object|String,
      required: true,
    },
    tagText: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
    allowRemove: {
      type: Boolean,
      required: false,
    },
    allowCopy: {
      type: Boolean,
      required: false,
    },
    removeBtnTitle: {
      type: String,
      required: false,
    },

  },
  data() {
    return {
      data_allowRemove: false,
      data_allowCopy: false,
    };
  },
  methods: {
    handleTagClick(tagContent) {
      this.$emit('tag-clicked', tagContent)
    },
    copyToClipboard(text) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    },
    removeTag(tagContent) {
      this.$emit('tag-removed', tagContent);
    },
  },
  created() {
    this.data_allowRemove = this.allowRemove || false;
    this.data_allowCopy = this.allowCopy || false;
  }
}
</script>
