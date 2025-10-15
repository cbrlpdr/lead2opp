import type { Opportunity } from "@/domain/opportunity";
import LeadListPanel from "../LeadListPanel";
import OpportunityListPanel from "../OpportunityListPanel";
import { useState } from "react";

export default function MainContainer() {
    const [opportunityList, setOpportunityList] = useState<Opportunity[] | null>([]);

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 p-4 lg:grid mt-10 items-start">
            <LeadListPanel setOpportunityList={setOpportunityList} />
            <OpportunityListPanel opportunityList={opportunityList || []}/>

        </div>
    );
}
