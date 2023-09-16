<template>
  <div>
    <div
      :class="[previewClass, 'position-relative']"
      style="white-space: pre-wrap;"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >{{ previewContent }}
      <template v-if="isHovered">
        <div class="w-100 h-100 position-absolute top-0 start-0" style="background: rgba(235,235,235,.2); transition">
          <div class="d-flex h-100 justify-content-center">
            <button class="btn btn-primary align-self-center">{{ currentButtonText }}</button>
          </div>
          <a href="#" @click.stop.prevent="copyToClipboard(previewContent)" class="stretched-link"></a>
        </div>
      </template>
    </div>

    <!--  Hidden elements  -->
    <textarea
      ref="hiddenTextarea"
      style="position: absolute; top: -9999px; left: -9999px;"
    ></textarea>
  </div>
</template>

<script>
import Default from "@/layouts/default";
export default {
  components: {Default},
  props: {
    previewContent: String, // The value of the preview
    previewClass: {
      type: String,
      default: '',
    },
    buttonText: {
      type: String,
      default: 'Copy to clipboard',
    },
    buttonTextSuccess: {
      type: String,
      default: 'Copied!',
    },
  },
  data() {
    return {
      isHovered: false,
      currentButtonText: '',
    };
  },
  methods: {
    handleCopyAddendum(content) {
      // Call the closure and pass the 'previewContent' as an argument
      this.handleCopyAddendum(content);
    },
    copyToClipboard(content) {
      const hiddenTextarea = this.$refs.hiddenTextarea;
      hiddenTextarea.value = content;           // Set the content to be copied
      hiddenTextarea.select();                  // Select the text in the hidden textarea
      document.execCommand('copy');  // Copy the selected text to the clipboard

      this.$emit('onCopyToClipboard', content);

      // Change button text
      this.currentButtonText = this.buttonTextSuccess;
      setTimeout(() => {
        this.currentButtonText = this.buttonText;
      }, 5000);
    },
  },
  created() {
    this.currentButtonText = this.buttonText;
  }
};
</script>
