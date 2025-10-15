export interface Opportunity {
    id: string
    name: string
    amount?: number
    accountName: string
    stage: string
    createdAt: Date
}

export interface OpportunityRepository {
  getAll(): Promise<Opportunity[]>;
}
