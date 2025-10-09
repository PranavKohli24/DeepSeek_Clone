import { Inter } from "next/font/google";
import "./globals.css";
import "./prism.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export const metadata = {
  title: "kohliAI",
  description: "Pranav Kohli portfolio",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <AppContextProvider>
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
      </head>
      <body
        className={`${inter.className} antialiased bg-[#292a2d]`}
      >
        <Toaster toastOptions={
          {
            success:{style:{background:"black", color:"white"}},
            error:{style:{background:"black",color:"white"}}
          }
        }/>
        {children}
      </body>
    </html>
    </AppContextProvider>
    </ClerkProvider>
  );
}
