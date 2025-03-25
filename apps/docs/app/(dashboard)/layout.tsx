import Sidebar from "../../components/Sidebar";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="grid min-h-screen w-full lg:grid-cols-[80px_1fr]">
          <Sidebar />
          <div className="flex flex-col">{children}</div>
        </div>
      </body>
    </html>
  );
}
