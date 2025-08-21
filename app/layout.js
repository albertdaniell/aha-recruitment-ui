import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./app-redux/provider";
import { Poppins } from 'next/font/google'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  icons: {
    icon: './favicon.ico', // /public path
  },
  title: "Agripreneur Expression of Interest Form",
  description:
    "The Government of Kenya, with the support of the World Bank through the NAVCDP and FSRP projects, is rolling out a business acceleration model in 46 counties. This program will equip individuals, especially youth, with correct skills to become agricultural entrepreneurs or 'agripreneurs.'These agripreneurs will serve as catalysts for change, bringing innovative technologies, resources, and market connections to farmers. Agripreneurs will operate as independent businesses, providing services and products to farmers for a fee or other forms of remuneration, making the model sustainable and scalable. Recognizing the value of experience, the government is prioritizing youth who participated in last year's national farmer registration exercise.",
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
