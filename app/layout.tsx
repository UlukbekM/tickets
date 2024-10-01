import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// import { getServerSession } from "next-auth";
// import { SessionProvider } from "next-auth/react";
import NavMenu from "./components/NavMenu";
import { Providers } from "./components/SessionProvider";
import { ThemeProvider } from "@/components/theme-provider"

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default async function RootLayout({
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>
) {
    // const session = await getServerSession()
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {/* <SessionProvider session={session}> */}
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                    <Providers>

                    {/* <NavMenu/> */}
                        {children}
                    </Providers>
                </ThemeProvider>

                {/* </SessionProvider> */}
            </body>
        </html>
    );
}
