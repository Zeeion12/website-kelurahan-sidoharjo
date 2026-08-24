import type { ReactNode } from "react";

interface FormSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
    return (
        <fieldset className="flex flex-col gap-4 border-t border-border pt-6 first:border-t-0 first:pt-0">
            <legend className="flex w-full flex-col gap-1 pb-1">
                <span className="font-heading text-sm font-semibold">{title}</span>
                {description && (
                    <span className="text-xs font-normal text-muted-foreground">
                        {description}
                    </span>
                )}
            </legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
        </fieldset>
    );
}
