import { BadgeDollarSign, Building, Frown, UserStar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Opportunity } from "@/domain/opportunity";
import { Separator } from "../ui/separator";
import { formatCurrency, getStageColor } from "@/lib/utils";
import { Badge } from "../ui/badge";

// Props interface for the OpportunityListPanel component
interface OpportunityListProps {
  opportunityList: Opportunity[],
}

// Main component to render a list of opportunities
export default function OpportunityListPanel({ opportunityList }: OpportunityListProps) {
  return (
    <Card className="w-[520px]">
      {/* Card header with title and icon */}
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--primary)]">
          <UserStar className="h-5 w-5" /> Opportunities
        </CardTitle>
      </CardHeader>

      {/* Card content: list of opportunities or empty state */}
      <CardContent className="space-y-4">
        {/* Show message if no opportunities exist */}
        {opportunityList.length === 0 && (
          <div className="text-primary flex flex-col gap-2 items-center">
            No opportunities yet
            <Frown />
          </div>
        )}

        {/* Map through opportunities and render each one */}
        {opportunityList.map((opportunity) => (
          <div key={opportunity.id} className="space-y-2 max-h-96 overflow-y-auto">
            <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">

              {/* Opportunity name and stage */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{opportunity.name}</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Badge className={getStageColor(opportunity.stage)}>
                      {opportunity.stage}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Separator line */}
              <Separator />

              {/* Opportunity details: account name and amount */}
              <div className="flex flex-col text-xs text-muted-foreground mt-4 gap-2">
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" /> {opportunity.accountName}
                </div>

                {/* Conditionally render amount if it exists */}
                {(!opportunity.amount || opportunity.amount === 0) || (
                  <div className="flex items-center gap-1">
                    <BadgeDollarSign className="h-4 w-4" /> {formatCurrency(opportunity.amount)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
