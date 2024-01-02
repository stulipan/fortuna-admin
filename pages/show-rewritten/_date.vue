<template>
  <section>
    <div class="container container-lg mb-6">
       <div class="row">
          <div class="col-xl-12">
            <div class="row mt-2 mt-sm-3">
              <div class="col-12 correction-no-paddingX mb-3">

                <div class="card mb-20px">
                  <div class="card-body" style="zoom: 85%;">
                    <div class="form-group row">
                      <div class="col-sm-12">
                        <label>Prefix</label>
                        <select v-model="selectedPrefix" class="form-control" @change="handlePrefix">
                          <option v-for="prefix in prefixes" :key="prefix" :value="prefix">{{ prefix }}</option>
                        </select>
                      </div>
                    </div>
                    <div class="form-group row mb-0">
                      <div class="col-sm-12">
                        <label>Postfix</label>
                        <select v-model="selectedPostfix" class="form-control" @change="handlePostfix">
                          <option
                            v-for="postfix in postfixes" :key="postfix" :value="postfix">{{ postfix }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mb-20px mt-3">
                  <ul class="list-group list-group-horizontal">
                    <li v-for="sign in astrologicalSigns" :key="sign.id" class="list-group-item">
                      <a v-if="isSignImported(sign.id)" :href="`#astrologicalSign_${sign.slug}`" :class="{'text-dark': isSignImported(sign.id)}">
                        {{ sign.name }}
                      </a>
                      <a v-else :href="getExternalUrl(sign.slug)" class="text-light-s" :class="{'text-light-s': !isSignImported(sign.id)}" target="_blank">
                        {{ sign.name }}
                      </a>
                    </li>
                  </ul>
                </div>

                <div class="card mb-20px mt-3">
                  <div v-for="(bundled, index) in bundledHoroscopes" :key="bundled.astrologicalSign.id" class="card-body" :class="{ 'bg-alternate': index % 2 === 1 }" :id="`astrologicalSign_${bundled.astrologicalSign.slug}`">

                      <div class="h4 admin-card-titleX mb-3 d-inline-block me-3">
                        {{ bundled.astrologicalSign.name }}
                      </div>

                      <div class="d-inline-block me-3">
                        <span>Base:</span>
                        <div v-if="isExceededLimit(getPreviewOfBase(bundled))"> <!-- Characters exceeded -->
                          <span class="text-danger">-{{ baseCharacterCounts[bundled.astrologicalSign.id] - inputLimit }}</span>
                        </div>

                        <div v-else> <!-- Characters remaining -->
                          <span>+{{ inputLimit - baseCharacterCounts[bundled.astrologicalSign.id] }}</span>
                        </div>
                      </div>

                      <div class="d-inline-block me-3">
                        <span>Addendum:</span>
                        <template v-if="isExceededLimit(getPreviewOfAddendum(bundled))"> <!-- Characters exceeded -->
                          <span class="text-danger">-{{ addendumCharacterCounts[bundled.astrologicalSign.id] - inputLimit }}</span>
                        </template>

                        <template v-else> <!-- Characters remaining -->
                          <span>+{{ inputLimit - addendumCharacterCounts[bundled.astrologicalSign.id] }}</span>
                        </template>
                      </div>

                      <div class="row">
                        <div class="col-md-4">

                              <textarea
                                v-model="bundled.base.content"
                                :id="`base_${bundled.astrologicalSign.name}`"
                                maxlength="65535"
                                rows="25"
                                class="form-control"
                                @copy="saveBundledContent(bundled, $event)"
                              ></textarea>

                        </div>
                        <div class="col-md-4">

                            <PreviewBlock
                              :key="bundled.astrologicalSign.id"
                              :previewContent="getPreviewOfBase(bundled)"
                              :previewClass="'text-mutedX'"
                              :buttonText="'Vágólapra kopizás'"
                              :buttonTextSuccess="'Kikopizva!'"
                              @onCopyToClipboard="saveBundledContent(bundled, $event)"
                            />

                        </div>

                        <div class="col-md-4">
                          <div v-if="bundled.raw" style="white-space: pre-wrap;" class="text-muted">{{ bundled.raw.content }}</div>
                        </div>
                      </div>

                      <div class="row mt-3">
                        <div class="col-md-4">
                          <div class="form-group">

                              <button
                                class="btn btn-sm btn-primary px-2"
                                @click="toggleTextarea(bundled)"
                                v-if="!addendumActiveStates[bundled.astrologicalSign.id] && !bundled.addendum.content"
                              >
                                + addendum szövegrész
                              </button>

                              <textarea
                                v-if="addendumActiveStates[bundled.astrologicalSign.id] || bundled.addendum.content"
                                v-model="bundled.addendum.content"
                                :id="`addendum_${bundled.astrologicalSign.name}`"
                                @blur="disableTextarea(bundled)"
                                maxlength="65535"
                                :rows="increaseRowsInAddendum(bundled.addendum.content)"
                                class="form-control"
                                @copy="saveBundledContent(bundled, $event)"
                              ></textarea>

                          </div>
                        </div>

                        <div class="col-md-4">

                            <PreviewBlock
                              v-if="bundled.addendum.content"
                              :key="bundled.astrologicalSign.id"
                              :previewContent="getPreviewOfAddendum(bundled)"
                              :previewClass="'text-mutedX'"
                              :buttonText="'Vágólapra kopizás'"
                              :buttonTextSuccess="'Kikopizva!'"
                              @onCopyToClipboard="saveBundledContent(bundled, $event)"
                            />

                        </div>

                        <div class="col-md-4">
                        </div>
                      </div>

                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    <div class="bg-body fixed-bottom" style="box-shadow: 0 0 1rem rgba(0,0,0,.15)!important;">
      <div class="container container-lg">
        <div class="row">
          <div class="col-xl-12">
            <div class="p-3 d-flex justify-content-between">
              <div class="pe-2">
                <button @click.prevent="onSubmit"
                        type="submit" class="btn btn-primary mr-2" formnovalidate="">Mentés
                </button>
              </div>
              <div class="">
                <ul class="list-group list-group-horizontal">
                  <li
                    v-for="locale in locales"
                    :key="locale"
                    :class="['list-group-item py-0', { active: locale === currentLocale }]"
                    @click="changeLocale(locale)"
                  >
                    {{ locale }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Cookies from 'js-cookie';
import PreviewBlock from "@/components/PreviewBlock";
import StulipanNotify from "@/plugins/StulipanNotify_const_orig.js";

const API_URI = 'http://fortunaai.hu/api';
const REWRITE_URI = 'http://www.fortunaai.hu/rewrite';
export default {
  components: {
    PreviewBlock,
  },
  data() {
    return {
      locales: ['hu', 'ro', 'xx'],
      currentLocale: '', // Set the default locale here
      prefixes: [
        '-------- FORTUNA HU -------- ',
        'Üdvözöllek, kedves {{cuf_9284767|fallback:"barátom"}}!',
        'Szia, kedves {{cuf_9284767|fallback:"barátom"}}!',
        'Szia, kedves {{cuf_9284767|fallback:"barátom"}}! Meghoztam a mai üzeneted.',
        'Hogy vagy, kedves {{cuf_9284767|fallback:"barátom"}}? Meghoztam a mai horoszkópod.',
        'Szép reggelt, kedves {{cuf_9284767|fallback:"barátom"}}!',
        'Jó reggelt, {{cuf_9284767|fallback:"barátom"}}, itt is van a mai horoszkópod!',
        'Jó reggelt, kedves {{cuf_9284767|fallback:"barátom"}}!',
        'Vidám reggelt, kedves {{cuf_9284767|fallback:"barátom"}}!',
        'Remélem jól vagy, kedves {{cuf_9284767|fallback:"barátom"}}!',
        'Remélem jól indul a napod, kedves {{cuf_9284767|fallback:"barátom"}}!',
        'Hogy vagy ma reggel, kedves {{cuf_9284767|fallback:"barátom"}}?',
        'Hogy vagy ma reggel, kedves {{cuf_9284767|fallback:"barátom"}}? Íme a horoszkópod!',
        'Meghoztam a mai üzeneted, kedves {{cuf_9284767|fallback:"barátom"}}!',
        'Ma is meghoztam a Horoszkópod, kedves {{cuf_9284767|fallback:"barátom"}}!',
        'Meg is hoztam a mai Horoszkópod, kedves {{cuf_9284767|fallback:"barátom"}}!',
        'Itt a legújabb horoszkópod, kedves {{cuf_9284767|fallback:"barátom"}}!',
        'Itt a mai horoszkópod, kedves {{cuf_9284767|fallback:"barátom"}}!',
        'Meghoztam a mai Horoszkópodat, kedves {{cuf_9284767|fallback:"barátom"}}!',
        'Megérkezett a mai horoszkópod, kedves {{cuf_9284767|fallback:"barátom"}}!',
        'Meg is hoztam a hétfői Horoszkópod, {{cuf_9284767|fallback:"barátom"}}!',
        'Meg is hoztam a keddi Horoszkópod, {{cuf_9284767|fallback:"barátom"}}!',
        'Meg is hoztam a szerdai Horoszkópod, {{cuf_9284767|fallback:"barátom"}}!',
        'Meg is hoztam a csütörtöki Horoszkópod, {{cuf_9284767|fallback:"barátom"}}!',
        'Meg is hoztam a pénteki Horoszkópod, {{cuf_9284767|fallback:"barátom"}}!',
        'Meg is hoztam a szombati Horoszkópod, {{cuf_9284767|fallback:"barátom"}}!',
        'Meg is hoztam a vasárnapi Horoszkópod, {{cuf_9284767|fallback:"barátom"}}!',
        'Szép szombati reggelt, kedves {{cuf_9284767|fallback:"barátom"}}!',
        'Remélem jól indul a hétvégéd, kedves {{cuf_9284767|fallback:"barátom"}}!',
        'Szép vasárnap reggelt, kedves {{cuf_9284767|fallback:"barátom"}}!',
        'Remélem pihentető hétvégéd volt, kedves {{cuf_9284767|fallback:"barátom"}}!',
        'Hogy telt a hétvégéd, kedves {{cuf_9284767|fallback:"barátom"}}?',
        '-------- LUNA HU -------- ',
        'Üdvözöllek, kedves {{cuf_9232715|fallback:"barátom"}}!',
        'Szia, kedves {{cuf_9232715|fallback:"barátom"}}!',
        'Jó reggelt, kedves {{cuf_9232715|fallback:"barátom"}}!',
        'Szép reggelt, kedves {{cuf_9232715|fallback:"barátom"}}!',
        'Meghoztam a mai Horoszkópod, kedves {{cuf_9232715|fallback:"barátom"}}!',
        'Megérkezett a mai horoszkópod, kedves {{cuf_9232715|fallback:"barátom"}}!',
        'Remélem jól vagy, kedves {{cuf_9232715|fallback:"barátom"}}!',
        'Remélem jól indul a napod, kedves {{cuf_9232715|fallback:"barátom"}}!',
        'Itt a mai horoszkópod, kedves {{cuf_9232715|fallback:"barátom"}}!',
        'Remélem pihentető hétvégéd volt, kedves {{cuf_9232715|fallback:"barátom"}}!',
        'Remélem jól indul a hétvégéd, kedves {{cuf_9232715|fallback:"barátom"}}!',
        'Remélem jól telik a hétvégéd, kedves {{cuf_9232715|fallback:"barátom"}}!',
        'Bízom benne, hogy jól telik a hétvégéd, kedves {{cuf_9232715|fallback:"barátom"}}!',
        'Boldog születésnapot, Magyarország! Íme a horoszkópod, {{cuf_9232715|fallback:"barátom"}}!',
        '-------- LUNA RO -------- ',
        // 'Salutare, {{cuf_9323449|fallback:"prietene"}}!',
        // 'Bun găsit, {{cuf_9323449|fallback:"prietene"}}!',
        // 'Bine te-am găsit, {{cuf_9323449|fallback:"prietene"}}!',
        // 'Bună dimineața, {{cuf_9323449|fallback:"prietene"}}!',
        // 'Ți-am adus horoscopul de azi, {{cuf_9323449|fallback:"prietene"}}!',
        // 'Dragă {{cuf_9323449|fallback:"prietene"}}, iată mesajul tău de azi!',
        // 'Dragă {{cuf_9323449|fallback:"prietene"}}, iată horoscopul tău de azi!',
        // '{{cuf_9323449|fallback:"Prietene"}}, a sosit horoscopul tău de azi!',
        // '{{cuf_9323449|fallback:"Prietene"}}, ți-am adus horoscopul de azi!',
        // 'Îți doresc un început de weekend plăcut, {{cuf_9323449|fallback:"prietene"}}!',
        // 'Să ai un început de weekend superb, {{cuf_9323449|fallback:"prietene"}}!',
        // 'Sper că ai avut un weekend odihnitor, {{cuf_9323449|fallback:"prietene"}}!',
        // 'Sper că ești bine, dragă {{cuf_9323449|fallback:"prietene"}}!',
      ],
      postfixes: [
        '-------- FORTUNA HU -------- ',
        '(Ahhoz, hogy el tudjam biztosan küldeni a holnapi horoszkópot, kérlek nyomj a gombra vagy írj ide valamit.)',
        '(Kérlek írj ide valamit vagy nyomj a gombra, hogy holnap is biztosan el tudjam küldeni a horoszkópod!)',
        '(Kérlek nyomj a gombra vagy írj ide valamit, hogy holnap is biztosan el tudjam küldeni a horoszkópod!)',
        '(Kérlek nyomj a gombra vagy írj ide valamit, hogy holnap is el tudjam küldeni a horoszkópod!)',
        '-------- LUNA HU -------- ',
        '(Kérlek nyomj a gombra vagy írj ide valamit, mert csak így tudom biztosan elküldeni a holnapi horoszkópot!)',
        'Szeretnéd hallani nagy titkomat a Szerencse Karkötőmről?',
        '-------- LUNA RO -------- ',
        // '(Apasă pe buton sau scrie ceva, căci numai așa îți pot trimite cu siguranță horoscopul de mâine!)',
        // '(Apasă pe buton căci numai așa îți pot trimite horoscopul de mâine!)',
      ],
      midfix: "(A folytatáshoz nyomj a Tovább gombra!)",
      selectedPrefix: '',
      selectedPostfix: '',
      addendumActiveStates: {},
      isPreviewHovered: true,
      astrologicalSigns: [
        { id: 1, name: 'Aries', slug: 'aries' },
        { id: 2, name: 'Taurus', slug: 'taurus' },
        { id: 3, name: 'Gemini', slug: 'gemini' },
        { id: 4, name: 'Cancer', slug: 'cancer' },
        { id: 5, name: 'Leo', slug: 'leo' },
        { id: 6, name: 'Virgo', slug: 'virgo' },
        { id: 7, name: 'Libra', slug: 'libra' },
        { id: 8, name: 'Scorpio', slug: 'scorpio' },
        { id: 9, name: 'Sagittarius', slug: 'sagittarius' },
        { id: 10, name: 'Capricorn', slug: 'capricorn' },
        { id: 11, name: 'Aquarius', slug: 'aquarius' },
        { id: 12, name: 'Pisces', slug: 'pisces' }
      ],
    }
  },
  async asyncData({params}) {
    const date = params.date;
    const locale = params.locale;

    // this.fetchApi(date, locale);

    try {
      // Make an API request to fetch the specific item based on the ID
      const response = await fetch(API_URI + `/horoscope-final/${date}/${locale}`);
      const data = await response.json();

      const addendumActiveStates = {};
      data.forEach((bundled) => {
        addendumActiveStates[bundled.astrologicalSign.id] = false;
        if (!bundled.addendum) {
          bundled.addendum = { content: '' }; // Initialize addendum object if null
        }
      });

      return { bundledHoroscopes: data, addendumActiveStates};
    } catch (error) {
      console.error(error);
      return { bundledHoroscopes: null };
    }
  },

  methods: {
    isExceededLimit(content) {
      return content.length > this.inputLimit;
    },
    toggleTextarea(bundled) {
      this.addendumActiveStates[bundled.astrologicalSign.id] = !this.addendumActiveStates[bundled.astrologicalSign.id];
      if (this.addendumActiveStates[bundled.astrologicalSign.id]) {
        this.$nextTick(() => {
          const textareaEl = document.getElementById(`addendum_${bundled.astrologicalSign.name}`);
          if (textareaEl) {
            textareaEl.focus();
          }
        });
      }
    },
    enableTextarea(bundled) {
      this.$set(this.addendumActiveStates, bundled.astrologicalSign.id, true);
      console.log(this.addendumActiveStates[bundled.astrologicalSign.id]);
      this.$nextTick(() => {
        const el = document.getElementById(`addendum_${bundled.astrologicalSign.name}`);
        if (el) {
          el.focus(); // Focus on the textarea immediately
        }
      });
    },
    disableTextarea(bundled) {
      if (bundled.addendum && bundled.addendum.content.trim() === '') {
        this.$set(this.addendumActiveStates, bundled.astrologicalSign.id, false);
      }
    },
    handleTextareaInput(bundled) {
    },
    handlePrefix() {
      const selectedPrefix = this.selectedPrefix;
      Cookies.set('selectedPrefix', selectedPrefix, { expires: 365 });
    },
    handlePostfix() {
      const selectedPostfix = this.selectedPostfix;
      Cookies.set('selectedPostfix', selectedPostfix, { expires: 365 });
    },
    saveBundledContent(bundled, content) {
      this.onSubmitTextarea(bundled);
    },
    copyToClipboard(content) {
      const hiddenTextarea = this.$refs.hiddenTextarea;
      hiddenTextarea.value = content;           // Set the content to be copied
      hiddenTextarea.select();                  // Select the text in the hidden textarea
      console.log(hiddenTextarea.value);
      document.execCommand('copy');  // Copy the selected text to the clipboard
      // window.getSelection().removeAllRanges();  // Clear the selection
    },
    increaseRowsInAddendum(content) {
      // Calculate the number of rows based on the length of the content
      if (content.length <= 350) {
        return 10; // Set the initial number of rows to 10
      } else {
        return 15; // Set the number of rows to 15 if content reaches 350 characters
      }
    },
    async onSubmit() {
      for (let bundled of this.bundledHoroscopes) {
        await this.onSubmitTextarea(bundled);
      }
    },
    async onSubmitTextarea(bundled) {
      try {
        const response = await this.$axios.put('http://fortunaai.hu/api/horoscope-bundled/', bundled);
        console.log(response);
        console.log(response.data.astrologicalSign.name);

        // Update this.bundledHoroscopes with the response data
        const updatedBundled = response.data;
        let hasAddendum = true;
        if (!updatedBundled.addendum) {
          updatedBundled.addendum = { content: '' }; // Initialize addendum object if null
          hasAddendum = false;
        }
        // Find the index of the corresponding object in this.bundledHoroscopes
        const index = this.bundledHoroscopes.findIndex(item => item.astrologicalSign.id === updatedBundled.astrologicalSign.id);

        if (index !== -1) {
          this.bundledHoroscopes.splice(index, 1, updatedBundled); // Replace the existing object with the updated data received from the API response
        }


        StulipanNotify.success(('Mentve. A "{sign}" szöveg kikopizva.').replace('{sign}', updatedBundled.astrologicalSign.name));

      } catch (error) {
        console.error(error);
      }
    },
    // async onSubmit() {
    //   try {
    //     for (let bundled of this.bundledHoroscopes) {
    //       // Prepare the data to be sent
    //       const data = bundled;
    //       // Make the API request for each bundledHoroscope
    //       const response = await this.$axios.put('http://fortunaai.hu/api/horoscope-bundled/', data);
    //
    //       // Handle the response for each bundledHoroscope (e.g., show success message, redirect, etc.)
    //       console.log(response);
    //     }
    //   } catch (error) {
    //     // Handle the error (e.g., show error message, log, etc.)
    //     console.error(error);
    //   }
    // }
    async fetchApi(date, locale) {
      try {
        // Make an API request to fetch the specific item based on the ID
        const response = await fetch(API_URI + `/horoscope-final/${date}/${locale}`);
        const data = await response.json();

        const addendumActiveStates = {};
        data.forEach((bundled) => {
          addendumActiveStates[bundled.astrologicalSign.id] = false;
          if (!bundled.addendum) {
            bundled.addendum = { content: '' }; // Initialize addendum object if null
          }
        });

        console.log(data)

        return { bundledHoroscopes: data, addendumActiveStates };
      } catch (error) {
        console.error(error);
        return { bundledHoroscopes: null };
      }
    },
    changeLocale(locale) {
      this.currentLocale = locale;
      this.$router.push({params: { date: this.$route.params.date, locale: locale }})
    },
    isSignImported(signId) {
      return this.bundledHoroscopes.some(bundled => bundled.astrologicalSign.id === signId);
    },
    getExternalUrl(signSlug) {
      const baseUrl = REWRITE_URI;
      const date = this.transformDate(this.$route.params.date);
      const urlParams = `${date}/${this.currentLocale}/${signSlug}`;
      return `${baseUrl}/${urlParams}`;
    },
    transformDate(inputDate) {
      const parts = inputDate.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];
        return `${year}/${month}/${day}`;
      }
      return inputDate;
    },
  },
  computed: {
    baseCharacterCounts() {
      const counts = {};
      this.bundledHoroscopes.forEach(bundled => {
        counts[bundled.astrologicalSign.id] = this.getPreviewOfBase(bundled).length;
      });
      return counts;
    },
    addendumCharacterCounts() {
      const counts = {};
      this.bundledHoroscopes.forEach(bundled => {
        counts[bundled.astrologicalSign.id] = this.getPreviewOfAddendum(bundled).length;
      });
      return counts;
    },
    inputLimit() {
      return 667; // Set the desired character limit here
    },
    getPreviewOfBase() {
      return (bundled) => {
        const prefix = this.selectedPrefix || ''; // Handle the case where selectedPrefix is empty
        const postfix = this.selectedPostfix || ''; // Handle the case where selectedPostfix is empty
        const midfix = this.midfix || ''; // Handle the case where selectedPostfix is empty

        // Combine the selectedPrefix, bundled.base.content, and selectedPostfix to create the preview text
        if (!bundled.addendum.content) {
          return prefix + '\n\n' + bundled.base.content + '\n\n' + postfix;
        }

        return prefix + '\n\n' + bundled.base.content + '\n\n' + midfix;
      };
    },
    getPreviewOfAddendum() {
      return (bundled) => {
        return bundled.addendum.content;
      };
    },
  },

  async created() {
    // Cookies
    const storedSelectedPrefix = Cookies.get('selectedPrefix');
    const storedSelectedPostfix = Cookies.get('selectedPostfix');

    if (storedSelectedPrefix) {
      this.selectedPrefix = storedSelectedPrefix;
    }
    if (storedSelectedPostfix) {
      this.selectedPostfix = storedSelectedPostfix;
    }

    // Fetch current locale from URL
    this.currentLocale = this.$route.params.locale;
    console.log(this.$store.state.vuexVariable);

  },
  mounted() {
    StulipanNotify.configure({
      hasCloseButton: true,
      duration: 8000, // 10s
    });
  }
}
</script>

<style>
.bg-alternate {
  background-color: #f3f1f1;
}
.text-light-s {
  color: #6d7175 !important;
}

</style>
