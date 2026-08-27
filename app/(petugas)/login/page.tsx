"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const supabase = createClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setIsSubmitting(false);

        if (signInError) {
            if (signInError.code === "email_not_confirmed") {
                setError(
                    "Akun ini belum dikonfirmasi."
                );
            } else if (signInError.code === "invalid_credentials") {
                setError("Email atau kata sandi salah.");
            } else {
                setError(`Gagal login: ${signInError.message}`);
            }
            return;
        }

        router.push("/dashboard");
        router.refresh();
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted/30 px-4">
            <Link
                href="/"
                className="inline-flex items-center gap-1 self-center text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="size-4" />
                Kembali ke Beranda
            </Link>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login Petugas</CardTitle>
                    <CardDescription>
                        Khusus untuk perangkat Kalurahan Sidoharjo.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="username"
                                placeholder="example@gmail.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="password">Kata Sandi</Label>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="PasswordExample"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Memproses..." : "Masuk"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
