import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldProps {
    label: string;
    htmlFor: string;
    error?: string;
    hint?: string;
    className?: string;
    children: ReactNode;
}

export function Field({ label, htmlFor, error, hint, className, children }: FieldProps) {
    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            <Label htmlFor={htmlFor}>{label}</Label>
            {children}
            {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}
