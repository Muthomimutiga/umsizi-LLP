import React, { FC, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpenCheck, Loader2, AlertTriangle, ChevronLeft, Building, Users, Calendar, UploadCloud,
    FileText as FileTextIcon, Check, X, Pencil, BrainCircuit, Download, Eye
} from 'lucide-react';
import { Button, Input, Label, FormField, Select, SelectTrigger, SelectContentWrapper, SelectItem, Textarea, Card, CardHeader, CardTitle, CardDescription, CardContent } from './components';
import { ManagerProps, Company, BoardMember, Meeting, AgendaItem } from './types';

// --- MOCK DATA & API SIMULATION ---
const MOCK_COMPANIES: Company[] = [
    { id: 'comp_1', name: 'SILAFRICA TANZANIA LIMITED' },
    { id: 'comp_2', name: 'Umsizi Holdings' },
    { id: 'comp_3', name: 'Innovate Kenya PLC' },
];
const MOCK_BOARD_MEMBERS: BoardMember[] = [
    { id: 'bm_1', name: 'Amina Mohamed', companyId: ['comp_1', 'comp_2'] },
    { id: 'bm_2', name: 'Johnstone Kipchoge', companyId: ['comp_1'] },
    { id: 'bm_3', name: 'Beatrice Wanjiru', companyId: ['comp_1', 'comp_3'] },
    { id: 'bm_4', name: 'David Chen', companyId: ['comp_2'] },
    { id: 'bm_5', name: 'Fatima Al-Sayed', companyId: ['comp_3'] },
];
let MOCK_MEETINGS: Meeting[] = [
    { id: 'meet_1', companyId: 'comp_1', title: 'Q2 Board Meeting', date: '2024-06-26', attendees: ['Amina Mohamed', 'Johnstone Kipchoge', 'Beatrice Wanjiru'], agendaParsed: false, status: 'Scheduled' },
];
let MOCK_AGENDA_ITEMS: AgendaItem[] = [];

// API simulation
const api = {
    getCompanies: async (): Promise<Company[]> => {
        await new Promise(res => setTimeout(res, 500));
        return MOCK_COMPANIES;
    },
    getMeetings: async (companyId: string): Promise<Meeting[]> => {
        await new Promise(res => setTimeout(res, 700));
        return MOCK_MEETINGS.filter(m => m.companyId === companyId);
    },
    getBoardMembers: async (companyId: string): Promise<BoardMember[]> => {
        await new Promise(res => setTimeout(res, 400));
        return MOCK_BOARD_MEMBERS.filter(bm => bm.companyId.includes(companyId));
    },
    createMeeting: async (meetingData: Omit<Meeting, 'id' | 'agendaParsed' | 'status'>): Promise<Meeting> => {
        await new Promise(res => setTimeout(res, 1000));
        const newMeeting: Meeting = {
            ...meetingData,
            id: `meet_${Date.now()}`,
            agendaParsed: false,
            status: 'Scheduled',
        };
        MOCK_MEETINGS.push(newMeeting);
        return newMeeting;
    },
    getAgendaItems: async (meetingId: string): Promise<AgendaItem[]> => {
        await new Promise(res => setTimeout(res, 600));
        return MOCK_AGENDA_ITEMS.filter(item => item.meetingId === meetingId);
    },
    // --- AI WORKFLOW TRIGGERS (SIMULATED) ---
    parseNoticeWebhook: async (meetingId: string, fileUrl: string): Promise<void> => {
        console.log(`[AI SIM] Parsing notice for meeting ${meetingId} from ${fileUrl}`);
        await new Promise(res => setTimeout(res, 4000)); // Simulate AI processing
        const newItems: AgendaItem[] = [
            { id: `ag_${Date.now()}_1`, meetingId, itemNumber: '1.0', title: 'Opening Remarks', sourceFileUrls: [], aiStatus: 'Idle', draftContent: '' },
            { id: `ag_${Date.now()}_2`, meetingId, itemNumber: '2.0', title: 'Approval of Previous Minutes', sourceFileUrls: [], aiStatus: 'Idle', draftContent: '' },
            { id: `ag_${Date.now()}_3`, meetingId, itemNumber: '3.0', title: 'Review of Q2 Financials', sourceFileUrls: [], aiStatus: 'Idle', draftContent: '' },
            { id: `ag_${Date.now()}_4`, meetingId, itemNumber: '4.0', title: 'CAPEX Proposal for New Factory', sourceFileUrls: [], aiStatus: 'Idle', draftContent: '' },
            { id: `ag_${Date.now()}_5`, meetingId, itemNumber: '5.0', title: 'A.O.B.', sourceFileUrls: [], aiStatus: 'Idle', draftContent: '' },
        ];
        MOCK_AGENDA_ITEMS.push(...newItems);
        const meetingIndex = MOCK_MEETINGS.findIndex(m => m.id === meetingId);
        if (meetingIndex > -1) MOCK_MEETINGS[meetingIndex].agendaParsed = true;
    },
    processBoardPackWebhook: async (agendaItemId: string, fileUrls: { name: string, url: string }[]): Promise<void> => {
        console.log(`[AI SIM] Processing board pack for agenda item ${agendaItemId}`, fileUrls);
        const itemIndex = MOCK_AGENDA_ITEMS.findIndex(item => item.id === agendaItemId);
        if (itemIndex > -1) {
            MOCK_AGENDA_ITEMS[itemIndex].aiStatus = 'Processing';
            MOCK_AGENDA_ITEMS[itemIndex].sourceFileUrls = fileUrls;
        }
        await new Promise(res => setTimeout(res, 6000)); // Simulate AI drafting
        if (itemIndex > -1) {
            MOCK_AGENDA_ITEMS[itemIndex].aiStatus = 'Draft Ready';
            MOCK_AGENDA_ITEMS[itemIndex].draftContent = `This is the AI-generated draft summary for "${MOCK_AGENDA_ITEMS[itemIndex].title}". It has been synthesized from the provided documents: ${fileUrls.map(f => f.name).join(', ')}. Key financial figures extracted show a positive trend. The main proposal involves a significant capital expenditure which requires board approval.`;
        }
    },
    approveDraft: async (agendaItemId: string, updatedContent: string): Promise<void> => {
        await new Promise(res => setTimeout(res, 500));
        const itemIndex = MOCK_AGENDA_ITEMS.findIndex(item => item.id === agendaItemId);
        if (itemIndex > -1) {
            MOCK_AGENDA_ITEMS[itemIndex].aiStatus = 'Approved';
            MOCK_AGENDA_ITEMS[itemIndex].draftContent = updatedContent;
        }
    },
    generateFinalMinutesWebhook: async (meetingId: string): Promise<void> => {
        console.log(`[AI SIM] Generating final minutes for meeting ${meetingId}`);
        const meetingIndex = MOCK_MEETINGS.findIndex(m => m.id === meetingId);
        if (meetingIndex > -1) MOCK_MEETINGS[meetingIndex].status = 'Generating';
        await new Promise(res => setTimeout(res, 5000)); // Simulate final assembly
        if (meetingIndex > -1) {
            MOCK_MEETINGS[meetingIndex].status = 'Completed';
            MOCK_MEETINGS[meetingIndex].finalMinutesUrl = 'data:application/msword;base64,UEsDBBQAAgAIAAAAAAAAAAAAAAAACwAAAAxvYmplY3QxLnhtbE7NAAEA';
        }
    }
};

// --- Main Manager Component ---
const MinutesManager: FC<ManagerProps> = ({ onGoHome, onSetPageConfig }) => {
    // Component State
    const [view, setView] = useState<'dashboard' | 'meetingDetails' | 'review'>('dashboard');
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
    const [selectedAgendaItem, setSelectedAgendaItem] = useState<AgendaItem | null>(null);
    const [isLoading, setIsLoading] = useState({ companies: true, meetings: false });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [polling, setPolling] = useState({ agenda: false, finalMinutes: false, items: false });
    const [agendaItemStatus, setAgendaItemStatus] = useState<Record<string, AgendaItem['aiStatus']>>({});

    // Fetch initial companies
    useEffect(() => {
        api.getCompanies().then(data => {
            setCompanies(data);
            setIsLoading(prev => ({ ...prev, companies: false }));
        });
    }, []);

    // Update page header based on context
    useEffect(() => {
        if (view === 'review' && selectedAgendaItem) {
            onSetPageConfig({ title: `Review: ${selectedAgendaItem.itemNumber}`, icon: <Eye />, desc: `Reviewing draft for "${selectedAgendaItem.title}"`});
        } else if (view === 'meetingDetails' && selectedMeeting) {
            onSetPageConfig({ title: selectedMeeting.title, icon: <Calendar />, desc: `Agenda for ${new Date(selectedMeeting.date.replace(/-/g, '/')).toDateString()}`});
        } else {
            onSetPageConfig({ title: "Minutes Dashboard", icon: <BookOpenCheck />, desc: selectedCompany ? `Viewing meetings for ${selectedCompany.name}` : "Select a company to begin." });
        }
    }, [view, selectedCompany, selectedMeeting, selectedAgendaItem, onSetPageConfig]);

    // Fetch meetings when a company is selected
    const handleCompanySelect = useCallback((companyId: string) => {
        const company = companies.find(c => c.id === companyId);
        if (company) {
            setSelectedCompany(company);
            setIsLoading(prev => ({ ...prev, meetings: true }));
            setMeetings([]);
            api.getMeetings(companyId).then(data => {
                setMeetings(data);
                setIsLoading(prev => ({ ...prev, meetings: false }));
            });
        }
    }, [companies]);

    // Select a meeting and fetch its agenda
    const handleMeetingSelect = useCallback((meeting: Meeting) => {
        setSelectedMeeting(meeting);
        setView('meetingDetails');
        setAgendaItems([]);
        api.getAgendaItems(meeting.id).then(items => {
            setAgendaItems(items);
            const initialStatus = items.reduce((acc, item) => ({...acc, [item.id]: item.aiStatus}), {});
            setAgendaItemStatus(initialStatus);
            if (items.some(item => item.aiStatus === 'Processing')) {
                setPolling(prev => ({...prev, items: true}));
            }
        });
        if (!meeting.agendaParsed) setPolling(prev => ({...prev, agenda: true}));
        if (meeting.status === 'Generating') setPolling(prev => ({...prev, finalMinutes: true}));
    }, []);

    // Polling effects
    const usePolling = (callback: () => void, isPolling: boolean, interval: number) => {
        useEffect(() => {
            if (isPolling) {
                const poller = setInterval(callback, interval);
                return () => clearInterval(poller);
            }
        }, [isPolling, callback, interval]);
    };

    usePolling(useCallback(async () => {
        if (!selectedMeeting) return;
        const freshItems = await api.getAgendaItems(selectedMeeting.id);
        if (freshItems.length > agendaItems.length) {
            setAgendaItems(freshItems);
            setPolling(prev => ({...prev, agenda: false}));
            setSelectedMeeting(prev => prev ? {...prev, agendaParsed: true} : null);
        }
    }, [selectedMeeting, agendaItems.length]), polling.agenda, 3000);
    
    usePolling(useCallback(async () => {
        if (!selectedMeeting) return;
        const freshItems = await api.getAgendaItems(selectedMeeting.id);
        const newStatuses: Record<string, AgendaItem['aiStatus']> = {};
        let changed = false;
        freshItems.forEach(item => {
            newStatuses[item.id] = item.aiStatus;
            if (agendaItemStatus[item.id] !== item.aiStatus) changed = true;
        });
        if (changed) {
            setAgendaItemStatus(newStatuses);
            setAgendaItems(freshItems);
        }
        if (!freshItems.some(i => i.aiStatus === 'Processing')) {
            setPolling(prev => ({...prev, items: false}));
        }
    }, [selectedMeeting, agendaItemStatus]), polling.items, 4000);

    usePolling(useCallback(async () => {
        if (!selectedMeeting) return;
        const freshMeetings = await api.getMeetings(selectedMeeting.companyId);
        const updatedMeeting = freshMeetings.find(m => m.id === selectedMeeting.id);
        if (updatedMeeting && updatedMeeting.status === 'Completed') {
            setSelectedMeeting(updatedMeeting);
            setMeetings(prev => prev.map(m => m.id === updatedMeeting.id ? updatedMeeting : m));
            setPolling(prev => ({...prev, finalMinutes: false}));
        }
    }, [selectedMeeting]), polling.finalMinutes, 5000);

    const handleBack = () => {
        if (view === 'review') setView('meetingDetails');
        else if (view === 'meetingDetails') setView('dashboard');
        else onGoHome();
    };

    // --- RENDER LOGIC ---
    const renderView = () => {
        switch (view) {
            case 'meetingDetails':
                return <MeetingDetailsPage
                          meeting={selectedMeeting!}
                          agendaItems={agendaItems}
                          onBack={handleBack}
                          onReview={(item) => { setSelectedAgendaItem(item); setView('review'); }}
                          setPolling={setPolling}
                          setSelectedMeeting={setSelectedMeeting}
                          agendaItemStatus={agendaItemStatus}
                        />;
            case 'review':
                return <ReviewScreen
                          item={selectedAgendaItem!}
                          onBack={handleBack}
                          onApprove={(updatedContent) => {
                              api.approveDraft(selectedAgendaItem!.id, updatedContent).then(() => {
                                  setAgendaItems(prev => prev.map(i => i.id === selectedAgendaItem!.id ? {...i, aiStatus: 'Approved', draftContent: updatedContent} : i));
                                  setAgendaItemStatus(prev => ({...prev, [selectedAgendaItem!.id]: 'Approved'}));
                                  setView('meetingDetails');
                              });
                          }}
                        />;
            case 'dashboard':
            default:
                return <Dashboard
                          meetings={meetings}
                          isLoading={isLoading.meetings}
                          onSelectMeeting={handleMeetingSelect}
                          onScheduleNew={() => selectedCompany && setIsModalOpen(true)}
                          companySelected={!!selectedCompany}
                        />;
        }
    };

    return (
        <div className="w-full space-y-4">
            {isModalOpen && selectedCompany &&
                <NewMeetingModal
                    company={selectedCompany}
                    onClose={() => setIsModalOpen(false)}
                    onMeetingCreated={(newMeeting) => {
                        setMeetings(prev => [...prev, newMeeting]);
                        setIsModalOpen(false);
                    }}
                />
            }
            <CompanySelector
                companies={companies}
                selectedCompanyId={selectedCompany?.id || ''}
                onSelect={handleCompanySelect}
                isLoading={isLoading.companies}
                disabled={view !== 'dashboard'}
            />
            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {selectedCompany ? renderView() : !isLoading.companies && 
                        <Card className="text-center p-8 text-gray-500"><p>Please select a company to view its meetings.</p></Card>
                    }
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// --- SUB-COMPONENTS ---
const CompanySelector: FC<{companies: Company[], selectedCompanyId: string, onSelect: (id: string) => void, isLoading: boolean, disabled: boolean}> = ({ companies, selectedCompanyId, onSelect, isLoading, disabled }) => (
    <Card className="shadow-md">
        <CardContent className="p-4">
            <Label htmlFor="company-selector">Company</Label>
            <Select onValueChange={onSelect} value={selectedCompanyId} disabled={isLoading || disabled}>
                <SelectTrigger id="company-selector" placeholder={isLoading ? "Loading companies..." : "Select a company..."}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                </SelectTrigger>
                <SelectContentWrapper>
                    {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContentWrapper>
            </Select>
        </CardContent>
    </Card>
);

const Dashboard: FC<{meetings: Meeting[], isLoading: boolean, onSelectMeeting: (m: Meeting) => void, onScheduleNew: () => void, companySelected: boolean}> = ({ meetings, isLoading, onSelectMeeting, onScheduleNew, companySelected }) => (
    <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Meetings</CardTitle>
                <Button onClick={onScheduleNew} disabled={!companySelected}>Schedule New Meeting</Button>
            </div>
        </CardHeader>
        <CardContent>
            {isLoading && <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-gray-400"/></div>}
            {!isLoading && meetings.length === 0 && <p className="text-gray-500 text-center py-8">No meetings scheduled for this company.</p>}
            {!isLoading && meetings.length > 0 && (
                <div className="space-y-3">
                    {meetings.map(m => (
                        <div key={m.id} onClick={() => onSelectMeeting(m)} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-gray-800">{m.title}</p>
                                    <p className="text-sm text-gray-500">{new Date(m.date.replace(/-/g, '/')).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">{m.status}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </CardContent>
    </Card>
);

const MeetingDetailsPage: FC<{
    meeting: Meeting,
    agendaItems: AgendaItem[],
    onBack: () => void,
    onReview: (item: AgendaItem) => void,
    setPolling: React.Dispatch<React.SetStateAction<{agenda: boolean, finalMinutes: boolean, items: boolean}>>,
    setSelectedMeeting: React.Dispatch<React.SetStateAction<Meeting | null>>,
    agendaItemStatus: Record<string, AgendaItem['aiStatus']>
}> = ({ meeting, agendaItems, onBack, onReview, setPolling, setSelectedMeeting, agendaItemStatus }) => {
    const noticeUploadRef = useRef<HTMLInputElement>(null);
    const [isParsing, setIsParsing] = useState(false);

    const handleNoticeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsParsing(true);
            const fileUrl = `simulated-cloud-storage/${file.name}`;
            api.parseNoticeWebhook(meeting.id, fileUrl).then(() => {
                setPolling(prev => ({...prev, agenda: true}));
                setIsParsing(false);
            });
        }
    };
    
    const allApproved = agendaItems.length > 0 && agendaItems.every(i => agendaItemStatus[i.id] === 'Approved');
    
    const handleGenerateMinutes = () => {
        api.generateFinalMinutesWebhook(meeting.id).then(() => {
            setSelectedMeeting(prev => prev ? {...prev, status: 'Generating'} : null);
            setPolling(prev => ({...prev, finalMinutes: true}));
        });
    };

    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                {!meeting.agendaParsed && !isParsing && (
                    <div className="text-center p-6 border-2 border-dashed rounded-lg">
                        <input type="file" ref={noticeUploadRef} onChange={handleNoticeUpload} className="hidden" accept=".pdf,.doc,.docx" />
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Upload Notice & Agenda</h3>
                        <p className="mt-1 text-sm text-gray-500">The AI will parse the agenda from the document.</p>
                        <Button className="mt-4" onClick={() => noticeUploadRef.current?.click()}>Upload File</Button>
                    </div>
                )}
                 {isParsing && <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-gray-400"/> <p className="ml-2">AI is parsing agenda...</p></div>}
                
                {agendaItems.map(item => <AgendaItemRow key={item.id} item={item} onReview={onReview} status={agendaItemStatus[item.id] || item.aiStatus} setPolling={setPolling} />)}

                {meeting.agendaParsed && (
                    <div className="pt-4 border-t mt-4 flex justify-end">
                       {meeting.status === 'Completed' && meeting.finalMinutesUrl ? (
                            <a href={meeting.finalMinutesUrl} target="_blank" rel="noopener noreferrer" download="Final_Minutes.docx">
                                <Button><Download className="mr-2 h-4 w-4"/>Download Final Minutes</Button>
                            </a>
                       ) : (
                         <Button onClick={handleGenerateMinutes} disabled={!allApproved || meeting.status === 'Generating'}>
                            {meeting.status === 'Generating' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <BrainCircuit className="mr-2 h-4 w-4"/>}
                            {meeting.status === 'Generating' ? 'Generating...' : 'Generate Final Minutes'}
                        </Button>
                       )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const AgendaItemRow: FC<{ item: AgendaItem; onReview: (item: AgendaItem) => void; status: AgendaItem['aiStatus']; setPolling: React.Dispatch<React.SetStateAction<{agenda: boolean, finalMinutes: boolean, items: boolean}>> }> = ({ item, onReview, status, setPolling }) => {
    const fileUploadRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFiles(Array.from(e.target.files));
    };

    const handleStartDraft = () => {
        const fileUrls = files.map(f => ({ name: f.name, url: `simulated-cloud-storage/${f.name}` }));
        api.processBoardPackWebhook(item.id, fileUrls).then(() => {
            setPolling(prev => ({...prev, items: true}));
        });
    };

    const getStatusIndicator = () => {
        switch (status) {
            case 'Processing': return <><Loader2 className="h-4 w-4 animate-spin text-orange-500" /> <span className="text-orange-600">Processing</span></>;
            case 'Draft Ready': return <><Check className="h-4 w-4 text-yellow-500" /> <span className="text-yellow-600">Draft Ready</span></>;
            case 'Approved': return <><Check className="h-4 w-4 text-green-500" /> <span className="text-green-600">Approved</span></>;
            default: return null;
        }
    };

    return (
        <div className="p-4 border rounded-lg bg-white shadow-sm space-y-3">
            <div className="flex justify-between items-start">
                <p><span className="font-semibold">{item.itemNumber}</span> {item.title}</p>
                <div className="flex items-center space-x-2 text-sm font-medium">{getStatusIndicator()}</div>
            </div>
            {status === 'Idle' && (
                <div className="pl-6 space-y-2">
                    <input type="file" multiple ref={fileUploadRef} onChange={handleFileChange} className="hidden" />
                    <Button variant="secondary" size="sm" onClick={() => fileUploadRef.current?.click()}><UploadCloud className="mr-2 h-4 w-4"/> Attach Board Pack</Button>
                    {files.length > 0 && ( <div className="text-xs text-gray-500">{files.map(f => <div key={f.name}>{f.name}</div>)}</div> )}
                    <Button size="sm" onClick={handleStartDraft} disabled={files.length === 0}><BrainCircuit className="mr-2 h-4 w-4"/> Start AI Draft</Button>
                </div>
            )}
             {status === 'Draft Ready' && <div className="pl-6"><Button size="sm" onClick={() => onReview(item)}><Eye className="mr-2 h-4 w-4"/> Review Draft</Button></div>}
             {status === 'Approved' && <div className="pl-6"><Button variant="outline" size="sm" onClick={() => onReview(item)}><Pencil className="mr-2 h-4 w-4"/> Edit Approved Draft</Button></div>}
        </div>
    );
};

const ReviewScreen: FC<{ item: AgendaItem; onBack: () => void; onApprove: (updatedContent: string) => void; }> = ({ item, onBack, onApprove }) => {
    const [draft, setDraft] = useState(item.draftContent);

    return (
        <Card>
            <CardHeader>
                 <CardTitle>Reviewing: {item.title}</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold mb-2">Source Documents</h3>
                    <div className="p-3 border rounded-lg bg-gray-50/50 space-y-2 text-sm h-full">
                        {item.sourceFileUrls.length > 0 ? item.sourceFileUrls.map(f => <div key={f.url} className="flex items-center"><FileTextIcon className="h-4 w-4 mr-2 text-gray-500" /> {f.name}</div>) : <p className="text-gray-400">No documents attached.</p>}
                        <div className="mt-4 p-4 border-t text-xs text-gray-600">
                            <p className="font-bold">Source Viewer Placeholder</p>
                            <p>In a full implementation, the content of the source documents would be viewable here.</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">AI-Generated Draft</h3>
                    <Textarea value={draft} onChange={e => setDraft(e.target.value)} rows={15} className="text-sm leading-relaxed" />
                    <div className="mt-4 flex justify-end">
                        <Button onClick={() => onApprove(draft)}><Check className="mr-2 h-4 w-4" /> Approve Draft</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const NewMeetingModal: FC<{ company: Company; onClose: () => void; onMeetingCreated: (m: Meeting) => void; }> = ({ company, onClose, onMeetingCreated }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [attendees, setAttendees] = useState<string[]>([]);
    const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);

    useEffect(() => {
        api.getBoardMembers(company.id).then(setBoardMembers);
    }, [company.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newMeetingData = { companyId: company.id, title, date, attendees };
        const newMeeting = await api.createMeeting(newMeetingData);
        onMeetingCreated(newMeeting);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1}} onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Schedule New Meeting</CardTitle>
                        <CardDescription>For {company.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField id="meetingTitle" label="Meeting Title" value={title} onChange={e => setTitle(e.target.value)} required />
                        <FormField id="meetingDate" label="Meeting Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                        <div>
                            <Label>Attendees</Label>
                            <div className="p-2 border rounded-md max-h-40 overflow-y-auto">
                                {boardMembers.map(bm => (
                                    <div key={bm.id} className="flex items-center space-x-2 p-1">
                                        <input type="checkbox" id={`bm_${bm.id}`} value={bm.name}
                                            onChange={e => {
                                                if (e.target.checked) setAttendees(prev => [...prev, bm.name]);
                                                else setAttendees(prev => prev.filter(name => name !== bm.name));
                                            }}
                                            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                        />
                                        <Label htmlFor={`bm_${bm.id}`}>{bm.name}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                    <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Schedule</Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default MinutesManager;
