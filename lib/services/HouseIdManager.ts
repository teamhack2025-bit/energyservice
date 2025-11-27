export class HouseIdManager {
  private static availableHouseIds = ['H001', 'H002', 'H003', 'H004', 'H005', 'H006']
  private static currentIndex = 0

  static async getHouseIdForUser(userId: string): Promise<string> {
    // For now, use a simple hash-based assignment
    // In production, this should query the database
    if (!userId) {
      return this.getNextAvailableHouseId()
    }
    
    // Simple hash to consistently assign same house ID to same user
    const hash = this.simpleHash(userId)
    const index = hash % this.availableHouseIds.length
    return this.availableHouseIds[index]
  }

  static async assignHouseId(userId: string): Promise<string> {
    // In production, this should store in database
    return this.getHouseIdForUser(userId)
  }

  private static getNextAvailableHouseId(): string {
    const houseId = this.availableHouseIds[this.currentIndex]
    this.currentIndex = (this.currentIndex + 1) % this.availableHouseIds.length
    return houseId
  }

  private static simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }

  static async updateHouseIdMapping(userId: string, houseId: string): Promise<void> {
    // In production, this should update the database
    console.log(`Mapping user ${userId} to house ${houseId}`)
  }
}
