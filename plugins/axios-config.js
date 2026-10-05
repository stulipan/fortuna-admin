export default function ({ $axios, $config }) {
  // Set up default headers
  const tokenValue = $config.BACKEND_API_TOKEN;
  $axios.defaults.headers.common['Authorization'] = `Bearer ${tokenValue}`;

  // // Add request interceptor
  // $axios.onRequest((config) => {
  //   // You can modify the request config here if needed
  //   return config;
  // });
  //
  // // Add response interceptor
  // $axios.onResponse((response) => {
  //   // You can modify the response data here if needed
  //   return response.data;
  // });
  //
  // // Add error interceptor
  // $axios.onError((error) => {
  //   // Handle errors here
  //   return Promise.reject(error);
  // });
}
