import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ShdkSelectProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
}

export function ShdkSelect({ id, value, onChange }: ShdkSelectProps) {
    return (
        <Select value={value} onValueChange={(next) => onChange(next ?? "")}>
            <SelectTrigger id={id} className="w-full">
                <SelectValue placeholder="Pilih SHDK" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="kepala-keluarga">Kepala Keluarga</SelectItem>
                <SelectItem value="suami">Suami</SelectItem>
                <SelectItem value="istri">Istri</SelectItem>
                <SelectItem value="anak">Anak</SelectItem>
                <SelectItem value="menantu">Menantu</SelectItem>
                <SelectItem value="cucu">Cucu</SelectItem>
                <SelectItem value="orangtua">Orang Tua</SelectItem>
                <SelectItem value="mertua">Mertua</SelectItem>
                <SelectItem value="famili-lain">Famili Lain</SelectItem>
                <SelectItem value="pembantu">Pembantu</SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
            </SelectContent>
        </Select>
    );
}
