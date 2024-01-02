import Vue from 'vue';
import { Wording } from 'assets/Wording.js';

// NINCS HASZNALATBAN !!!

export default ({ app }, inject) => {
  inject('wording', Wording);
};
