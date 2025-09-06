
import React, { useState, FC, ChangeEvent, Dispatch, SetStateAction, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, CheckCircle as CheckCircleIcon, ChevronRight, ChevronLeft, Loader2, AlertTriangle, Send as SendIconLucide, Eye,
    Building, MapPin, Mail, UserCheck, FileSearch, Edit3
} from 'lucide-react';

import { Form4Details, WizardProps, PageConfigItem } from './types';
import { questionVariants } from './constants';
import { Button, Input, Label, FormField, DetailItem, Select, SelectTrigger, SelectContentWrapper, SelectItem, Textarea, TextAreaField } from './components';

// Constants specific to this wizard
const FORM4_WEBHOOK_URL = process.env.FORM4_WEBHOOK_URL || "YOUR_MAKE_COM_WEBHOOK_URL_FORM4";
const FORM4_DRIVE_FOLDER_URL = process.env.FORM4_DRIVE_FOLDER_URL || "YOUR_GOOGLE_DRIVE_FOLDER_URL_FORM4";

const form4PageConfig: PageConfigItem[] = [
    { title: "Organisation Name", icon: <Building className="h-6 w-6" />, desc: "Enter the name of the organisation." },
    { title: "Registered Office", icon: <MapPin className="h-6 w-6" />, desc: "Specify the new or changed registered office address." },
    { title: "Postal Address", icon: <Mail className="h-6 w-6" />, desc: "Specify the new or changed postal address." },
    { title: "Declaration Details", icon: <UserCheck className="h-6 w-6" />, desc: "Enter the date and Chief Officer's name." },
    { title: "Review Form 4 Details", icon: <FileSearch className="h-6 w-6" />, desc: "Review all information before submission." },
    { title: "Generate Form 4", icon: <SendIconLucide className="h-6 w-6" />, desc: "Submit to generate Notification of Change." },
];

// --- Page Specific Components ---

interface OrganizationNamePageProps {
  organizationName: string;
  setOrganizationName: (name: string) => void;
}
const OrganizationNamePage: FC<OrganizationNamePageProps> = ({ organizationName, setOrganizationName }) => (
    <motion.div variants={questionVariants} className="space-y-4 md:space-y-5">
        <FormField 
            id="organizationName" 
            label="Name of Organisation" 
            value={organizationName} 
            onChange={(e) => setOrganizationName(e.target.value)} 
            required 
            placeholder="Enter the full name of the organisation"
        />
    </motion.div>
);

interface AddressDetailsPageProps {
  option: 'willHave' | 'hasChanged';
  setOption: (option: 'willHave' | 'hasChanged') => void;
  addressAt?: string;
  setAddressAt?: (value: string) => void;
  addressFrom?: string;
  setAddressFrom?: (value: string) => void;
  addressTo?: string;
  setAddressTo?: (value: string) => void;
  addressTypeLabel: 'Registered Office' | 'Postal Address';
}
const AddressDetailsPage: FC<AddressDetailsPageProps> = ({ 
    option, setOption, addressAt, setAddressAt, addressFrom, setAddressFrom, addressTo, setAddressTo, addressTypeLabel 
}) => (
    <motion.div variants={questionVariants} className="space-y-4 md:space-y-5">
        <div className="space-y-1.5">
            <Label htmlFor={`${addressTypeLabel.toLowerCase().replace(' ', '')}Option`}>{addressTypeLabel} Status</Label>
            <Select value={option} onValueChange={(val) => setOption(val as 'willHave' | 'hasChanged')}>
                <SelectTrigger id={`${addressTypeLabel.toLowerCase().replace(' ', '')}Option`} placeholder={`Select ${addressTypeLabel} status`} />
                <SelectContentWrapper>
                    <SelectItem value="willHave">{`*Will have its ${addressTypeLabel.toLowerCase()} at`}</SelectItem>
                    <SelectItem value="hasChanged">{`Has changed its ${addressTypeLabel.toLowerCase()} from`}</SelectItem>
                </SelectContentWrapper>
            </Select>
        </div>

        {option === 'willHave' && setAddressAt && (
            <TextAreaField 
                id={`${addressTypeLabel.toLowerCase().replace(' ', '')}At`}
                label={`${addressTypeLabel} At`} 
                value={addressAt || ''} 
                onChange={(e) => setAddressAt(e.target.value)} 
                required 
                rows={3}
                placeholder={`Enter the full ${addressTypeLabel.toLowerCase()}`}
            />
        )}
        {option === 'hasChanged' && setAddressFrom && setAddressTo && (
            <>
                <TextAreaField 
                    id={`${addressTypeLabel.toLowerCase().replace(' ', '')}From`}
                    label={`${addressTypeLabel} From`} 
                    value={addressFrom || ''} 
                    onChange={(e) => setAddressFrom(e.target.value)} 
                    required 
                    rows={3}
                    placeholder={`Enter the previous ${addressTypeLabel.toLowerCase()}`}
                />
                <TextAreaField 
                    id={`${addressTypeLabel.toLowerCase().replace(' ', '')}To`}
                    label={`${addressTypeLabel} To`} 
                    value={addressTo || ''} 
                    onChange={(e) => setAddressTo(e.target.value)} 
                    required 
                    rows={3}
                    placeholder={`Enter the new ${addressTypeLabel.toLowerCase()}`}
                />
            </>
        )}
         <p className="text-xs text-gray-500 mt-1">*Select this option if this is the first notification of this address type or if you are only providing a new address without specifying a previous one.</p>
    </motion.div>
);


interface DeclarationDetailsPageProps {
  datedThe: string;
  setDatedThe: (date: string) => void;
  chiefOfficerName: string;
  setChiefOfficerName: (name: string) => void;
}
const DeclarationDetailsPage: FC<DeclarationDetailsPageProps> = ({ datedThe, setDatedThe, chiefOfficerName, setChiefOfficerName }) => (
    <motion.div variants={questionVariants} className="space-y-4 md:space-y-5">
        <FormField 
            id="datedThe" 
            label="Dated the" 
            type="date" 
            value={datedThe} 
            onChange={(e) => setDatedThe(e.target.value)} 
            required 
        />
        <FormField 
            id="chiefOfficerName" 
            label="Chief Officer Name (for signature)" 
            value={chiefOfficerName} 
            onChange={(e) => setChiefOfficerName(e.target.value)} 
            required 
            placeholder="Enter the name of the Chief Officer"
        />
    </motion.div>
);

interface Form4ReviewPageProps {
  details: Form4Details;
}
const Form4ReviewPage: FC<Form4ReviewPageProps> = ({ details }) => (
    <motion.div variants={questionVariants} className="space-y-6 text-sm">
        <h4 className="text-md font-semibold text-gray-700 border-b pb-2">Organisation Name:</h4>
        <DetailItem label="Name of Organisation" value={details.organizationName} />

        <h4 className="text-md font-semibold text-gray-700 border-b pb-2 pt-3">Registered Office:</h4>
        {details.registeredOfficeOption === 'willHave' ? (
            <DetailItem label="Will have its registered office at" value={details.registeredOfficeAt} />
        ) : (
            <>
                <DetailItem label="Has changed its registered office from" value={details.registeredOfficeFrom} />
                <DetailItem label="To" value={details.registeredOfficeTo} />
            </>
        )}
        
        <h4 className="text-md font-semibold text-gray-700 border-b pb-2 pt-3">Postal Address:</h4>
        {details.postalAddressOption === 'willHave' ? (
            <DetailItem label="Will have its postal address at" value={details.postalAddressAt} />
        ) : (
            <>
                <DetailItem label="Has changed its postal address from" value={details.postalAddressFrom} />
                <DetailItem label="To" value={details.postalAddressTo} />
            </>
        )}

        <h4 className="text-md font-semibold text-gray-700 border-b pb-2 pt-3">Declaration Details:</h4>
        <DetailItem label="Dated the" value={details.datedThe} />
        <DetailItem label="Chief Officer Name" value={details.chiefOfficerName} />
    </motion.div>
);

const Form4GenerateConfirmationPage: FC = () => (
    <motion.div
        key="generateForm4"
        variants={questionVariants} initial="hidden" animate="visible" exit="exit"
        className="text-center py-10"
    >
        <SendIconLucide className="h-16 w-16 text-green-600 mx-auto mb-6 opacity-80" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Ready to Generate Form 4?</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
            All information has been entered. Click below to submit for document generation.
        </p>
    </motion.div>
);

interface Form4SubmissionSuccessPageProps {
  webhookSuccessMessage: string | null;
  onGoHome: () => void;
  driveFolderUrl: string;
}
const Form4SubmissionSuccessPage: FC<Form4SubmissionSuccessPageProps> = ({ webhookSuccessMessage, onGoHome, driveFolderUrl }) => (
    <motion.div
        key="finalStepForm4"
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
            Your Form 4 generation process has been initiated.
        </p>
        <Button onClick={onGoHome} variant="default" size="lg">
            <Home className="mr-2 h-5 w-5" /> Go to Homepage
        </Button>
    </motion.div>
);

// --- Validation Functions ---
const validateOrganizationNameData = (name: string): string | null => {
    if (!name.trim()) return "Please enter the Organisation Name.";
    return null;
};

const validateAddressDetailsData = (
    option: 'willHave' | 'hasChanged',
    addressAt?: string,
    addressFrom?: string,
    addressTo?: string,
    addressType?: string
): string | null => {
    if (option === 'willHave' && !addressAt?.trim()) {
        return `Please provide the ${addressType || 'address'} at.`;
    }
    if (option === 'hasChanged' && (!addressFrom?.trim() || !addressTo?.trim())) {
        return `Please provide both the ${addressType || 'address'} from and to.`;
    }
    return null;
};

const validateDeclarationDetailsData = (datedThe: string, chiefOfficerName: string): string | null => {
    if (!datedThe) return "Please enter the date.";
    if (!chiefOfficerName.trim()) return "Please enter the Chief Officer's Name.";
    return null;
};


// --- Main Wizard Component ---
const Form4Wizard: FC<WizardProps> = ({ onGoHome, onSetInitialPageTitle }) => {
    const initialForm4DetailsState: Form4Details = {
        organizationName: '',
        registeredOfficeOption: 'willHave',
        registeredOfficeAt: '',
        registeredOfficeFrom: '',
        registeredOfficeTo: '',
        postalAddressOption: 'willHave',
        postalAddressAt: '',
        postalAddressFrom: '',
        postalAddressTo: '',
        datedThe: '',
        chiefOfficerName: '',
    };
    const [formDetails, setFormDetails] = useState<Form4Details>(initialForm4DetailsState);
    
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [isSendingToWebhook, setIsSendingToWebhook] = useState<boolean>(false);
    const [webhookSuccessMessage, setWebhookSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (onSetInitialPageTitle && form4PageConfig[currentPage - 1]) {
            const { title, desc, icon } = form4PageConfig[currentPage - 1];
            onSetInitialPageTitle(title, desc, icon);
        }
    }, [currentPage, onSetInitialPageTitle]);
    
    const totalSteps = form4PageConfig.length;
    const progressPercent = totalSteps > 0 ? Math.max(0, Math.min(100, ((currentPage - 1) / (totalSteps -1)) * 100)) : 0;
    
    const isReviewPage = currentPage === totalSteps - 1;
    const isGeneratePage = currentPage === totalSteps;
    const isFinalStep = webhookSuccessMessage !== null;
    
    const handleNext = () => {
        setSubmissionError(null);
        let error: string | null = null;

        if (currentPage === 1) error = validateOrganizationNameData(formDetails.organizationName);
        else if (currentPage === 2) error = validateAddressDetailsData(formDetails.registeredOfficeOption, formDetails.registeredOfficeAt, formDetails.registeredOfficeFrom, formDetails.registeredOfficeTo, "Registered Office");
        else if (currentPage === 3) error = validateAddressDetailsData(formDetails.postalAddressOption, formDetails.postalAddressAt, formDetails.postalAddressFrom, formDetails.postalAddressTo, "Postal Address");
        else if (currentPage === 4) error = validateDeclarationDetailsData(formDetails.datedThe, formDetails.chiefOfficerName);

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
        const documentTypeName = "Form 4 - NGO Address Change";
        const formDataPayload = { ...formDetails };

        // Clean up data based on options
        if (formDataPayload.registeredOfficeOption === 'willHave') {
            delete formDataPayload.registeredOfficeFrom;
            delete formDataPayload.registeredOfficeTo;
        } else {
            delete formDataPayload.registeredOfficeAt;
        }
        if (formDataPayload.postalAddressOption === 'willHave') {
            delete formDataPayload.postalAddressFrom;
            delete formDataPayload.postalAddressTo;
        } else {
            delete formDataPayload.postalAddressAt;
        }


        if (!FORM4_WEBHOOK_URL || FORM4_WEBHOOK_URL.includes("YOUR_MAKE_COM_WEBHOOK_URL_FORM4")) {
             setSubmissionError(`${documentTypeName} webhook URL is not configured. Please contact the administrator.`);
             return;
        }
        if (!FORM4_WEBHOOK_URL.startsWith('https://hook.eu1.make.com/') && !FORM4_WEBHOOK_URL.startsWith('https://hook.us1.make.com/')) {
            setSubmissionError("The configured Make.com Webhook URL appears to be invalid. Please contact the administrator.");
            return;
        }

        setIsSendingToWebhook(true); setSubmissionError(null); setWebhookSuccessMessage(null);

        try {
            const response = await fetch(FORM4_WEBHOOK_URL, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ documentType: 'form4', formData: formDataPayload }),
            });
            const responseText = await response.text();
            if (response.ok) {
                if (responseText.toLowerCase() === "accepted") {
                     setWebhookSuccessMessage(
                        `Your ${documentTypeName} data has been successfully submitted. The document will be generated and saved to Google Drive.
                        <br /><br />
                        <a href="${FORM4_DRIVE_FOLDER_URL}" target="_blank" rel="noopener noreferrer" class="text-green-700 underline hover:text-green-800 font-semibold py-2 inline-block">
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
        1: <OrganizationNamePage 
                organizationName={formDetails.organizationName} 
                setOrganizationName={(name) => setFormDetails(prev => ({...prev, organizationName: name}))} 
            />,
        2: <AddressDetailsPage 
                option={formDetails.registeredOfficeOption}
                setOption={(opt) => setFormDetails(prev => ({...prev, registeredOfficeOption: opt}))}
                addressAt={formDetails.registeredOfficeAt}
                setAddressAt={(val) => setFormDetails(prev => ({...prev, registeredOfficeAt: val}))}
                addressFrom={formDetails.registeredOfficeFrom}
                setAddressFrom={(val) => setFormDetails(prev => ({...prev, registeredOfficeFrom: val}))}
                addressTo={formDetails.registeredOfficeTo}
                setAddressTo={(val) => setFormDetails(prev => ({...prev, registeredOfficeTo: val}))}
                addressTypeLabel="Registered Office"
            />,
        3: <AddressDetailsPage
                option={formDetails.postalAddressOption}
                setOption={(opt) => setFormDetails(prev => ({...prev, postalAddressOption: opt}))}
                addressAt={formDetails.postalAddressAt}
                setAddressAt={(val) => setFormDetails(prev => ({...prev, postalAddressAt: val}))}
                addressFrom={formDetails.postalAddressFrom}
                setAddressFrom={(val) => setFormDetails(prev => ({...prev, postalAddressFrom: val}))}
                addressTo={formDetails.postalAddressTo}
                setAddressTo={(val) => setFormDetails(prev => ({...prev, postalAddressTo: val}))}
                addressTypeLabel="Postal Address"
            />,
        4: <DeclarationDetailsPage 
                datedThe={formDetails.datedThe}
                setDatedThe={(date) => setFormDetails(prev => ({...prev, datedThe: date}))}
                chiefOfficerName={formDetails.chiefOfficerName}
                setChiefOfficerName={(name) => setFormDetails(prev => ({...prev, chiefOfficerName: name}))}
            />,
        5: <Form4ReviewPage details={formDetails} />,
        6: <Form4GenerateConfirmationPage />,
    };

    const renderCurrentPageContent = () => {
         if (isFinalStep) {
            return <Form4SubmissionSuccessPage webhookSuccessMessage={webhookSuccessMessage} onGoHome={onGoHome} driveFolderUrl={FORM4_DRIVE_FOLDER_URL} />;
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
                        {isSendingToWebhook ? "Sending..." : isGeneratePage ? "Generate Form 4" : isReviewPage ? "Proceed to Generate" : "Next"}
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
export default Form4Wizard;
