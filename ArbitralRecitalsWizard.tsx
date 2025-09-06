
import React, { useState, FC, ChangeEvent, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, CheckCircle as CheckCircleIcon, ChevronRight, ChevronLeft, Loader2, AlertTriangle, Send as SendIconLucide, Eye,
    Gavel as GavelIcon, UserCircle2, Users2, FileText as FileTextIcon, CalendarDays, ShieldQuestion, Landmark, AlignLeft, Settings2
} from 'lucide-react';

import { PartyDetails, DisputeDetails, ArbitratorAppointment, PreliminaryMatters, HearingDetails, WizardProps, PageConfigItem } from './types';
import { questionVariants } from './constants';
import { Button, Input, Textarea, Label, FormField, TextAreaField, DetailItem, Select, SelectTrigger, SelectContentWrapper, SelectItem } from './components';

// Constants specific to this wizard
const ARBITRAL_RECITAL_WEBHOOK_URL = process.env.ARBITRAL_RECITAL_WEBHOOK_URL || "https://hook.eu1.make.com/lswiqh7zs9z59qxrjuye2q31l1nxmu7d";
const ARBITRAL_RECITALS_DRIVE_FOLDER_URL = process.env.ARBITRAL_RECITALS_DRIVE_FOLDER_URL || "https://drive.google.com/drive/folders/1Z5_JDMJqKge42ufyThwdJ03lFNOFmD5S?usp=drive_link";

const arbitralRecitalsPageConfig: PageConfigItem[] = [
    { title: "Claimant & Advocate Details", icon: <UserCircle2 className="h-6 w-6" />, desc: "Enter the Claimant's and their Advocate's information." },
    { title: "Respondent & Advocate Details", icon: <UserCircle2 className="h-6 w-6" />, desc: "Enter the Respondent's and their Advocate's information." },
    { title: "Dispute Details", icon: <FileTextIcon className="h-6 w-6" />, desc: "Provide an overview of the dispute and the arbitration agreement." },
    { title: "Arbitrator Appointment", icon: <GavelIcon className="h-6 w-6" />, desc: "Detail the arbitrator's appointment process." },
    { title: "Preliminary Matters & Pleadings", icon: <AlignLeft className="h-6 w-6" />, desc: "Record details of the preliminary meeting and filed documents." },
    { title: "Hearing & Submissions", icon: <CalendarDays className="h-6 w-6" />, desc: "Document hearing details and submission dates." },
    { title: "Review Details", icon: <ShieldQuestion className="h-6 w-6" />, desc: "Review all entered information before generating the document." },
    { title: "Generate Recital", icon: <SendIconLucide className="h-6 w-6" />, desc: "Submit the information to generate the Arbitral Award Recital." },
];

// --- Page Specific Components ---

interface PartyDetailsPageProps {
  details: PartyDetails;
  setDetails: Dispatch<SetStateAction<PartyDetails>>;
  partyType: 'Claimant' | 'Respondent';
}

const PartyDetailsPage: FC<PartyDetailsPageProps> = ({ details, setDetails, partyType }) => {
  const handleChange = (field: keyof PartyDetails) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDetails(prev => ({ ...prev, [field]: e.target.value as PartyDetails[keyof PartyDetails] }));
  };
  return (
    // @ts-ignore TypeScript is not correctly recognizing framer-motion animation props here.
    <motion.div variants={questionVariants} className="space-y-4 md:space-y-5">
        <FormField id={`${partyType.toLowerCase()}Name`} label={`${partyType} Full Name`} value={details.name} onChange={handleChange('name')} required />
        <FormField id={`${partyType.toLowerCase()}AdvocateFirm`} label={`${partyType}'s Advocate Firm`} value={details.advocateFirm} onChange={handleChange('advocateFirm')} required />
        <FormField id={`${partyType.toLowerCase()}AdvocatePhysicalAddress`} label="Advocate's Physical Address" value={details.advocatePhysicalAddress} onChange={handleChange('advocatePhysicalAddress')} />
        <FormField id={`${partyType.toLowerCase()}AdvocatePoBox`} label="Advocate's P.O. Box & Postal Code" value={details.advocatePoBox} onChange={handleChange('advocatePoBox')} required />
        <FormField id={`${partyType.toLowerCase()}AdvocateEmail`} label="Advocate's Primary Email" type="email" value={details.advocateEmail} onChange={handleChange('advocateEmail')} required />
        <FormField id={`${partyType.toLowerCase()}AdvocateSecondaryEmail`} label="Advocate's Secondary Email" type="email" value={details.advocateSecondaryEmail || ''} onChange={handleChange('advocateSecondaryEmail')} isOptional />
    </motion.div>
  );
};

interface DisputeDetailsPageProps {
  details: DisputeDetails;
  setDetails: Dispatch<SetStateAction<DisputeDetails>>;
}
const DisputeDetailsPage: FC<DisputeDetailsPageProps> = ({ details, setDetails }) => {
  const handleChange = (field: keyof DisputeDetails) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDetails(prev => ({ ...prev, [field]: e.target.value as DisputeDetails[keyof DisputeDetails] }));
  };
  return (
    // @ts-ignore TypeScript is not correctly recognizing framer-motion animation props here.
    <motion.div variants={questionVariants} className="space-y-4 md:space-y-5">
        <TextAreaField id="claimantOverview" label="Brief Overview from Claimant's Perspective" value={details.claimantOverview} onChange={handleChange('claimantOverview')} required />
        <TextAreaField id="respondentOverview" label="Brief Overview from Respondent's Perspective" value={details.respondentOverview} onChange={handleChange('respondentOverview')} required />
        <FormField id="arbitrationAgreementSource" label="Source of Arbitration Agreement (e.g., Clause X of Agreement dated Y)" value={details.arbitrationAgreementSource} onChange={handleChange('arbitrationAgreementSource')} required />
        <FormField id="agreementDate" label="Date of the main Agreement containing arbitration clause" type="date" value={details.agreementDate} onChange={handleChange('agreementDate')} required />
    </motion.div>
  );
};

interface ArbitratorAppointmentPageProps {
  details: ArbitratorAppointment;
  setDetails: Dispatch<SetStateAction<ArbitratorAppointment>>;
  arbitrationActDetails: string;
  setArbitrationActDetails: Dispatch<SetStateAction<string>>;
}
const ArbitratorAppointmentPage: FC<ArbitratorAppointmentPageProps> = ({ details, setDetails, arbitrationActDetails, setArbitrationActDetails }) => {
  const handleChange = (field: keyof ArbitratorAppointment) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDetails(prev => ({ ...prev, [field]: e.target.value as ArbitratorAppointment[keyof ArbitratorAppointment] }));
  };
  const handleSelectChange = (field: keyof ArbitratorAppointment) => (value: string | boolean) => {
    setDetails(prev => ({ ...prev, [field]: value as ArbitratorAppointment[keyof ArbitratorAppointment] }));
  };
  return (
    // @ts-ignore TypeScript is not correctly recognizing framer-motion animation props here.
    <motion.div variants={questionVariants} className="space-y-4 md:space-y-5">
        <div className="space-y-1.5">
            <Label htmlFor="appointingBody">Appointing Body</Label>
            <Select value={details.appointingBody} onValueChange={(val) => handleSelectChange('appointingBody')(val as 'CIArb' | 'LSK' | 'Other')}>
                <SelectTrigger id="appointingBody" placeholder="Select Appointing Body" />
                <SelectContentWrapper>
                    <SelectItem value="CIArb">Chartered Institute of Arbitrators (CIArb)</SelectItem>
                    <SelectItem value="LSK">Law Society of Kenya (LSK)</SelectItem>
                    <SelectItem value="Other">Other (Please specify)</SelectItem>
                </SelectContentWrapper>
            </Select>
        </div>
        {details.appointingBody === 'Other' && (
            <FormField id="otherAppointingBody" label="Specify Other Appointing Body" value={details.otherAppointingBody || ''} onChange={handleChange('otherAppointingBody')} required />
        )}
        <FormField id="nominationAcceptanceDate" label="Date Arbitrator Accepted Nomination" type="date" value={details.nominationAcceptanceDate} onChange={handleChange('nominationAcceptanceDate')} required />
        <FormField id="preliminaryMeetingDate" label="Date of Preliminary Meeting" type="date" value={details.preliminaryMeetingDate} onChange={handleChange('preliminaryMeetingDate')} required />
        <FormField id="preliminaryMeetingVenue" label="Venue of Preliminary Meeting" value={details.preliminaryMeetingVenue} onChange={handleChange('preliminaryMeetingVenue')} required />
        <TextAreaField id="arbitrationActDetails" label="Arbitration Act & Rules Citation" value={arbitrationActDetails} onChange={(e) => setArbitrationActDetails(e.target.value)} rows={3} placeholder="e.g., THE ARBITRATION ACT 1995..." />
    </motion.div>
  );
};

interface PreliminaryMattersPageProps {
  details: PreliminaryMatters;
  setDetails: Dispatch<SetStateAction<PreliminaryMatters>>;
}
const PreliminaryMattersPage: FC<PreliminaryMattersPageProps> = ({ details, setDetails }) => {
  const handleChange = (field: keyof PreliminaryMatters) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDetails(prev => ({ ...prev, [field]: e.target.value as PreliminaryMatters[keyof PreliminaryMatters] }));
  };
  return (
    // @ts-ignore TypeScript is not correctly recognizing framer-motion animation props here.
    <motion.div variants={questionVariants} className="space-y-4 md:space-y-5 grid md:grid-cols-2 gap-4 md:gap-5">
        <FormField id="claimantRepName" label="Claimant's Representative at Prelim. Meeting" value={details.claimantRepName} onChange={handleChange('claimantRepName')} required className="md:col-span-1"/>
        <FormField id="claimantRepFirm" label="Claimant Rep's Firm" value={details.claimantRepFirm} onChange={handleChange('claimantRepFirm')} className="md:col-span-1"/>
        <FormField id="respondentRepName" label="Respondent's Representative at Prelim. Meeting" value={details.respondentRepName} onChange={handleChange('respondentRepName')} required className="md:col-span-1"/>
        <FormField id="respondentRepFirm" label="Respondent Rep's Firm" value={details.respondentRepFirm} onChange={handleChange('respondentRepFirm')} className="md:col-span-1"/>
        <FormField id="proceduralRules" label="Procedural Rules Adopted" value={details.proceduralRules} onChange={handleChange('proceduralRules')} required className="md:col-span-2"/>
        <FormField id="dateSocFiled" label="Date Statement of Claim Filed" type="date" value={details.dateSocFiled || ''} onChange={handleChange('dateSocFiled')} isOptional className="md:col-span-1"/>
        <FormField id="dateSodFiled" label="Date Statement of Defence Filed" type="date" value={details.dateSodFiled || ''} onChange={handleChange('dateSodFiled')} isOptional className="md:col-span-1"/>
        <FormField id="dateReplyToDefenceFiled" label="Date Reply to Defence Filed" type="date" value={details.dateReplyToDefenceFiled || ''} onChange={handleChange('dateReplyToDefenceFiled')} isOptional className="md:col-span-1"/>
        <FormField id="dateResponseToDefenceCounterclaimFiled" label="Date Response to Defence & Counterclaim Filed" type="date" value={details.dateResponseToDefenceCounterclaimFiled || ''} onChange={handleChange('dateResponseToDefenceCounterclaimFiled')} isOptional className="md:col-span-1"/>
    </motion.div>
  );
};

interface HearingDetailsPageProps {
  details: HearingDetails;
  setDetails: Dispatch<SetStateAction<HearingDetails>>;
}
const HearingDetailsPage: FC<HearingDetailsPageProps> = ({ details, setDetails }) => {
  const handleChange = (field: keyof HearingDetails) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDetails(prev => ({ ...prev, [field]: e.target.value as HearingDetails[keyof HearingDetails] }));
  };
  const handleSelectChange = (field: keyof HearingDetails) => (value: string | boolean) => {
    setDetails(prev => ({ ...prev, [field]: value as HearingDetails[keyof HearingDetails] }));
  };
  return (
    // @ts-ignore TypeScript is not correctly recognizing framer-motion animation props here.
    <motion.div variants={questionVariants} className="space-y-4 md:space-y-5">
        <div className="space-y-1.5">
            <Label htmlFor="hearingConducted">Was a Hearing Conducted?</Label>
            <Select value={details.hearingConducted} onValueChange={(val) => handleSelectChange('hearingConducted')(val as 'yes' | 'no_docs_only')}>
                <SelectTrigger id="hearingConducted" placeholder="Select an option" />
                <SelectContentWrapper>
                    <SelectItem value="yes">Yes, hearing was conducted</SelectItem>
                    <SelectItem value="no_docs_only">No, matter determined on documents only</SelectItem>
                </SelectContentWrapper>
            </Select>
        </div>
        {details.hearingConducted === 'yes' && (
            <>
                <FormField id="hearingDate" label="Date of Hearing" type="date" value={details.hearingDate || ''} onChange={handleChange('hearingDate')} required />
                <FormField id="hearingVenue" label="Venue of Hearing" value={details.hearingVenue || ''} onChange={handleChange('hearingVenue')} required />
                <TextAreaField id="claimantWitnesses" label="Claimant's Witnesses (Names, one per line)" value={details.claimantWitnesses || ''} onChange={handleChange('claimantWitnesses')} isOptional />
                <TextAreaField id="respondentWitnesses" label="Respondent's Witnesses (Names, one per line)" value={details.respondentWitnesses || ''} onChange={handleChange('respondentWitnesses')} isOptional />
            </>
        )}
        <FormField id="dateClaimantSubmissionsFiled" label="Date Claimant's Submissions Filed" type="date" value={details.dateClaimantSubmissionsFiled || ''} onChange={handleChange('dateClaimantSubmissionsFiled')} isOptional />
        <FormField id="dateRespondentSubmissionsFiled" label="Date Respondent's Submissions Filed" type="date" value={details.dateRespondentSubmissionsFiled || ''} onChange={handleChange('dateRespondentSubmissionsFiled')} isOptional />
        <FormField id="dateFinalAwardAdvised" label="Date Parties Advised Final Award Would Issue" type="date" value={details.dateFinalAwardAdvised || ''} onChange={handleChange('dateFinalAwardAdvised')} isOptional />
        
        {/* New Fields */}
        <FormField id="dateListOfIssuesFiled" label="Date List of Issues Filed (if any)" type="date" value={details.dateListOfIssuesFiled || ''} onChange={handleChange('dateListOfIssuesFiled')} isOptional />
        <FormField id="dateClaimantInvoiceSettled" label="Date Claimant's Final Invoice Settled" type="date" value={details.dateClaimantInvoiceSettled || ''} onChange={handleChange('dateClaimantInvoiceSettled')} isOptional />
        <FormField id="dateRespondentInvoiceSettled" label="Date Respondent's Final Invoice Settled" type="date" value={details.dateRespondentInvoiceSettled || ''} onChange={handleChange('dateRespondentInvoiceSettled')} isOptional />
    </motion.div>
  );
};

interface ArbitralReviewPageProps {
  claimantDetails: PartyDetails;
  respondentDetails: PartyDetails;
  disputeDetails: DisputeDetails;
  arbitratorAppointment: ArbitratorAppointment;
  preliminaryMatters: PreliminaryMatters;
  hearingDetails: HearingDetails;
  arbitrationActDetails: string;
}
const ArbitralReviewPage: FC<ArbitralReviewPageProps> = (props) => {
  const { claimantDetails, respondentDetails, disputeDetails, arbitratorAppointment, preliminaryMatters, hearingDetails, arbitrationActDetails } = props;
  return (
    // @ts-ignore TypeScript is not correctly recognizing framer-motion animation props here.
    <motion.div variants={questionVariants} className="space-y-6 text-sm">
        <h4 className="text-md font-semibold text-gray-700 border-b pb-2">Claimant & Advocate:</h4>
        <DetailItem label="Claimant Name" value={claimantDetails.name} />
        <DetailItem label="Advocate Firm" value={claimantDetails.advocateFirm} />
        <DetailItem label="Advocate Address" value={claimantDetails.advocatePhysicalAddress} />
        <DetailItem label="Advocate P.O. Box" value={claimantDetails.advocatePoBox} />
        <DetailItem label="Advocate Email" value={claimantDetails.advocateEmail} />
        <DetailItem label="Advocate Secondary Email" value={claimantDetails.advocateSecondaryEmail} />

        <h4 className="text-md font-semibold text-gray-700 border-b pb-2 pt-3">Respondent & Advocate:</h4>
        <DetailItem label="Respondent Name" value={respondentDetails.name} />
        <DetailItem label="Advocate Firm" value={respondentDetails.advocateFirm} />
        <DetailItem label="Advocate Address" value={respondentDetails.advocatePhysicalAddress} />
        <DetailItem label="Advocate P.O. Box" value={respondentDetails.advocatePoBox} />
        <DetailItem label="Advocate Email" value={respondentDetails.advocateEmail} />
        <DetailItem label="Advocate Secondary Email" value={respondentDetails.advocateSecondaryEmail} />
        
        <h4 className="text-md font-semibold text-gray-700 border-b pb-2 pt-3">Dispute Details:</h4>
        <DetailItem label="Claimant Overview" value={disputeDetails.claimantOverview} />
        <DetailItem label="Respondent Overview" value={disputeDetails.respondentOverview} />
        <DetailItem label="Arbitration Agreement Source" value={disputeDetails.arbitrationAgreementSource} />
        <DetailItem label="Agreement Date" value={disputeDetails.agreementDate} />

        <h4 className="text-md font-semibold text-gray-700 border-b pb-2 pt-3">Arbitrator Appointment:</h4>
        <DetailItem label="Appointing Body" value={arbitratorAppointment.appointingBody === 'Other' ? arbitratorAppointment.otherAppointingBody : arbitratorAppointment.appointingBody} />
        <DetailItem label="Nomination Acceptance Date" value={arbitratorAppointment.nominationAcceptanceDate} />
        <DetailItem label="Preliminary Meeting Date" value={arbitratorAppointment.preliminaryMeetingDate} />
        <DetailItem label="Preliminary Meeting Venue" value={arbitratorAppointment.preliminaryMeetingVenue} />
        <DetailItem label="Act & Rules Citation" value={arbitrationActDetails} />

        <h4 className="text-md font-semibold text-gray-700 border-b pb-2 pt-3">Preliminary Matters:</h4>
        <DetailItem label="Claimant Rep." value={`${preliminaryMatters.claimantRepName}${preliminaryMatters.claimantRepFirm ? ` (${preliminaryMatters.claimantRepFirm})` : ''}`} />
        <DetailItem label="Respondent Rep." value={`${preliminaryMatters.respondentRepName}${preliminaryMatters.respondentRepFirm ? ` (${preliminaryMatters.respondentRepFirm})` : ''}`} />
        <DetailItem label="Procedural Rules" value={preliminaryMatters.proceduralRules} />
        <DetailItem label="SOC Filed" value={preliminaryMatters.dateSocFiled} />
        <DetailItem label="SOD Filed" value={preliminaryMatters.dateSodFiled} />
        <DetailItem label="Reply to Defence Filed" value={preliminaryMatters.dateReplyToDefenceFiled} />
        <DetailItem label="Response to Defence & CC Filed" value={preliminaryMatters.dateResponseToDefenceCounterclaimFiled} />

        <h4 className="text-md font-semibold text-gray-700 border-b pb-2 pt-3">Hearing & Submissions:</h4>
        <DetailItem label="Hearing Conducted" value={hearingDetails.hearingConducted === 'yes' ? 'Yes' : 'No, on documents only'} />
        {hearingDetails.hearingConducted === 'yes' && <>
            <DetailItem label="Hearing Date" value={hearingDetails.hearingDate} />
            <DetailItem label="Hearing Venue" value={hearingDetails.hearingVenue} />
            <DetailItem label="Claimant Witnesses" value={hearingDetails.claimantWitnesses} />
            <DetailItem label="Respondent Witnesses" value={hearingDetails.respondentWitnesses} />
        </>}
        <DetailItem label="Claimant Submissions Filed" value={hearingDetails.dateClaimantSubmissionsFiled} />
        <DetailItem label="Respondent Submissions Filed" value={hearingDetails.dateRespondentSubmissionsFiled} />
        <DetailItem label="Final Award Advised Date" value={hearingDetails.dateFinalAwardAdvised} />
        {/* New Review Items */}
        <DetailItem label="List of Issues Filed Date" value={hearingDetails.dateListOfIssuesFiled} />
        <DetailItem label="Claimant Invoice Settled Date" value={hearingDetails.dateClaimantInvoiceSettled} />
        <DetailItem label="Respondent Invoice Settled Date" value={hearingDetails.dateRespondentInvoiceSettled} />
    </motion.div>
  );
};

const ArbitralGenerateConfirmationPage: FC = () => (
    // @ts-ignore TypeScript is not correctly recognizing framer-motion animation props here.
    <motion.div
        key="generateArbitral"
        variants={questionVariants} initial="hidden" animate="visible" exit="exit"
        className="text-center py-10"
    >
        <SendIconLucide className="h-16 w-16 text-green-600 mx-auto mb-6 opacity-80" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Ready to Generate?</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
            All information has been entered. Click the button below to send the data to the webhook for document generation.
        </p>
    </motion.div>
);

interface ArbitralSubmissionSuccessPageProps {
  webhookSuccessMessage: string | null;
  onGoHome: () => void;
  driveFolderUrl: string;
}
const ArbitralSubmissionSuccessPage: FC<ArbitralSubmissionSuccessPageProps> = ({ webhookSuccessMessage, onGoHome, driveFolderUrl }) => (
    // @ts-ignore TypeScript is not correctly recognizing framer-motion animation props here.
    <motion.div
        key="finalStepArbitral"
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
const validateClaimantDetailsPage = (details: PartyDetails): string | null => {
    if (!details.name.trim() || !details.advocateFirm.trim() || !details.advocatePoBox.trim() || !details.advocateEmail.trim()) {
        return "Please fill all required Claimant and Advocate details.";
    }
    return null;
};

const validateRespondentDetailsPage = (details: PartyDetails): string | null => {
    if (!details.name.trim() || !details.advocateFirm.trim() || !details.advocatePoBox.trim() || !details.advocateEmail.trim()) {
        return "Please fill all required Respondent and Advocate details.";
    }
    return null;
};

const validateDisputeDetailsPage = (details: DisputeDetails): string | null => {
    if (!details.claimantOverview.trim() || !details.respondentOverview.trim() || !details.arbitrationAgreementSource.trim() || !details.agreementDate) {
        return "Please fill all fields for Dispute Details.";
    }
    return null;
};

const validateArbitratorAppointmentPage = (details: ArbitratorAppointment): string | null => {
    if ((details.appointingBody === 'Other' && !details.otherAppointingBody?.trim()) || !details.nominationAcceptanceDate || !details.preliminaryMeetingDate || !details.preliminaryMeetingVenue.trim()) {
        return "Please fill all fields for Arbitrator Appointment.";
    }
    return null;
};

const validatePreliminaryMattersPage = (details: PreliminaryMatters): string | null => {
    if (!details.claimantRepName.trim() || !details.respondentRepName.trim() || !details.proceduralRules.trim()) {
        return "Please fill all required fields for Preliminary Matters.";
    }
    return null;
};

const validateHearingDetailsPage = (details: HearingDetails): string | null => {
    if (details.hearingConducted === 'yes' && (!details.hearingDate || !details.hearingVenue?.trim())) {
        return "If hearing was conducted, please provide Date and Venue.";
    }
    // New fields are optional, so no specific validation added here unless required later.
    return null;
};

// --- Main Wizard Component ---
const ArbitralRecitalsWizard: FC<WizardProps> = ({ onGoHome, onSetInitialPageTitle }) => {
    const initialPartyState: PartyDetails = { name: '', advocateFirm: '', advocatePhysicalAddress: '', advocatePoBox: '', advocateEmail: '', advocateSecondaryEmail: '' };
    const [claimantDetails, setClaimantDetails] = useState<PartyDetails>(initialPartyState);
    const [respondentDetails, setRespondentDetails] = useState<PartyDetails>(initialPartyState);
    const initialDisputeState: DisputeDetails = { claimantOverview: '', respondentOverview: '', arbitrationAgreementSource: '', agreementDate: '' };
    const [disputeDetails, setDisputeDetails] = useState<DisputeDetails>(initialDisputeState);
    const initialArbitratorState: ArbitratorAppointment = { appointingBody: 'CIArb', otherAppointingBody: '', nominationAcceptanceDate: '', preliminaryMeetingDate: '', preliminaryMeetingVenue: 'Videoconference' };
    const [arbitratorAppointment, setArbitratorAppointment] = useState<ArbitratorAppointment>(initialArbitratorState);
    const initialPrelimMattersState: PreliminaryMatters = { claimantRepName: '', claimantRepFirm: '', respondentRepName: '', respondentRepFirm: '', proceduralRules: 'The Chartered Institute of Arbitrators (Kenya Branch), 2020', dateSocFiled: '', dateSodFiled: '', dateReplyToDefenceFiled: '', dateResponseToDefenceCounterclaimFiled: '' };
    const [preliminaryMatters, setPreliminaryMatters] = useState<PreliminaryMatters>(initialPrelimMattersState);
    const initialHearingState: HearingDetails = { 
        hearingConducted: 'yes', 
        hearingDate: '', 
        hearingVenue: 'Chartered Institute of Arbitrators (Kenya Branch)', 
        claimantWitnesses: '', 
        respondentWitnesses: '', 
        dateClaimantSubmissionsFiled: '', 
        dateRespondentSubmissionsFiled: '', 
        dateFinalAwardAdvised: '',
        dateListOfIssuesFiled: '', // Initialize new field
        dateClaimantInvoiceSettled: '', // Initialize new field
        dateRespondentInvoiceSettled: '' // Initialize new field
    };
    const [hearingDetails, setHearingDetails] = useState<HearingDetails>(initialHearingState);
    const [arbitrationActDetails, setArbitrationActDetails] = useState<string>("THE ARBITRATION ACT 1995 (AMENDED) [‘THE ACT’] AND THE RULES OF THE CHARTERED INSTITUTE OF ARBITRATORS (KENYA BRANCH), 2020");

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [isSendingToWebhook, setIsSendingToWebhook] = useState<boolean>(false);
    const [webhookSuccessMessage, setWebhookSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (onSetInitialPageTitle && arbitralRecitalsPageConfig[currentPage -1]) {
            const { title, desc, icon } = arbitralRecitalsPageConfig[currentPage - 1];
            onSetInitialPageTitle(title, desc, icon);
        }
    }, [currentPage, onSetInitialPageTitle]);
    
    const totalSteps = arbitralRecitalsPageConfig.length;
    const progressPercent = totalSteps > 0 ? Math.max(0, Math.min(100, ((currentPage - 1) / (totalSteps-1)) * 100)) : 0;
    
    const isReviewPage = currentPage === totalSteps - 1;
    const isGeneratePage = currentPage === totalSteps;
    const isFinalStep = webhookSuccessMessage !== null;

    const handleNext = () => {
        setSubmissionError(null);
        let error: string | null = null;

        if (currentPage === 1) error = validateClaimantDetailsPage(claimantDetails);
        else if (currentPage === 2) error = validateRespondentDetailsPage(respondentDetails);
        else if (currentPage === 3) error = validateDisputeDetailsPage(disputeDetails);
        else if (currentPage === 4) error = validateArbitratorAppointmentPage(arbitratorAppointment);
        else if (currentPage === 5) error = validatePreliminaryMattersPage(preliminaryMatters);
        else if (currentPage === 6) error = validateHearingDetailsPage(hearingDetails);

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
        const documentTypeName = "Arbitral Recital";
        const formData = { arbitrationActDetails, claimantDetails, respondentDetails, disputeDetails, arbitratorAppointment, preliminaryMatters, hearingDetails };

        if (!ARBITRAL_RECITAL_WEBHOOK_URL || ARBITRAL_RECITAL_WEBHOOK_URL.includes("YOUR_MAKE_COM_WEBHOOK_URL_HERE")) {
             setSubmissionError(`${documentTypeName} webhook URL is not configured. Please contact the administrator.`);
             return;
        }
        if (!ARBITRAL_RECITAL_WEBHOOK_URL.startsWith('https://hook.eu1.make.com/') && !ARBITRAL_RECITAL_WEBHOOK_URL.startsWith('https://hook.us1.make.com/')) {
            setSubmissionError("The configured Make.com Webhook URL appears to be invalid. Please contact the administrator.");
            return;
        }

        setIsSendingToWebhook(true); setSubmissionError(null); setWebhookSuccessMessage(null);

        try {
            const response = await fetch(ARBITRAL_RECITAL_WEBHOOK_URL, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ documentType: 'arbitralRecitals', formData }),
            });
            const responseText = await response.text();
            if (response.ok) {
                if (responseText.toLowerCase() === "accepted") {
                     setWebhookSuccessMessage(
                        `Your ${documentTypeName} data has been successfully submitted. The document will be generated and saved to Google Drive.
                        <br /><br />
                        <a href="${ARBITRAL_RECITALS_DRIVE_FOLDER_URL}" target="_blank" rel="noopener noreferrer" class="text-green-700 underline hover:text-green-800 font-semibold py-2 inline-block">
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
        1: <PartyDetailsPage details={claimantDetails} setDetails={setClaimantDetails} partyType="Claimant" />,
        2: <PartyDetailsPage details={respondentDetails} setDetails={setRespondentDetails} partyType="Respondent" />,
        3: <DisputeDetailsPage details={disputeDetails} setDetails={setDisputeDetails} />,
        4: <ArbitratorAppointmentPage details={arbitratorAppointment} setDetails={setArbitratorAppointment} arbitrationActDetails={arbitrationActDetails} setArbitrationActDetails={setArbitrationActDetails} />,
        5: <PreliminaryMattersPage details={preliminaryMatters} setDetails={setPreliminaryMatters} />,
        6: <HearingDetailsPage details={hearingDetails} setDetails={setHearingDetails} />,
        7: <ArbitralReviewPage claimantDetails={claimantDetails} respondentDetails={respondentDetails} disputeDetails={disputeDetails} arbitratorAppointment={arbitratorAppointment} preliminaryMatters={preliminaryMatters} hearingDetails={hearingDetails} arbitrationActDetails={arbitrationActDetails} />,
        8: <ArbitralGenerateConfirmationPage />,
    };

    const renderCurrentPageContent = () => {
        if (isFinalStep) {
             return <ArbitralSubmissionSuccessPage webhookSuccessMessage={webhookSuccessMessage} onGoHome={onGoHome} driveFolderUrl={ARBITRAL_RECITALS_DRIVE_FOLDER_URL} />;
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

export default ArbitralRecitalsWizard;