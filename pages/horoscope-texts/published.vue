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

            <div v-if="!months" class="col-lg-12 correction-no-paddingX mt-20px">
              <div class="alert alert-danger">Nem sikerült betölteni a publikálásokat.</div>
            </div>

            <!-- Hónaponként egy kártya, benne minden nap (a publikálás nélküliek is) _byClaude -->
            <div v-for="month in months" :key="month.key" class="col-lg-12 correction-no-paddingX mb-3">
              <div class="card">
                <div class="card-body pb-0">
                  <div class="h5 card-title">{{ month.title }}</div>
                </div>
                <div class="table-responsive">
                  <table class="table table-hover table-striped mb-0">
                    <tbody>
                      <tr v-for="day in month.days" :key="day.date">
                        <td class="text-nowrap">
                          <NuxtLink v-if="day.count" :to="`/horoscope-texts/date/${day.date}`">{{ day.date }}</NuxtLink>
                          <span v-else class="text-muted">{{ day.date }}</span>
                          <div class="small text-muted">{{ day.weekday }}</div>
                        </td>
                        <td class="text-end w-100">
                          <span class="badge" :class="day.missing.length ? 'bg-danger' : 'bg-success'">{{ day.count }}/{{ signs.length }}</span>
                          <div v-if="day.count === 0" class="small text-danger">Nincs publikálás</div>
                          <div v-else-if="day.missing.length" class="small text-danger">Hiányzik: {{ day.missing.join(', ') }}</div>
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
const API_URI = `${process.env.BACKEND_URL}/api`;
export default {
  data() {
    return {
      goBackTo: { name: 'index'},
    };
  },

  // Publikálási napok + csillagjegyek betöltése _byClaude
  async asyncData({$axios}) {
    try {
      const [dates, signs] = await Promise.all([
        $axios.get(API_URI + '/horoscope-text-published/dates'),
        $axios.get(API_URI + '/astrological-signs/'),
      ]);
      return { publishedDates: dates.data, signs: signs.data.map(sign => sign.name) };
    } catch (error) {
      console.error(error);
      return { publishedDates: null, signs: [] };
    }
  },

  computed: {
    // Napok a legújabbtól a legrégebbi publikálásig, hónapokba csoportosítva _byClaude
    months() {
      if (!this.publishedDates || !this.publishedDates.length) {
        return null;
      }
      const byDate = {};
      this.publishedDates.forEach(item => { byDate[item.publishDate] = item.signs; });

      const monthFormat = new Intl.DateTimeFormat('hu-HU', { year: 'numeric', month: 'long', timeZone: 'UTC' });
      const weekdayFormat = new Intl.DateTimeFormat('hu-HU', { weekday: 'long', timeZone: 'UTC' });
      const first = new Date(this.publishedDates[this.publishedDates.length - 1].publishDate + 'T00:00:00Z');
      const months = [];

      for (let day = new Date(this.publishedDates[0].publishDate + 'T00:00:00Z'); day >= first; day.setUTCDate(day.getUTCDate() - 1)) {
        const date = day.toISOString().slice(0, 10);
        const published = byDate[date] || [];
        if (!months.length || months[months.length - 1].key !== date.slice(0, 7)) {
          months.push({ key: date.slice(0, 7), title: monthFormat.format(day), days: [] });
        }
        months[months.length - 1].days.push({
          date,
          weekday: weekdayFormat.format(day),
          count: published.length,
          missing: this.signs.filter(sign => !published.includes(sign)),
        });
      }
      return months;
    },
  },

  head() {
    return {
      title: 'Publikálások',
      meta: [
        {
          name: 'Publikálások',
          content: 'A publikált horoszkópok listája, publikálási dátum szerint.',
        },
      ],
    };
  },
}
</script>

<style>
</style>
