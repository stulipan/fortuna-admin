<template>
  <section class="container">
    <div class="row mt-3">
        <div class="col-lg-12 col-xl-10 mx-auto">
          <div class="row">
            <div class="col-lg-12 mb-3">
              <div class="header-wrapper">
                <div class="header-goback">
                  <div class="x">
                    <NuxtLink :to="goBackTo" class="btn btn-secondary btn-go-back"></NuxtLink>
                  </div>
                </div>
                <div class="header-title">
                  <div class="d-flex flex-md-row align-items-center flex-wrap">
                    <div class="d-flex">
                      <div class="page-title h3 d-inline me-md-2 me-1">Publikálások
                      </div>
                    </div>
                    <div class="d-flex align-items-center">
                    </div>
                  </div>
                </div>
                <div class="header-actions">
                  ...
                </div>
              </div>
            </div>

            <div class="col-lg-12 correction-no-paddingX mt-20px">
              <div class="card">
                <div class="table-responsive">
                  <table class="table table-hover table-striped">
                    <tbody>
                      <tr v-for="item in fetchedData" :key="item.date">
                        <td>
                          <NuxtLink :to="`/show-rewritten/${item.date}/hu`">
                            {{ item.date }}
                          </NuxtLink>
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
import {Wording} from "assets/Wording";
import {FortunaPrefixes} from "assets/FortunaPrefixes";

const API_URI = `${process.env.BACKEND_URL}/api`;
export default {
  data() {
    return {
      isFetchingData: true,
      goBackTo: { name: 'index'},
    };
  },
  async asyncData({$axios}) {
    try {
      const response = await $axios.get(API_URI + '/horoscope-final');
      return { fetchedData: response.data };
    } catch (error) {
      // Handle error if the request fails
      console.error(error);
      return { fetchedData: null };
    }
  },

  head() {
    return {
      title: 'Átírt horoszkópok',
      meta: [
        {
          // hid: 'description',
          name: 'Átírt horoszkópok',
          content: 'A régi felület, ahol átírtam az ezós horikat.',
        },
      ],
    };
  },
  created() {
  }


}
</script>

<style>
</style>

