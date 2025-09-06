
import React, { useState, FC, ChangeEvent, Dispatch, SetStateAction, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, CheckCircle as CheckCircleIcon, ChevronRight, ChevronLeft, Loader2, AlertTriangle, Send as SendIconLucide, Eye,
    FileArchive, Building2 as Building2Icon, DollarSign, Users, ListChecks, PlusCircle, Trash2
} from 'lucide-react';

import { Allottee, CR20FormDetails, WizardProps, PageConfigItem, DocumentType } from './types';
import { questionVariants } from './constants';
import { Button, Input, Textarea, Label, FormField, TextAreaField, DetailItem, Select, SelectTrigger, SelectContentWrapper, SelectItem } from './components';

// Constants specific to this wizard
const CR20_WEBHOOK_URL = process.env.CR20_WEBHOOK_URL || "https://hook.eu1.make.com/xgs1riw3k3am2vu8do45sr35vgm3ivru";
const CR20_DRIVE_FOLDER_URL = process.env.CR20_DRIVE_FOLDER_URL || "https://drive.google.com/drive/folders/1Xpa4gOqusok3QeV_4E5DQSAa9eF1tb0_?usp=drive_link";

const cr20PageConfig: PageConfigItem[] = [
    { title: "Company Identification", icon: <Building2Icon className="h-6 w-6" />, desc: "Enter the company's name and registration number." },
    { title: "Particulars of Allotment", icon: <DollarSign className="h-6 w-6" />, desc: "Detail the shares allotted and their financial aspects." },
    { title: "Allottee(s) Information", icon: <Users className="h-6 w-6" />, desc: "Provide details for each allottee." },
    { title: "Lodging Agent Details", icon: <ListChecks className="h-6 w-6" />, desc: "Information about the person lodging the form." },
    { title: "Review Form CR20 Details", icon: <FileArchive className="h-6 w-6" />, desc: "Review all entered information before submitting." },
    { title: "Generate Form CR20", icon: <SendIconLucide className="h-6 w-6" />, desc: "Submit the information to generate Form CR20." },
];

// --- Page Specific Components ---

interface CompanyIdentificationPageProps {
  details: Pick<CR20FormDetails, 'companyName' | 'companyNumber'>;
  setDetails: Dispatch<SetStateAction<CR20FormDetails>>;
}
const CompanyIdentificationPage: FC<CompanyIdentificationPageProps> = ({ details, setDetails }) => {
  const handleChange = (field: 'companyName' | 'companyNumber') => (e: ChangeEvent<HTMLInputElement>) => {
    setDetails(prev => ({ ...prev, [field]: e.target.value }));
  };
  return (
    // @ts-ignore TypeScript is not correctly recognizing framer-motion animation props here.
    <motion.div variants={questionVariants} className="space-y-4 md:space-y-5">
        <FormField id="companyName" label="Company Name" value={details.companyName} onChange={handleChange('companyName')} required />
        <FormField id="companyNumber" label="Company Number" value={details.companyNumber} onChange={handleChange('companyNumber')} required />
    </motion.div>
  );
};

interface ParticularsOfAllotmentPageProps {
  details: Pick<CR20FormDetails, 'sharesAllottedPayableInCash' | 'nominalAmountOfSharesAllotted' | 'amountPaidOrUnpaidOnEachShare' | 'considerationForSharesOtherwiseThanInCash'>;
  setDetails: Dispatch<SetStateAction<CR20FormDetails>>;
}
const ParticularsOfAllotmentPage: FC<ParticularsOfAllotmentPageProps> = ({ details, setDetails }) => {
  const handleChange = (field: keyof ParticularsOfAllotmentPageProps['details']) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDetails(prev => ({ ...prev, [field]: e.target.value }));
  };
  return (
    // @ts-ignore TypeScript is not correctly recognizing framer-motion animation props here.
    <motion.div variants={questionVariants} className="space-y-4 md:space-y-5">
        <FormField id="sharesAllottedPayableInCash" label="Number of shares allotted payable in cash" value={details.sharesAllottedPayableInCash} onChange={handleChange('sharesAllottedPayableInCash')} required />
        <FormField id="nominalAmountOfSharesAllotted" label="Nominal amount of shares allotted" value={details.nominalAmountOfSharesAllotted} onChange={handleChange('nominalAmountOfSharesAllotted')} required />
        <FormField id="amountPaidOrUnpaidOnEachShare" label="Amount paid or due and unpaid on each share" value={details.amountPaidOrUnpaidOnEachShare} onChange={handleChange('amountPaidOrUnpaidOnEachShare')} required />
        <TextAreaField id="considerationForSharesOtherwiseThanInCash" label="Consideration for which shares have been allotted otherwise than in cash" value={details.considerationForSharesOtherwiseThanInCash} onChange={handleChange('considerationForSharesOtherwiseThanInCash')} isOptional />
    </motion.div>
  );
};

interface AllotteesInformationPageProps {
  allottees: Allottee[];
  onAllotteeChange: (index: number, field: keyof Allottee, value: string) => void;
  onAddAllottee: () => void;
  onRemoveAllottee: (index: number) => void;
}
const AllotteesInformationPage: FC<AllotteesInformationPageProps> = ({ allottees, onAllotteeChange, onAddAllottee, onRemoveAllottee }) => (
    // @ts-ignore TypeScript is not correctly recognizing framer-motion animation props here.
    <motion.div variants={questionVariants} className="space-y-6">
        {allottees.map((allottee, index) => (
            <div key={allottee.id} className="p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50/50">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-md text-gray-700">Allottee {index + 1}</h4>
                    {allottees.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => onRemoveAllottee(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1">
                            <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                    )}
                </div>
                <div className="space-y-3">
                    <FormField id={`allotteeFullName-${index}`} label="Full Name" value={allottee.allotteeFullName} onChange={(e) => onAllotteeChange(index, 'allotteeFullName', e.target.value)} required />
                    <FormField id={`allotteePostalAddress-${index}`} label="Postal Address" value={allottee.allotteePostalAddress} onChange={(e) => onAllotteeChange(index, 'allotteePostalAddress', e.target.value)} required />
                    <FormField id={`allotteeNumberOfShares-${index}`} label="Number of Shares" type="number" value={allottee.allotteeNumberOfShares} onChange={(e) => onAllotteeChange(index, 'allotteeNumberOfShares', e.target.value)} required />
                    <div className="space-y-1.5">
                        <Label htmlFor={`allotteeClassOfShare-${index}`}>Class of Share</Label>
                        <Select value={allottee.allotteeClassOfShare} onValueChange={(val) => onAllotteeChange(index, 'allotteeClassOfShare', val)}>
                            <SelectTrigger id={`allotteeClassOfShare-${index}`} placeholder="Select Class of Share"/>
                            <SelectContentWrapper>
                                <SelectItem value="Ordinary">Ordinary</SelectItem>
                                <SelectItem value="Preference">Preference</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContentWrapper>
                        </Select>
                    </div>
                </div>
            </div>
        ))}
        <Button type="button" variant="outline" onClick={onAddAllottee} className="mt-3 text-green-600 border-green-500 hover:bg-green-50">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Allottee
        </Button>
    </motion.div>
);

interface LodgingAgentDetailsPageProps {
  details: Pick<CR20FormDetails, 'lodgedByName' | 'lodgedByAddress' | 'lodgedByCapacity' | 'lodgedByDate'>;
  setDetails: Dispatch<SetStateAction<CR20FormDetails>>;
}
const LodgingAgentDetailsPage: FC<LodgingAgentDetailsPageProps> = ({ details, setDetails }) => {
  const handleChange = (field: keyof LodgingAgentDetailsPageProps['details']) => (e: ChangeEvent<HTMLInputElement>) => {
    setDetails(prev => ({ ...prev, [field]: e.target.value }));
  };
  return (
    // @ts-ignore TypeScript is not correctly recognizing framer-motion animation props here.
    <motion.div variants={questionVariants} className="space-y-4 md:space-y-5">
        <FormField id="lodgedByName" label="Lodged By (Name)" value={details.lodgedByName} onChange={handleChange('lodgedByName')} required />
        <FormField id="lodgedByAddress" label="Lodged By (Address)" value={details.lodgedByAddress} onChange={handleChange('lodgedByAddress')} required />
        <FormField id="lodgedByCapacity" label="Lodged By (Capacity)" value={details.lodgedByCapacity} onChange={handleChange('lodgedByCapacity')} required placeholder="e.g., Director, Secretary, Advocate"/>
        <FormField id="lodgedByDate" label="Date of Lodging" type="date" value={details.lodgedByDate} onChange={handleChange('lodgedByDate')} required />
    </motion.div>
  );
};

interface CR20ReviewPageProps {
  details: CR20FormDetails;
}
const CR20ReviewPage: FC<CR20ReviewPageProps> = ({ details }) => (
    // @ts-ignore TypeScript is not correctly recognizing framer-motion animation props here.
    <motion.div variants={questionVariants} className="space-y-6 text-sm">
        <h4 className="text-md font-semibold text-gray-700 border-b pb-2">Company Identification:</h4>
        <DetailItem label="Company Name" value={details.companyName} />
        <DetailItem label="Company Number" value={details.companyNumber} />

        <h4 className="text-md font-semibold text-gray-700 border-b pb-2 pt-3">Particulars of Allotment:</h4>
        <DetailItem label="Shares Allotted Payable in Cash" value={details.sharesAllottedPayableInCash} />
        <DetailItem label="Nominal Amount of Shares Allotted" value={details.nominalAmountOfSharesAllotted} />
        <DetailItem label="Amount Paid/Unpaid on Each Share" value={details.amountPaidOrUnpaidOnEachShare} />
        <DetailItem label="Consideration (Otherwise than in cash)" value={details.considerationForSharesOtherwiseThanInCash} />

        <h4 className="text-md font-semibold text-gray-700 border-b pb-2 pt-3">Allottees:</h4>
        {details.allottees.map((allottee, index) => (
            <div key={allottee.id} className="pl-3 border-l-2 border-green-200 mb-3 pb-2 last:mb-0 last:pb-0">
                <p className="text-xs uppercase text-green-600 font-semibold mb-1">Allottee {index + 1}</p>
                <DetailItem label="Full Name" value={allottee.allotteeFullName} />
                <DetailItem label="Postal Address" value={allottee.allotteePostalAddress} />
                <DetailItem label="Number of Shares" value={allottee.allotteeNumberOfShares} />
                <DetailItem label="Class of Share" value={allottee.allotteeClassOfShare} />
            </div>
        ))}

        <h4 className="text-md font-semibold text-gray-700 border-b pb-2 pt-3">Lodging Agent Details:</h4>
        <DetailItem label="Lodged By (Name)" value={details.lodgedByName} />
        <DetailItem label="Lodged By (Address)" value={details.lodgedByAddress} />
        <DetailItem label="Lodged By (Capacity)" value={details.lodgedByCapacity} />
        <DetailItem label="Date of Lodging" value={details.lodgedByDate} />
    </motion.div>
);

const CR20GenerateConfirmationPage: FC = () => (
    // @ts-ignore TypeScript is not correctly recognizing framer-motion animation props here.
    <motion.div
        key="generateCR20"
        variants={questionVariants} initial="hidden" animate="visible" exit="exit"
        className="text-center py-10"
    >
        <SendIconLucide className="h-16 w-16 text-green-600 mx-auto mb-6 opacity-80" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Ready to Generate Form CR20?</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
            All information has been entered. Click the button below to send the data to the webhook for document generation.
        </p>
    </motion.div>
);

interface CR20SubmissionSuccessPageProps {
  webhookSuccessMessage: string | null;
  onGoHome: () => void;
  driveFolderUrl: string;
}
const CR20SubmissionSuccessPage: FC<CR20SubmissionSuccessPageProps> = ({ webhookSuccessMessage, onGoHome, driveFolderUrl }) => (
    // @ts-ignore TypeScript is not correctly recognizing framer-motion animation props here.
    <motion.div
        key="finalStepCR20"
        variants={questionVariants} initial="hidden" animate="visible" exit="exit"
        className="text-center py-10"
    >
        <CheckCircleIcon className="h-20 w-20 text-green-600 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Submission Successful!</h2>
        {webhookSuccessMessage && (
            <div
                className="text-gray-600 mb-6 bg-green-50 p-4 rounded-md border border-green-200 shadow-sm"
                dangerouslySetInnerHTML={{ __html: webhookSuccessMessage }}
            />
        )}
        <p className="text-gray-600 mb-8">
            Your document generation process has been initiated.
        </p>
        <Button onClick={onGoHome} variant="default" size="lg">
            <Home className="mr-2 h-5 w-5" /> Go to Homepage
        </Button>
    </motion.div>
);

// --- Validation Functions ---
const validateCompanyIdentificationData = (details: Pick<CR20FormDetails, 'companyName' | 'companyNumber'>): string | null => {
    if (!details.companyName.trim() || !details.companyNumber.trim()) {
        return "Please fill all Company Identification fields.";
    }
    return null;
};

const validateParticularsOfAllotmentData = (details: Pick<CR20FormDetails, 'sharesAllottedPayableInCash' | 'nominalAmountOfSharesAllotted' | 'amountPaidOrUnpaidOnEachShare'>): string | null => {
    if (!details.sharesAllottedPayableInCash.trim() || !details.nominalAmountOfSharesAllotted.trim() || !details.amountPaidOrUnpaidOnEachShare.trim()) {
        return "Please fill all required Particulars of Allotment fields.";
    }
    return null;
};

const validateAllotteesData = (allottees: Allottee[]): string | null => {
    if (allottees.length === 0) {
        return "Please add at least one allottee.";
    }
    for (const allottee of allottees) {
        if (!allottee.allotteeFullName.trim() || !allottee.allotteePostalAddress.trim() || !allottee.allotteeNumberOfShares.trim() || !allottee.allotteeClassOfShare.trim()) {
            return "Please fill all required fields for each allottee.";
        }
    }
    return null;
};

const validateLodgingAgentData = (details: Pick<CR20FormDetails, 'lodgedByName' | 'lodgedByAddress' | 'lodgedByCapacity' | 'lodgedByDate'>): string | null => {
    if (!details.lodgedByName.trim() || !details.lodgedByAddress.trim() || !details.lodgedByCapacity.trim() || !details.lodgedByDate) {
        return "Please fill all Lodging Agent details.";
    }
    return null;
};

// --- Main Wizard Component ---
const CR20Wizard: FC<WizardProps> = ({ onGoHome, onSetInitialPageTitle, initialPreviousScreen }) => {
    const initialCR20State: CR20FormDetails = {
        companyName: '', companyNumber: '', sharesAllottedPayableInCash: '', nominalAmountOfSharesAllotted: '', amountPaidOrUnpaidOnEachShare: '', considerationForSharesOtherwiseThanInCash: '',
        allottees: [{ id: crypto.randomUUID(), allotteeFullName: '', allotteePostalAddress: '', allotteeNumberOfShares: '', allotteeClassOfShare: 'Ordinary' }],
        lodgedByName: '', lodgedByAddress: '', lodgedByCapacity: '', lodgedByDate: ''
    };
    const [cr20FormDetails, setCr20FormDetails] = useState<CR20FormDetails>(initialCR20State);
    
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [isSendingToWebhook, setIsSendingToWebhook] = useState<boolean>(false);
    const [webhookSuccessMessage, setWebhookSuccessMessage] = useState<string | null>(null);
    // const [previousScreen, setPreviousScreen] = useState<DocumentType | undefined>(initialPreviousScreen); // Example usage


    useEffect(() => {
        if (onSetInitialPageTitle && cr20PageConfig[currentPage - 1]) {
            const { title, desc, icon } = cr20PageConfig[currentPage - 1];
            onSetInitialPageTitle(title, desc, icon);
        }
    }, [currentPage, onSetInitialPageTitle]);
    
    const totalSteps = cr20PageConfig.length;
    const progressPercent = totalSteps > 0 ? Math.max(0, Math.min(100, ((currentPage - 1) / (totalSteps -1)) * 100)) : 0;
    
    const isReviewPage = currentPage === totalSteps - 1;
    const isGeneratePage = currentPage === totalSteps;
    const isFinalStep = webhookSuccessMessage !== null;
    
    const handleAllotteeChange = (index: number, field: keyof Allottee, value: string) => {
        const newAllottees = [...cr20FormDetails.allottees];
        newAllottees[index] = { ...newAllottees[index], [field]: value as Allottee[keyof Allottee] };
        setCr20FormDetails(prev => ({ ...prev, allottees: newAllottees }));
    };

    const addAllottee = () => {
        setCr20FormDetails(prev => ({
            ...prev,
            allottees: [...prev.allottees, { id: crypto.randomUUID(), allotteeFullName: '', allotteePostalAddress: '', allotteeNumberOfShares: '', allotteeClassOfShare: 'Ordinary' }]
        }));
    };

    const removeAllottee = (index: number) => {
        if (cr20FormDetails.allottees.length > 1) {
            setCr20FormDetails(prev => ({
                ...prev,
                allottees: prev.allottees.filter((_, i) => i !== index)
            }));
        } else {
            setSubmissionError("At least one allottee must be specified.");
            setTimeout(() => setSubmissionError(null), 5000);
        }
    };
    
    const handleNext = () => {
        setSubmissionError(null);
        let error: string | null = null;

        if (currentPage === 1) error = validateCompanyIdentificationData(cr20FormDetails);
        else if (currentPage === 2) error = validateParticularsOfAllotmentData(cr20FormDetails);
        else if (currentPage === 3) error = validateAllotteesData(cr20FormDetails.allottees);
        else if (currentPage === 4) error = validateLodgingAgentData(cr20FormDetails);

        if (error) {
            setSubmissionError(error);
            return;
        }

        if (isGeneratePage) {
            handleSendDataToWebhook();
            return;
        }
        setCurrentPage(prev => prev + 1);
    };

    const handlePrevious = () => {
        setSubmissionError(null);
        if (currentPage === 1) {
            onGoHome(); // This will use the onGoHome from App.tsx which handles going back to manager or main menu
        } else {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleSendDataToWebhook = async () => {
        const documentTypeName = "Form CR20";
        const formData = cr20FormDetails;

        if (!CR20_WEBHOOK_URL || CR20_WEBHOOK_URL.includes("YOUR_MAKE_COM_WEBHOOK_URL_HERE")) {
             setSubmissionError(`${documentTypeName} webhook URL is not configured. Please contact the administrator.`);
             return;
        }
         if (!CR20_WEBHOOK_URL.startsWith('https://hook.eu1.make.com/') && !CR20_WEBHOOK_URL.startsWith('https://hook.us1.make.com/')) {
            setSubmissionError("The configured Make.com Webhook URL appears to be invalid. Please contact the administrator.");
            return;
        }

        setIsSendingToWebhook(true); setSubmissionError(null); setWebhookSuccessMessage(null);

        try {
            const response = await fetch(CR20_WEBHOOK_URL, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ documentType: 'cr20', formData }),
            });
            const responseText = await response.text();
             if (response.ok) {
                if (responseText.toLowerCase() === "accepted") {
                     setWebhookSuccessMessage(
                        `Your ${documentTypeName} data has been successfully submitted. The document will be generated and saved to Google Drive.
                        <br /><br />
                        <a href="${CR20_DRIVE_FOLDER_URL}" target="_blank" rel="noopener noreferrer" class="text-green-700 underline hover:text-green-800 font-semibold py-2 inline-block">
                            Click here to open the Google Drive folder.
                        </a>`
                    );
                } else {
                    setWebhookSuccessMessage(`Data sent. Make.com responded: ${responseText}.`);
                }
            } else {
                setSubmissionError(`Failed to send data. Status: ${response.status}. Response: ${responseText || 'No additional error info.'}`);
            }
        } catch (error: any) {
            setSubmissionError(`An error occurred while sending data: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsSendingToWebhook(false);
        }
    };
    
    const pageComponents: { [key: number]: ReactNode } = {
        1: <CompanyIdentificationPage details={cr20FormDetails} setDetails={setCr20FormDetails} />,
        2: <ParticularsOfAllotmentPage details={cr20FormDetails} setDetails={setCr20FormDetails} />,
        3: <AllotteesInformationPage allottees={cr20FormDetails.allottees} onAllotteeChange={handleAllotteeChange} onAddAllottee={addAllottee} onRemoveAllottee={removeAllottee} />,
        4: <LodgingAgentDetailsPage details={cr20FormDetails} setDetails={setCr20FormDetails} />,
        5: <CR20ReviewPage details={cr20FormDetails} />,
        6: <CR20GenerateConfirmationPage />,
    };

    const renderCurrentPageContent = () => {
        if (isFinalStep) {
             return <CR20SubmissionSuccessPage webhookSuccessMessage={webhookSuccessMessage} onGoHome={onGoHome} driveFolderUrl={CR20_DRIVE_FOLDER_URL} />;
        }
        return pageComponents[currentPage] || <p>Page not found.</p>;
    };

    return (
        <div className="w-full">
             {!isFinalStep && (
                <div className="px-0 pt-0 pb-2"> 
                    <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        {/* @ts-ignore TypeScript is not correctly recognizing framer-motion animation props here. */}
                        <motion.div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 text-right mt-1">
                        Step {currentPage} of {totalSteps}
                    </p>
                </div>
            )}

            <AnimatePresence mode="wait">
                {renderCurrentPageContent()}
            </AnimatePresence>

            {!isFinalStep && (
                <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                    <Button variant="outline" onClick={handlePrevious} className="w-full sm:w-auto" disabled={isSendingToWebhook}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <Button
                        onClick={handleNext}
                        variant={isGeneratePage ? "success" : "default"}
                        className="w-full sm:w-auto"
                        disabled={isSendingToWebhook}
                    >
                        {isSendingToWebhook ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : isGeneratePage ? (
                            <SendIconLucide className="mr-2 h-4 w-4" />
                        ) : isReviewPage ? (
                            <Eye className="mr-2 h-4 w-4" />
                        ) : (
                            <ChevronRight className="mr-2 h-4 w-4" />
                        )}
                        {isSendingToWebhook ? "Sending..." : isGeneratePage ? "Generate Document" : isReviewPage ? "Proceed to Generate" : "Next"}
                    </Button>
                </div>
            )}

            {submissionError && (
                // @ts-ignore TypeScript is not correctly recognizing framer-motion animation props here.
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-t border-red-200 p-3 text-center mt-4 rounded-md"
                >
                    <p className="text-sm text-red-700 font-medium flex items-center justify-center">
                        <AlertTriangle className="mr-2 h-5 w-5 flex-shrink-0"/> {submissionError}
                    </p>
                </motion.div>
            )}
        </div>
    );
};
export default CR20Wizard;
