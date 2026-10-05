<template>
  <div class="">
    <hr>
    <slot name="not-found">

      <div class="h-100 text-center p-4">
        <div class="h1 text-muted-extra">
          <span class="fa-xl">
            <slot name="not-found-icon">
              <i class="fa-solid fa-magnifying-glass"></i>
            </slot>
            </span>
        </div>
        <div class="font-18 mt-3 mb-2">{{ title }}</div>
        <div class="text-muted-extra">{{description }}</div>
      </div>

    </slot>
  </div>
</template>

<script>

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
    };
  },
  methods: {
  },
  created() {
  },
  mounted() {
  },
}
</script>
