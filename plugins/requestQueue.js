// services/requestQueue.js

export default class RequestQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  async addRequest(requestFunction) {
    return new Promise(async (resolve, reject) => {
      this.queue.push({ requestFunction, resolve, reject });
      await this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const { requestFunction, resolve, reject } = this.queue.shift();

      try {
        const result = await requestFunction();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }

    this.isProcessing = false;
  }
}
