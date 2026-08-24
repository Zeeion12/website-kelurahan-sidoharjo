import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface JenisKelaminRadioProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
}

export function JenisKelaminRadio({ id, value, onChange }: JenisKelaminRadioProps) {
    return (
        <RadioGroup value={value} onValueChange={onChange} className="flex flex-row gap-6">
            <Label className="flex items-center gap-2 font-normal">
                <RadioGroupItem id={`${id}-l`} value="laki-laki" />
                Laki-laki
            </Label>
            <Label className="flex items-center gap-2 font-normal">
                <RadioGroupItem id={`${id}-p`} value="perempuan" />
                Perempuan
            </Label>
        </RadioGroup>
    );
}
