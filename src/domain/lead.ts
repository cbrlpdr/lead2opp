export interface Lead {
    id: string;
    name: string;
    company: string;
    email: string;
    source: string;
    score: number;
    status: string;
}

export interface LeadRepository {
  getAll(): Promise<Lead[]>;
  update(lead: Lead): Promise<void>;
}
