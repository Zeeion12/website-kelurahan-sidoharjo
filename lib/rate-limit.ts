interface Bucket {
    count: number;
    resetAt: number;
}

// In-memory, per-instance. Cukup untuk deployment single-instance; kalau
// nanti pindah ke platform serverless multi-instance, hitungan ini tidak
// dibagi antar instance -- ganti ke penyimpanan bersama (mis. Upstash Redis).
const buckets = new Map<string, Bucket>();

function sweepExpired(now: number) {
    for (const [key, bucket] of buckets) {
        if (now > bucket.resetAt) buckets.delete(key);
    }
}

/** Fixed-window rate limit. Return true kalau `key` sudah melebihi `limit` permintaan dalam `windowMs` terakhir. */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    if (buckets.size > 500) sweepExpired(now);

    const bucket = buckets.get(key);
    if (!bucket || now > bucket.resetAt) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return false;
    }

    bucket.count += 1;
    return bucket.count > limit;
}
