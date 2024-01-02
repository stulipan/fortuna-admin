<template>
  <section class="container">
      <div class="row mt-4">
        <div class="col-lg-12 col-xl-12 mx-auto">
          <div class="row">
            <div class="col-lg-12 mb-3">
              <div>
                <button data-open-modal="devModal" class="btn btn-danger" role="button">Itt van egy modal.</button>
              </div>
              <div ref="modal" class="modal fadeX" id="devModal" role="dialog" aria-modal="true" aria-labelledby="devModalTitle">
                <div class="modal-dialog modal-dialog-centeredX modal-dialog-scrollable" tabindex="-1">
                  <div class="modal-content">
                    <button type="button" class="close" data-close-modal="modal" aria-label="Close">
                      <span aria-hidden="true"></span>
                    </button>
                    <div class="modal-header">
                      <h4 class="modal-title" id="devModalTitle">Modal title</h4>
                    </div>
                    <div class="modal-body">
<!--                      <h4 class="modal-title mb-3" id="devModalTitle">Modal title</h4>-->
                      <p>Modal body text goes here.</p>
                      <p>Ugye veled is előfordult már, hogy eszedbe jutott egy kedves ismerős? Vagy amikor munkaidőben csak a szerelmedre tudtál gondolni, netán hálát éréztél valaki iránt de éppen nem tudtad miképpen mutathatod ki az illető felé? Ezek mind gyönyörűszép emberi érzések. A Difiorival olyan szolgáltatást álmodtunk meg, ami révén könyedén kifejezheted ezen érzéseidet, szeretteid tudtukra adhatod, hogy gondolsz rájuk és menyire fontosak neked.</p>
                      <p>Ugye veled is előfordult már, hogy eszedbe jutott egy kedves ismerős? Vagy amikor munkaidőben csak a szerelmedre tudtál gondolni, netán hálát éréztél valaki iránt de éppen nem tudtad miképpen mutathatod ki az illető felé? Ezek mind gyönyörűszép emberi érzések. A Difiorival olyan szolgáltatást álmodtunk meg, ami révén könyedén kifejezheted ezen érzéseidet, szeretteid tudtukra adhatod, hogy gondolsz rájuk és menyire fontosak neked.</p>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-close-modal="modal">Close</button>
                      <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-12 mb-3">
              <div class="header-wrapper">
                <div class="header-goback">
                  <div class="x">
                    <a href="#" class="btn btn-secondary btn-go-back" @click.prevent="$router.go(-1)"></a>
                  </div>
                </div>
                <div class="header-title">
                  <div class="d-flex flex-md-row align-items-center flex-wrap">
                    <div class="d-flex">
                      <div v-if="date">
                        <div class="page-title h3 d-inline me-md-2 me-1">Horoszkópszöveg: <span class="fw-bold">{{ date }}</span>
                          <span v-if="isPreview" class="badge bg-dark ms-2">Preview</span>
                        </div>
                      </div>
                      <div v-else>
                        <div class="page-title h3 d-inline mr-md-2 mr-1">Horoszkópszöveg
                        </div>
                      </div>
                    </div>
                    <div class="d-flex align-items-center">
                      <!--                      <span class="mr-1 badge badge-warning">Fizetésre vár</span>-->
                      <!--                      <span class="mr-1 badge badge-warning">Feldolgozás alatt</span>-->
                    </div>
                  </div>
                </div>
                <div class="header-actions">
                  <button @click.prevent="createEmptyHoroscopeText" class="btn btn-secondary me-2">
                    <i class="fa-solid fa-pen me-2"></i> Szöveg hozzáadása
                  </button>
                  <button @click.prevent="togglePreview" :class="{ 'btn-primary': !isPreview, 'btn-secondary': isPreview }" class="btn me-2">
                    <span v-if="isPreview"><i class="fa-solid fa-eye-slash fa-lg me-2"></i> Preview OFF</span>
                    <span v-else><i class="fa-solid fa-eye fa-lg me-2"></i> Preview ON</span>
                  </button>
                  <button v-if="isPreview" @click.prevent="syncHoroscopeToManychat" class="btn btn-success">
                    <i class="fa-solid fa-upload me-2"></i> Feltöltés
                  </button>
                </div>
              </div>
            </div>

            <div class="col-lg-12" v-if="isPreview">
              <div class="card">
                <div class="card-body" style="zoom: 85%;">
                  <div class="form-group">
                    <label>Prefix</label>
                    <select v-model="selectedPrefix" class="form-control" @change="handlePrefix">
                      <option v-for="prefix in prefixes" :key="prefix.combined" :value="prefix.id">{{ prefix.combined }}</option>
                    </select>
                  </div>
                  <div class="form-group mb-0">
                    <label>Postfix</label>
                    <select v-model="selectedPostfix" class="form-control" @change="handlePostfix">
                        <option
                          v-for="postfix in postfixes" :key="postfix" :value="postfix">{{ postfix }}</option>
                      </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-12 mt-3">
              <Pagination
                v-if="!isFetchingData"
                :currentPage="currentPage"
                :totalPages="totalPages"
                :prevText="paginationPrevText"
                :nextText="paginationNextText"
                @page-change="handlePageChange"
              />
            </div>

            <div class="col-lg-12 mt-20px">
              <HoroscopeTextPublisher
                v-for="(horoscopeText, index) in horoscopeTexts"
                :key="horoscopeText.id"
                :horoscopeText="horoscopeText"
                :index="index"
                :astrological-signs="astrologicalSigns"
                :tags="tags"
                :isPreview="isPreview"

                applyBtnClass="btn btn-smX btn-primary"
                cancelBtnClass="btn btn-smX btn-secondary"

                @horoscope-text-published-saved="data => addHoroscopeTextPublished(index, data)"
                @horoscope-text-published-removed="data => removeHoroscopeTextPublished(index, data)"
                @tag-selected="data => selectTag(index, data)"
                @tag-added="data => addTag(index, data)"
                @tag-removed="data => removeTag(index, data)"

                @base-saved="editedText => saveEditedHoroscopeText(index, horoscopeText)"
                @addendum-saved="editedText => saveEditedHoroscopeText(index, horoscopeText, false)"

                @horoscope-text-removed="removeHoroscopeText(index)"
              />
<!--              @base-saved="editedText => saveEditedText(index, editedText)"-->
<!--              @addendum-saved="editedText => saveEditedText(index, editedText, false)"-->
            </div>

            <div class="col-lg-12 mt-3">
              <Pagination
                :currentPage="currentPage"
                :totalPages="totalPages"
                :prevText="paginationPrevText"
                :nextText="paginationNextText"
                @page-change="handlePageChange"
              />
            </div>

            <div class="col-lg-12 mt-20px mb-4">&nbsp;
            </div>

          </div>
        </div>
      </div>
  </section>
</template>

<script>
import {Wording} from "assets/Wording.js"
import {FortunaPrefixes} from "assets/FortunaPrefixes.js"
import HoroscopeTextPublisher from "@/components/HoroscopeTextPublisher";
import Multiselect from "vue-multiselect";
import StulipanNotify from "@/plugins/StulipanNotify";
import {stulipanNotify} from "@/plugins/StulipanNotify";
import StulipanModal from "@/plugins/StulipanModal";
import Pagination from "~/components/Pagination";
import Cookies from "js-cookie";

const API_URI = 'http://fortunaai.hu/api';
const API_HOROSCOPE_TEXT = 'http://fortunaai.hu/api/horoscope-texts/';
// const API_HOROSCOPE_TEXT = 'http://fortunaai.hu/api/horoscope-text-published/';
const API_HOROSCOPE_TEXT_COUNT = 'http://fortunaai.hu/api/horoscope-texts/count/';
const API_ASTROLOGICAL_SIGN = 'http://fortunaai.hu/api/astrological-signs/';
const API_TAGS = 'http://fortunaai.hu/api/tags/';

const API_POPULATE_BOT_FIELDS = 'http://fortunaai.hu/api/manychat/populate';

export default {
  components: {
    Multiselect,
    HoroscopeTextPublisher,
    Pagination
  },

  data() {
    return {
      isFetchingData: true,

      isPreview: false,
      date: null,
      horoscopeTexts: [],
      horoscopeTextsCount: null,
      astrologicalSigns: [], // This should be populated in asyncData
      tags: [],

      currentPage: 1,
      // totalPages: null,
      pageSize: 20,
      paginationPrevText: Wording.generic.previous,
      paginationNextText: Wording.generic.next,
      // requestQueue: new RequestQueue(),
      prefixes: [],
      // prefixesAfterName: [],
      // prefixesCombined: [],
      postfixes: FortunaPrefixes.postfixes,
      midfix: FortunaPrefixes.midfix,
      selectedPrefix: '',
      selectedPostfix: '',
    };
  },

  async asyncData({params, query}) {

    const date = params.date;
    // const page = params.page || 1;

    try {
      console.log('asyncData')
      console.log(`Query page: ` + query.page);
      const [
        // horoscopeTextsResponse, horoscopeTextsResponseCount,
        astrologicalSignsResponse, tagsResponse] = await Promise.all([
        // fetch(date ? API_HOROSCOPE_TEXT + `?page=1&publishDate=${date}` :API_HOROSCOPE_TEXT + `?page=1`),
        // fetch(API_HOROSCOPE_TEXT_COUNT + (date ? `?publishDate=${date}` : '')),
        fetch(API_ASTROLOGICAL_SIGN),
        fetch(API_TAGS),
      ]);

      // // Check the first API response
      // if (!horoscopeTextsResponse.ok) {
      //   if (horoscopeTextsResponse.status >= 400 && horoscopeTextsResponse.status < 500) {
      //     // console.error(`Client-side error with status: ${response.status}`);  // Handle client-side errors (status codes in the 400 range)
      //
      //     const error = await horoscopeTextsResponse.json();
      //
      //     console.error(error.message);
      //     // TODO: Error notification
      //
      //     return { horoscopeTexts: null }; // Or return an appropriate value for client errors
      //   } else {
      //     throw new Error(`API request failed with status: ${horoscopeTextsResponse.status}`);  // Handle other server-side errors (status codes not in the 400 range)
      //   }
      // }
      //
      // if (!horoscopeTextsResponseCount.ok) {
      //   if (horoscopeTextsResponseCount.status >= 400 && horoscopeTextsResponseCount.status < 500) {
      //     // console.error(`Client-side error with status: ${response.status}`);  // Handle client-side errors (status codes in the 400 range)
      //
      //     const error = await horoscopeTextsResponseCount.json();
      //
      //     console.error(error.message);
      //     // TODO: Error notification
      //
      //     return { horoscopeTextsCount: null };
      //   } else {
      //     throw new Error(`API request failed with status: ${horoscopeTextsResponseCount.status}`);  // Handle other server-side errors (status codes not in the 400 range)
      //   }
      // }

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

      // const horoscopeTextsData = await horoscopeTextsResponse.json();
      // const horoscopeTextsCountData = await horoscopeTextsResponseCount.json();
      const astrologicalSignsData = await astrologicalSignsResponse.json();
      const tagsData = await tagsResponse.json();

      return {
        // horoscopeTexts: horoscopeTextsData,
        // horoscopeTextsCount: horoscopeTextsCountData.count,
        astrologicalSigns: astrologicalSignsData,
        tags: tagsData,
        date: date,
      };
    } catch (error) {
      console.error(error);
      return {
        // horoscopeTexts: null,
        // horoscopeTextsCountData: null,
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
    async fetchData() {
      const date = this.$route.params.date;
      const tag = this.$route.params.tag;
      const page = this.currentPage;  // this.currentPage frissitve van a `beforeRouteUpdate` lifecycle hook-ban

      try {
        let apiQueryParams = '';
        if (date) {
          apiQueryParams = `?page=${page}&publishDate=${date}`;
        } else if (tag) {
          apiQueryParams = `?page=${page}&tag=${tag}`;
        } else {
          apiQueryParams = `?page=${page}`;
        }

        const [horoscopeTextsResponse, horoscopeTextsResponseCount] = await Promise.all([
          fetch(API_HOROSCOPE_TEXT + apiQueryParams),
          fetch(API_HOROSCOPE_TEXT_COUNT + apiQueryParams),
        ]);

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

        if (true) {
        // if (!astrologicalSignsResponse.ok) {
        //   if (astrologicalSignsResponse.status >= 400 && astrologicalSignsResponse.status < 500) {
        //     // console.error(`Client-side error with status: ${response.status}`);  // Handle client-side errors (status codes in the 400 range)
        //
        //     const error = await astrologicalSignsResponse.json();
        //
        //     console.error(error.message);
        //     // TODO: Error notification
        //
        //     return {astrologicalSigns: null}; // Or return an appropriate value for client errors
        //   } else {
        //     throw new Error(`API request failed with status: ${astrologicalSignsResponse.status}`);  // Handle other server-side errors (status codes not in the 400 range)
        //   }
        // }
        //
        // if (!tagsResponse.ok) {
        //   if (tagsResponse.status >= 400 && tagsResponse.status < 500) {
        //     // console.error(`Client-side error with status: ${response.status}`);  // Handle client-side errors (status codes in the 400 range)
        //
        //     const error = await tagsResponse.json();
        //
        //     console.error(error.message);
        //     // TODO: Error notification
        //
        //     return { tags: null }; // Or return an appropriate value for client errors
        //   } else {
        //     throw new Error(`API request failed with status: ${tagsResponse.status}`);  // Handle other server-side errors (status codes not in the 400 range)
        //   }
        // }
        }

        const horoscopeTextsData = await horoscopeTextsResponse.json();
        const horoscopeTextsCountData = await horoscopeTextsResponseCount.json();
        // const astrologicalSignsData = await astrologicalSignsResponse.json();
        // const tagsData = await tagsResponse.json();

        this.horoscopeTexts = horoscopeTextsData;
        this.horoscopeTextsCount = horoscopeTextsCountData.count;

        this.isFetchingData = false;
      } catch (error) {
        console.error(error);
        return {
          horoscopeTexts: null,
          horoscopeTextsCountData: null,
          // astrologicalSigns: null,
          // tags: null,
        };
      }
      console.log('fetchData ---> Finished');
      console.log('fetchData ---> ' +  page);
    },

    createEmptyHoroscopeText() {
      let newHoroscopeText = {
        "id": null,
        "locale": "hu",
        "base": null,
        "addendum": null,
        "horoscopeTextsPublished":[],
        "tags":[]
      };
      this.horoscopeTexts.unshift(newHoroscopeText);
    },
    async saveEditedHoroscopeText(index, horoscopeText, isBase = true) {
      console.log(this.horoscopeTexts[index]);

      if (horoscopeText.base === '' || horoscopeText.base === null) {
        stulipanNotify.error('Üres horoszkópszöveg!');
        return;
      }

      const textId = horoscopeText.id;

      // Newly create horoscopeText has id=null;
      if (textId == null) {
        try {
          const response = await this.$axios.post(API_HOROSCOPE_TEXT, horoscopeText);
          this.updateHoroscopeTextAtIndex(index, response.data);
          stulipanNotify.success('Új szöveg (horoszkóp) sikeresen elmentve!');
          console.log(response);
        } catch (error) {
          this.handleError(error);
        }
      } else {
        try {
          const response = await this.$axios.put(API_HOROSCOPE_TEXT + `${textId}`, this.horoscopeTexts[index]);
          // this.horoscopeTexts[index] = response.data;
          this.updateHoroscopeTextAtIndex(index, response.data);
          if (isBase) {
            stulipanNotify.success('Base: Sikeresen elmentve!');
            // console.log('Frissített szöveg:', this.horoscopeTexts[index].base);
          } else {
            stulipanNotify.success('Addendum: Sikeresen elmentve!');
            // console.log('Frissített szöveg:', this.horoscopeTexts[index].addendum);
          }
          console.log(response);
        } catch (error) {
          this.handleError(error);
        }
      }
    },
    async removeHoroscopeText(index) {
      const isConfirmed = await stulipanNotify.showConfirmation('Biztosan törölni akarod ezt a horoszkópszöveget?', null, null, {confirmBtnClass: 'btn btn-danger'});
      if (!isConfirmed) return;

      const horoscopeText = this.horoscopeTexts[index];
      const textId = horoscopeText.id;

      if (!textId) {
        this.horoscopeTexts.splice(index, 1);
        return;
      }

      try {
        const response = await this.$axios.delete(API_HOROSCOPE_TEXT + `${textId}`);

        const foundIndex = this.horoscopeTexts.findIndex(item => item.id === textId);
        if (foundIndex !== -1) {
          this.horoscopeTexts.splice(foundIndex, 1);
        }
        console.log('Removed: Horoszkópszöveg sikeresen törölve!');
        stulipanNotify.success('Horoszkópszöveg sikeresen törölve!');
      } catch (error) {
        this.handleError(error);
      }

    },
    updateHoroscopeTextAtIndex(index, newData) {
      const updatedHoroscopeTexts = [...this.horoscopeTexts];  // Create a shallow copy of the array
      updatedHoroscopeTexts[index] = newData;
      this.horoscopeTexts = updatedHoroscopeTexts;  // Update the data property to trigger Vue's reactivity
    },

    async addTag(index, newTagText) {
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
        stulipanNotify.success('Címke: Sikeresen elmentve és hozzáadva!\'');
      } catch (error) {
        this.handleError(error);
      }
    },
    async selectTag(index, newTag) {
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
        stulipanNotify.success('Címke: Sikeresen elmentve és hozzáadva!');
      } catch (error) {
        this.handleError(error);
      }
    },
    async removeTag(index, tag) {
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
        stulipanNotify.success('Címke törölve!');
      } catch (error) {
        this.handleError(error);
      }
    },
    async refreshTags() {
      try {
        const [tagsResponse] = await Promise.all([
          fetch(API_TAGS),
        ]);

        if (!tagsResponse.ok) {
          if (tagsResponse.status >= 400 && tagsResponse.status < 500) {
            console.log(tagsResponse);
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

    async addHoroscopeTextPublished(index, data) {
      console.log(data.horoscopeText);
      console.log(data.date);
      console.log(data.sign);

      // const isConfirmed = await stulipanNotify.showConfirmation('Egy publikálást fogsz hozzáadni. Mehet?');
      // if (!isConfirmed) return;

      try {
        console.log('addHoroscopeTextPublished');
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

        stulipanNotify.success((Wording.horoscopeText.addHoroscopeTextPublishedSuccessful).replace('{{sign}}', horoscopeTextPublished.astrologicalSign.name).replace('{{date}}', horoscopeTextPublished.publishDate));

      } catch (error) {
        // if (error.response) {
        //   // The request was made and the server responded with a status code that falls out of the range of 2xx
        //   console.error('Az API-hívás hibát dobott:', error.response.status);
        //   const errorData = error.response.data;
        //   console.error(errorData.message);
        //   stulipanNotify.error(
        //     errorData.message + ' (' + error.response.status + ': ' + errorData.error + ')'
        //   );
        // } else if (error.request) {
        //   // The request was made but no response was received
        //   console.error('Request made but no response received:', error.request);
        // } else {
        //   // Something else happened while setting up the request
        //   console.error('Error:', error.message);
        // }
        this.handleError(error);
      }
    },
    async removeHoroscopeTextPublished(index, textPublished) {
      const isConfirmed = await stulipanNotify.showConfirmation(Wording.horoscopeText.removeHoroscopeTextPublished);
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
        stulipanNotify.success(Wording.horoscopeText.removeHoroscopeTextPublishedSuccessful);
      } catch (error) {
        // if (error.response) {
        //   // The request was made and the server responded with a status code that falls out of the range of 2xx
        //   console.error('Az API-hívás hibát dobott:', error.response.status);
        //   const errorData = error.response.data;
        //   console.error(errorData.message);
        //
        //   console.log(error.response);
        //   stulipanNotify.error(
        //     errorData.message + ' (' + error.response.status + ': ' + errorData.error + ')'
        //   );
        // } else if (error.request) {
        //   // The request was made but no response was received
        //   console.error('Request made but no response received:', error.request);
        // } else {
        //   // Something else happened while setting up the request
        //   console.error('Error:', error.message);
        // }
        this.handleError(error);
      }


    },

    togglePreview() {
      this.isPreview = !this.isPreview;
    },
    handlePrefix() {
      // const selectedPrefix = this.selectedPrefix;
      Cookies.set('selectedPrefix', this.selectedPrefix, { expires: 365 });
      this.$store.dispatch('setSelectedPrefix', this.selectedPrefix);
    },
    handlePostfix() {
      // const selectedPostfix = this.selectedPostfix;
      Cookies.set('selectedPostfix', this.selectedPostfix, { expires: 365 });
      this.$store.dispatch('setSelectedPostfix', this.selectedPostfix);
    },
    handlePageChange(page) {
      console.log('Page: ' + page);
      const newRoute = {
        name: this.$route.name,
        params: { date: this.$route.params.date, tag: this.$route.params.tag },
        query:  { page: page },
      };

      this.$router.push(newRoute);
    },

    async syncHoroscopeToManychat() {
      stulipanNotify.showConfirmation(
        'You are going to delete 1 Facebook Message. Proceed really?',
        async () => {
          console.log('onConfirm');
          try {
            console.log('populate Manychat');
            const postBody = {
              prefix: this.$store.state.prefixes[this.$store.state.selectedPrefix] ? this.$store.state.prefixes[this.$store.state.selectedPrefix].prefix : null,
              prefixAfterName: this.$store.state.prefixes[this.$store.state.selectedPrefix] ? this.$store.state.prefixes[this.$store.state.selectedPrefix].prefixAfterName : null,
              postfix: this.selectedPostfix,
              midfix: this.midfix,
            }

            console.log(JSON.stringify(postBody));
            console.log(this.date);
            const response = await this.$axios.post(API_POPULATE_BOT_FIELDS + `/${this.date}`, JSON.stringify(postBody));
            console.log(response.data);
            console.log('Published: Sikeresen feltoltve!');

            stulipanNotify.success(('Sikeresen feltoltve: {{date}}').replace('{{date}}', this.date));

          } catch (error) {
            if (error.response) {
              console.error('Az API-hívás hibát dobott:', error.response.status);
              const errorData = error.response.data;
              console.error(errorData.message);
              stulipanNotify.error(
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
        () => { console.log('onCancel') }
      )
    },

    handleError(error) {
      if (error.response) {
        const responseStatus = error.response.status;
        const responseData = error.response.data; // Example: data = { error: "Unprocessable entity.", message: "A törölni kívánt entitás nem található."}

        console.error('API-hívás hibakód:', responseStatus);  // The request was made and the server responded with a status code that falls out of the range of 2xx
        console.error(responseData.message);
        stulipanNotify.error(
          `${responseData.message} (${responseStatus}: ${responseData.error})`
        );
      } else if (error.request) {
        console.error('Request made but no response received:', error.request);
      } else {
        console.error('Error:', error.message);
      }
    },
  },

  head() {
    return {
      title: `${this.date ? `HT: ${this.date}` : 'Horoszkópszövegek'}`,
      meta: [
        {
          // hid: 'description',
          name: 'Horoszkópszövegek',
          content: 'Ezen az oldalon editálhatod a horoszkópszövegeket',
        },
      ],
    };
  },

  async created() {
    this.prefixes = FortunaPrefixes.prefixes.map(({ start, end }, index) => ({
      id: index,
      prefix: start,
      prefixAfterName: end,
      combined: start + FortunaPrefixes.yourname + end,
    }));

    // Cookies
    this.selectedPrefix = Cookies.get('selectedPrefix');
    this.selectedPostfix = Cookies.get('selectedPostfix');

    if (this.selectedPrefix) {
      this.$store.dispatch('setSelectedPrefix', this.selectedPrefix);
    }
    if (this.selectedPostfix) {
      this.$store.dispatch('setSelectedPostfix', this.selectedPostfix);
    }
    this.$store.commit('updateSelectedMidfix', this.midfix);
    this.$store.commit('updateVuexVariable', 'Ez egy Vuex változó.');
    this.$store.commit('updatePrefixes', this.prefixes);

    // this.totalPages = Math.ceil(this.horoscopeTextsCount / this.pageSize);

    this.currentPage = parseInt(this.$route.query.page, 10) || 1;
    await this.fetchData();
    console.log('created ---> finished')
  },

  mounted() {
    // const myModal = new StulipanModal({
    //   target: '#devModal',
    //   closeOnEsc: true,
    // });
    // myModal.show();



    // const notifyTop = new StulipanNotify({position: 'top-left', isFluid: true});
    // notifyTop.error('Ez egy notify tipusu uzenet.');

    const notifyConfig = {
      // position: 'top-center',
      // isFluid: true,
      duration: 8000,
      confirmText: Wording.generic.confirmBtn,
      cancelText: Wording.generic.cancelBtn,
    };
    stulipanNotify.configure(notifyConfig);
    // stulipanNotify.success('This is a very long, in fact more than longer notification message displayed on the screen.');

  },

  beforeRouteUpdate(to, from, next) {
    this.currentPage = parseInt(to.query.page, 10) || this.currentPage;
    // React to route parameter changes
    // Access parameters with to.params and from.params
    this.fetchData();
    next();
  }

  // // NOT IN USE !!!
  // async asyncData() {
  //   // const requestQueue = new RequestQueue();
  //   //
  //   // const fetchHoroscopeTexts = async () => {
  //   //   const response = await fetch(API_HOROSCOPE_TEXT);
  //   //   return response.ok ? response.json() : Promise.reject(response.status);
  //   // };
  //   //
  //   // const fetchAstrologicalSigns = async () => {
  //   //   const response = await fetch(API_ASTROLOGICAL_SIGN);
  //   //   return response.ok ? response.json() : Promise.reject(response.status);
  //   // };
  //   //
  //   // const fetchTags = async () => {
  //   //   const response = await fetch(API_TAGS);
  //   //   return response.ok ? response.json() : Promise.reject(response.status);
  //   // };
  //   //
  //   //
  //   // // Add requests to the requestQueue
  //   // const [horoscopeTextsData, astrologicalSignsData, tagsData] = await Promise.all([
  //   //   requestQueue.addRequest(fetchHoroscopeTexts),
  //   //   requestQueue.addRequest(fetchAstrologicalSigns),
  //   //   requestQueue.addRequest(fetchTags),
  //   // ]);
  //   //
  //   // return {
  //   //   horoscopeTexts: horoscopeTextsData,
  //   //   astrologicalSigns: astrologicalSignsData,
  //   //   tags: tagsData,
  //   // };
  // },
}

</script>

<style>
/*.modal {*/

/*  !*width: 100%;*!*/
/*  !*height: 100%;*!*/
/*  background-color: rgba(0, 0, 0, 0.5);*/
/*}*/

/*.modal-dialog {*/
/*  outline: none;*/
/*}*/

/*.show .modal-dialog {*/
/*  animation-duration: .2s;*/
/*  animation-name: dialog_fadeInDown;*/
/*}*/

/*.hide .modal-dialog {*/
/*  animation-duration: .2s;*/
/*  animation-name: dialog_fadeOutUp;*/
/*}*/

/*@keyframes dialog_fadeInDown {*/
/*  0% {*/
/*    opacity: 0;*/
/*    transform: translateY(-20px);*/
/*  }*/
/*  100% {*/
/*    opacity: 1;*/
/*    transform: translateY(0);*/
/*  }*/
/*}*/

/*@keyframes dialog_fadeOutUp {*/
/*  0% {*/
/*    opacity: 1;*/
/*    transform: translateY(0);*/
/*  }*/
/*  100% {*/
/*    opacity: 0;*/
/*    transform: translateY(-20px);*/
/*  }*/
/*}*/









/*.notify-container {*/
/*  --apt-container-spacer: 20px;*/
/*  --apt-container-width: 500px;*/

/*  position: fixed;*/
/*  display: flex;*/
/*  flex-direction: column;*/
/*  gap: .5rem;*/
/*  margin: var(--apt-container-spacer);*/
/*  max-width: var(--apt-container-width);*/
/*  z-index: 1200; !* Last Bootstrap z-index is $zindex-tooltip: 1080; From here: https://getbootstrap.com/docs/5.0/layout/z-index/ *!*/
/*}*/
/*.notify-container[data-position^="top-"] {*/
/*  top: 0;*/
/*}*/
/*.notify-container[data-position^="bottom-"] {*/
/*  bottom: 0;*/
/*}*/

/*.notify-container[data-position$="-right"] {*/
/*  right: 0;*/
/*}*/

/*.notify-container[data-position$="-left"] {*/
/*  left: 0;*/
/*}*/

/*.notify-container[data-position$="-center"] {*/
/*  left: 50%;*/
/*  transform: translateX(-50%);*/
/*}*/

/*.notify-container.notify-fluid {*/
/*  width: 100% !important;*/
/*  max-width: 100% !important;*/
/*  margin: 0;*/
/*}*/

/*.notify-container.notify-fluid .notify {*/
/*  border-radius: 0;*/
/*}*/

/*.notify {*/
/*  --apt-notify-body-margin: 0.5rem;*/
/*  --apt-notify-action-padding-top: 0.25625rem;*/

/*  box-sizing: border-box;*/
/*  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.05);*/
/*  display: flex;*/
/*  justify-content: space-between;*/
/*  align-items: flex-start;*/
/*  overflow: hidden;*/

/*  transform-origin: top;*/
/*  transition: translate .2s cubic-bezier(.8,0,.2,.8);*/
/*}*/


/*.notify.show {*/
/*  animation: expandHeight .4s cubic-bezier(.8,0,.2,.8);*/
/*}*/

/*.notify.hide {*/
/*  transform: scaleY(0);*/
/*  animation: collapseHeight .4s cubic-bezier(0,1,.2,1);*/
/*}*/

/*.notify-body {*/
/*  display: flex;*/
/*  margin-right: var(--apt-notify-body-margin);*/
/*}*/

/*.notify-action {*/
/*  display: flex;*/
/*  padding-top: var(--apt-notify-action-padding-top); !* calc((1.45rem - 0.89rem)/2)   >>> line height - fontSize / 2*!*/
/*}*/

/*@keyframes expandHeight {*/
/*  from {*/
/*    transform: scaleY(0);*/
/*  }*/
/*  to {*/
/*    transform: scaleY(1);*/
/*  }*/
/*}*/

/*@keyframes collapseHeight {*/
/*  from {*/
/*    transform: scaleY(1);*/
/*  }*/
/*  to {*/
/*    transform: scaleY(0);*/
/*  }*/
/*}*/


.white-space {
  white-space: pre-wrap;
}
</style>
