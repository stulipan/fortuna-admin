<template>
  <div v-if="hasPagination">
    <ul class="pagination">
      <li :class="{ 'page-item': true, 'prev': true, 'disabled': currentPage === 1 }">
        <a href="#" class="page-link" @click.prevent="goToPage(currentPage - 1)" :aria-disabled="currentPage === 1">{{ prevText }}</a>
      </li>

      <li v-for="pageNumber in visiblePages" :key="pageNumber" :class="{ 'page-item': true, 'active': pageNumber === currentPage, 'disabled': pageNumber === '...' }">
        <a href="#" v-if="pageNumber !== '...'" class="page-link" @click.prevent="goToPage(pageNumber)">{{ pageNumber }}</a>
        <span v-else class="page-link">…</span>
      </li>

      <li :class="{ 'page-item': true, 'next': true, 'disabled': currentPage === totalPages }">
        <a href="#" class="page-link" @click.prevent="goToPage(currentPage + 1)" :aria-disabled="currentPage === totalPages">{{ nextText }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number|null,
      required: true,
    },
    maxVisiblePages: {
      type: Number,
      default: 5, // Adjust this value based on your preference
    },

    prevText: {
      type: String,
      default: '← Previous',
    },
    nextText: {
      type: String,
      default: 'Next →',
    },
  },
  computed: {
    visiblePages() {
      const startPage = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2));
      const endPage = Math.min(this.totalPages, startPage + this.maxVisiblePages - 1);

      let pages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

      // Ensure the first and last pages are always visible
      if (startPage > 2) {
        pages.unshift('...'); // Place the first '...' element
      }
      if (startPage > 1) {
        pages.unshift(1); // Always show the first page
      }

      if (endPage < this.totalPages - 1) {
        pages.push('...'); // Place the second '...' element
      }
      if (endPage < this.totalPages) {
        pages.push(this.totalPages); // Always show the last page
      }

      return pages;
    },
    hasPagination() {
      return this.totalPages && this.totalPages > 1;
    }
  },
  methods: {
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.$emit('page-change', page);
      }
    },
  },
};
</script>

<style scoped>
/* Add your styling here if needed */
</style>
