import { simulateLatency } from "@/lib/utils";
import leadList from "./data/leads.json";

import type { Lead, LeadRepository } from "@/domain/lead";

export class LeadRepositoryJSON implements LeadRepository {
    private leads: Lead[] = [...leadList]; // Defining the leads based on the imported JSON file


    async getAll(): Promise<Lead[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.leads);
            }, simulateLatency()); // Simulating latency
        });
    }

    async update(updatedLead: Lead): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = this.leads.findIndex((l) => l.id === updatedLead.id);
                if (index !== -1) {
                    this.leads[index] = updatedLead;
                    resolve();
                    //Here I would work on a data persistance to update the data source

                } else {
                    throw new Error("Lead not found");
                }
            }, simulateLatency()); // Simulating latency
        });

    }
}
