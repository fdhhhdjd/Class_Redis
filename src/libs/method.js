//* LIB
const { default: axios } = require("axios");

//* IMPORT
const { TIME } = require("../commons/constants");
const {
  app: { firebaseMessage },
} = require("../commons/configs/app.config");

class AxiosService {
  constructor() {
    this.axiosIns = this.createAxiosInstance(
      process.env.GOOGLE_PUSH_NOTIFICATION,
      TIME._15_SECOND
    );

    this.applyAuthInterceptor(this.axiosIns);
  }

  createAxiosInstance(baseURL, timeout) {
    return axios.create({
      baseURL: baseURL,
      timeout: timeout,
      headers: {
        Accept: "application/json",
      },
    });
  }

  applyAuthInterceptor(axiosInstance) {
    axiosInstance.interceptors.request.use(
      (config) => {
        config.headers["Authorization"] = `key=${firebaseMessage}`;

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new AxiosService();
    }
    return this.instance;
  }

  async post(url, data, config) {
    try {
      const response = await this.axiosIns.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

const axiosService = AxiosService.getInstance();

module.exports = axiosService;
