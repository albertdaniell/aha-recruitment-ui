import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./app-redux/provider";
import { Poppins } from 'next/font/google'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  icons: {
    icon: './favicon.ico', // /public path
  },
  title: "Ward Veterinary Surgeons and Veterinary Para Professionals for County FMD & PPR Vaccination Campaign Application form",
  description:
    "The County Governments, in collaboration with NAVCDP and the Directorate of Veterinary Services, invite qualified and licensed Veterinarians and Veterinary Para-professionals to apply for the upcoming Foot and Mouth Disease (FMD) and Peste des Petits Ruminants (PPR) vaccination campaign. The campaign will be implemented through the e-voucher system to ensure efficient service delivery and transparent compensation.",
};

const Poppins_Font = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] // Al
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={` ${Poppins_Font.variable}`}>

      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
