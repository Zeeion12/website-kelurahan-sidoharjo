import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface KewarganegaraanRadioProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
}

export function KewarganegaraanRadio({ id, value, onChange }: KewarganegaraanRadioProps) {
    return (
        <RadioGroup value={value} onValueChange={onChange} className="flex flex-row gap-6">
            <Label className="flex items-center gap-2 font-normal">
                <RadioGroupItem id={`${id}-wni`} value="wni" />
                WNI
            </Label>
            <Label className="flex items-center gap-2 font-normal">
                <RadioGroupItem id={`${id}-wna`} value="wna" />
                WNA
            </Label>
        </RadioGroup>
    );
}
