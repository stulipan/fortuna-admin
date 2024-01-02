<template>
  <section class="container">
    <div>

      <div class="row mt-3">
        <div class="col-lg-12 col-xl-12 mx-auto">
          <div class="row">
            <div class="col-lg-12">
              <div class="mb-20px mb-3">
                <div class="">
                  <h3>Horoszkópszövegek</h3>
                  <button @click.prevent="onClickDoConfirm" class="btn btn-call-to-action">Click</button>
                </div>
              </div>
            </div>

            <div class="col-lg-12 correction-no-paddingX mt-20px">
              <div class="col-lg-12 mt-20px mb-3">
                <Pagination
                  :currentPage="currentPage"
                  :totalPages="totalPages"
                  :prevText="paginationPrevText"
                  :nextText="paginationNextText"
                  @page-change="handlePageChange"
                />
              </div>

              <div class="col-lg-12 correction-no-paddingX mt-20px">
                <HoroscopeTextPublisher
                  v-for="(horoscopeText, index) in horoscopeTexts"
                  :key="horoscopeText.id"
                  :horoscopeText="horoscopeText"
                  :index="index"
                  :astrological-signs="astrologicalSigns"
                  :tags="tags"

                  applyBtnClass="btn btn-smX btn-primary"
                  cancelBtnClass="btn btn-smX btn-secondary"

                  @horoscope-text-published-saved="data => handleHoroscopeTextPublished(index, data)"
                  @horoscope-text-published-removed="data => removeHoroscopeTextPublished(index, data)"
                  @tag-selected="data => selectTag(index, data)"
                  @tag-added="data => addTag(index, data)"
                  @tag-removed="data => removeTag(index, data)"

                  @base-saved="editedText => saveNewText(index, editedText)"
                  @addendum-saved="editedText => saveNewText(index, editedText, false)"

                />
              </div>

              <div class="col-lg-12 mt-20px mb-4">&nbsp;
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
import HoroscopeTextPublisher from "@/components/HoroscopeTextPublisher";
import Multiselect from "vue-multiselect";
import StulipanNotify from "@/plugins/StulipanNotify_const_orig.js";
import RequestQueue from "~/plugins/requestQueue";
import Pagination from "~/components/Pagination";

const API_URI = 'http://fortunaai.hu/api';
// const API_HOROSCOPE_TEXT = 'http://fortunaai.hu/api/horoscope-texts/?cursor=9165';
const API_HOROSCOPE_TEXT = 'http://fortunaai.hu/api/horoscope-texts/';
const API_HOROSCOPE_TEXT_COUNT = 'http://fortunaai.hu/api/horoscope-texts/count';
const API_ASTROLOGICAL_SIGN = 'http://fortunaai.hu/api/astrological-signs/';
const API_TAGS = 'http://fortunaai.hu/api/tags/';

export default {
  components: {
    Multiselect,
    HoroscopeTextPublisher,
    Pagination
  },

  data() {
    return {
      horoscopeTexts: [],
      horoscopeTextsCount: null,
      astrologicalSigns: [], // This should be populated in asyncData
      tags: [],

      currentPage: 1,
      // totalPages: null,
      pageSize: 20,
      paginationPrevText: '← Előző',
      paginationNextText: 'Kővetkező →',
      // requestQueue: new RequestQueue(),
    };
  },

  async asyncData() {
    const pageSize = 20;

    try {
      const [horoscopeTextsResponse, horoscopeTextsResponseCount, astrologicalSignsResponse, tagsResponse] = await Promise.all([
        fetch(API_HOROSCOPE_TEXT + `?page=1`),
        fetch(API_HOROSCOPE_TEXT_COUNT),
        fetch(API_ASTROLOGICAL_SIGN),
        fetch(API_TAGS),
      ]);

      // Check the first API response
      if (!horoscopeTextsResponse.ok) {
        if (horoscopeTextsResponse.status >= 400 && horoscopeTextsResponse.status < 500) {
          // console.error(`Client-side error with status: ${response.status}`);  // Handle client-side errors (status codes in the 400 range)

          const error = await horoscopeTextsResponse.json();

          console.error(error.message);
          // TODO: Error notification

          return { horoscopeTexts: null }; // Or return an appropriate value for client errors
        } else {
          throw new Error(`API request failed with status: ${horoscopeTextsResponse.status}`);  // Handle other server-side errors (status codes not in the 400 range)
        }
      }

      if (!horoscopeTextsResponseCount.ok) {
        if (horoscopeTextsResponseCount.status >= 400 && horoscopeTextsResponseCount.status < 500) {
          // console.error(`Client-side error with status: ${response.status}`);  // Handle client-side errors (status codes in the 400 range)

          const error = await horoscopeTextsResponseCount.json();

          console.error(error.message);
          // TODO: Error notification

          return { horoscopeTextsCount: null };
        } else {
          throw new Error(`API request failed with status: ${horoscopeTextsResponseCount.status}`);  // Handle other server-side errors (status codes not in the 400 range)
        }
      }

      if (!astrologicalSignsResponse.ok) {
        if (astrologicalSignsResponse.status >= 400 && astrologicalSignsResponse.status < 500) {
          // console.error(`Client-side error with status: ${response.status}`);  // Handle client-side errors (status codes in the 400 range)

          const error = await astrologicalSignsResponse.json();

          console.error(error.message);
          // TODO: Error notification

          return {astrologicalSigns: null}; // Or return an appropriate value for client errors
        } else {
          throw new Error(`API request failed with status: ${astrologicalSignsResponse.status}`);  // Handle other server-side errors (status codes not in the 400 range)
        }
      }

      if (!tagsResponse.ok) {
        if (tagsResponse.status >= 400 && tagsResponse.status < 500) {
          // console.error(`Client-side error with status: ${response.status}`);  // Handle client-side errors (status codes in the 400 range)

          const error = await tagsResponse.json();

          console.error(error.message);
          // TODO: Error notification

          return { tags: null }; // Or return an appropriate value for client errors
        } else {
          throw new Error(`API request failed with status: ${tagsResponse.status}`);  // Handle other server-side errors (status codes not in the 400 range)
        }
      }

      const horoscopeTextsData = await horoscopeTextsResponse.json();
      const horoscopeTextsCountData = await horoscopeTextsResponseCount.json();
      const astrologicalSignsData = await astrologicalSignsResponse.json();
      const tagsData = await tagsResponse.json();

      return {
        horoscopeTexts: horoscopeTextsData,
        horoscopeTextsCount: horoscopeTextsCountData.count,
        // totalPages: Math.ceil(horoscopeTextsCountData.count / pageSize),
        astrologicalSigns: astrologicalSignsData,
        tags: tagsData,
      };
    } catch (error) {
      console.error(error);
      return {
        horoscopeTexts: null,
        horoscopeTextsCountData: null,
        astrologicalSigns: null,
        tags: null,
      };
    }
  },

  computed: {
    totalPages() {
      return Math.ceil(this.horoscopeTextsCount / this.pageSize);
    },
  },

  methods: {
    async handlePageChange(page) {
      console.log(page);
      try {
        const response = await this.$axios.get(API_HOROSCOPE_TEXT + `?page=${page}`);
        this.horoscopeTexts = response.data;

        this.currentPage = page;
        // this.totalPages = Math.ceil(this.horoscopeTextsCount / this.pageSize);
        this.cursor = this.horoscopeTexts[this.horoscopeTexts.length - 1].id;
      } catch (error) {
        console.error('Error fetching horoscope texts:', error);
      }
    },

    async handleHoroscopeTextPublished(index, data) {
      console.log(data.horoscopeText);
      console.log(data.date);
      console.log(data.sign);

      const isConfirmed = await StulipanNotify.showConfirmation('Egy publikálást fogsz hozzáadni. Mehet?');
      if (!isConfirmed) return;

      try {
        console.log('handleHoroscopeTextPublished');
        const textId = this.horoscopeTexts[index].id;
        const horoscopeTextPublished = {
          astrologicalSign: data.sign,
          publishDate: data.date,
          note: null
        }

        const response = await this.$axios.post(API_HOROSCOPE_TEXT + `${textId}` + '/published/', horoscopeTextPublished);
        console.log(response.data);
        console.log('this.horoscopeTexts[index] BEFORE');
        console.log(index);
        console.log(this.horoscopeTexts[index]);
        // this.horoscopeTexts[index] = response.data;  // HoroscopeText jön vissza
        // this.horoscopeTexts[index].horoscopeTextsPublished = response.data.horoscopeTextsPublished;

        this.updateHoroscopeTextAtIndex(index, response.data);

        console.log('this.horoscopeTexts[index] AFTER');
        console.log(index);
        console.log(this.horoscopeTexts[index]);

        console.log('Published: Sikeresen elmentve!');

        StulipanNotify.configure({
          position: 'top',
          isFullscreen: true,
          duration: 5000,
        });
        StulipanNotify.success(('A publikálás sikeresen elmentve: {date} {sign}').replace('{sign}', horoscopeTextPublished.astrologicalSign.name).replace('{date}', horoscopeTextPublished.publishDate));

      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code that falls out of the range of 2xx
          console.error('Az API-hívás hibát dobott:', error.response.status);
          const errorData = error.response.data;
          console.error(errorData.message);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Request made but no response received:', error.request);
        } else {
          // Something else happened while setting up the request
          console.error('Error:', error.message);
        }
      }
    },
    async removeHoroscopeTextPublished(index, textPublished) {
      const isConfirmed = await StulipanNotify.showConfirmation('Egy publikálást fogsz törölni. Folytatod?');
      if (!isConfirmed) return;

      try {
        console.log('removeHoroscopeTextPublished');
        const horoscopeText = this.horoscopeTexts[index];
        const textId = horoscopeText.id;
        const publishedId = textPublished.id;

        const response = await this.$axios.delete(API_HOROSCOPE_TEXT + `${textId}` + '/published/' + `${publishedId}`);

        const foundIndex = horoscopeText.horoscopeTextsPublished.findIndex(item => item.id === textPublished.id);
        if (foundIndex !== -1) {
          horoscopeText.horoscopeTextsPublished.splice(foundIndex, 1);
        }
        console.log('Removed: Sikeresen törölve!');
        StulipanNotify.success('A publikálás sikeresen törölve!');
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code that falls out of the range of 2xx
          console.error('Az API-hívás hibát dobott:', error.response.status);
          const errorData = error.response.data;
          console.error(errorData.message);

          console.log(error.response);
          StulipanNotify.error(
            errorData.message + ' (' + error.response.status + ': ' + errorData.error + ')'
          );
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Request made but no response received:', error.request);
        } else {
          // Something else happened while setting up the request
          console.error('Error:', error.message);
        }
      }


    },
    async addTag(index, newTagText) {
      console.log('addTag');
      const horoscopeText = this.horoscopeTexts[index];
      const textId = this.horoscopeTexts[index].id;
      const newTag = {
        id: null,
        name: newTagText,
      }

      try {
        const response = await this.$axios.post(API_HOROSCOPE_TEXT + `${textId}` + '/tags/', newTag);
        console.log(response.data);
        this.updateHoroscopeTextAtIndex(index, response.data);

        const tagList = this.horoscopeTexts[index].tags;
        const foundTag = tagList.find(tag => tag.name === newTag.name);  // Megkeressük az elpósztolt címket, így megkapjuk POST-hívásban visszakapott objektumot (ennek már van 'id'-ja!)
        // this.tags = [...this.tags, foundTag];  // reactive módja ennek: this.tags.push(foundTag)
        this.tags = this.tags.concat(foundTag);

        console.log('Címke: Sikeresen elmentve és hozzáadva!');
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code that falls out of the range of 2xx
          console.error('Az API-hívás hibát dobott:', error.response.status);
          const errorData = error.response.data;
          console.error(errorData.message);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Request made but no response received:', error.request);
        } else {
          // Something else happened while setting up the request
          console.error('Error:', error.message);
        }
      }
    },
    async selectTag(index, newTag) {
      console.log('assignTag');
      const textId = this.horoscopeTexts[index].id;

      try {
        const response = await this.$axios.post(API_HOROSCOPE_TEXT + `${textId}` + '/tags/', newTag);
        this.updateHoroscopeTextAtIndex(index, response.data);

        const tagList = this.horoscopeTexts[index].tags;
        const foundTag = tagList.find(tag => tag.name === newTag.name);

        // Csekkolja, hogy a 'this.tags' listában létezik-e az új címke. Ha igen, felülcsapja (azzal, ami API-hívásból jött), ha nem, akkor hozzáadja.
        const indexToReplace = this.tags.findIndex(tag => tag.name === foundTag.name);
        if (indexToReplace !== -1) {
          this.tags.splice(indexToReplace, 1, foundTag);
        } else {
          this.tags.push(foundTag);
        }
        console.log('Címke: Sikeresen elmentve és hozzáadva!');
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code that falls out of the range of 2xx
          console.error('Az API-hívás hibát dobott:', error.response.status);
          const errorData = error.response.data;
          console.error(errorData.message);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Request made but no response received:', error.request);
        } else {
          // Something else happened while setting up the request
          console.error('Error:', error.message);
        }
      }
    },
    async removeTag(index, tag) {
      console.log('removeTag');
      console.log(tag);
      console.log(tag.id);
      const horoscopeText = this.horoscopeTexts[index];
      const textId = this.horoscopeTexts[index].id;
      const tagId = tag.id;

      // console.log(horoscopeText.tags);
      // const foundTag = horoscopeText.tags.find(item => item.name === tag.name);
      // const tagId = foundTag.id;

      try {
        const response = await this.$axios.delete(API_HOROSCOPE_TEXT + `${textId}` + '/tags/' + `${tagId}`);

        const foundIndex = horoscopeText.tags.findIndex(item => item.name === tag.name);
        if (foundIndex !== -1) {
          horoscopeText.tags.splice(foundIndex, 1);
        }

        await this.refreshTags();

      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code that falls out of the range of 2xx
          console.error('Az API-hívás hibát dobott:', error.response.status);
          const errorData = error.response.data;
          console.error(errorData.message);
          StulipanNotify.success(error.response.status + ' >> ' + error.response.data );
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Request made but no response received:', error.request);
        } else {
          // Something else happened while setting up the request
          console.error('Error:', error.message);
        }
      }
    },

    async refreshTags() {
      try {
        const [tagsResponse] = await Promise.all([
          fetch(API_TAGS),
        ]);

        if (!tagsResponse.ok) {
          if (tagsResponse.status >= 400 && tagsResponse.status < 500) {
            // console.error(`Client-side error with status: ${response.status}`);  // Handle client-side errors (status codes in the 400 range)

            const error = await tagsResponse.json();

            console.error(error.message);
            // TODO: Error notification

            return { tags: null }; // Or return an appropriate value for client errors
          } else {
            throw new Error(`API request failed with status: ${tagsResponse.status}`);  // Handle other server-side errors (status codes not in the 400 range)
          }
        }

        this.tags = await tagsResponse.json();

      } catch (error) {
        console.error(error);
        return {
          tags: null,
        };
      }
    },

    updateHoroscopeTextAtIndex(index, newData) {
      const updatedHoroscopeTexts = [...this.horoscopeTexts];  // Create a shallow copy of the array
      updatedHoroscopeTexts[index] = newData;
      this.horoscopeTexts = updatedHoroscopeTexts;  // Update the data property to trigger Vue's reactivity
    },
    async saveNewText(index, editedText, isBase = true) {

      if (isBase) {
        this.horoscopeTexts[index].base = editedText;
      } else {
        this.horoscopeTexts[index].addendum = editedText;
      }

      const textId = this.horoscopeTexts[index].id;
      // const textId=100;

      try {
        const response = await this.$axios.put(API_HOROSCOPE_TEXT + `${textId}`, this.horoscopeTexts[index]);
        console.log(response);
        this.horoscopeTexts[index] = response.data;
        if (isBase) {
          console.log('Base: Sikeresen elmentve!');
          console.log('Frissített szöveg:', this.horoscopeTexts[index].base);
        } else {
          console.log('Addendum: Sikeresen elmentve!');
          console.log('Frissített szöveg:', this.horoscopeTexts[index].addendum);
        }

      } catch (error) {
        // console.error(error);
        // Handle the error response here
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Az API-hívás hibát dobott:', error.response.status);
          const errorData = error.response.data;
          console.error(errorData.message);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Request made but no response received:', error.request);
        } else {
          // Something else happened while setting up the request
          console.error('Error:', error.message);
        }
      }
    },
    onClickDoConfirm() {
      console.log(this.totalPages);
      StulipanNotify.showConfirmation(
        'You are going to delete 1 Facebook Message. Proceed really?',
        () => { console.log(this.totalPages); console.log('onConfirm'); },
        () => { console.log('onCancel') }
      )
    }

  },

  async created() {
    // this.totalPages = Math.ceil(this.horoscopeTextsCount / this.pageSize);
    await this.handlePageChange(1);
  },

  mounted() {
    StulipanNotify.configure({
      hasCloseButton: true,
      duration: 5000,
      confirmText: 'Mehet',
      cancelText: 'Mégse',
    });

    // StulipanNotify.warning('This is a very long, in fact more than longer notification message displayed on the scree.', { duration: 500000});
  }
}

// async asyncData() {
//   const requestQueue = new RequestQueue();
//
//   const fetchHoroscopeTexts = async () => {
//     const response = await fetch(API_HOROSCOPE_TEXT);
//     return response.ok ? response.json() : Promise.reject(response.status);
//   };
//
//   const fetchAstrologicalSigns = async () => {
//     const response = await fetch(API_ASTROLOGICAL_SIGN);
//     return response.ok ? response.json() : Promise.reject(response.status);
//   };
//
//   const fetchTags = async () => {
//     const response = await fetch(API_TAGS);
//     return response.ok ? response.json() : Promise.reject(response.status);
//   };
//
//
//   // Add requests to the requestQueue
//   const [horoscopeTextsData, astrologicalSignsData, tagsData] = await Promise.all([
//     requestQueue.addRequest(fetchHoroscopeTexts),
//     requestQueue.addRequest(fetchAstrologicalSigns),
//     requestQueue.addRequest(fetchTags),
//   ]);
//
//   return {
//     horoscopeTexts: horoscopeTextsData,
//     astrologicalSigns: astrologicalSignsData,
//     tags: tagsData,
//   };
// },

</script>

<style>
.white-space {
  white-space: pre-wrap;
}

.notification {
  position: fixed;
  top: 0;
  right: 20px;
  z-index: 1200;  /* Last Bootstrap z-index is $zindex-tooltip: 1080; From here: https://getbootstrap.com/docs/5.0/layout/z-index/ */
  opacity: 0;
  transform: translateY(-20px); /* Initially move it up to hide it */
  transition: top 0.5s ease-in-out, opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.05);
}

.notification.show {
  opacity: 1;
  transform: translateY(0);
  top: 20px;
  transition: top 0.5s ease-in-out, opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
}

.confirmation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.5);
  overflow: hidden;
  z-index: 1200;   /* backdrop z-index  */

}

.confirmation .confirmation-dialog {
  width: auto;
  display: flex;
  flex-direction: column;
  /*width: 540px;*/
  max-width: 540px;
  margin: 2rem auto;
  background-color: #fff;
  border: 1px solid rgba(0,0,0,.2);
  border-radius: 0.3rem;
  /*outline: 0;*/
  animation-duration: .2s;
  animation-name: fadeInDown;


  /*z-index: 1201;*/
  transform: translate(0);
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.confirmation-body {
  position: relative;
  flex: 1 1 auto;
  padding: .5rem 1rem;
}
.confirmation-footer {
  display: flex;
  justify-content: space-between;
  padding: .5rem 1rem;
  border-top: 1px solid #dee2e6;
}

.confirmation-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1190;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: .5;
}


/*.fade:not(.show) {*/
/*  opacity: 0;*/
/*}*/

/*.confirmation.fade .confirmation-dialog {*/
/*  transition: transform .3s ease-out;*/
/*  transform: translate(0,-50px);*/
/*}*/

/*.confirmation.show .confirmation-dialog {*/
/*  transform: none;*/
/*}*/

</style>


