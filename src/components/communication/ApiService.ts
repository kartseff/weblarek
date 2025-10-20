import { Api } from '../../components/base/Api'
import {IApi, IProductResponse, IOrderPayload, IOrderResponse} from '../../types'

export class ApiService {
    protected apiClient: IApi

    constructor(apiClient: IApi = new Api(import.meta.env.VITE_API_ORIGIN)) {
      this.apiClient = apiClient
    }

    async fetchProducts(): Promise<IProductResponse> {
      return this.apiClient.get<IProductResponse>('/api/weblarek/product')
    }

    async sendOrder(payload: IOrderPayload): Promise<IOrderResponse> {
      return this.apiClient.post<IOrderPayload, IOrderResponse>('/api/weblarek/order', payload)
    }
}