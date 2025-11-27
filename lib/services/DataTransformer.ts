import { ExternalAPIResponse, InternalDashboardData } from '@/types/external-api'

export class DataTransformer {
  static transformExternalToInternal(external: ExternalAPIResponse): InternalDashboardData {
    return {
      todayStats: this.transformTodayStats(external.metrics),
      monthlyStats: this.transformMonthlyStats(external.metrics),
      metrics: this.transformMetrics(external.metrics),
      last30Days: this.transformNetBalance(external.net_balance),
      last7DaysConsumption: this.transformConsumption(external.consumption),
      last7DaysProduction: this.transformProduction(external.production),
      energyBalance: this.transformEnergyBalance(external.energy_balance),
      quickActions: this.transformQuickActions(external.quick_actions),
    }
  }

  private static transformTodayStats(metrics: any) {
    return {
      netBalance: metrics.net_today.value,
      production: metrics.today_production.value,
      consumption: metrics.today_consumption.value,
      efficiency: metrics.efficiency.value,
    }
  }

  private static transformMonthlyStats(metrics: any) {
    return {
      cost: metrics.cost_this_month.value,
      revenue: metrics.revenue_this_month.value,
    }
  }

  private static transformMetrics(metrics: any) {
    return {
      netToday: {
        value: metrics.net_today.value,
        change: metrics.net_today.change,
        direction: metrics.net_today.change_direction,
      },
      costThisMonth: {
        value: metrics.cost_this_month.value,
        change: metrics.cost_this_month.change,
        direction: metrics.cost_this_month.change_direction,
      },
      revenueThisMonth: {
        value: metrics.revenue_this_month.value,
        change: metrics.revenue_this_month.change,
        direction: metrics.revenue_this_month.change_direction,
      },
      efficiency: {
        value: metrics.efficiency.value,
        change: metrics.efficiency.change,
        direction: metrics.efficiency.change_direction,
      },
      todayProduction: {
        value: metrics.today_production.value,
        change: metrics.today_production.change,
        direction: metrics.today_production.change_direction,
      },
      todayConsumption: {
        value: metrics.today_consumption.value,
        change: metrics.today_consumption.change,
        direction: metrics.today_consumption.change_direction,
      },
    }
  }

  private static transformNetBalance(netBalance: any) {
    return netBalance.data.map((day: any) => ({
      timestamp: day.date,
      importKwh: day.import,
      exportKwh: day.export,
      netKwh: day.net,
    }))
  }

  private static transformConsumption(consumption: any) {
    return consumption.data.map((day: any) => ({
      date: day.date,
      hourlyValues: day.values,
      average: day.average,
    }))
  }

  private static transformProduction(production: any) {
    return production.data.map((day: any) => ({
      date: day.date,
      hourlyValues: day.values,
      average: day.average,
    }))
  }

  private static transformEnergyBalance(energyBalance: any) {
    // If energy_balance is not provided, return default values
    if (!energyBalance) {
      return {
        produced: 0,
        consumed: 0,
        net: 0,
      }
    }
    
    return {
      produced: energyBalance.produced?.value || 0,
      consumed: energyBalance.consumed?.value || 0,
      net: energyBalance.net?.value || 0,
    }
  }

  private static transformQuickActions(actions: any[]) {
    // If quick_actions is not provided, return empty array
    if (!actions || !Array.isArray(actions)) {
      return []
    }
    
    return actions.map((action) => ({
      id: action.id,
      title: action.title,
      description: action.description,
      icon: action.icon,
      href: action.action,
    }))
  }
}
