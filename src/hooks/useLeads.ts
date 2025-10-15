import type { Lead } from "@/domain/lead";
import { LeadRepositoryJSON } from "../repositories/leadRepositoryJSON";
import { useEffect, useState } from "react";

export const useLeads = () => {
    const [leads,setLeads] = useState<Lead[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);

    useEffect(() => {
        const leadRepository = new LeadRepositoryJSON();

        const fetchLeads = async () => {
            setLoading(true);
            try {
                const data = await leadRepository.getAll();
                setLeads(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }

        fetchLeads();

    }, []);
    return {leads, loading, error}
}
