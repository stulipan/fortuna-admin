<template>
  <section class="container">
    <div>

      <div>

        <div class="row">
          <div class="col-lg-12">

            <div class="row mt-2 mt-sm-3">
              <div class="col-12 correction-no-paddingX">
                <div class="card mb-20px">
                  <div class="table-responsive mt-3">
                    <table class="table table-striped table-hoverX mb-0">
                      <thead class="thead-light">
                        <tr>
                          <th scope="col">Csillagjegy</th>
                          <th scope="col">Base</th>
                          <th scope="col">Addendum</th>
                          <th scope="col">Unprocessed</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="baseHoroscope in baseHoroscopes" :key="baseHoroscope.astrologicalSign">
                          <td class="">
                            {{ baseHoroscope.astrologicalSign.name }} <br>
<!--                            <span class="text-muted">{{ csillagjegyek[baseHoroscope.astrologicalSign.name|lower]|capitalize }}</span>-->
                          </td>
                          <td class="">
                            {{ baseHoroscope.content }}
                          </td>
                          <td class="">
<!--                            {{ // addendumHoroscopes[loop.index0].content|nl2br }}-->
                          </td>
                          <td class="smallX text-muted">
<!--                            {{ rawHoroscopes[loop.index0].content|nl2br }}-->
                          </td>
                          <td class="">
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="mb-3 text-muted">
                </div>
                <div class="mb-3">
                  &nbsp;
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
  // computed: {
  //   item() {
  //     // Access the item's ID from the route parameters
  //     const itemId = this.$route.params.date;
  //     // Find the corresponding item from the fetched data
  //     return this.fetchedData.find(item => item.id === itemId);
  //   }
  // },


  async asyncData({ params }) {
    try {
      const date = params.date;
      // Make an API request to fetch the specific item based on the ID
      const response = await fetch(API_URI + `/horoscope-final/${date}`);

      console.log(response);
      const data = await response.json();

      return { baseHoroscopes: data };
    } catch (error) {
      console.error(error);
      return { baseHoroscopes: null };
    }
  },
  // props: {
  //   baseHoroscopes: {
  //     type: Object,
  //     required: true
  //   }
  // },
}
</script>

<style>
</style>

