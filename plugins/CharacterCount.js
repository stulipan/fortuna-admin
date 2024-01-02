// plugins/CharacterCount.js
// This is a Vue mixin.

export default {
  methods: {
    count(text) {
      return text.length;
    },
    exceededCount(text, limit) {
      return this.count(text) - limit;
    },
    remainingCount(text, limit) {
      return limit - this.count(text);
    },
    isExceededLimit(text, limit) {
      return this.count(text) > limit;
    },
  },
};







// VERSION: A.

// export const CharacterCount =  {
//   count: function(text) {
//     return text.length;
//   },
//
//   exceeded: function(text, limit) {
//     return Math.max(0, this.count(text) - limit);
//   },
//
//   remaining: function(text, limit) {
//     return Math.max(0, limit - this.count(text));
//   },
//
//   isExceededLimit: function(text, limit) {
//     return this.count(text) > limit;
//   }
// };





// VERSION: B.

// // utils/CharacterCount.js
// export default class CharacterCount {
//   static count(text) {
//     return text.length;
//   }
//
//   static exceeded(text, limit) {
//     return Math.max(0, this.count(text) - limit);
//   }
//
//   static remaining(text, limit) {
//     return Math.max(0, limit - this.count(text));
//   }
//
//   static isExceededLimit(text, limit) {
//     return this.count(text) > limit;
//   }
// }
