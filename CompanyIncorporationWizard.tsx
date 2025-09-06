
import React, { useState, FC, ChangeEvent, Dispatch, SetStateAction, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, CheckCircle as CheckCircleIcon, ChevronRight, ChevronLeft, Loader2, AlertTriangle, Send as SendIconLucide, Eye,
    FilePlus2, Building, Users2, UserCog, BookLock, Handshake, FileCheck, DollarSign, Contact2, PlusCircle, Trash2
} from 'lucide-react';

import {
    CompanyIncorporationDetails, ShareholderDetails, DirectorDetails, CompanySecretaryDetails, BeneficialOwnerDetails,
    WizardProps, PageConfigItem, CompanyIncorporationListKey, DocumentType
} from './types';
import { questionVariants } from './constants';
import { Button, Input, Textarea, Label, FormField, TextAreaField, DetailItem, Select, SelectTrigger, SelectContentWrapper, SelectItem } from './components';

// Constants specific to this wizard
const COMPANY_INCORPORATION_WEBHOOK_URL = process.env.COMPANY_INCORPORATION_WEBHOOK_URL || "YOUR_MAKE_COM_WEBHOOK_URL_HERE_CO_INC";
const COMPANY_INCORPORATION_DRIVE_FOLDER_URL = process.env.COMPANY_INCORPORATION_DRIVE_FOLDER_URL || "YOUR_GOOGLE_DRIVE_FOLDER_URL_HERE";

const companyIncorporationPageConfig: PageConfigItem[] = [
    { title: "Proposed Company Details", icon: <Building className="h-6 w-6" />, desc: "Enter the proposed company names and registered office details." },
    { title: "Share Capital Structure", icon: <DollarSign className="h-6 w-6" />, desc: "Define the nominal share capital and value per share." },
    { title: "Shareholder Information", icon: <Users2 className="h-6 w-6" />, desc: "Provide details for each initial shareholder." },
    { title: "Director Information", icon: <UserCog className="h-6 w-6" />, desc: "Provide details for each initial director." },
    { title: "Company Secretary (Optional)", icon: <BookLock className="h-6 w-6" />, desc: "Appoint a company secretary if applicable." },
    { title: "Beneficial Owner(s) (Optional)", icon: <Handshake className="h-6 w-6" />, desc: "Declare beneficial owners if applicable." },
    { title: "Contact Person Details", icon: <Contact2 className="h-6 w-6" />, desc: "Details of the primary contact for this incorporation." },
    { title: "Review Incorporation Data", icon: <FileCheck className="h-6 w-6" />, desc: "Review all entered information before submission." },
    { title: "Submit for Incorporation", icon: <SendIconLucide className="h-6 w-6" />, desc: "Send the data to generate incorporation documents." },
];

// --- Page Specific Components ---

interface ProposedCompanyDetailsPageProps {
  details: Pick<CompanyIncorporationDetails, 'proposedCompanyName1' | 'proposedCompanyName2' | 'proposedCompanyName3' | 'natureOfBusiness' | 'regOfficePlotNo' | 'regOfficeStreetRoad' | 'regOfficeTown' | 'regOfficeCounty' | 'regOfficePoBox' | 'regOfficePostalCode' | 'regOfficeEmail' | 'regOfficePhone'>;
  setDetails: Dispatch<SetStateAction<CompanyIncorporationDetails>>;
}
const ProposedCompanyDetailsPage: FC<ProposedCompanyDetailsPageProps> = ({ details, setDetails }) => {
  const handleChange = (field: keyof ProposedCompanyDetailsPageProps['details']) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDetails(prev => ({ ...prev, [field]: e.target.value }));
  };
  return (
    <motion.div variants={questionVariants} className="space-y-4 md:space-y-5">
        <FormField id="proposedCompanyName1" label="Proposed Company Name 1" value={details.proposedCompanyName1} onChange={handleChange('proposedCompanyName1')} required />
        <FormField id="proposedCompanyName2" label="Proposed Company Name 2" value={details.proposedCompanyName2} onChange={handleChange('proposedCompanyName2')} isOptional />
        <FormField id="proposedCompanyName3" label="Proposed Company Name 3" value={details.proposedCompanyName3} onChange={handleChange('proposedCompanyName3')} isOptional />
        <TextAreaField id="natureOfBusiness" label="Nature of Business / Principal Activity" value={details.natureOfBusiness} onChange={handleChange('natureOfBusiness')} required />
        <h4 className="text-md font-semibold text-gray-700 pt-2 border-b pb-1">Registered Office Address:</h4>
        <div className="grid md:grid-cols-2 gap-4">
            <FormField id="regOfficePlotNo" label="Plot No./LR No." value={details.regOfficePlotNo} onChange={handleChange('regOfficePlotNo')} required />
            <FormField id="regOfficeStreetRoad" label="Street/Road" value={details.regOfficeStreetRoad} onChange={handleChange('regOfficeStreetRoad')} required />
            <FormField id="regOfficeTown" label="Town" value={details.regOfficeTown} onChange={handleChange('regOfficeTown')} required />
            <FormField id="regOfficeCounty" label="County" value={details.regOfficeCounty} onChange={handleChange('regOfficeCounty')} required />
            <FormField id="regOfficePoBox" label="P.O. Box" value={details.regOfficePoBox} onChange={handleChange('regOfficePoBox')} required />
            <FormField id="regOfficePostalCode" label="Postal Code" value={details.regOfficePostalCode} onChange={handleChange('regOfficePostalCode')} required />
            <FormField id="regOfficeEmail" label="Email Address" type="email" value={details.regOfficeEmail} onChange={handleChange('regOfficeEmail')} required className="md:col-span-1"/>
            <FormField id="regOfficePhone" label="Phone Number" type="tel" value={details.regOfficePhone} onChange={handleChange('regOfficePhone')} required className="md:col-span-1"/>
        </div>
    </motion.div>
  );
};

interface ShareCapitalPageProps {
  details: Pick<CompanyIncorporationDetails, 'nominalShareCapitalAmount' | 'nominalShareCapitalCurrency' | 'valuePerShareAmount' | 'valuePerShareCurrency'>;
  setDetails: Dispatch<SetStateAction<CompanyIncorporationDetails>>;
}
const ShareCapitalPage: FC<ShareCapitalPageProps> = ({ details, setDetails }) => {
  const handleChange = (field: 'nominalShareCapitalAmount' | 'valuePerShareAmount') => (e: ChangeEvent<HTMLInputElement>) => {
    setDetails(prev => ({ ...prev, [field]: e.target.value }));
  };
  const handleSelectChange = (field: 'nominalShareCapitalCurrency' | 'valuePerShareCurrency') => (value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };
  return (
    <motion.div variants={questionVariants} className="space-y-4 md:space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
            <FormField id="nominalShareCapitalAmount" label="Nominal Share Capital Amount" type="number" value={details.nominalShareCapitalAmount} onChange={handleChange('nominalShareCapitalAmount')} required />
            <div className="space-y-1.5">
                <Label htmlFor="nominalShareCapitalCurrency">Currency</Label>
                <Select value={details.nominalShareCapitalCurrency} onValueChange={handleSelectChange('nominalShareCapitalCurrency')}>
                    <SelectTrigger id="nominalShareCapitalCurrency" />
                    <SelectContentWrapper>
                        <SelectItem value="KES">KES (Kenyan Shilling)</SelectItem>
                        <SelectItem value="USD">USD (US Dollar)</SelectItem>
                        <SelectItem value="EUR">EUR (Euro)</SelectItem>
                        <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                    </SelectContentWrapper>
                </Select>
            </div>
        </div>
            <div className="grid md:grid-cols-2 gap-4">
            <FormField id="valuePerShareAmount" label="Value Per Share Amount" type="number" value={details.valuePerShareAmount} onChange={handleChange('valuePerShareAmount')} required />
            <div className="space-y-1.5">
                <Label htmlFor="valuePerShareCurrency">Currency</Label>
                <Select value={details.valuePerShareCurrency} onValueChange={handleSelectChange('valuePerShareCurrency')}>
                    <SelectTrigger id="valuePerShareCurrency" />
                    <SelectContentWrapper>
                        <SelectItem value="KES">KES (Kenyan Shilling)</SelectItem>
                        <SelectItem value="USD">USD (US Dollar)</SelectItem>
                        <SelectItem value="EUR">EUR (Euro)</SelectItem>
                        <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                    </SelectContentWrapper>
                </Select>
            </div>
        </div>
    </motion.div>
  );
};

interface ShareholderListPageProps {
  shareholders: ShareholderDetails[];
  onNestedChange: (listName: 'shareholders', index: number, field: keyof ShareholderDetails, value: any) => void;
  onAddItem: (listName: 'shareholders', template: ShareholderDetails) => void;
  onRemoveItem: (listName: 'shareholders', index: number, minItems?: number) => void;
  initialShareholder: ShareholderDetails;
}
const ShareholderListPage: FC<ShareholderListPageProps> = ({ shareholders, onNestedChange, onAddItem, onRemoveItem, initialShareholder }) => (
    <motion.div variants={questionVariants} className="space-y-6">
        {shareholders.map((sh, index) => (
            <div key={sh.id} className="p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50/50">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-md text-gray-700">Shareholder {index + 1}</h4>
                    {shareholders.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => onRemoveItem('shareholders', index, 1)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1">
                            <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                    )}
                </div>
                <div className="space-y-3 grid md:grid-cols-2 gap-x-4 gap-y-3">
                    <FormField id={`sh_fullName_${index}`} label="Full Name" value={sh.fullName} onChange={(e) => onNestedChange('shareholders',index, 'fullName', e.target.value)} required className="md:col-span-2"/>
                    <FormField id={`sh_idPassportNo_${index}`} label="ID/Passport No." value={sh.idPassportNo} onChange={(e) => onNestedChange('shareholders',index, 'idPassportNo', e.target.value)} required />
                    <FormField id={`sh_nationality_${index}`} label="Nationality" value={sh.nationality} onChange={(e) => onNestedChange('shareholders',index, 'nationality', e.target.value)} required />
                    <FormField id={`sh_occupation_${index}`} label="Occupation" value={sh.occupation} onChange={(e) => onNestedChange('shareholders',index, 'occupation', e.target.value)} required />
                    <FormField id={`sh_poBox_${index}`} label="P.O. Box" value={sh.poBox} onChange={(e) => onNestedChange('shareholders',index, 'poBox', e.target.value)} required />
                    <FormField id={`sh_postalCode_${index}`} label="Postal Code" value={sh.postalCode} onChange={(e) => onNestedChange('shareholders',index, 'postalCode', e.target.value)} required />
                    <FormField id={`sh_email_${index}`} label="Email" type="email" value={sh.email} onChange={(e) => onNestedChange('shareholders',index, 'email', e.target.value)} required />
                    <FormField id={`sh_phone_${index}`} label="Phone Number" type="tel" value={sh.phone} onChange={(e) => onNestedChange('shareholders',index, 'phone', e.target.value)} required />
                    <FormField id={`sh_numberOfShares_${index}`} label="Number of Shares" type="number" value={sh.numberOfShares} onChange={(e) => onNestedChange('shareholders',index, 'numberOfShares', e.target.value)} required />
                    <div className="space-y-1.5">
                        <Label htmlFor={`sh_classOfShares_${index}`}>Class of Shares</Label>
                        <Select value={sh.classOfShares} onValueChange={(val) => onNestedChange('shareholders',index, 'classOfShares', val)}>
                            <SelectTrigger id={`sh_classOfShares_${index}`} />
                            <SelectContentWrapper>
                                <SelectItem value="Ordinary">Ordinary</SelectItem>
                                <SelectItem value="Preference">Preference</SelectItem>
                            </SelectContentWrapper>
                        </Select>
                    </div>
                </div>
            </div>
        ))}
            <Button type="button" variant="outline" onClick={() => onAddItem('shareholders', initialShareholder)} className="mt-3 text-green-600 border-green-500 hover:bg-green-50">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Shareholder
        </Button>
    </motion.div>
);

interface DirectorListPageProps {
  directors: DirectorDetails[];
  onNestedChange: (listName: 'directors', index: number, field: keyof DirectorDetails, value: any) => void;
  onAddItem: (listName: 'directors', template: DirectorDetails) => void;
  onRemoveItem: (listName: 'directors', index: number, minItems?: number) => void;
  initialDirector: DirectorDetails;
}
const DirectorListPage: FC<DirectorListPageProps> = ({ directors, onNestedChange, onAddItem, onRemoveItem, initialDirector }) => (
    <motion.div variants={questionVariants} className="space-y-6">
        {directors.map((dir, index) => (
            <div key={dir.id} className="p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50/50">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-md text-gray-700">Director {index + 1}</h4>
                    {directors.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => onRemoveItem('directors', index, 1)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1">
                            <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                    )}
                </div>
                <div className="space-y-3 grid md:grid-cols-2 gap-x-4 gap-y-3">
                    <FormField id={`dir_fullName_${index}`} label="Full Name" value={dir.fullName} onChange={(e) => onNestedChange('directors', index, 'fullName', e.target.value)} required className="md:col-span-2"/>
                    <FormField id={`dir_idPassportNo_${index}`} label="ID/Passport No." value={dir.idPassportNo} onChange={(e) => onNestedChange('directors', index, 'idPassportNo', e.target.value)} required />
                    <FormField id={`dir_nationality_${index}`} label="Nationality" value={dir.nationality} onChange={(e) => onNestedChange('directors', index, 'nationality', e.target.value)} required />
                    <FormField id={`dir_occupation_${index}`} label="Occupation" value={dir.occupation} onChange={(e) => onNestedChange('directors', index, 'occupation', e.target.value)} required />
                    <FormField id={`dir_residentialPlotNo_${index}`} label="Residential Plot No." value={dir.residentialPlotNo} onChange={(e) => onNestedChange('directors', index, 'residentialPlotNo', e.target.value)} required />
                    <FormField id={`dir_residentialStreetRoad_${index}`} label="Residential Street/Road" value={dir.residentialStreetRoad} onChange={(e) => onNestedChange('directors', index, 'residentialStreetRoad', e.target.value)} required />
                    <FormField id={`dir_residentialTown_${index}`} label="Residential Town" value={dir.residentialTown} onChange={(e) => onNestedChange('directors', index, 'residentialTown', e.target.value)} required />
                    <FormField id={`dir_residentialCounty_${index}`} label="Residential County" value={dir.residentialCounty} onChange={(e) => onNestedChange('directors', index, 'residentialCounty', e.target.value)} required />
                    <FormField id={`dir_poBox_${index}`} label="P.O. Box" value={dir.poBox} onChange={(e) => onNestedChange('directors', index, 'poBox', e.target.value)} required />
                    <FormField id={`dir_postalCode_${index}`} label="Postal Code" value={dir.postalCode} onChange={(e) => onNestedChange('directors', index, 'postalCode', e.target.value)} required />
                    <FormField id={`dir_email_${index}`} label="Email" type="email" value={dir.email} onChange={(e) => onNestedChange('directors', index, 'email', e.target.value)} required />
                    <FormField id={`dir_phone_${index}`} label="Phone Number" type="tel" value={dir.phone} onChange={(e) => onNestedChange('directors', index, 'phone', e.target.value)} required />
                    <div className="space-y-1.5 md:col-span-2">
                        <Label htmlFor={`dir_consentToAct_${index}`}>Consent to Act as Director</Label>
                        <Select value={dir.consentToAct} onValueChange={(val) => onNestedChange('directors', index, 'consentToAct', val as 'Yes' | 'No')}>
                            <SelectTrigger id={`dir_consentToAct_${index}`} />
                            <SelectContentWrapper>
                                <SelectItem value="Yes">Yes</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                            </SelectContentWrapper>
                        </Select>
                    </div>
                </div>
            </div>
        ))}
            <Button type="button" variant="outline" onClick={() => onAddItem('directors', initialDirector)} className="mt-3 text-green-600 border-green-500 hover:bg-green-50">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Director
        </Button>
    </motion.div>
);

interface CompanySecretaryPageProps {
  companySecretary: CompanySecretaryDetails;
  onFieldChange: <F extends keyof CompanySecretaryDetails>(field: F, value: CompanySecretaryDetails[F]) => void;
}
const CompanySecretaryPage: FC<CompanySecretaryPageProps> = ({ companySecretary, onFieldChange }) => (
    <motion.div variants={questionVariants} className="space-y-4 md:space-y-5">
        <div className="flex items-center space-x-2 mb-4">
            <Input type="checkbox" id="isCompanySecretaryApplicable" checked={companySecretary.isApplicable} onChange={(e) => onFieldChange('isApplicable', e.target.checked)} className="h-5 w-5 rounded text-green-600 focus:ring-green-500 border-gray-300 shadow-sm" />
            <Label htmlFor="isCompanySecretaryApplicable" className="text-base">Appoint a Company Secretary?</Label>
        </div>
        {companySecretary.isApplicable && (
            <div className="space-y-3 grid md:grid-cols-2 gap-x-4 gap-y-3 p-4 border rounded-md bg-gray-50/30">
                <FormField id="cs_fullName" label="Full Name" value={companySecretary.fullName} onChange={(e) => onFieldChange('fullName', e.target.value)} required className="md:col-span-2"/>
                <FormField id="cs_idPassportRegNo" label="ID/Passport/Reg. No." value={companySecretary.idPassportRegNo} onChange={(e) => onFieldChange('idPassportRegNo', e.target.value)} required />
                <FormField id="cs_poBox" label="P.O. Box" value={companySecretary.poBox} onChange={(e) => onFieldChange('poBox', e.target.value)} required />
                <FormField id="cs_postalCode" label="Postal Code" value={companySecretary.postalCode} onChange={(e) => onFieldChange('postalCode', e.target.value)} required />
                <FormField id="cs_email" label="Email" type="email" value={companySecretary.email} onChange={(e) => onFieldChange('email', e.target.value)} required />
                <FormField id="cs_phone" label="Phone Number" type="tel" value={companySecretary.phone} onChange={(e) => onFieldChange('phone', e.target.value)} required />
                <FormField id="cs_practicingCertNo" label="Practicing Cert. No. (if applicable)" value={companySecretary.practicingCertNo || ''} onChange={(e) => onFieldChange('practicingCertNo', e.target.value)} isOptional />
            </div>
        )}
    </motion.div>
);

interface BeneficialOwnerListPageProps {
  beneficialOwners: BeneficialOwnerDetails[];
  hasBeneficialOwners: boolean;
  onHasBeneficialOwnersChange: (value: boolean) => void;
  onNestedChange: (listName: 'beneficialOwners', index: number, field: keyof BeneficialOwnerDetails, value: any) => void;
  onAddItem: (listName: 'beneficialOwners', template: BeneficialOwnerDetails) => void;
  onRemoveItem: (listName: 'beneficialOwners', index: number, minItems?: number) => void;
  initialBeneficialOwner: BeneficialOwnerDetails;
}
const BeneficialOwnerListPage: FC<BeneficialOwnerListPageProps> = ({ beneficialOwners, hasBeneficialOwners, onHasBeneficialOwnersChange, onNestedChange, onAddItem, onRemoveItem, initialBeneficialOwner }) => (
    <motion.div variants={questionVariants} className="space-y-6">
            <div className="flex items-center space-x-2 mb-1">
            <Input type="checkbox" id="hasBeneficialOwners" checked={hasBeneficialOwners} onChange={(e) => onHasBeneficialOwnersChange(e.target.checked)} className="h-5 w-5 rounded text-green-600 focus:ring-green-500 border-gray-300 shadow-sm" />
            <Label htmlFor="hasBeneficialOwners" className="text-base">Are there Beneficial Owners to declare?</Label>
        </div>
        {hasBeneficialOwners && beneficialOwners.map((bo, index) => (
            <div key={bo.id} className="p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50/50">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-md text-gray-700">Beneficial Owner {index + 1}</h4>
                    {beneficialOwners.length > 0 && ( // Ensure we can remove even if it's the last one when hasBeneficialOwners is true
                        <Button type="button" variant="ghost" size="sm" onClick={() => onRemoveItem('beneficialOwners', index, 0)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1">
                            <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                    )}
                </div>
                <div className="space-y-3 grid md:grid-cols-2 gap-x-4 gap-y-3">
                    <FormField id={`bo_fullName_${index}`} label="Full Name" value={bo.fullName} onChange={(e) => onNestedChange('beneficialOwners',index, 'fullName', e.target.value)} required className="md:col-span-2"/>
                    <FormField id={`bo_idPassportNo_${index}`} label="ID/Passport No." value={bo.idPassportNo} onChange={(e) => onNestedChange('beneficialOwners',index, 'idPassportNo', e.target.value)} required />
                    <FormField id={`bo_nationality_${index}`} label="Nationality" value={bo.nationality} onChange={(e) => onNestedChange('beneficialOwners',index, 'nationality', e.target.value)} required />
                    <FormField id={`bo_occupation_${index}`} label="Occupation" value={bo.occupation} onChange={(e) => onNestedChange('beneficialOwners',index, 'occupation', e.target.value)} required />
                    <FormField id={`bo_poBox_${index}`} label="P.O. Box" value={bo.poBox} onChange={(e) => onNestedChange('beneficialOwners',index, 'poBox', e.target.value)} required />
                    <FormField id={`bo_postalCode_${index}`} label="Postal Code" value={bo.postalCode} onChange={(e) => onNestedChange('beneficialOwners',index, 'postalCode', e.target.value)} required />
                    <FormField id={`bo_email_${index}`} label="Email" type="email" value={bo.email} onChange={(e) => onNestedChange('beneficialOwners',index, 'email', e.target.value)} required />
                    <FormField id={`bo_phone_${index}`} label="Phone Number" type="tel" value={bo.phone} onChange={(e) => onNestedChange('beneficialOwners',index, 'phone', e.target.value)} required />
                    <TextAreaField id={`bo_natureOfOwnership_${index}`} label="Nature of Ownership/Control" value={bo.natureOfOwnership} onChange={(e) => onNestedChange('beneficialOwners',index, 'natureOfOwnership', e.target.value)} required className="md:col-span-2" rows={2}/>
                </div>
            </div>
        ))}
        {hasBeneficialOwners &&
            <Button type="button" variant="outline" onClick={() => onAddItem('beneficialOwners', initialBeneficialOwner)} className="mt-3 text-green-600 border-green-500 hover:bg-green-50">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Beneficial Owner
            </Button>
        }
    </motion.div>
);

interface ContactPersonPageProps {
  details: Pick<CompanyIncorporationDetails, 'contactPersonName' | 'contactPersonEmail' | 'contactPersonPhone'>;
  setDetails: Dispatch<SetStateAction<CompanyIncorporationDetails>>;
}
const ContactPersonPage: FC<ContactPersonPageProps> = ({ details, setDetails }) => {
  const handleChange = (field: keyof ContactPersonPageProps['details']) => (e: ChangeEvent<HTMLInputElement>) => {
    setDetails(prev => ({ ...prev, [field]: e.target.value }));
  };
  return (
    <motion.div variants={questionVariants} className="space-y-4 md:space-y-5">
        <FormField id="contactPersonName" label="Contact Person Full Name" value={details.contactPersonName} onChange={handleChange('contactPersonName')} required />
        <FormField id="contactPersonEmail" label="Contact Person Email" type="email" value={details.contactPersonEmail} onChange={handleChange('contactPersonEmail')} required />
        <FormField id="contactPersonPhone" label="Contact Person Phone Number" type="tel" value={details.contactPersonPhone} onChange={handleChange('contactPersonPhone')} required />
    </motion.div>
  );
};

interface CompanyIncorporationReviewPageProps {
  details: CompanyIncorporationDetails;
}
const CompanyIncorporationReviewPage: FC<CompanyIncorporationReviewPageProps> = ({ details }) => (
    <motion.div variants={questionVariants} className="space-y-6 text-sm">
        <h4 className="text-md font-semibold text-gray-700 border-b pb-2">Proposed Company Details:</h4>
        <DetailItem label="Name 1" value={details.proposedCompanyName1} />
        <DetailItem label="Name 2" value={details.proposedCompanyName2} />
        <DetailItem label="Name 3" value={details.proposedCompanyName3} />
        <DetailItem label="Nature of Business" value={details.natureOfBusiness} />
        <p className="text-xs uppercase text-gray-500 font-semibold mt-2 mb-0.5">Registered Office:</p>
        <DetailItem label="Plot/LR No." value={details.regOfficePlotNo} />
        <DetailItem label="Street/Road" value={details.regOfficeStreetRoad} />
        <DetailItem label="Town" value={details.regOfficeTown} />
        <DetailItem label="County" value={details.regOfficeCounty} />
        <DetailItem label="P.O. Box" value={details.regOfficePoBox} />
        <DetailItem label="Postal Code" value={details.regOfficePostalCode} />
        <DetailItem label="Email" value={details.regOfficeEmail} />
        <DetailItem label="Phone" value={details.regOfficePhone} />

        <h4 className="text-md font-semibold text-gray-700 border-b pb-2 pt-3">Share Capital:</h4>
        <DetailItem label="Nominal Capital" value={`${details.nominalShareCapitalAmount} ${details.nominalShareCapitalCurrency}`} />
        <DetailItem label="Value Per Share" value={`${details.valuePerShareAmount} ${details.valuePerShareCurrency}`} />
        
        <h4 className="text-md font-semibold text-gray-700 border-b pb-2 pt-3">Shareholders:</h4>
        {details.shareholders.map((sh, i) => (
            <div key={sh.id} className="pl-3 border-l-2 border-green-200 mb-3 pb-2 last:mb-0 last:pb-0">
                <p className="text-xs uppercase text-green-600 font-semibold mb-1">Shareholder {i + 1}</p>
                <DetailItem label="Name" value={sh.fullName} />
                <DetailItem label="ID/Passport" value={sh.idPassportNo} />
                <DetailItem label="Nationality" value={sh.nationality} />
                <DetailItem label="Occupation" value={sh.occupation} />
                <DetailItem label="Address" value={`P.O. Box ${sh.poBox} - ${sh.postalCode}`} />
                <DetailItem label="Email" value={sh.email} />
                <DetailItem label="Phone" value={sh.phone} />
                <DetailItem label="Shares" value={`${sh.numberOfShares} (${sh.classOfShares})`} />
            </div>
        ))}

        <h4 className="text-md font-semibold text-gray-700 border-b pb-2 pt-3">Directors:</h4>
        {details.directors.map((dir, i) => (
            <div key={dir.id} className="pl-3 border-l-2 border-blue-200 mb-3 pb-2 last:mb-0 last:pb-0">
                <p className="text-xs uppercase text-blue-600 font-semibold mb-1">Director {i + 1}</p>
                <DetailItem label="Name" value={dir.fullName} />
                <DetailItem label="ID/Passport" value={dir.idPassportNo} />
                <DetailItem label="Nationality" value={dir.nationality} />
                <DetailItem label="Occupation" value={dir.occupation} />
                <p className="text-xs uppercase text-gray-500 font-semibold mt-2 mb-0.5">Residential Address:</p>
                <DetailItem label="Plot/Street/Town/County" value={`${dir.residentialPlotNo}, ${dir.residentialStreetRoad}, ${dir.residentialTown}, ${dir.residentialCounty}`} />
                <DetailItem label="Postal Address" value={`P.O. Box ${dir.poBox} - ${dir.postalCode}`} />
                <DetailItem label="Email" value={dir.email} />
                <DetailItem label="Phone" value={dir.phone} />
                <DetailItem label="Consent to Act" value={dir.consentToAct} />
            </div>
        ))}

        {details.companySecretary.isApplicable && <>
            <h4 className="text-md font-semibold text-gray-700 border-b pb-2 pt-3">Company Secretary:</h4>
            <DetailItem label="Name" value={details.companySecretary.fullName} />
            <DetailItem label="ID/Reg. No." value={details.companySecretary.idPassportRegNo} />
            <DetailItem label="Address" value={`P.O. Box ${details.companySecretary.poBox} - ${details.companySecretary.postalCode}`} />
            <DetailItem label="Email" value={details.companySecretary.email} />
            <DetailItem label="Phone" value={details.companySecretary.phone} />
            <DetailItem label="Practicing Cert." value={details.companySecretary.practicingCertNo} />
        </>}

        {details.hasBeneficialOwners && details.beneficialOwners.length > 0 && <>
            <h4 className="text-md font-semibold text-gray-700 border-b pb-2 pt-3">Beneficial Owners:</h4>
            {details.beneficialOwners.map((bo, i) => (
            <div key={bo.id} className="pl-3 border-l-2 border-purple-200 mb-3 pb-2 last:mb-0 last:pb-0">
                <p className="text-xs uppercase text-purple-600 font-semibold mb-1">Beneficial Owner {i + 1}</p>
                <DetailItem label="Name" value={bo.fullName} />
                <DetailItem label="ID/Passport" value={bo.idPassportNo} />
                <DetailItem label="Nationality" value={bo.nationality} />
                <DetailItem label="Occupation" value={bo.occupation} />
                <DetailItem label="Address" value={`P.O. Box ${bo.poBox} - ${bo.postalCode}`} />
                <DetailItem label="Email" value={bo.email} />
                <DetailItem label="Phone" value={bo.phone} />
                <DetailItem label="Nature of Ownership" value={bo.natureOfOwnership} />
            </div>
            ))}
        </>}

        <h4 className="text-md font-semibold text-gray-700 border-b pb-2 pt-3">Contact Person:</h4>
        <DetailItem label="Name" value={details.contactPersonName} />
        <DetailItem label="Email" value={details.contactPersonEmail} />
        <DetailItem label="Phone" value={details.contactPersonPhone} />
    </motion.div>
);

const CompanyIncorporationSubmitPage: FC = () => (
    <motion.div
        key="submitIncorporation"
        variants={questionVariants} initial="hidden" animate="visible" exit="exit"
        className="text-center py-10"
    >
        <SendIconLucide className="h-16 w-16 text-green-600 mx-auto mb-6 opacity-80" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Ready to Submit for Incorporation?</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
            All information has been entered. Click the button below to send the data to the webhook for company incorporation.
        </p>
    </motion.div>
);

interface CompanyIncorporationSuccessPageProps {
  webhookSuccessMessage: string | null;
  onGoHome: () => void;
  driveFolderUrl: string;
}
const CompanyIncorporationSuccessPage: FC<CompanyIncorporationSuccessPageProps> = ({ webhookSuccessMessage, onGoHome, driveFolderUrl }) => (
    <motion.div
        key="finalStepCoInc"
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
const validateProposedCompanyDetailsData = (
    details: Pick<CompanyIncorporationDetails, 'proposedCompanyName1' | 'natureOfBusiness' | 'regOfficePlotNo' | 'regOfficeStreetRoad' | 'regOfficeTown' | 'regOfficeCounty' | 'regOfficePoBox' | 'regOfficePostalCode' | 'regOfficeEmail' | 'regOfficePhone'>
): string | null => {
    if (!details.proposedCompanyName1.trim() || !details.natureOfBusiness.trim() || !details.regOfficePlotNo.trim() ||
        !details.regOfficeStreetRoad.trim() || !details.regOfficeTown.trim() || !details.regOfficeCounty.trim() ||
        !details.regOfficePoBox.trim() || !details.regOfficePostalCode.trim() || !details.regOfficeEmail.trim() ||
        !details.regOfficePhone.trim()) {
        return "Please fill all required Company Details fields.";
    }
    return null;
};

const validateShareCapitalData = (
    details: Pick<CompanyIncorporationDetails, 'nominalShareCapitalAmount' | 'valuePerShareAmount'>
): string | null => {
    if (!details.nominalShareCapitalAmount.trim() || !details.valuePerShareAmount.trim()) {
        return "Please fill all Share Capital fields.";
    }
    return null;
};

const validateShareholdersData = (shareholders: ShareholderDetails[]): string | null => {
    if (shareholders.length === 0) {
        return "Please add at least one shareholder.";
    }
    for (const sh of shareholders) {
        if (!sh.fullName.trim() || !sh.idPassportNo.trim() || !sh.nationality.trim() || !sh.occupation.trim() ||
            !sh.poBox.trim() || !sh.postalCode.trim() || !sh.email.trim() || !sh.phone.trim() ||
            !sh.numberOfShares.trim() || !sh.classOfShares.trim()) {
            return "Please fill all required fields for each shareholder.";
        }
    }
    return null;
};

const validateDirectorsData = (directors: DirectorDetails[]): string | null => {
    if (directors.length === 0) {
        return "Please add at least one director.";
    }
    for (const dir of directors) {
        if (!dir.fullName.trim() || !dir.idPassportNo.trim() || !dir.nationality.trim() || !dir.occupation.trim() ||
            !dir.residentialPlotNo.trim() || !dir.residentialStreetRoad.trim() || !dir.residentialTown.trim() ||
            !dir.residentialCounty.trim() || !dir.poBox.trim() || !dir.postalCode.trim() || !dir.email.trim() ||
            !dir.phone.trim()) {
            return "Please fill all required fields for each director.";
        }
    }
    return null;
};

const validateCompanySecretaryData = (secretary: CompanySecretaryDetails): string | null => {
    if (secretary.isApplicable) {
        if (!secretary.fullName.trim() || !secretary.idPassportRegNo.trim() || !secretary.poBox.trim() ||
            !secretary.postalCode.trim() || !secretary.email.trim() || !secretary.phone.trim()) {
            return "Please fill all required fields for the Company Secretary.";
        }
    }
    return null;
};

const validateBeneficialOwnersData = (owners: BeneficialOwnerDetails[], hasOwners: boolean): string | null => {
    if (hasOwners) {
        if (owners.length === 0 && hasOwners) { // Check if beneficial owners are expected but none provided
            return "Please add at least one beneficial owner if indicated, or uncheck the 'Are there Beneficial Owners to declare?' box.";
        }
        for (const bo of owners) {
            if (!bo.fullName.trim() || !bo.idPassportNo.trim() || !bo.nationality.trim() || !bo.occupation.trim() ||
                !bo.poBox.trim() || !bo.postalCode.trim() || !bo.email.trim() || !bo.phone.trim() ||
                !bo.natureOfOwnership.trim()) {
                return "Please fill all required fields for each beneficial owner.";
            }
        }
    }
    return null;
};

const validateContactPersonData = (
    details: Pick<CompanyIncorporationDetails, 'contactPersonName' | 'contactPersonEmail' | 'contactPersonPhone'>
): string | null => {
    if (!details.contactPersonName.trim() || !details.contactPersonEmail.trim() || !details.contactPersonPhone.trim()) {
        return "Please fill all Contact Person details.";
    }
    return null;
};

// --- Main Wizard Component ---
const CompanyIncorporationWizard: FC<WizardProps> = ({ onGoHome, onSetInitialPageTitle, initialPreviousScreen }) => {
    const initialCompanyIncorporationState: CompanyIncorporationDetails = {
        proposedCompanyName1: '', proposedCompanyName2: '', proposedCompanyName3: '', natureOfBusiness: '',
        regOfficePlotNo: '', regOfficeStreetRoad: '', regOfficeTown: '', regOfficeCounty: '', regOfficePoBox: '', regOfficePostalCode: '', regOfficeEmail: '', regOfficePhone: '',
        nominalShareCapitalAmount: '', nominalShareCapitalCurrency: 'KES', valuePerShareAmount: '', valuePerShareCurrency: 'KES',
        shareholders: [{ id: crypto.randomUUID(), fullName: '', idPassportNo: '', nationality: '', occupation: '', poBox: '', postalCode: '', email: '', phone: '', numberOfShares: '', classOfShares: 'Ordinary' }],
        directors: [{ id: crypto.randomUUID(), fullName: '', idPassportNo: '', nationality: '', occupation: '', residentialPlotNo: '', residentialStreetRoad: '', residentialTown: '', residentialCounty: '', poBox: '', postalCode: '', email: '', phone: '', consentToAct: 'No' }],
        companySecretary: { isApplicable: false, fullName: '', idPassportRegNo: '', poBox: '', postalCode: '', email: '', phone: '', practicingCertNo: '' },
        hasBeneficialOwners: false,
        beneficialOwners: [], // Initialize as empty, add first one only if hasBeneficialOwners is true and list is empty
        contactPersonName: '', contactPersonEmail: '', contactPersonPhone: '',
    };
    const [companyIncorporationDetails, setCompanyIncorporationDetails] = useState<CompanyIncorporationDetails>(initialCompanyIncorporationState);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [isSendingToWebhook, setIsSendingToWebhook] = useState<boolean>(false);
    const [webhookSuccessMessage, setWebhookSuccessMessage] = useState<string | null>(null);
    // const [previousScreen, setPreviousScreen] = useState<DocumentType | undefined>(initialPreviousScreen); // Example usage
    
    useEffect(() => {
        if (onSetInitialPageTitle && companyIncorporationPageConfig[currentPage - 1]) {
            const { title, desc, icon } = companyIncorporationPageConfig[currentPage - 1];
            onSetInitialPageTitle(title, desc, icon);
        }
    }, [currentPage, onSetInitialPageTitle]);

     useEffect(() => {
        // If hasBeneficialOwners is true and the list is empty, add an initial BO
        if (companyIncorporationDetails.hasBeneficialOwners && companyIncorporationDetails.beneficialOwners.length === 0) {
            setCompanyIncorporationDetails(prev => ({
                ...prev,
                beneficialOwners: [{ id: crypto.randomUUID(), fullName: '', idPassportNo: '', nationality: '', occupation: '', poBox: '', postalCode: '', email: '', phone: '', natureOfOwnership: '' }]
            }));
        }
    }, [companyIncorporationDetails.hasBeneficialOwners]);


    const totalSteps = companyIncorporationPageConfig.length;
    const progressPercent = totalSteps > 0 ? Math.max(0, Math.min(100, ((currentPage - 1) / (totalSteps -1)) * 100)) : 0;

    const isReviewPage = currentPage === totalSteps - 1;
    const isGeneratePage = currentPage === totalSteps;
    const isFinalStep = webhookSuccessMessage !== null;
    
    const handleCompanySecretaryFieldChange = <F extends keyof CompanySecretaryDetails>(
        field: F,
        value: CompanySecretaryDetails[F]
    ) => {
        setCompanyIncorporationDetails(prev => ({
            ...prev,
            companySecretary: {
                ...prev.companySecretary,
                [field]: value
            }
        }));
    };
    
    const handleCompanyIncorporationNestedChange = <
        LN extends CompanyIncorporationListKey,
        UItem extends CompanyIncorporationDetails[LN][number], 
        K extends keyof UItem
    >(
        listName: LN,
        index: number,
        field: K,
        value: UItem[K]
    ) => {
        setCompanyIncorporationDetails(prev => {
            const list = prev[listName] as UItem[]; 
            const newList = [...list];
            newList[index] = { ...list[index], [field]: value };
            return { ...prev, [listName]: newList as any }; 
        });
    };
    
    
    const addCompanyIncorporationListItem = <
        LN extends CompanyIncorporationListKey
    >(
        listName: LN, 
        newItemTemplate: CompanyIncorporationDetails[LN][number] 
    ) => {
        setCompanyIncorporationDetails(prev => {
            const list = prev[listName];
            const newItemWithId = { ...newItemTemplate, id: crypto.randomUUID() };
            return { 
                ...prev, 
                [listName]: [...list, newItemWithId] as any 
            };
        });
    };
        
    const removeCompanyIncorporationListItem = (
        listName: CompanyIncorporationListKey, 
        index: number, 
        minItems: number = 1
    ) => {
        setCompanyIncorporationDetails(prev => {
            const list = prev[listName] as Array<{id: string}>; // Ensure list is typed as array of objects with id
            if (list.length <= minItems) {
                 setSubmissionError(`At least ${minItems} ${listName.toString().replace(/s$/, '').replace(/([A-Z])/g, ' $1').toLowerCase()} must be specified.`);
                 setTimeout(() => setSubmissionError(null), 5000);
                return prev;
            }
            return { ...prev, [listName]: list.filter((_, i) => i !== index) as any };
        });
    };

    const handleNext = () => {
        setSubmissionError(null);
        let error: string | null = null;

        const { proposedCompanyName1, natureOfBusiness, regOfficePlotNo, regOfficeStreetRoad, regOfficeTown, regOfficeCounty, regOfficePoBox, regOfficePostalCode, regOfficeEmail, regOfficePhone, nominalShareCapitalAmount, valuePerShareAmount, shareholders, directors, companySecretary, hasBeneficialOwners, beneficialOwners, contactPersonName, contactPersonEmail, contactPersonPhone } = companyIncorporationDetails;

        if (currentPage === 1) error = validateProposedCompanyDetailsData({ proposedCompanyName1, natureOfBusiness, regOfficePlotNo, regOfficeStreetRoad, regOfficeTown, regOfficeCounty, regOfficePoBox, regOfficePostalCode, regOfficeEmail, regOfficePhone });
        else if (currentPage === 2) error = validateShareCapitalData({ nominalShareCapitalAmount, valuePerShareAmount });
        else if (currentPage === 3) error = validateShareholdersData(shareholders);
        else if (currentPage === 4) error = validateDirectorsData(directors);
        else if (currentPage === 5) error = validateCompanySecretaryData(companySecretary);
        else if (currentPage === 6) error = validateBeneficialOwnersData(beneficialOwners, hasBeneficialOwners);
        else if (currentPage === 7) error = validateContactPersonData({ contactPersonName, contactPersonEmail, contactPersonPhone });
        
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
        const documentTypeName = "Company Incorporation";
        // Filter out beneficialOwners if hasBeneficialOwners is false
        const formData = {
            ...companyIncorporationDetails,
            beneficialOwners: companyIncorporationDetails.hasBeneficialOwners ? companyIncorporationDetails.beneficialOwners : [],
        };


        if (!COMPANY_INCORPORATION_WEBHOOK_URL || COMPANY_INCORPORATION_WEBHOOK_URL.includes("YOUR_MAKE_COM_WEBHOOK_URL_HERE")) {
             setSubmissionError(`${documentTypeName} webhook URL is not configured. Please contact the administrator.`);
             return;
        }
        if (!COMPANY_INCORPORATION_WEBHOOK_URL.startsWith('https://hook.eu1.make.com/') && !COMPANY_INCORPORATION_WEBHOOK_URL.startsWith('https://hook.us1.make.com/')) {
            setSubmissionError("The configured Make.com Webhook URL appears to be invalid. Please contact the administrator.");
            return;
        }

        setIsSendingToWebhook(true); setSubmissionError(null); setWebhookSuccessMessage(null);

        try {
            const response = await fetch(COMPANY_INCORPORATION_WEBHOOK_URL, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ documentType: 'companyIncorporation', formData }),
            });
            const responseText = await response.text();
            if (response.ok) {
                 if (responseText.toLowerCase() === "accepted") {
                     setWebhookSuccessMessage(
                        `Your ${documentTypeName} data has been successfully submitted. The document will be generated and saved to Google Drive.
                        <br /><br />
                        <a href="${COMPANY_INCORPORATION_DRIVE_FOLDER_URL}" target="_blank" rel="noopener noreferrer" class="text-green-700 underline hover:text-green-800 font-semibold py-2 inline-block">
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
        1: <ProposedCompanyDetailsPage details={companyIncorporationDetails} setDetails={setCompanyIncorporationDetails} />,
        2: <ShareCapitalPage details={companyIncorporationDetails} setDetails={setCompanyIncorporationDetails} />,
        3: <ShareholderListPage 
                shareholders={companyIncorporationDetails.shareholders} 
                onNestedChange={handleCompanyIncorporationNestedChange} 
                onAddItem={addCompanyIncorporationListItem} 
                onRemoveItem={removeCompanyIncorporationListItem}
                initialShareholder={initialCompanyIncorporationState.shareholders[0]}
            />,
        4: <DirectorListPage
                directors={companyIncorporationDetails.directors}
                onNestedChange={handleCompanyIncorporationNestedChange}
                onAddItem={addCompanyIncorporationListItem}
                onRemoveItem={removeCompanyIncorporationListItem}
                initialDirector={initialCompanyIncorporationState.directors[0]}
            />,
        5: <CompanySecretaryPage
                companySecretary={companyIncorporationDetails.companySecretary}
                onFieldChange={handleCompanySecretaryFieldChange}
            />,
        6: <BeneficialOwnerListPage
                beneficialOwners={companyIncorporationDetails.beneficialOwners}
                hasBeneficialOwners={companyIncorporationDetails.hasBeneficialOwners}
                onHasBeneficialOwnersChange={(val) => setCompanyIncorporationDetails(prev => ({...prev, hasBeneficialOwners: val}))}
                onNestedChange={handleCompanyIncorporationNestedChange}
                onAddItem={addCompanyIncorporationListItem}
                onRemoveItem={removeCompanyIncorporationListItem}
                initialBeneficialOwner={initialCompanyIncorporationState.beneficialOwners.length > 0 ? initialCompanyIncorporationState.beneficialOwners[0] : { id: crypto.randomUUID(), fullName: '', idPassportNo: '', nationality: '', occupation: '', poBox: '', postalCode: '', email: '', phone: '', natureOfOwnership: '' }}
            />,
        7: <ContactPersonPage details={companyIncorporationDetails} setDetails={setCompanyIncorporationDetails} />,
        8: <CompanyIncorporationReviewPage details={companyIncorporationDetails} />,
        9: <CompanyIncorporationSubmitPage />,
    };

    const renderCurrentPageContent = () => {
        if (isFinalStep) {
            return <CompanyIncorporationSuccessPage webhookSuccessMessage={webhookSuccessMessage} onGoHome={onGoHome} driveFolderUrl={COMPANY_INCORPORATION_DRIVE_FOLDER_URL} />;
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
                        {isSendingToWebhook ? "Sending..." : isGeneratePage ? "Generate Document" : isReviewPage ? "Proceed to Generate" : "Next"}
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
export default CompanyIncorporationWizard;