<template>
  <section class="container">
    <div class="row mt-3">
        <div class="col-lg-12 col-xl-10 mx-auto">
          <div class="row">
            <div class="col-lg-12">
              <div class="mb-20px mb-3">
                <div class="">
                  <h3 class="d-inline-block">Fortuna üzenetei [Horoszkóp admin]</h3>
                </div>
              </div>
            </div>

            <div class="col-lg-12 correction-no-paddingX mb-3">
              <div class="card">
                <div class="card-body">
                  <ul class="settings-item-list">
                    <li class="settings-item">
                      <nuxt-link :to="`/horoscope-texts/`" class="w-100 h-100">
                        <div class="settings-item-body">
                          <div class="settings-icon">
                            <i class="fa-regular fa-file-lines"></i>
                          </div>
                          <div class="settings-option">
                            <div>
                              <span class="text-primary">Horoszkópszövegek</span>
                            </div>
                            <div>
                              Feldogozatlan szövegek.
                            </div>
                          </div>
                        </div>
                      </nuxt-link>
                    </li>
                    <li class="settings-item">
                      <a href="http://www.fortunaai.hu/" target="_blank" class="w-100 h-100">
                        <div class="settings-item-body">
                          <div class="settings-icon">
                            <i class="fa-solid fa-cloud-arrow-down"></i>
                          </div>
                          <div class="settings-option">
                            <div>
                              <span class="text-primary">Import from EzoTV</span>
                            </div>
                            <div>
                              Server oldali weboldal: Fortunaai.hu
                            </div>
                          </div>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-lg-12 correction-no-paddingX mt-20px">
              <div class="card">
                <div class="card-body">
                  <div class="h3 card-title">Átírt horoszkópok</div>
                </div>

                <div class="table-responsive">
                  <table class="table table-hover table-striped">
                    <tbody>
                      <tr v-for="item in fetchedData" :key="item.date">
                        <td>
                          <nuxt-link :to="`/show-rewritten/${item.date}/hu`">
                            {{ item.date }}
                          </nuxt-link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </section>
</template>

<script>
const API_URI = 'http://fortunaai.hu/api';
export default {
  async asyncData() {
    try {
      // Make an API request to fetch the data
      const response = await fetch(API_URI + '/horoscope-final');
      const data = await response.json();

      // Return the fetched data
      return { fetchedData: data };
    } catch (error) {
      // Handle error if the request fails
      console.error(error);
      return { fetchedData: null };
    }
  }
}
</script>

<style>
</style>

