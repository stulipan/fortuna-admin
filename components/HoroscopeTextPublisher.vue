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
          <multiselect-bellow
            v-model="tagList"
            :options="tags"
            label="name"
            trackBy="id"

            :multiple="true"
            :taggable="true"
            :close-on-select="false"
            :hideSelected="false"
            :showLabels="false"
            :searchable="true"

            @option-selected="selectTag"
            @option-added="addTag"
            @option-removed="removeTag"
            @tag-clicked="listHoroscopeTextsByTag"

            placeholder="Válassz..."
            noResultLabel="Nincs ilyen opció..."
            selectGroupLabel="A csoport kiválasztásához nyomj Entert"
            deselectGroupLabel="A kijelölés megszüntetéséhez nyomj Entert"
            selectLabel="A kiválasztásához nyomj Entert"
            deselectLabel="Az eltávolításhoz nyomj Entert"
            selectedLabel="Kiválasztva"
            tagPlaceholder="Címke létrehozásához nyomj Entert"

            myClass="detached"
            open-direction="bottom"
            :max-height="150"
          >
          </multiselect-bellow>
        </div>
      </div>
    </div>
    <div class="col-md-3 mb-2">
      <div class="form-group">
        <div class="" v-for="(textPublished) in horoscopeText.horoscopeTextsPublished" :key="textPublished.id">
          <div class="vertical-row">
            <div class="vertical-col">

              <Tag
                :tagContent="textPublished"
                :tagText="textPublished.publishDate"
                @tag-clicked="listHoroscopeTextsPublished(textPublished)"
                @tag-removed="removeTextPublished(textPublished)"
              >
                <span :class="{ 'text-success': isTomorrow(textPublished.publishDate) }" class="" style="">{{ textPublished.publishDate}}</span>
                <span :class="{ 'text-success': isTomorrow(textPublished.publishDate) }"  class="fst-italic" style="">{{ textPublished.astrologicalSign.name}}</span>
              </Tag>

            </div>
          </div>
        </div>
      </div>
      <div class="form-group">

        <label class="form-label">Csillagjegy</label>
        <multiselect
          v-model="sign"
          placeholder="Válassz..."
          label="name"

          track-by="id"
          :options="astrologicalSigns"
          :multiple="false"
          :close-on-select="true"
          :show-labels="false"
          :show-no-results="true"
          :class="[ {'detached': true}, {'mb-2': true}]"
          open-direction="bottom"
          :max-height="150"
          :allow-empty="false"
          noResultLabel="Nincs ilyen opció..."
        >
        </multiselect>

      </div>
      <div class="form-group">
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

export default {
  components: {
    Tag,
    EditableText,
    Multiselect,
    MultiselectBellow,
  },
  mixins: [CharacterCount],
  props: {
    horoscopeText: Object, // This is a HoroscopeText.
    index: Number,
    astrologicalSigns: [],
    tags: [],
    isPreview: false,

    applyBtnClass: String,
    cancelBtnClass: String,
  },
  data() {
    return {
      date: '',
      sign: {
        name: '',
        slug: '',
      },
      basePreviewText: '',
      addendumPreviewText: '',
      prefix: '',
      // tagList: this.horoscopeText.tags,
      // initialTagList: [...this.horoscopeText.tags],
      isNew: false,
    };
  },
  computed: {
    tagList() {
      return [...this.horoscopeText.tags];
    },
    // prefix() {
    //   return this.$store.state.prefixes[this.$store.state.selectedPrefix] ? this.$store.state.prefixes[this.$store.state.selectedPrefix].combined : '';
    // },
    hasAddendum() {
      return this.horoscopeText.addendum ? true : false;
    },
  },
  watch: {
    '$store.state.selectedPrefix' : 'refreshPreviewTexts',
    '$store.state.selectedPostfix': 'refreshPreviewTexts',
    '$store.state.selectedMidfix': 'refreshPreviewTexts',
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
    addTag(newTagText) {
      this.$emit('tag-added', newTagText);
    },
    removeTag(tag) {
      this.$emit('tag-removed', tag);
    },
    selectTag(tag) {
      this.$emit('tag-selected', tag);
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
    this.refreshPreviewTexts();

    if (this.horoscopeText.id == null ) {
      this.isNew = true;
    }
  }
};
</script>
