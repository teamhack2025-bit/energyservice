import { ExternalAPIResponse } from '@/types/external-api'

export class ExternalEnergyService {
  private baseUrl: string
  private maxRetries = 2
  private retryDelay = 1000
  private timeout = 5000

  constructor() {
    this.baseUrl = process.env.EXTERNAL_ENERGY_API_URL || 'https://energyserviceapi.vercel.app'
  }

  async getDashboardData(houseId: string): Promise<ExternalAPIResponse> {
    const url = `${this.baseUrl}/api/dashboard/overview/${houseId}`
    
    try {
      const response = await this.fetchWithRetry(url, this.maxRetries)
      const data = await response.json()
      
      console.log('External API response received:', {
        houseId,
        hasMetrics: !!data.metrics,
        hasConsumption: !!data.consumption,
        hasProduction: !!data.production,
        hasNetBalance: !!data.net_balance,
        hasEnergyBalance: !!data.energy_balance,
      })
      
      if (!this.validateResponse(data)) {
        console.error('Validation failed for response:', JSON.stringify(data).substring(0, 200))
        throw new Error('Invalid response structure from external API')
      }
      
      return data
    } catch (error) {
      console.error('External API error:', {
        houseId,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
      throw error
    }
  }

  private async fetchWithRetry(url: string, retriesLeft: number): Promise<Response> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return response
    } catch (error) {
      if (retriesLeft > 0) {
        console.log(`Retrying... (${retriesLeft} attempts left)`)
        await this.delay(this.retryDelay * (this.maxRetries - retriesLeft + 1))
        return this.fetchWithRetry(url, retriesLeft - 1)
      }
      throw error
    }
  }

  private validateResponse(data: any): boolean {
    // energy_balance is optional - we can calculate it from other data
    const isValid = !!(
      data &&
      data.metrics &&
      data.metrics.net_today &&
      data.metrics.cost_this_month &&
      data.metrics.revenue_this_month &&
      data.metrics.efficiency &&
      data.metrics.today_production &&
      data.metrics.today_consumption &&
      data.consumption &&
      data.consumption.data &&
      data.production &&
      data.production.data &&
      data.net_balance &&
      data.net_balance.data
    )
    
    if (!isValid) {
      console.error('Validation details:', {
        hasData: !!data,
        hasMetrics: !!data?.metrics,
        hasNetToday: !!data?.metrics?.net_today,
        hasCostThisMonth: !!data?.metrics?.cost_this_month,
        hasRevenueThisMonth: !!data?.metrics?.revenue_this_month,
        hasEfficiency: !!data?.metrics?.efficiency,
        hasTodayProduction: !!data?.metrics?.today_production,
        hasTodayConsumption: !!data?.metrics?.today_consumption,
        hasConsumption: !!data?.consumption,
        hasConsumptionData: !!data?.consumption?.data,
        hasProduction: !!data?.production,
        hasProductionData: !!data?.production?.data,
        hasNetBalance: !!data?.net_balance,
        hasNetBalanceData: !!data?.net_balance?.data,
      })
    }
    
    return isValid
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
