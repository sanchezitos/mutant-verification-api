import axios, { AxiosInstance, Method } from "axios";

export class AxiosServices {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create();
  }

  configBaseUrl(baseUrl?: string) {
    if (baseUrl) {
      this.axiosInstance.defaults.baseURL = baseUrl;
    }
  }

  configCommonHeaders(headers: Record<string, string>) {
    this.axiosInstance.defaults.headers.common = headers;
  }

  async request<D, R>(
    endpoint: string,
    method: Method,
    data?: D,
    headers?: Record<string, string>
  ): Promise<R> {
    try {
      const response = await this.axiosInstance.request<R>({
        url: endpoint,
        method,
        data,
        headers: headers || {},
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {

        console.error("error:", error.response?.data);
        if (error.response?.data) throw error.response?.data
      }

      throw error
    }
  }
}
