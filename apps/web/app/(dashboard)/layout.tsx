import LeftBar from "../../components/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LeftBar />
        <div className="flex flex-col">{children}</div>
      </body>
    </html>
  );
}
