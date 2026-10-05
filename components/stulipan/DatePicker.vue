<template>
  <div>
<!--    <input v-model="inputValue" type="text" :id="elementId" class="form-control">-->

    <input :value="value" type="text" :id="elementId" class="form-control"
           @input="$emit('input', $event.target.value)"
    >
  </div>
</template>

<script>

// =================== IMPORTANT FYI ========================
// Both moment and StulipanDateRangePicker are dependencies, thus are installed as `npm install plugin_name`
// See package.json

import moment from "moment";
import StulipanDateRangePicker from 'StulipanDateRangePicker';

export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      inputValue: this.value,
      inputElement: null,
      customConfig: null,
    };
  },
  watch: {
    // value(newValue) {
    //   this.inputValue = newValue;
    // },
    // inputValue(newValue) {
    //   // console.log('valuechanged ==== ' + newValue);
    //   this.$emit('input', newValue);
    // }
  },
  computed: {
    elementId() {
      return 'drp-' + Math.random().toString(36).substr(2, 9);
    }
  },
  methods: {
    updateInputValue(newStart, newEnd) {
      this.$emit('input', newStart);
    },
  },
  created() {
  },
  mounted() {
    var customConfig = {
      singleDatePicker: true,
      // displayInline: true,
      // displayInlineAlwaysOn: true,
      opens: 'right',
      drops: 'down',
      autoApply: true,
      autoUpdateInput: false,
      alwaysShowCalendars: true,
      // maxDate: moment(),
      locale: {
        format: "YYYY-MM-DD",
        separator: ' - ',
        cancelLabel: 'Mégse',
        applyLabel: 'Mehet',
        daysOfWeek: ['V', 'H', 'K', 'Sz', 'Cs', 'P', 'Sz'],
        monthNames: ['Január', 'Február', 'Március', 'Április', 'Május', 'Június', 'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'],
        firstDay: 1,
        dropdownRangeLabel: 'Időintervallumok',
        customRangeLabel: 'Egyedi időszak',
      },
      buttonClasses: 'btn',
      cancelClass: 'btn-secondary',

      startDate: this.value,

      // showCustomRangeLabel: true,
      // showRangesAsDropdown: true,
      // ranges: {
      //   'Ma': [moment(), moment()],
      //   'Tegnap': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      //   "Aktuális hónap": [moment().startOf('month'), moment().endOf('month')],
      //   "Előző hónap": [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      //   "Utolsó 7 nap": [moment().subtract(6, 'days'), moment()],
      //   "Utolsó 30 nap": [moment().subtract(29, 'days'), moment()],
      //   "Aktuális év": [moment().startOf('year'), moment().endOf('year')],
      //   "Előző év": [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
      //   "Élettartam": [moment('1990-01-01'), moment()],
      // },
    };

    var callback = function(startDate, endDate) { /* your callback function here */ };
    var dateInput = document.querySelectorAll('#' + this.elementId);  // this is a NodeList array
    dateInput.daterangepicker(customConfig, callback);

    // console.log(dateInput);

    var element = dateInput[0];

    // dateInput.forEach(function(element) {
    element.addEventListener('apply.daterangepicker', function(event) {
      // console.log('--------');
      // console.log(event.target);
      // console.log(element);
      const picker = event.target.daterangepicker;
      this.updateInputValue(picker.startDate.format('YYYY-MM-DD'))
    }.bind(this));
    // }.bind(this));

  }
}
</script>
