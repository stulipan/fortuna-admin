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
                      <NuxtLink :to="{ name: 'show-rewritten' }" class="w-100 h-100">
                        <div class="settings-item-body">
                          <div class="settings-icon">
                            <i class="fa-solid fa-box-archive"></i>
                          </div>
                          <div class="settings-option">
                            <div>
                              <span class="text-primary">Átírt horoszkópok</span>
                            </div>
                            <div>
                              A régi felület, ahol átírtam az ezós horikat.
                            </div>
                          </div>
                        </div>
                      </NuxtLink>
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
                    <li class="settings-item">
                      <NuxtLink to="http://www.fortunaai.hu/" target="_blank" class="w-100 h-100">
                        <div class="settings-item-body">
                          <div class="settings-icon">
                            <i class="fa-regular fa-clock"></i>
                          </div>
                          <div class="settings-option">
                            <div>
                              <span class="text-primary">Publikálások</span>
                            </div>
                            <div>
                              A publikált horoszkópok listája, publikálási dátum szerint.
                            </div>
                          </div>
                        </div>
                      </NuxtLink>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
<!--            <div class="col-lg-12 correction-no-paddingX mt-20px">-->
<!--              <div class="card">-->
<!--                <div class="card-body">-->
<!--                  <div class="h3 card-title">Átírt horoszkópok</div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
          </div>
        </div>
      </div>
  </section>
</template>

<script>
export default {
  // async asyncData({ app }) {
  //   const routeNames = app.router.options.routes.map(route => route.name).filter(Boolean);
  //   console.log('All Route Names:', routeNames);
  //
  //   // Your other logic here
  //
  //   return {};
  // },
  head() {
    return {
      title: 'Dashboard',
      meta: [
        {
          name: 'Dashboard',
          content: 'Fortuna admin dashboard-ja',
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

