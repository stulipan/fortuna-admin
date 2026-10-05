<template>
  <div class="row">
    <div class="col-md-9">
      <div class="card mb-3">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center form-group">
            <div class="d-flex">
              <div class="text-muted">
                <div class="d-inline-block me-3">
                  [{{ index }}]
                </div>
                <div class="d-inline-block me-3">
                  ID: {{ horoscopeText.id }}
                </div>
                <div class="d-inline-block me-3">
                  Base:
                  <span v-if="isExceededLimit(basePreviewText, 667)">
                <span class="text-danger"> -{{ exceededCount(basePreviewText, 667) }}</span>
              </span>
                  <span v-else>
                <span>+{{ remainingCount(basePreviewText, 667) }}</span>
              </span>
                </div>
                <div class="d-inline-block me-3">
                  Addendum:
                  <span v-if="isExceededLimit(addendumPreviewText, 667)">
                <span class="text-danger"> -{{ exceededCount(addendumPreviewText, 667) }}</span>
              </span>
                  <span v-else>
                <span>+{{ remainingCount(addendumPreviewText, 667) }}</span>
              </span>
                </div>

              </div>
            </div>
            <div class="d-flex">
              <a class="btn-link-secondary text-muted" role="button" @click.prevent="removeHoroscopeText">
                <i class="fa-solid fa-trash-can"></i>
              </a>
            </div>
          </div>


          <div class="row">
            <div class="col-md-6">
              <div v-if="isPreview">
                <div v-if="prefix" class="white-space">{{ prefix + '\n\n'}}</div>
              </div>
              <EditableText
                :text="horoscopeText.base"
                :isEmptyForm="horoscopeText.id === undefined || horoscopeText.id === null"
                @text-saved="editedText => updateBase(editedText)"
                @text-changed="editedText => handleTextChange(editedText, false)"
                :textarea-rows="15"
                containerClass="containerClass"
                textareaClass="form-control"
                :applyBtnClass="applyBtnClass"
                :cancelBtnClass="cancelBtnClass"
                addTextBtnText="+ base szövegrész"
              />
              <div v-if="isPreview" class="white-space">
                <div v-if="horoscopeText.addendum" class="white-space">{{ '\n' + $store.state.selectedMidfix}}</div>
                <div v-else class="white-space">{{ '\n' + $store.state.selectedPostfix}}</div>
              </div>
            </div>
            <div class="col-md-6">
<!--              v-if="horoscopeText.addendum"-->
              <EditableText

                :text="horoscopeText.addendum"
                :isEmptyForm="horoscopeText.id === undefined || horoscopeText.id === null"
                @text-saved="editedText => updateAddendum(editedText)"
                @text-changed="editedText => handleTextChange(editedText, true)"
                :textarea-rows="15"
                containerClass="containerClass"
                textareaClass="form-control"
                :applyBtnClass="applyBtnClass"
                :cancelBtnClass="cancelBtnClass"
                addTextBtnText="+ addendum szövegrész"
              />
            </div>
          </div>
        </div>
        <div class="card-footer bg-white">
          <label class="form-label">Címkék</label>
          <MultiselectBellow
            v-model="tagList"
            :options="data_tags"
            label="name"
            trackBy="id"

            :multiple="true"
            :taggable="true"
            :hideSelected="false"
            :showLabels="false"
            :searchable="true"

            :internal-search="false"
            :options-limit="300"
            @search-change="tags_handleInternalSeach"

            @option-selected="tags_selectTag"
            @option-added="tags_addTag"
            @option-removed="tags_removeTag"
            @tag-clicked="listHoroscopeTextsByTag"
            :tagPath="tagPath"

            :block-keys="['Delete']"

            placeholder="Válassz..."
            noResultLabel="Nincs ilyen opció..."
            selectGroupLabel="A csoport kiválasztásához nyomj Enter-t"
            deselectGroupLabel="A kijelölés megszüntetéséhez nyomj Enter-t"
            selectLabel="A kiválasztásához nyomj Enter-t"
            deselectLabel="Az eltávolításhoz nyomj Enter-t"
            selectedLabel="Kiválasztva"
            tagPlaceholder="Címke létrehozásához nyomj Enter-t"

            myClass="detached"
            open-direction="bottom"
            :max-height="150"

            :close-on-select="false"
            @close="tags_handleCloseDropdown"
          >
          </MultiselectBellow>
        </div>
      </div>
    </div>
    <div class="col-md-3 mb-2">
      <div class="form-group" v-if="horoscopeText.horoscopeTextsPublished && horoscopeText.horoscopeTextsPublished.length > 0">
<!--        <div class="" v-for="(textPublished) in horoscopeText.horoscopeTextsPublished" :key="textPublished.id">-->
<!--          <div class="vertical-row">-->
<!--            <div class="vertical-col">-->

<!--              <Tag-->
<!--                :tagContent="textPublished"-->
<!--                :tagText="textPublished.publishDate"-->
<!--                :allowRemove="true"-->
<!--                :allowCopy="true"-->
<!--                :url="datePath + textPublished.publishDate"-->
<!--                @tag&#45;&#45;clicked="listHoroscopeTextsPublished(textPublished)"-->
<!--                @tag-removed="removeTextPublished(textPublished)"-->
<!--                removeBtnTitle="Eltávolítás"-->
<!--              >-->
<!--                <span :class="{ 'text-success': isTomorrow(textPublished.publishDate) }" class="me-2" style="">{{ textPublished.publishDate}}</span>-->
<!--                <span :class="{ 'text-success': isTomorrow(textPublished.publishDate) }"  class="fst-italic" style="">{{ textPublished.astrologicalSign.name}}</span>-->
<!--              </Tag>-->

<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <hr>-->

        <div v-for="(textPublished) in horoscopeText.horoscopeTextsPublished.slice(0, 2)" :key="textPublished.id">
          <div class="vertical-row">
            <div class="vertical-col">

              <Tag
                :tagContent="textPublished"
                :tagText="textPublished.publishDate"
                :allowRemove="true"
                :allowCopy="true"
                :url="datePath + textPublished.publishDate"
                @tag--clicked="listHoroscopeTextsPublished(textPublished)"
                @tag-removed="removeTextPublished(textPublished)"
                removeBtnTitle="Eltávolítás"
              >
                <span :class="{ 'text-success': isTomorrow(textPublished.publishDate) }" class="me-2" style="">{{ textPublished.publishDate}}</span>
                <span :class="{ 'text-success': isTomorrow(textPublished.publishDate) }"  class="fst-italic" style="">{{ textPublished.astrologicalSign.name}}</span>
              </Tag>

            </div>
          </div>
        </div>

        <div v-if="horoscopeText.horoscopeTextsPublished.length > 4" class="vertical-row">
          <div class="vertical-col">

            <button :data-open-modal="'horoTextPublishedList_' + index" class="btn btn-link px-0" role="button">
              további {{ horoscopeText.horoscopeTextsPublished.length - 2 - remainingPublishings.length }} publikálás
<!--              <span class="fa-lg me-2">-->
<!--                <i class="fa-solid fa-ellipsis"></i>-->
<!--              </span>-->
            </button>
            <Sidebar
              :id="'horoTextPublishedList_' + index"
              :isScrollable="true"
              :hasFooter="true"
            >
              <template #modal-title>
                <h4 class="modal-title">Az összes publikálás</h4>
              </template>
              <template #modal-body>
                <div class="" v-for="(textPublished) in horoscopeText.horoscopeTextsPublished" :key="textPublished.id">
                  <div class="vertical-row">
                    <div class="vertical-col">

                      <Tag
                        :tagContent="textPublished"
                        :tagText="textPublished.publishDate"
                        :allowRemove="true"
                        :allowCopy="true"
                        :url="datePath + textPublished.publishDate"
                        @tag--clicked="listHoroscopeTextsPublished(textPublished)"
                        @tag-removed="removeTextPublished(textPublished)"
                        removeBtnTitle="Eltávolítás"
                      >
                        <span :class="{ 'text-success': isTomorrow(textPublished.publishDate) }" class="me-2" style="">{{ textPublished.publishDate}}</span>
                        <span :class="{ 'text-success': isTomorrow(textPublished.publishDate) }"  class="fst-italic" style="">{{ textPublished.astrologicalSign.name}}</span>
                      </Tag>

                    </div>
                  </div>
                </div>
              </template>
              <template #modal-footer-wrapper>
                <div></div>
              </template>
            </Sidebar>

          </div>
        </div>

        <div v-for="(textPublished) in remainingPublishings" :key="textPublished.id">
          <div class="vertical-row">
            <div class="vertical-col">

              <Tag
                :tagContent="textPublished"
                :tagText="textPublished.publishDate"
                :allowRemove="true"
                :allowCopy="true"
                :url="datePath + textPublished.publishDate"
                @tag--clicked="listHoroscopeTextsPublished(textPublished)"
                @tag-removed="removeTextPublished(textPublished)"
                removeBtnTitle="Eltávolítás"
              >
                <span :class="{ 'text-success': isTomorrow(textPublished.publishDate) }" class="me-2" style="">{{ textPublished.publishDate}}</span>
                <span :class="{ 'text-success': isTomorrow(textPublished.publishDate) }"  class="fst-italic" style="">{{ textPublished.astrologicalSign.name}}</span>
              </Tag>

            </div>
          </div>
        </div>


      </div>
      <div class="form-group">

        <label class="form-label">Csillagjegy</label>
        <VariantPicker
          v-model="sign"
          :variants="astrologicalSigns"
          :name="'zodiac_'+index"
        ></VariantPicker>
<!--        <multiselect-->
<!--          v-model="sign"-->
<!--          :options="astrologicalSigns"-->
<!--          placeholder="Válassz..."-->
<!--          label="name"-->

<!--          track-by="id"-->
<!--          :multiple="false"-->
<!--          :close-on-select="true"-->
<!--          :show-labels="false"-->
<!--          :show-no-results="true"-->
<!--          :class="[ {'detached': true}, {'mb-2': true}]"-->
<!--          open-direction="bottom"-->
<!--          :max-height="150"-->
<!--          :allow-empty="false"-->
<!--        >-->
<!--          <span slot="noResult">Nincs ilyen opció...</span>-->
<!--        </multiselect>-->

      </div>
      <div class="form-group d-none">
        <label class="form-label">Dátum</label>
        <input
          type="text"
          v-model="date"
          placeholder="YYYY-MM-DD"
          pattern="\d{4}-\d{2}-\d{2}"
          title="Please enter a date in the format YYYY-MM-DD"
          class="form-control"
          required
        />
        <span v-if="isHoroscopeTextFormInvalid" class="invalid-feedback">{{ dateErrorMessage}}</span>
      </div>
      <div class="form-group mb-0">
        <button :class="applyBtnClass" @click="saveChanges">Save</button>
      </div>
    </div>
  </div>

</template>

<script>
import CharacterCount from "@/plugins/CharacterCount";
import EditableText from '~/components/EditableText.vue';
import Multiselect from "vue-multiselect";
import MultiselectBellow from "@/components/MultiselectBellow";
import Tag from "@/components/Tag";
import VariantPicker from "@/components/stulipan/VariantPicker";

import Modal from "@/components/stulipan/Modal";
import {StulipanModalInit} from "@/plugins/StulipanModal";
import Sidebar from "@/components/stulipan/Sidebar";

export default {
  components: {
    Sidebar,
    VariantPicker,
    Tag,
    EditableText,
    Multiselect,
    MultiselectBellow,
    Modal
  },
  mixins: [CharacterCount],
  props: {
    horoscopeText: Object, // This is a HoroscopeText.
    index: Number,
    astrologicalSigns: [],
    tags: [],
    currentDate: String,
    isPreview: false,

    applyBtnClass: String,
    cancelBtnClass: String,
  },
  data() {
    return {
      date: this.currentDate,
      dateErrorMessage: '',
      sign: {
        name: '',
        slug: '',
      },
      isHoroscopeTextFormInvalid: false,
      basePreviewText: '',
      addendumPreviewText: '',
      prefix: '',
      // tagList: this.horoscopeText.tags,
      // initialTagList: [...this.horoscopeText.tags],
      isNew: false,
      datePath: '/horoscope-texts/date/',
      tagPath: '/horoscope-texts/tag/',

      data_tags: [],
    };
  },
  computed: {
    tagList() {
      return [...this.horoscopeText.tags];
    },
    hasAddendum() {
      return this.horoscopeText.addendum ? true : false;
    },
    remainingPublishings() {
      const texts = this.horoscopeText.horoscopeTextsPublished;
      const length = texts.length;
      if (length === 2) {
        return [];
      }
      if (length === 3) {
        return texts.slice(-1);
      }
      if (length >= 4) {
        return texts.slice(-2);
      }
    }
  },
  watch: {
    '$store.state.selectedPrefix' : 'refreshPreviewTexts',
    '$store.state.selectedPostfix': 'refreshPreviewTexts',
    '$store.state.selectedMidfix': 'refreshPreviewTexts',
    currentDate(newVal) {
      this.date = newVal;
    }
  },
  methods: {
    updateBase(editedText) {
      this.horoscopeText.base = editedText;
      this.$emit('base-saved', this.horoscopeText.base);

    },
    updateAddendum(editedText) {
      this.horoscopeText.addendum = editedText;
      this.$emit('addendum-saved', this.horoscopeText.addendum);
    },
    saveChanges() {
      const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
      const isInvalidFormat = !dateFormatRegex.test(this.date);

      if (isInvalidFormat) {
        this.dateErrorMessage = 'Hibás dátum.'
        this.isHoroscopeTextFormInvalid = true;
        return;
      } else {
        this.isHoroscopeTextFormInvalid = false;
      }



      this.$emit('horoscope-text-published-saved', {
        horoscopeText: this.horoscopeText,
        date: this.date,
        sign: this.sign
      });
    },
    copyToClipboard(text) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      console.log('Kikopizva: ' + text);
    },
    removeTextPublished(textPublished) {
      this.$emit('horoscope-text-published-removed', textPublished);
    },
    tags_addTag(newTagText) {
      this.$emit('tag-added', newTagText);
    },
    tags_removeTag(tag) {
      this.$emit('tag-removed', tag);
    },
    tags_selectTag(tag) {
      this.$emit('tag-selected', tag);
    },
    tags_handleInternalSeach(searchQuery) {
      const normalizedQuery = this.normalizeString(searchQuery);
      this.data_tags = [...this.data_tags.filter(tag => this.normalizeString(tag.name).includes(normalizedQuery))];
    },
    normalizeString(str) {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    },
    tags_handleCloseDropdown(value, id) {
      this.data_tags = this.tags;
    },
    listHoroscopeTextsByTag(tag) {
      this.$router.push({ name: 'horoscope-texts-tag', params: { tag: tag.name } });
    },

    listHoroscopeTextsPublished(horoscopeTextPublished) {
      this.$router.push({ name: 'horoscope-texts-date', params: { date: horoscopeTextPublished.publishDate } });
    },

    removeHoroscopeText() {
      this.$emit('horoscope-text-removed');
    },

    handleTextChange(text, isAddendum = false) {
      if (isAddendum) {
        this.addendumPreviewText = this.getPreviewText(text, true);
      } else {
        this.basePreviewText = this.getPreviewText(text);
      }
    },
    refreshPreviewTexts() {
      this.prefix = this.$store.state.prefixes[this.$store.state.selectedPrefix] ? this.$store.state.prefixes[this.$store.state.selectedPrefix].combined : '';
      this.basePreviewText = this.getPreviewText(this.horoscopeText.base);
      this.addendumPreviewText = this.getPreviewText(this.horoscopeText.addendum, true);
    },

    // Utility methods:
    getPreviewText(text, isAddendum = false) {
      let content = '';
      if (!isAddendum) {
        if (!this.hasAddendum) {
          content = this.prefix +'\n\n' + text +'\n\n' + this.$store.state.selectedPostfix;
        } else {
          content = this.prefix +'\n\n' + text + '\n\n' + this.$store.state.selectedMidfix;
        }
      } else {
        if (this.hasAddendum) {
          content = text;
        }
      }
      return content;
    },
    isTomorrow(date) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const publishDate = new Date(date);

      return (
        publishDate.getDate() === tomorrow.getDate() &&
        publishDate.getMonth() === tomorrow.getMonth() &&
        publishDate.getFullYear() === tomorrow.getFullYear()
      );
    },
  },
  created() {
    this.data_tags = this.tags;  // this.tags comes from props
    this.refreshPreviewTexts();

    if (this.horoscopeText.id == null ) {
      this.isNew = true;
    }
  },
  mounted() {
    // this.date = this.currentDate;
  }
};
</script>
