import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ChevronRight } from 'lucide-react';

// --- cn Utility ---
export const cn = (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ');
};

// --- UI Components ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'success';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 shadow-sm";
    const variantStyles = {
        default: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800",
        destructive: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
        outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 active:bg-gray-100",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400",
        ghost: "hover:bg-gray-100 text-gray-700 active:bg-gray-200",
        success: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800",
    };
    const sizeStyles = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
    };
    return (
        <button
            className={cn(baseStyles, variantStyles[variant || 'default'], sizeStyles[size || 'default'], className)}
            ref={ref}
            {...props}
        >
            {children}
        </button>
    );
  }
);
Button.displayName = "Button";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
        type={type}
        className={cn("flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:border-green-500 disabled:cursor-not-allowed disabled:opacity-50", className)}
        ref={ref}
        {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
        className={cn("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:border-green-500 disabled:cursor-not-allowed disabled:opacity-50", className)}
        ref={ref}
        {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, htmlFor, children, ...props }, ref) => (
    <label
        ref={ref}
        htmlFor={htmlFor}
        className={cn("text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
        {...props}
    >
        {children}
    </label>
  )
);
Label.displayName = "Label";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-lg border border-gray-200 bg-white text-gray-800 shadow-lg", className)} {...props}/>
  )
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-5 md:p-6", className)} {...props}/>
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-lg md:text-xl font-semibold leading-none tracking-tight text-gray-900 flex items-center", className)} {...props}>
        {children}
    </h3>
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-gray-500", className)} {...props}/>
  )
);
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 md:p-6 pt-0", className)} {...props}/>
  )
);
CardContent.displayName = "CardContent";


// --- Select Components ---
interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  isSelected?: boolean;
  children?: React.ReactNode;
}

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, onClick, isSelected, value, ...props }, ref) => (
    <div
        ref={ref}
        onClick={onClick}
        className={cn(
            "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 px-3 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            isSelected && "font-semibold bg-gray-100 text-green-600",
            className
        )}
        data-value={value}
        {...props}
    >
        {isSelected && (
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-500" />
            </span>
        )}
        <span className={cn(isSelected && "pl-5")}>{children}</span>
    </div>
  )
);
SelectItem.displayName = "SelectItem";


interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // FIX: Changed labelToDisplay type to ReactNode to allow React components as labels.
  labelToDisplay?: ReactNode;
  children?: ReactNode; 
  placeholder?: string;
  'data-state'?: 'open' | 'closed';
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, onClick, labelToDisplay, children, placeholder, ...props }, ref) => {
    const triggerContent = labelToDisplay || children;
    return (
        <button
            ref={ref}
            onClick={onClick}
            type="button"
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:cursor-not-allowed disabled:opacity-50",
                !triggerContent && "text-gray-400",
                className
            )}
            {...props}
        >
            {triggerContent || placeholder || "Select an option"}
            <ChevronRight className="h-4 w-4 opacity-60 transform transition-transform data-[state=open]:rotate-90" data-state={props['data-state']} />
        </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

interface SelectContentWrapperProps {
  className?: string;
  setIsOpen?: (isOpen: boolean) => void;
  onValueChange?: (value: string) => void;
  selectedValue?: string;
  children: React.ReactElement<SelectItemProps>[] | React.ReactElement<SelectItemProps>;
}


export const SelectContentWrapper = React.forwardRef<HTMLDivElement, SelectContentWrapperProps>(
  ({ className, children, setIsOpen, onValueChange, selectedValue }, ref) => (
    // @ts-ignore TypeScript is not correctly recognizing framer-motion animation props here.
    <motion.div
        ref={ref}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.1 }}
        className={cn(
            "absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white p-1 text-gray-800 shadow-lg max-h-60 overflow-y-auto",
            className
        )}
    >
        {React.Children.map(children, (child) => {
            if (!React.isValidElement<SelectItemProps>(child)) return child;
            return React.cloneElement(child, {
                onClick: (event: React.MouseEvent<HTMLDivElement>) => {
                    if (onValueChange && child.props.value) onValueChange(child.props.value);
                    if (setIsOpen) setIsOpen(false);
                    if (child.props.onClick) child.props.onClick(event); 
                },
                isSelected: child.props.value === selectedValue,
            });
        })}
    </motion.div>
  )
);
SelectContentWrapper.displayName = "SelectContentWrapper";


interface SelectProps {
  children: ReactNode;
  onValueChange?: (value: string) => void;
  value?: string;
  className?: string;
  disabled?: boolean;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
    ({ children, onValueChange, value, className, disabled }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const triggerElement = React.Children.toArray(children).find(
        (child): child is React.ReactElement<SelectTriggerProps> =>
            React.isValidElement(child) && (child.type === SelectTrigger)
    );
    
    const contentElement = React.Children.toArray(children).find(
         (child): child is React.ReactElement<SelectContentWrapperProps> =>
            React.isValidElement(child) && (child.type === SelectContentWrapper)
    );

    let finalLabelToDisplay: ReactNode;

    if (value && contentElement && contentElement.props.children) {
        const items = React.Children.toArray(contentElement.props.children).filter(
          (child): child is React.ReactElement<SelectItemProps> => React.isValidElement(child) && child.type === SelectItem
        );
        const selectedItemElement = items.find(item => item.props.value === value);
        if (selectedItemElement && selectedItemElement.props.children) {
            finalLabelToDisplay = selectedItemElement.props.children;
        }
    }
    
    // If no value is selected, the trigger's own children are used as the display value (or placeholder)
    if (!finalLabelToDisplay && triggerElement?.props.children) {
        finalLabelToDisplay = triggerElement.props.children;
    }
    
    return (
        <div className={cn("relative", className)} ref={selectRef}>
            {triggerElement && React.cloneElement(triggerElement, {
                onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                    if (!disabled) {
                        setIsOpen(prev => !prev);
                    }
                    if(triggerElement.props.onClick) triggerElement.props.onClick(e);
                },
                labelToDisplay: finalLabelToDisplay,
                'data-state': isOpen ? 'open' : 'closed',
                 children: undefined, // Children are now handled via labelToDisplay for consistency
                 placeholder: triggerElement.props.placeholder,
                 disabled: disabled
            })}
            {isOpen && !disabled && contentElement && React.cloneElement(contentElement, {
                setIsOpen,
                onValueChange,
                selectedValue: value
            })}
        </div>
    );
});
Select.displayName = "Select";


// --- Form Field Components ---
interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  isOptional?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({ id, label, value, onChange, type = "text", required = false, placeholder, isOptional = false, ...props }) => (
    <div className="space-y-1.5">
        <Label htmlFor={id}>
            {label} {required && !isOptional && <span className="text-red-500">*</span>}
            {isOptional && <span className="text-xs text-gray-500"> (Optional)</span>}
        </Label>
        <Input
            id={id}
            type={type}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            required={required && !isOptional}
            {...props}
        />
    </div>
);

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  isOptional?: boolean;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ id, label, value, onChange, required = false, placeholder, rows = 3, isOptional = false }) => (
    <div className="space-y-1.5 md:col-span-2">
        <Label htmlFor={id}>
            {label} {required && !isOptional && <span className="text-red-500">*</span>}
            {isOptional && <span className="text-xs text-gray-500"> (Optional)</span>}
        </Label>
        <Textarea
            id={id}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            required={required && !isOptional}
            rows={rows}
        />
    </div>
);

// --- Detail Item Component ---
interface DetailItemProps {
  label: string;
  value?: string | number | null | ReactNode;
}
export const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => {
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    return null;
  }
  return (
    <div className="py-1.5 border-b border-gray-200 last:border-b-0">
      <span className="text-gray-500 font-medium text-xs uppercase tracking-wider block sm:inline sm:mr-2">{label}: </span>
      <span className="text-gray-700 text-sm block sm:inline">{value}</span>
    </div>
  );
};
