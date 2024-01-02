<template>
  <div :class="containerClass" class="position-relative">
<!--    <div v-if="!isEditing" @click="startEditing" class="card-img-overlay"></div>-->
    <template v-if="!isEditing">
      <template v-if="!text">
        <button class="btn btn-sm btn-primary px-2" @click="startEditing">
          {{ addTextBtnText }}
        </button>
      </template>
      <template v-else>
        <div v-if="!isEditing" @click="startEditing" class="card-img-overlay"></div>
        <div class="white-space">{{ text }}</div>
      </template>
    </template>

    <div v-if="isEditing">
      <div class="form-group">
        <textarea
          ref="editTextarea"
          v-model="editedText"
          :rows="textareaRows"
          :class="textareaClass"
          @input="handleTextChange"
        ></textarea>
      </div>
      <div class="form-group mb-0">
        <button :class="applyBtnClass" @click="saveText">Save</button>
        <button :class="cancelBtnClass" @click="cancelText">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: String,
    isEmptyForm: Boolean,

    containerClass: String,
    textareaClass: String,

    applyBtnClass: String,
    cancelBtnClass: String,

    textareaRows: Number,

    addTextBtnText: {
      type: String,
      default: '+ add text',
    },
  },
  data() {
    return {
      isEditing: false,
      editedText: this.text,
    };
  },
  methods: {
    startEditing() {
      this.isEditing = true;
      this.$nextTick(() => {
        const textarea = this.$refs.editTextarea;
        textarea.focus();
        textarea.selectionStart = 0; // Set the cursor to the beginning
        textarea.selectionEnd = 0; // Set the cursor to the beginning
      });
    },
    saveText() {
      this.isEditing = false;
      this.$emit('text-saved', this.editedText);
    },
    cancelText() {
      this.isEditing = false;
    },
    handleTextChange() {
      this.$emit('text-changed', this.editedText);
    },
  },
  created() {
    this.isEditing = typeof this.isEmptyForm !== 'undefined' ? this.isEmptyForm : false;
  }
};
</script>
