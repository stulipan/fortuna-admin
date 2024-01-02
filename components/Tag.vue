<template>
  <div class="filter-tag">
    <div class="filter-tag-content">
      <div class="">
<!--        <slot name="customContent">{{ tagContent }}</slot>-->
        <slot>{{ tagContent }}</slot>
      </div>
      <a href="#" @click.stop.prevent="handleTagClick(tagContent)" class="stretched-link"></a>
    </div>
    <a href="#" class="filter-tag-button" @click.stop.prevent="copyToClipboard(tagText)">
      <i class="fa-regular fa-clipboard"></i>
    </a>
    <a href="#" role="button" class="filter-tag-button" @click.stop.prevent="removeTag(tagContent)">
      <i class="fa-solid fa-xmark"></i>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    tagContent: {
      type: Object,
      required: true,
    },
    tagText: {
      type: String,
      required: false,
    },
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
  }
}
</script>
