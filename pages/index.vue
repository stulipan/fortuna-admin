<template>
  <section class="container">
    <div>

      <div class="row mt-3">
        <div class="col-lg-12 col-xl-10 mx-auto">
          <div class="row">
            <div class="col-lg-12">
              <div class="mb-20px mb-3">
                <div class="">
                  <h3>Import from EzoTV</h3>
                </div>
                <div class="vertical-row">
                  <div class="vertical-col">
                    <div class="alert alert-secondary me-2">HU</div>
                  </div>
                  <div class="vertical-col">
                    <a href="" class="btn btn-success me-2">Ma </a>
                  </div>
                  <div class="vertical-col">
                    <a href="" class="btn btn-success me-2">Holnap </a>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-12 correction-no-paddingX mt-20px">
              <div class="card">
                <div class="card-body">
                  <div class="h3 card-title">Átírt horoszkópok</div>
                </div>

                <div class="table-responsive">
                  <table class="table table-hover">
                    <tr v-for="item in fetchedData" :key="item.date">
                      <td>
                        <nuxt-link :to="`/show-rewritten/${item.date}`">{{ item.date }}</nuxt-link>
<!--                        <nuxt-link :to="{ name: 'show-rewritten', params: { date: item.date } }">{{ item.date }}</nuxt-link>-->
<!--                        <a href="/show-rewritten/{{ item.date }}">{{ item.date }}</a>-->
                      </td>
                    </tr>
                  </table>
                </div>

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

