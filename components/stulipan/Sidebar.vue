<template>
  <div class="modal sidebar sidebar-right" :id="id" role="dialog" aria-modal="true" :aria-labelledby="id + '_modalTitle'">
    <div class="sidebar-dialog" :class="[{'sidebar-dialog-scrollable': data_isScrollable}]" tabindex="-1" data-modal-dialog="modal-dialog">
      <div class="sidebar-content">
        <button type="button" class="close" data-close-modal="modal" aria-label="Close">
          <span aria-hidden="true"></span>
        </button>

        <div class="modal-header">
          <slot name="modal-header">

            <div class="modal-title" :id="id + '_modalTitle'">
              <slot name="modal-title">
                <h4 class="modal-title">Default Title</h4>
              </slot>
            </div>

          </slot>
        </div>

        <div class="modal-body">
          <slot name="modal-body">Default Content</slot>
        </div>

        <slot name="modal-footer-wrapper">

          <div v-if="data_hasFooter" class="modal-footer">
            <slot name="modal-footer">
            </slot>
          </div>

        </slot>

      </div>
    </div>
  </div>
</template>

<script>
import StulipanModal, {StulipanModalInit} from "@/plugins/StulipanModal";

export default {
  props: {
    id: {
      type: String,
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
    isCentered: {
      type: Boolean,
      required: false,
    },
    isScrollable: {
      type: Boolean,
      required: false,
      default: true,
    },
    closeOnEsc: {
      type: Boolean,
      required: false,
      default: true,
    },
    hasFooter: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  data() {
    return {
      data_modal: null,
      data_closeOnEsc: true,
      data_isScrollable: false,
      data_hasFooter: false,

    };
  },
  methods: {
    // openModal() {
    //   this.data_modal = new StulipanModal({
    //     target: this.id,
    //   });
    //   this.data_modal.configure({ closeOnEsc: true });
    //   this.data_modal.show();
    // },
  },
  created() {
    this.data_closeOnEsc = this.closeOnEsc;
    this.data_isScrollable = this.isScrollable;
    this.data_hasFooter = this.hasFooter;
  },
  mounted() {
    StulipanModalInit.initialize(this.id);
  },
  beforeDestroy() {
  },
}
</script>
