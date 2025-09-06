
import React, { useState, FC, ChangeEvent, Dispatch, SetStateAction, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, CheckCircle as CheckCircleIcon, ChevronRight, ChevronLeft, Loader2, AlertTriangle, Send as SendIconLucide, Eye,
    FileEdit, UsersRound, CalendarCheck2, ShieldQuestion
} from 'lucide-react';

import { PBOChangeOfNameFormDetails, RegisteredOfficial, WizardProps, PageConfigItem } from './types';
import { questionVariants } from './constants';
import { Button, Input, Label, FormField, DetailItem } from './components';

// Constants specific to this wizard
const PBO_CHANGE_OF_NAME_WEBHOOK_URL = process.env.PBO_CHANGE_OF_NAME_WEBHOOK_URL || "YOUR_MAKE_COM_WEBHOOK_URL_HERE_PBO_CN";
const PBO_CHANGE_OF_NAME_DRIVE_FOLDER_URL = process.env.PBO_CHANGE_OF_NAME_DRIVE_FOLDER_URL || "YOUR_GOOGLE_DRIVE_FOLDER_URL_HERE";

const pboChangeOfNamePageConfig: PageConfigItem[] = [
    { title: "Organization & Resolution", icon: <FileEdit className="h-6 w-6" />, desc: "Details of the organization and name change resolution." },
    { title: "Registered Officials", icon: <UsersRound className="h-6 w-6" />, desc: "Names and designations of three registered officials." },
    { title: "Lodging Details", icon: <CalendarCheck2 className="h-6 w-6" />, desc: "Date this form is being lodged." },
    { title: "Review Form 16 Details", icon: <ShieldQuestion className="h-6 w-6" />, desc: "Review all information before submitting." },
    { title: "Generate Form 16", icon: <SendIconLucide className="h-6 w-6" />, desc: "Submit to generate Notification of Change of Name." },
];

// --- Page Specific Components ---

interface OrganizationResolutionPageProps {
  details: Pick<PBOChangeOfNameFormDetails, 'organizationCurrentName' | 'organizationNewName' | 'resolutionNumber' | 'meetingDate'>;
  setDetails: Dispatch<SetStateAction<PBOChangeOfNameFormDetails>>;
}
const OrganizationResolutionPage: FC<OrganizationResolutionPageProps> = ({ details, setDetails }) => {
  const handleChange = (field: keyof OrganizationResolutionPageProps['details']) => (e: ChangeEvent<HTMLInputElement>) => {
    setDetails(prev => ({ ...prev, [field]: e.target.value }));
  };
  return (
    <motion.div variants={questionVariants} className="space-y-4 md:space-y-5">
        <FormField id="organizationCurrentName" label="Current Organization Name" value={details.organizationCurrentName} onChange={handleChange('organizationCurrentName')} required 
            placeholder="The... (Organization Full Name)"
        />
        <FormField id="organizationNewName" label="Proposed New Organization Name" value={details.organizationNewName} onChange={handleChange('organizationNewName')} required 
            placeholder="To... (New Organization Full Name)"
        />
        <FormField id="resolutionNumber" label="Resolution Number" value={details.resolutionNumber} onChange={handleChange('resolutionNumber')} required />
        <FormField id="meetingDate" label="Date of Meeting Approving Change" type="date" value={details.meetingDate} onChange={handleChange('meetingDate')} required />
    </motion.div>
  );
};

interface RegisteredOfficialsPageProps {
  officials: RegisteredOfficial[];
  onOfficialChange: (index: number, field: keyof Omit<RegisteredOfficial, 'id'>, value: string) => void;
}
const RegisteredOfficialsPage: FC<RegisteredOfficialsPageProps> = ({ officials, onOfficialChange }) => (
    <motion.div variants={questionVariants} className="space-y-6">
        <p className="text-sm text-gray-600">Enter the names and designations of three currently registered officials of the organization.</p>
        {officials.map((official, index) => (
            <div key={official.id} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50/30">
                <h4 className="font-semibold text-md text-gray-700 mb-3">Official {index + 1}</h4>
                <div className="space-y-3">
                    <FormField 
                        id={`officialName-${index}`} 
                        label="Full Name" 
                        value={official.name} 
                        onChange={(e) => onOfficialChange(index, 'name', e.target.value)} 
                        required 
                    />
                    <FormField 
                        id={`officialDesignation-${index}`} 
                        label="Designation" 
                        value={official.designation} 
                        onChange={(e) => onOfficialChange(index, 'designation', e.target.value)} 
                        required 
                    />
                </div>
            </div>
        ))}
    </motion.div>
);

interface LodgingDatePageProps {
  lodgingDate: string;
  setLodgingDate: (date: string) => void;
}
const LodgingDatePage: FC<LodgingDatePageProps> = ({ lodgingDate, setLodgingDate }) => (
    <motion.div variants={questionVariants} className="space-y-4 md:space-y-5">
        <FormField 
            id="lodgingDate" 
            label="Date of Lodging this Form" 
            type="date" 
            value={lodgingDate} 
            onChange={(e) => setLodgingDate(e.target.value)} 
            required 
        />
    </motion.div>
);

interface PBOChangeOfNameReviewPageProps {
  details: PBOChangeOfNameFormDetails;
}
const PBOChangeOfNameReviewPage: FC<PBOChangeOfNameReviewPageProps> = ({ details }) => (
    <motion.div variants={questionVariants} className="space-y-6 text-sm">
        <h4 className="text-md font-semibold text-gray-700 border-b pb-2">Organization & Resolution Details:</h4>
        <DetailItem label="Current Organization Name (The...)" value={details.organizationCurrentName} />
        <DetailItem label="Proposed New Organization Name (To...)" value={details.organizationNewName} />
        <DetailItem label="Resolution Number" value={details.resolutionNumber} />
        <DetailItem label="Meeting Date" value={details.meetingDate} />
        
        <h4 className="text-md font-semibold text-gray-700 border-b pb-2 pt-3">Registered Officials:</h4>
        {details.registeredOfficials.map((official, index) => (
            <div key={official.id} className="pl-3 border-l-2 border-green-200 mb-2 pb-1 last:mb-0 last:pb-0">
                <p className="text-xs uppercase text-green-600 font-semibold mb-0.5">Official {index + 1}</p>
                <DetailItem label="Name" value={official.name} />
                <DetailItem label="Designation" value={official.designation} />
            </div>
        ))}

        <h4 className="text-md font-semibold text-gray-700 border-b pb-2 pt-3">Lodging Details:</h4>
        <DetailItem label="Date of Lodging" value={details.lodgingDate} />
    </motion.div>
);

const PBOChangeOfNameGenerateConfirmationPage: FC = () => (
    <motion.div
        key="generatePBOChangeName"
        variants={questionVariants} initial="hidden" animate="visible" exit="exit"
        className="text-center py-10"
    >
        <SendIconLucide className="h-16 w-16 text-green-600 mx-auto mb-6 opacity-80" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Ready to Generate Form 16?</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
            All information has been entered. Click below to submit for document generation.
        </p>
    </motion.div>
);

interface PBOChangeOfNameSubmissionSuccessPageProps {
  webhookSuccessMessage: string | null;
  onGoHome: () => void;
  driveFolderUrl: string;
}
const PBOChangeOfNameSubmissionSuccessPage: FC<PBOChangeOfNameSubmissionSuccessPageProps> = ({ webhookSuccessMessage, onGoHome, driveFolderUrl }) => (
    <motion.div
        key="finalStepPBOChangeName"
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
            Your Form 16 generation process has been initiated.
        </p>
        <Button onClick={onGoHome} variant="default" size="lg">
            <Home className="mr-2 h-5 w-5" /> Go to Homepage
        </Button>
    </motion.div>
);

// --- Validation Functions ---
const validateOrganizationResolutionData = (
    details: Pick<PBOChangeOfNameFormDetails, 'organizationCurrentName' | 'organizationNewName' | 'resolutionNumber' | 'meetingDate'>
): string | null => {
    if (!details.organizationCurrentName.trim() || !details.organizationNewName.trim() || !details.resolutionNumber.trim() || !details.meetingDate) {
        return "Please fill all Organization & Resolution fields.";
    }
    return null;
};

const validateRegisteredOfficialsData = (officials: RegisteredOfficial[]): string | null => {
    for (const official of officials) {
        if (!official.name.trim() || !official.designation.trim()) {
            return "Please fill all fields for each Registered Official.";
        }
    }
    return null;
};

const validateLodgingDateData = (lodgingDate: string): string | null => {
    if (!lodgingDate) {
        return "Please enter the Lodging Date.";
    }
    return null;
};


// --- Main Wizard Component ---
const PBOChangeOfNameWizard: FC<WizardProps> = ({ onGoHome, onSetInitialPageTitle }) => {
    const initialPBOChangeOfNameState: PBOChangeOfNameFormDetails = {
        organizationCurrentName: '',
        organizationNewName: '',
        resolutionNumber: '',
        meetingDate: '',
        registeredOfficials: [
            { id: crypto.randomUUID(), name: '', designation: '' },
            { id: crypto.randomUUID(), name: '', designation: '' },
            { id: crypto.randomUUID(), name: '', designation: '' },
        ],
        lodgingDate: '',
    };
    const [formDetails, setFormDetails] = useState<PBOChangeOfNameFormDetails>(initialPBOChangeOfNameState);
    
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [isSendingToWebhook, setIsSendingToWebhook] = useState<boolean>(false);
    const [webhookSuccessMessage, setWebhookSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (onSetInitialPageTitle && pboChangeOfNamePageConfig[currentPage - 1]) {
            const { title, desc, icon } = pboChangeOfNamePageConfig[currentPage - 1];
            onSetInitialPageTitle(title, desc, icon);
        }
    }, [currentPage, onSetInitialPageTitle]);
    
    const totalSteps = pboChangeOfNamePageConfig.length;
    const progressPercent = totalSteps > 0 ? Math.max(0, Math.min(100, ((currentPage - 1) / (totalSteps -1)) * 100)) : 0;
    
    const isReviewPage = currentPage === totalSteps - 1;
    const isGeneratePage = currentPage === totalSteps;
    const isFinalStep = webhookSuccessMessage !== null;

    const handleOfficialChange = (index: number, field: keyof Omit<RegisteredOfficial, 'id'>, value: string) => {
        setFormDetails(prev => {
            const newOfficials = [...prev.registeredOfficials];
            newOfficials[index] = { ...newOfficials[index], [field]: value };
            return { ...prev, registeredOfficials: newOfficials };
        });
    };
    
    const handleNext = () => {
        setSubmissionError(null);
        let error: string | null = null;

        if (currentPage === 1) error = validateOrganizationResolutionData(formDetails);
        else if (currentPage === 2) error = validateRegisteredOfficialsData(formDetails.registeredOfficials);
        else if (currentPage === 3) error = validateLodgingDateData(formDetails.lodgingDate);

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
            onGoHome();
        } else {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleSendDataToWebhook = async () => {
        const documentTypeName = "PBO Change of Name (Form 16)";
        const formDataPayload = formDetails;

        if (!PBO_CHANGE_OF_NAME_WEBHOOK_URL || PBO_CHANGE_OF_NAME_WEBHOOK_URL.includes("YOUR_MAKE_COM_WEBHOOK_URL_HERE")) {
             setSubmissionError(`${documentTypeName} webhook URL is not configured. Please contact the administrator.`);
             return;
        }
        if (!PBO_CHANGE_OF_NAME_WEBHOOK_URL.startsWith('https://hook.eu1.make.com/') && !PBO_CHANGE_OF_NAME_WEBHOOK_URL.startsWith('https://hook.us1.make.com/')) {
            setSubmissionError("The configured Make.com Webhook URL appears to be invalid. Please contact the administrator.");
            return;
        }

        setIsSendingToWebhook(true); setSubmissionError(null); setWebhookSuccessMessage(null);

        try {
            const response = await fetch(PBO_CHANGE_OF_NAME_WEBHOOK_URL, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ documentType: 'pboChangeOfName', formData: formDataPayload }),
            });
            const responseText = await response.text();
            if (response.ok) {
                if (responseText.toLowerCase() === "accepted") {
                     setWebhookSuccessMessage(
                        `Your ${documentTypeName} data has been successfully submitted. The document will be generated and saved to Google Drive.
                        <br /><br />
                        <a href="${PBO_CHANGE_OF_NAME_DRIVE_FOLDER_URL}" target="_blank" rel="noopener noreferrer" class="text-green-700 underline hover:text-green-800 font-semibold py-2 inline-block">
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
        1: <OrganizationResolutionPage details={formDetails} setDetails={setFormDetails} />,
        2: <RegisteredOfficialsPage officials={formDetails.registeredOfficials} onOfficialChange={handleOfficialChange} />,
        3: <LodgingDatePage lodgingDate={formDetails.lodgingDate} setLodgingDate={(date) => setFormDetails(prev => ({...prev, lodgingDate: date}))} />,
        4: <PBOChangeOfNameReviewPage details={formDetails} />,
        5: <PBOChangeOfNameGenerateConfirmationPage />,
    };

    const renderCurrentPageContent = () => {
         if (isFinalStep) {
            return <PBOChangeOfNameSubmissionSuccessPage webhookSuccessMessage={webhookSuccessMessage} onGoHome={onGoHome} driveFolderUrl={PBO_CHANGE_OF_NAME_DRIVE_FOLDER_URL} />;
        }
        return pageComponents[currentPage] || <p>Page not found.</p>;
    };

    return (
        <div className="w-full">
            {!isFinalStep && (
                <div className="px-0 pt-0 pb-2">
                    <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
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
                        {isSendingToWebhook ? "Sending..." : isGeneratePage ? "Generate Form 16" : isReviewPage ? "Proceed to Generate" : "Next"}
                    </Button>
                </div>
            )}

            {submissionError && (
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
export default PBOChangeOfNameWizard;
