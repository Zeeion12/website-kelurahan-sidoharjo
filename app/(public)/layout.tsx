import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PublicLayout({ children }: LayoutProps<"/">) {
    return (
        <>
            <Navbar />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
        </>
    );
}
