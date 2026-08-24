import { Badge } from "@/components/ui/badge";
import { STATUS_BADGE_VARIANT, STATUS_LABEL } from "@/lib/status";
import type { StatusPengajuan } from "@/types";

interface StatusBadgeProps {
    status: StatusPengajuan;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    return <Badge variant={STATUS_BADGE_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}
