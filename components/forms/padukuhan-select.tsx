import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PADUKUHAN_SIDOHARJO } from "@/config/padukuhan";

interface PadukuhanSelectProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
}

export function PadukuhanSelect({ id, value, onChange }: PadukuhanSelectProps) {
    return (
        <Select value={value} onValueChange={(next) => onChange(next ?? "")}>
            <SelectTrigger id={id} className="w-full">
                <SelectValue placeholder="Pilih padukuhan" />
            </SelectTrigger>
            <SelectContent>
                {PADUKUHAN_SIDOHARJO.map((padukuhan) => (
                    <SelectItem key={padukuhan} value={padukuhan}>
                        {padukuhan}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
