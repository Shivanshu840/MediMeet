import Footer from "../../components/footer";
import LeftBar from "../../components/sidebar";
import { Providers } from "../../provider";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>

                <LeftBar />
                <div className="flex flex-col">

                    {children}
                    <Footer/>

                </div>

            </body>
        </html>
    );
}