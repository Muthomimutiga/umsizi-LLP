import { ReactNode, FC } from 'react';

export type MainMenuSelection =
  | 'arbitralRecitals'
  | 'cr20'
  | 'companyIncorporation'
  | 'pbo'
  | 'companyRegistry'
  | 'societies'
  | 'boardEvaluation'
  | 'governanceAudits'
  | 'kipi'
  | 'minutes'
  | 'rfp'
  | 'pboChangeOfName'
  | 'form4';


export type DocumentType = MainMenuSelection | null;

// Generic Page Configuration for App Header
export interface PageConfigItem {
    title: string;
    icon: ReactNode;
    desc: string;
}

// --- Wizard Hook and Component Types ---

/**
 * Props that each individual step component (e.g., PartyDetailsPage) will receive.
 * TStepData: The type for this specific step's data slice.
 * TWizardFormData: The type for the entire wizard's form data.
 */
export interface StepComponentProps<TStepData, TWizardFormData> {
  data: TStepData;
  allFormData: TWizardFormData; // Access to all wizard data if needed for conditional logic in a step
  onDataChange: <K extends keyof TStepData>(field: K, value: TStepData[K]) => void;
  setStepError?: (error: string | null) => void; // For step-specific async/complex validation
}

/**
 * Configuration for a single step in the wizard.
 * TStepData: The type for this specific step's data slice.
 * TWizardFormData: The type for the entire wizard's form data.
 */
export interface WizardStepConfig<TStepData, TWizardFormData> extends PageConfigItem {
  id: keyof TWizardFormData & string; // Unique ID for the step, must be a key in TWizardFormData
  component: FC<StepComponentProps<TStepData, TWizardFormData>>;
  validate?: (stepData: TStepData, allFormData: TWizardFormData) => string | null;
}

/**
 * Props for the useWizardStepper hook.
 * TWizardFormData: The type for the entire wizard's form data.
 */
export interface UseWizardStepperProps<TWizardFormData> {
  steps: WizardStepConfig<any, TWizardFormData>[]; // Array of step configurations
  initialFormData: TWizardFormData;
  webhookUrl: string;
  driveFolderUrl: string;
  documentTypeName: string;
  onGoHome: () => void;
  onSetPageConfig: (config: PageConfigItem) => void;
  makeWebhookPayload: (formData: TWizardFormData) => Record<string, any> | Promise<Record<string, any>>; // Updated to allow Promise
  generateConfirmationPageConfig: PageConfigItem;
  successPageStrings: {
    title: string;
    additionalInfo: string;
  };
  wizardKey: string; // A unique key for this wizard instance (e.g., "arbitralRecitals")
}

/**
 * Values returned by the useWizardStepper hook.
 * TWizardFormData: The type for the entire wizard's form data.
 */
export interface UseWizardStepperReturn<TWizardFormData> {
  currentStepIndex: number; // 0-based index for the `steps` array
  ActiveStepContentComponent: FC<StepComponentProps<any, TWizardFormData>> | null;
  formData: TWizardFormData;
  updateField: <TStepId extends keyof TWizardFormData, TFieldKey extends keyof TWizardFormData[TStepId]>(
    stepId: TStepId,
    field: TFieldKey,
    value: TWizardFormData[TStepId][TFieldKey]
  ) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  submitDataToWebhook: () => void;
  progressPercent: number;
  wizardError: string | null;
  setWizardError: (error: string | null) => void; // Added for components to set wizard-level errors
  isSubmitting: boolean;
  submissionSuccessMessageHtml: string | null;
  showGenerateConfirmationPage: boolean;
  isReviewStep: boolean;
  currentHeaderConfig: PageConfigItem; // The current config for the App header
}

// Props for generic Wizard components that will use the useWizardStepper hook
export interface WizardProps {
  onGoHome: () => void; // Function to navigate back to the main menu or previous manager screen
  onSetInitialPageTitle?: (title: string, description: string, icon?: ReactNode) => void; // To be deprecated if hook handles all header changes
  initialPreviousScreen?: DocumentType; // To track the manager screen before a wizard
}


// --- Manager Component Props ---
export interface ManagerProps {
  onGoHome: () => void;
  onSelectSubType: (subTypeKey: string, docTypeToSet?: MainMenuSelection, managerType?: MainMenuSelection, keyForComingSoon?: string) => void;
  selectedSubTypeKey: string | null;
  onSetPageConfig: (config: PageConfigItem) => void;
}


// --- Specific Form Data Types (Example: Arbitral Recitals) ---
export interface PartyDetails {
  name: string;
  advocateFirm: string;
  advocatePhysicalAddress: string;
  advocatePoBox: string;
  advocateEmail: string;
  advocateSecondaryEmail?: string;
}

export interface DisputeDetails {
  claimantOverview: string;
  respondentOverview: string;
  arbitrationAgreementSource: string;
  agreementDate: string;
}

export interface ArbitratorAppointment {
  appointingBody: 'CIArb' | 'LSK' | 'Other' | ''; // Added '' for initial empty state
  otherAppointingBody?: string;
  nominationAcceptanceDate: string;
  preliminaryMeetingDate: string;
  preliminaryMeetingVenue: string;
}

export interface PreliminaryMatters {
  claimantRepName: string;
  claimantRepFirm: string;
  respondentRepName: string;
  respondentRepFirm: string;
  proceduralRules: string;
  dateSocFiled?: string;
  dateSodFiled?: string;
  dateReplyToDefenceFiled?: string;
  dateResponseToDefenceCounterclaimFiled?: string;
}

export interface HearingDetails {
  hearingConducted: 'yes' | 'no_docs_only' | ''; // Added '' for initial empty state
  hearingDate?: string;
  hearingVenue?: string;
  claimantWitnesses?: string;
  respondentWitnesses?: string;
  dateClaimantSubmissionsFiled?: string;
  dateRespondentSubmissionsFiled?: string;
  dateFinalAwardAdvised?: string;
  dateListOfIssuesFiled?: string;
  dateClaimantInvoiceSettled?: string;
  dateRespondentInvoiceSettled?: string;
}

// Combined form data for Arbitral Recitals Wizard
export interface ArbitralRecitalsFormData {
  claimantDetails: PartyDetails;
  respondentDetails: PartyDetails;
  disputeDetails: DisputeDetails;
  arbitratorAppointment: ArbitratorAppointment;
  arbitrationActDetails: string; // Was separate, now part of the form data
  preliminaryMatters: PreliminaryMatters;
  hearingDetails: HearingDetails;
  // Add other step data keys here if they are managed by the wizard
}


// --- CR20 Form Types ---
export interface Allottee {
  id: string;
  allotteeFullName: string;
  allotteePostalAddress: string;
  allotteeNumberOfShares: string;
  allotteeClassOfShare: string;
}

export interface CR20FormDetails {
  companyName: string;
  companyNumber: string;
  sharesAllottedPayableInCash: string;
  nominalAmountOfSharesAllotted: string;
  amountPaidOrUnpaidOnEachShare: string;
  considerationForSharesOtherwiseThanInCash?: string;
  allottees: Allottee[];
  lodgedByName: string;
  lodgedByAddress: string;
  lodgedByCapacity: string;
  lodgedByDate: string;
}

// --- Company Incorporation Types ---
export interface ShareholderDetails {
    id: string;
    fullName: string;
    idPassportNo: string;
    nationality: string;
    occupation: string;
    poBox: string;
    postalCode: string;
    email: string;
    phone: string;
    numberOfShares: string;
    classOfShares: string;
}

export interface DirectorDetails {
    id: string;
    fullName: string;
    idPassportNo: string;
    nationality: string;
    occupation: string;
    residentialPlotNo: string;
    residentialStreetRoad: string;
    residentialTown: string;
    residentialCounty: string;
    poBox: string;
    postalCode: string;
    email: string;
    phone: string;
    consentToAct: 'Yes' | 'No';
}

export interface CompanySecretaryDetails {
    isApplicable: boolean;
    fullName: string;
    idPassportRegNo: string;
    poBox: string;
    postalCode: string;
    email: string;
    phone: string;
    practicingCertNo?: string;
}

export interface BeneficialOwnerDetails {
    id: string;
    fullName: string;
    idPassportNo: string;
    nationality: string;
    occupation: string;
    poBox: string;
    postalCode: string;
    email: string;
    phone: string;
    natureOfOwnership: string;
}

export interface CompanyIncorporationDetails {
    proposedCompanyName1: string;
    proposedCompanyName2: string;
    proposedCompanyName3: string;
    natureOfBusiness: string;
    regOfficePlotNo: string;
    regOfficeStreetRoad: string;
    regOfficeTown: string;
    regOfficeCounty: string;
    regOfficePoBox: string;
    regOfficePostalCode: string;
    regOfficeEmail: string;
    regOfficePhone: string;
    nominalShareCapitalAmount: string;
    nominalShareCapitalCurrency: string;
    valuePerShareAmount: string;
    valuePerShareCurrency: string;
    shareholders: ShareholderDetails[];
    directors: DirectorDetails[];
    companySecretary: CompanySecretaryDetails;
    hasBeneficialOwners: boolean;
    beneficialOwners: BeneficialOwnerDetails[];
    contactPersonName: string;
    contactPersonEmail: string;
    contactPersonPhone: string;
}

// --- PBO Change of Name Types ---
export interface RegisteredOfficial {
  id: string;
  name: string;
  designation: string;
}

export interface PBOChangeOfNameFormDetails {
  organizationCurrentName: string;
  organizationNewName: string;
  resolutionNumber: string;
  meetingDate: string; // YYYY-MM-DD
  registeredOfficials: RegisteredOfficial[];
  lodgingDate: string; // YYYY-MM-DD
}

// --- Form 4 - Notification of Registered Office or Contact Address ---
export interface Form4Details {
  organizationName: string;

  registeredOfficeOption: 'willHave' | 'hasChanged';
  registeredOfficeAt?: string;
  registeredOfficeFrom?: string;
  registeredOfficeTo?: string;

  postalAddressOption: 'willHave' | 'hasChanged';
  postalAddressAt?: string;
  postalAddressFrom?: string;
  postalAddressTo?: string;

  datedThe: string; // YYYY-MM-DD
  chiefOfficerName: string;
}

// --- NEW Minutes AI Dashboard Types ---
export interface Company {
  id: string; // Airtable Record ID
  name: string;
}

export interface BoardMember {
  id: string;
  name: string;
  companyId: string[]; // Can be linked to multiple companies
}

export interface Meeting {
  id: string; // Airtable Record ID
  companyId: string;
  title: string;
  date: string; // YYYY-MM-DD format
  attendees: string[]; // array of BoardMember names
  noticeUrl?: string;
  agendaParsed: boolean;
  status: 'Scheduled' | 'Generating' | 'Completed';
  finalMinutesUrl?: string;
}

export interface AgendaItem {
  id: string; // Airtable Record ID
  meetingId: string;
  itemNumber: string;
  title: string;
  sourceFileUrls: { name: string, url: string }[];
  aiStatus: 'Idle' | 'Processing' | 'Draft Ready' | 'Approved';
  draftContent: string;
}


// Helper type for list keys in CompanyIncorporationDetails
export type CompanyIncorporationListKey = {
    [P in keyof CompanyIncorporationDetails]: CompanyIncorporationDetails[P] extends Array<infer Item>
        ? Item extends { id: string }
            ? P
            : never
        : never;
}[keyof CompanyIncorporationDetails];


export interface SubTypeInfo {
    key: string;
    title: string;
    icon: React.ReactNode;
    docTypeToSet?: MainMenuSelection;
    isManager?: boolean;
    managerType?: MainMenuSelection;
    keyForComingSoon?: string;
}
