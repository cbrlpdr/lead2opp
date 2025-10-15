import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

export const Loading = () => {
    return (
        <Card className="w-[520px]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--primary)]">
                    <Users className="h-5 w-5" />
                    Leads
                </CardTitle>
            </CardHeader>
            {/* List of leads */}
            <CardContent className="space-y-4">
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    <div className="w-full rounded-md border border-muted-300 p-4">
                        <div className="flex animate-pulse space-x-4">
                            <div className="flex-1 space-y-6 py-1">
                                <div className="h-2 rounded bg-gray-200"></div>
                                <Separator />
                                <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                                        <div className="col-span-1 h-2 rounded bg-gray-200"></div>
                                    </div>
                                    <div className="h-2 rounded bg-gray-200"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
}
