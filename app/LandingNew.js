import Link from "next/link";
import React from "react";
import { Calendar, FileText, ClipboardList, DollarSign } from "lucide-react";
import Image from "next/image";

const data = [
  {
    id: "1000",
    title:
      "Ward Veterinary Surgeons and Veterinary Para Professionals for County FMD & PPR Vaccination Campaign",
    project: "NAVCDP Project",
    system: "E-Voucher System",
    deadline: "………… 2025", // left as in PDF since exact date not filled
    issued_by: [
      "County Governments",
      "National Agricultural Value Chain Development Project (NAVCDP)",
      "Directorate of Veterinary Services",
    ],
    description:
      "The County Governments in collaboration with the National Agricultural Value Chain Development Project (NAVCDP) and the Directorate of Veterinary Services invite qualified and licensed Veterinarians and Veterinary Para-professionals to apply to participate in the upcoming Foot and Mouth Disease (FMD) and Peste des Petits Ruminants (PPR) vaccination campaign. This initiative will be implemented through the e-voucher system to ensure efficient service delivery and transparent compensation.",
    objectives: [
      "Enhance livestock health and productivity across Kenya",
      "Prevent and control outbreaks of FMD and PPR",
      "Strengthen Animal Health Service delivery through digital platforms",
    ],
    eligibility: {
      who_should_apply:
        "Licensed Veterinarians and Veterinary Para-professionals",
      requirements: [
        "Registered, retained and therefore eligible to practice as per the Kenya Veterinary Board (KVB)",
        "Familiar with digital tools leveraging on mobile technology communication",
        "Available for deployment between September and November 2025",
      ],
    },
    responsibilities: [
      "Administer FMD and/or PPR vaccines to targeted livestock populations",
      "Record and report vaccination data via the e-voucher system",
      "Register animals through the digital platform",
      "Effectively engage with livestock owners and local stakeholders",
      "Ensure cold chain and vaccine integrity throughout the campaign period",
      "Target animals include cattle, sheep, and goats where applicable",
    ],
    remuneration: {
      VPPs: {
        cattle: "Ksh. 24 per head",
        sheep_goat: "Ksh. 3 per head",
      },
      VSs: {
        cattle: "Ksh. 8 per head",
        sheep_goat: "Ksh. 1 per head",
      },
      target_animals: ["cattle", "sheep", "goats"],
    },
    e_voucher_system: {
      features: [
        "Facilitates service tracking and reporting",
        "Enables timely payments for services rendered",
        "Provides real-time data for monitoring and evaluation",
      ],
    },
    application_process: {
      required_documents: [
        "Cover letter expressing interest",
        "Updated CV with relevant experience",
        "Copy of updated KVB registration certificate",
        "Copy of professional certificate",
        "National ID and contact details",
      ],
      submission_format:
        "All the above documents should be compiled as one PDF document for ease of upload and download.",
      submission_format2:
      "• Successful applicants will be required to have personal Insurance against any incidents or accidents that may occur during this exercise.",
      submission_deadline: "………… 2025",
      submission_method: "Submit your application via the portal",
    },
  },
];
export default function LandingPage() {
  const campaign = data[0];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Section */}
      <main className="flex flex-col md:flex-row items-center justify-between bg-slate-50 text-slate-800 md:pt-0 pt-10">
        {/* Left Content */}
        <section className="px-6 md:px-20 py-10 flex flex-col lg:flex-row lg:items-center gap-5">
          <div className="lg:w-1/2 mb-12 md:mb-0">
            <h1 className="text-2xl md:text-4xl font-extrabold leading-snug text-slate-700">
              Ward Veterinary Surgeons and Veterinary Para Professionals for{" "}
              <span className="text-[#05a552]">
                County FMD & PPR Vaccination
              </span>{" "}
              Campaign
            </h1>

            <p className="mt-6 text-slate-600 md:text-lg">
              The County Governments, in collaboration with NAVCDP and the
              Directorate of Veterinary Services, invite qualified and licensed
              Veterinarians and Veterinary Para-professionals to apply for the
              upcoming Foot and Mouth Disease (FMD) and Peste des Petits
              Ruminants (PPR) vaccination campaign. The campaign will be
              implemented through the e-voucher system to ensure efficient
              service delivery and transparent compensation.
            </p>
            <div className="mt-3 flex items-center gap-2 text-sm font-medium">
              <Calendar className="w-4 h-4" />
              Deadline: {campaign.deadline}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/aha/sign-up/"
                className="inline-block px-6 py-3 text-white font-semibold text-lg rounded-lg shadow-lg bg-[#009639] hover:bg-[#1a5a33f1] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 animate-pulse"
              >
                Apply Now
              </Link>

              <a
                href="/Advert_Vaccination.docx" // 👈 path to your PDF in /public
                download
                className="border border-[#05a552] text-[#05a552] px-6 py-3 rounded-lg hover:bg-green-50 transition-all duration-300"
              >
                Download Ad
              </a>

              <Link
                href="#learn-more"
                className="border bg-[#009639] hover:bg-[#1a5a33f1] text-white border-[#05a552] px-6 py-3 rounded-lg transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="lg:w-1/2 lg:flex lg:justify-center">
            <img
              src="/cow.jpg"
              alt="Agricultural Illustration"
              className="w-full max-w-lg rounded-3xl shadow-lg"
            />
          </div>
        </section>
      </main>
      <div id="learn-more">
        <section className="px-6 md:px-20 py-16 flex flex-col  gap-4">
          {/* Issued By */}
          <section className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-lg font-semibold text-emerald-700 mb-2">
              Issued By
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {campaign.issued_by.map((issuer, i) => (
                <li key={i}>{issuer}</li>
              ))}
            </ul>
          </section>

          {/* Objectives */}
          <section className="bg-[#00963927] rounded-2xl shadow-md p-5">
            <h2 className="text-lg font-semibold text-[#009639] mb-2">
              Objectives
            </h2>
            <ul className="list-disc list-inside text-gray-800 space-y-1">
              {campaign.objectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </section>

          {/* Responsibilities */}
          <section className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-lg font-semibold text-emerald-700 mb-2 flex items-center gap-2">
              <ClipboardList className="w-5 h-5" /> Responsibilities
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {campaign.responsibilities.map((task, i) => (
                <li key={i}>{task}</li>
              ))}
            </ul>
          </section>

          {/* Remuneration */}
          {/* <section className="bg-[#00963927] rounded-2xl shadow-md p-5">
            <h2 className="text-lg font-semibold text-emerald-700 mb-2 flex items-center gap-2">
              <DollarSign className="w-5 h-5" /> Remuneration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-emerald-600">VPPs</h3>
                <ul className="list-disc list-inside text-gray-700">
                  <li>Cattle: {campaign.remuneration.VPPs.cattle}</li>
                  <li>Sheep/Goat: {campaign.remuneration.VPPs.sheep_goat}</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-emerald-600">VSs</h3>
                <ul className="list-disc list-inside text-gray-700">
                  <li>Cattle: {campaign.remuneration.VSs.cattle}</li>
                  <li>Sheep/Goat: {campaign.remuneration.VSs.sheep_goat}</li>
                </ul>
              </div>
            </div>
            <p className="mt-2 text-gray-600">
              Target animals: {campaign.remuneration.target_animals.join(", ")}
            </p>
          </section> */}

          {/* Application Process */}
          <section className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-lg font-semibold text-emerald-700 mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5" /> How to Apply
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {campaign.application_process.required_documents.map((doc, i) => (
                <li key={i}>{doc}</li>
              ))}
            </ul>
            <p className="mt-3 text-gray-600">
              {campaign.application_process.submission_format}
            </p>
            <p className="mt-3 text-gray-600">
              {campaign.application_process.submission_format2}
            </p>
            <p className="mt-3 text-gray-600">
              {campaign.application_process.info}
            </p>
            <p className="mt-3 text-gray-600 font-medium">
              Deadline: {campaign.application_process.submission_deadline}
            </p>
            <p className="mt-1 text-emerald-700 font-semibold">
              {campaign.application_process.submission_method}
            </p>

            <div className="mt-6 flex gap-4">
              {/* Apply Now button */}
              <Link
                href="/aha/sign-up/"
                className="inline-block px-6 py-3 text-white font-semibold text-lg rounded-lg shadow-lg bg-[#009639] hover:bg-[#1a5a33f1] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 animate-pulse"
              >
                Apply Now
              </Link>

              <a
                href="/Advert_Vaccination.docx" // 👈 path to your PDF in /public
                download
                className="border border-[#05a552] text-[#05a552] px-6 py-3 rounded-lg hover:bg-green-50 transition-all duration-300"
              >
                Download Ad
              </a>
            </div>
          </section>
        </section>
      </div>

      <div className="bg-white border-t-2 border-t-slate-100" id="logos">
        {/* logos */}

        <section className="px-6 md:px-20 py-16 flex flex-col  gap-4">
          <div className="flex md:flex-row  gap-3 justify-between overflow-auto">
            <Image
              alt="Agripreneur Expression of Interest Form
        "
              width={100}
              height={100}
              src="/emblem.png"
              className="rounded-2xl md:w-[120px] md:h-[120px] w-[75px] h-[75px]  my-5"
            ></Image>
            <Image
              alt="Agripreneur Expression of Interest Form
        "
              width={100}
              height={100}
              src="/cog.png"
              className="rounded-2xl md:w-[120px] md:h-[120px] w-[75px] h-[75px]  my-5"
            ></Image>
            <Image
              alt="Agripreneur Expression of Interest Form
        "
              width={100}
              height={100}
              src="/kalro.png"
              className="rounded-2xl md:w-[120px] md:h-[120px] w-[75px] h-[75px]  my-5"
            ></Image>
            <Image
              alt="Agripreneur Expression of Interest Form
        "
              width={100}
              height={100}
              src="/navcdp.png"
              className="rounded-2xl md:w-[120px] md:h-[120px] w-[75px] h-[75px]  my-5"
            ></Image>
            <Image
              alt="Agripreneur Expression of Interest Form
        "
              width={100}
              height={100}
              src="/fsrp.png"
              className="rounded-2xl md:w-[120px] md:h-[120px] w-[75px] h-[75px]  my-5"
            ></Image>
            <Image
              alt="Agripreneur Expression of Interest Form
        "
              width={100}
              height={100}
              src="/worldbank.png"
              className="rounded-2xl md:w-[120px] md:h-[120px] w-[75px] h-[75px] my-5"
            ></Image>
          </div>
        </section>
      </div>

      <div className="bg-gray-800 p-8 text-white text-center">
        <p>Developed by KALRO ICT</p>
      </div>
    </div>
  );
}
