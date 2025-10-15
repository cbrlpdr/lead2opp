import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownUp, ArrowUpDown, Building, DollarSign, Filter, Loader2, Mail, Save, Search, Star, Users } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Separator } from "@/components/ui/separator"
import { useLeads } from "../../hooks/useLeads";
import type { SortOrder } from "@/domain/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Lead } from "@/domain/lead";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { Label } from "../ui/label";
import { RadioGroup } from "radix-ui";
import { Button } from "../ui/button";
import { LeadRepositoryJSON } from "@/repositories/leadRepositoryJSON";
import { editLead } from "@/services/lead/editLead";
import type { Opportunity } from "@/domain/opportunity";
import { getStatusColor, validateEmail } from "@/lib/utils";
import { Loading } from "../Loading/index";
import { Toast } from "../Toast";
import { v4 } from "uuid";

// Props for LeadListPanel
interface LeadListProps {
    setOpportunityList: React.Dispatch<React.SetStateAction<Opportunity[] | null>>
}

export default function LeadListPanel({ setOpportunityList }: LeadListProps) {
    // ------------------ FILTER & SORT STATES
    const [searchTerm, setSearchTerm] = useState(""); // search input
    const [sortOrder, setSortOrder] = useState<SortOrder>(() => {
        const saved = localStorage.getItem("SORT_ORDER");
        return saved === "asc" || saved === "desc" ? saved : "desc";
    });
    const [statusFilter, setStatusFilter] = useState<string | null>(() => {
        const saved = localStorage.getItem("STATUS_FILTER");
        return saved && saved !== "" ? saved : null;
    });

    // ------------------ SELECT & EDIT STATES
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [editableLead, setEditableLead] = useState<Lead | null>(null);
    const [isBeingConverted, setIsBeingConverted] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [leadList, setLeadList] = useState<Lead[] | null>(null);

    // ------------------ OPPORTUNITY STATES
    const [amount, setAmount] = useState(0);
    const [stage, setStage] = useState("Proposal");

    // ------------------ TOAST STATES
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error">("success");

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToastMessage(message);
        setToastType(type);
    };

    // Fetch leads from hook
    const { leads, loading, error } = useLeads();

    // Initialize lead list from fetched leads
    useEffect(() => {
        if (leads.length > 0 && !leadList) {
            setLeadList(leads);
        }
    }, [leads, leadList]);

    // ------------------ EVENT HANDLERS

    // Save lead edits
    const handleSave = async () => {
        setIsSaving(true);
        if (editableLead) {
            try {
                const leadRepository = new LeadRepositoryJSON();
                await editLead(leadRepository, editableLead);

                // Update lead list in UI
                setLeadList((prev) => prev?.map(l => l.id === editableLead.id ? editableLead : l) ?? [editableLead]);

                setSelectedLead(null);
                showToast("Lead successfully edited", "success");
            } catch (err) {
                console.error(err);
                showToast("Error", "error");
            }
        }
        setIsSaving(false);
    }

    // Convert lead to opportunity
    const handleConvert = async () => {
        if (editableLead) {
            const newOpportunity: Opportunity = {
                id: v4(),
                accountName: editableLead.company,
                name: editableLead.name,
                amount: amount,
                createdAt: new Date(),
                stage: stage
            };
            setOpportunityList(prev => [...(prev ?? []), newOpportunity]);

            // Remove lead from list
            setLeadList(prev => prev?.filter(l => l.id !== editableLead.id) ?? []);

            showToast("Opportunity created!", "success");

            // Reset states
            setSelectedLead(null);
            setEditableLead(null);
            setIsBeingConverted(false);
            setAmount(0);
            setStage("Proposal");
        }
    }

    // Handle email input change
    const handleChangeEmailInput = (editedEmail: string) => {
        if (!editableLead) return;
        setEditableLead({ ...editableLead, email: editedEmail });
        setIsEmailValid(validateEmail(editedEmail));
    }

    // ------------------ FILTER & SORT LOGIC
    const filteredAndSortedLeads = useMemo(() => {
        const source = leadList ?? leads;
        if (!source) return [];

        const filtered = source.filter(lead =>
            lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.company.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const statusFiltered = statusFilter
            ? filtered.filter(lead => lead.status === statusFilter)
            : filtered;

        return statusFiltered.sort((a, b) => sortOrder === "asc" ? a.score - b.score : b.score - a.score);
    }, [leads, leadList, searchTerm, statusFilter, sortOrder]);

    // Update editable lead when selected
    useEffect(() => {
        setIsEmailValid(true);
        if (selectedLead) setEditableLead({ ...selectedLead });
    }, [selectedLead]);

    // Persist filter & sort in localStorage
    useEffect(() => {
        localStorage.setItem("SORT_ORDER", sortOrder);
        localStorage.setItem("STATUS_FILTER", statusFilter ?? "");
    }, [sortOrder, statusFilter]);

    // ------------------ RENDER STATES
    if (loading) return <Loading />;
    if (error) return <div>Error</div>;
    if (leads.length === 0) return <div>No Leads found</div>;

    return <>
        {/* Toast notifications */}
        {toastMessage && (
            <Toast
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage(null)}
            />
        )}

        {/* Main leads card */}
        <Card className="w-[520px]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--primary)]">
                    <Users className="h-5 w-5" /> Leads
                </CardTitle>
            </CardHeader>

            {/* Search and filters */}
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search for name or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Status select & sort */}
                <div className="flex items-center text-xs text-muted-foreground">
                    <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <Filter className="h-3 w-3 mr-2" />
                            <SelectValue placeholder="Status" className="text-xs" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem className="text-xs" value="all">All Status</SelectItem>
                            <SelectItem className="text-xs" value="new">New</SelectItem>
                            <SelectItem className="text-xs" value="contacted">Contacted</SelectItem>
                            <SelectItem className="text-xs" value="qualified">Qualified</SelectItem>
                        </SelectContent>
                    </Select>

                    {sortOrder === "asc"
                        ? <ArrowUpDown className="h-4 w-4 ml-4 cursor-pointer" onClick={() => setSortOrder("desc")} />
                        : <ArrowDownUp className="h-4 w-4 ml-4 cursor-pointer" onClick={() => setSortOrder("asc")} />
                    }
                </div>
            </CardContent>

            {/* List of leads */}
            <CardContent className="space-y-4">
                {filteredAndSortedLeads?.length === 0
                    ? <h2 className="text-primary">No leads found</h2>
                    : filteredAndSortedLeads?.map((lead) => (
                        <div key={lead.id} className="space-y-2 max-h-96 overflow-y-auto" onClick={() => setSelectedLead(lead)}>
                            <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">

                                {/* Lead header: name & score */}
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium">{lead.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <Star className="h-3 w-3 fill-purple-800 text-purple-800 mt-[2px]" />
                                            <span className="text-sm font-medium">{lead.score}</span>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Lead details: company & email */}
                                <div className="flex flex-col text-xs text-muted-foreground mt-4 gap-2">
                                    <div className="flex items-center gap-1">
                                        <Building className="h-4 w-4" /> {lead.company}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Mail className="h-4 w-4" /> {lead.email}
                                    </div>
                                </div>

                                {/* Lead source & status */}
                                <div className="text-xs text-muted-foreground mt-4">
                                    <div className="flex justify-between items-center">
                                        Source: {lead.source}
                                        <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))
                }
            </CardContent>
        </Card>

        {/* Lead details sheet */}
        <Sheet open={!!selectedLead} onOpenChange={() => { setSelectedLead(null); setIsBeingConverted(false); }}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{selectedLead?.name}</SheetTitle>
                    <Separator className="mt-2" />
                    <SheetDescription className="pt-2">
                        {/* Company */}
                        <div className="flex flex-col gap-2">
                            <Label className="pl-1 text-primary">Company</Label>
                            <Label className="pl-1">{selectedLead?.company}</Label>
                        </div>

                        {/* Edit or convert form */}
                        {!isBeingConverted ? (
                            <>
                                {/* Email */}
                                <div className="flex flex-col gap-2 pt-4">
                                    <Label className="pl-1 text-primary">E-mail</Label>
                                    <Input className="text-black" value={editableLead?.email} onChange={(e) => handleChangeEmailInput(e.target.value)} />
                                    {!isEmailValid && <span className="text-red-500">Email invalid</span>}
                                </div>

                                {/* Status */}
                                <div className="flex flex-col gap-2 pt-4">
                                    <Label className="pl-1 text-primary">Status</Label>
                                    <RadioGroup.Root className="max-w-md w-full grid grid-cols-3 gap-3 text-xs" value={editableLead?.status ?? ""} onValueChange={(val) => setEditableLead({ ...editableLead!, status: val })}>
                                        <RadioGroup.Item value="new" className="ring-[1px] ring-border rounded py-1 px-3 data-[state=checked]:ring-2 data-[state=checked]:ring-purple-800">New</RadioGroup.Item>
                                        <RadioGroup.Item value="contacted" className="ring-[1px] ring-border rounded py-1 px-3 data-[state=checked]:ring-2 data-[state=checked]:ring-purple-800">Contacted</RadioGroup.Item>
                                        <RadioGroup.Item value="qualified" className="ring-[1px] ring-border rounded py-1 px-3 data-[state=checked]:ring-2 data-[state=checked]:ring-purple-800">Qualified</RadioGroup.Item>
                                    </RadioGroup.Root>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Convert: Amount */}
                                <Label className="pl-1 text-primary pt-4 mb-2">Amount (optional)</Label>
                                <div className="flex flex-row">
                                    <DollarSign className="h-4 mt-2" />
                                    <Input type="number" value={amount} onChange={(e) => {
                                        setAmount(Number(e.target.value))}} />
                                </div>

                                {/* Convert: Stage */}
                                <div className="flex flex-col gap-2 pt-4">
                                    <RadioGroup.Root className="max-w-md w-9/10 mx-auto grid grid-cols-3 gap-3 text-xs" value={stage} onValueChange={(selectedStage) => setStage(selectedStage)}>
                                        <RadioGroup.Item value="Proposal" className="ring-[1px] ring-border rounded py-1 px-3 data-[state=checked]:ring-2 data-[state=checked]:ring-purple-800">Proposal</RadioGroup.Item>
                                        <RadioGroup.Item value="Negotiation" className="ring-[1px] ring-border rounded py-1 px-3 data-[state=checked]:ring-2 data-[state=checked]:ring-purple-800">Negotiation</RadioGroup.Item>
                                        <RadioGroup.Item value="Closed Won" className="ring-[1px] ring-border rounded py-1 px-3 data-[state=checked]:ring-2 data-[state=checked]:ring-purple-800">Closed Won</RadioGroup.Item>
                                    </RadioGroup.Root>
                                </div>
                            </>
                        )}

                        {/* Action buttons */}
                        <div className="flex flex-col gap-2 mt-5">
                            {!isBeingConverted ? (
                                <>
                                    <Button variant="outline" className="items-center gap-2 rounded-full bg-purple-600 text-primary" disabled={!isEmailValid || isSaving} onClick={handleSave}>
                                        {isSaving ? <><Loader2 className="animate-spin h-5 w-5" /> Saving</> : <><Save /> Save</>}
                                    </Button>
                                    <Button onClick={() => setIsBeingConverted(true)} variant="outline" disabled={isSaving} className="items-center gap-2 rounded-full bg-purple-600 text-primary"><Star /> Convert</Button>
                                </>
                            ) : (
                                <Button onClick={handleConvert} variant="default" className="items-center gap-2 rounded-full bg-purple-600 text-primary"><Star className="fill-purple-900" /> Convert</Button>
                            )}
                        </div>

                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    </>
}
