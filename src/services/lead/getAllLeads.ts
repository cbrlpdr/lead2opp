import type { Lead, LeadRepository } from "@/domain/lead";

export function getAllLeads(leadRepo: LeadRepository): Promise<Lead[]> {
    const leads = leadRepo.getAll();
    return leads;
}
