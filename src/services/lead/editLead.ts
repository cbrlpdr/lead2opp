import type { Lead, LeadRepository } from "@/domain/lead";

export async function editLead(leadRepo: LeadRepository, lead: Lead) {
    await leadRepo.update(lead);
}
