// app/page.tsx
"use client";

import { Calendar, FileText, ClipboardList, DollarSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const data = [
  {
    id: "1000",
    title:
      "Ward Veterinary Surgeons and Veterinary Para Professionals for County FMD & PPR Vaccination Campaign",
    project: "NAVCDP Project",
    system: "E-Voucher System",
    deadline: "27th August 2025",
    issued_by: [
      "County Governments",
      "National Agricultural Value Chain Development Project (NAVCDP)",
      "Directorate of Veterinary Services",
    ],
    description:
      "The County Governments, in collaboration with NAVCDP and the Directorate of Veterinary Services, invite qualified and licensed Veterinarians and Veterinary Para-professionals to apply for the upcoming Foot and Mouth Disease (FMD) and Peste des Petits Ruminants (PPR) vaccination campaign. The campaign will be implemented through the e-voucher system to ensure efficient service delivery and transparent compensation.",
    objectives: [
      "Enhance livestock health and productivity across Kenya",
      "Prevent and control outbreaks of FMD and PPR",
      "Strengthen veterinary service delivery through digital platforms",
    ],
    eligibility: {
      who_should_apply:
        "Licensed Veterinarians and Veterinary Para-professionals",
      requirements: [
        "Registered, retained and authorized to practice with the Kenya Veterinary Board (KVB)",
        "Familiar with digital tools and mobile-based service delivery",
        "Available for deployment between September and November 2025",
      ],
    },
    responsibilities: [
      "Administer FMD and PPR vaccines to targeted livestock populations",
      "Record and report vaccination data via the e-voucher system",
      "Register animals through the digital platform",
      "Engage with livestock owners and local stakeholders",
      "Ensure cold chain and vaccine integrity throughout the campaign period",
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
        "All documents should be compiled into a single PDF file for upload.",
      submission_deadline: "27th August 2025",
      submission_method: "Submit via the application portal",
    },
  },
];

export default function Page() {
  const campaign = data[0];

  return (
    <main className="min-h-screen border-t-8 border-t-[#009639]  to-white p-6 md:p-5">
        <div className="flex md:hidden  justify-between">
                  <img src="/emblem.png" className="w-[100px] h-[100px]"></img>

                  <img src="/cog.png" className="w-[100px] h-[100px]"></img>
                </div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-8xl mx-auto">
        {/* LEFT SIDE - PDF Viewer */}
  <div className="md:col-span-1 bg-white rounded-2xl shadow-md overflow-hidden md:h-[95vh] ">
          {/* <iframe
            src="/advert_Vaccination_sample.pdf" // 👈 replace with your PDF path (e.g., /public/sample.pdf)
            className="w-full h-full"
          /> */}
          <div className="md:w-full md:h-full  md:flex items- justify-center  hidden">
            <img
              src="/cow.jpg" // 👈 replace with your image path
              alt="Advertisement"
              className="w-full h-full object-cover rounded-lg shadow"
            />
          </div>
        </div>

        {/* RIGHT SIDE - Campaign Info */}
  <div className="md:col-span-2 space-y-3 overflow-y-auto md:h-[95vh]  pr-2">
             <div className="md:flex hidden  justify-between">
                  <img src="/emblem.png" className="w-[100px] h-[100px]"></img>

                  <img src="/cog.png" className="w-[100px] h-[100px]"></img>
                </div>
          {/* Title */}
          <div className="bg-[#009639] text-white rounded-2xl shadow-md p-6">
            <h1 className="text-2xl md:text-3xl font-bold">{campaign.title}</h1>
            <p className="mt-2">{campaign.description}</p>
            <div className="mt-3 flex items-center gap-2 text-sm font-medium">
              <Calendar className="w-4 h-4" />
              Deadline: {campaign.deadline}
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            {/* Apply Now button */}
            <Link
              href="/aha/login/" // 👈 change to your application form route or external link
              className="inline-block px-6 py-3 text-white font-semibold text-lg rounded-full shadow-lg bg-[#009639] hover:bg-[#1a5a33f1] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 animate-pulse"
            >
              Apply Now
            </Link>

            {/* Download PDF button */}
            <a
              href="/advert_Vaccination_sample.pdf" // 👈 path to your PDF in /public
              download
              className="inline-block px-6 py-3 text-slate-700 font-semibold text-lg rounded-full shadow-lg border-[1px] border-[#009639] bg-[#0096396d]  transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
            >
              Download Ad
            </a>
          </div>

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
          <section className="bg-[#00963927] rounded-2xl shadow-md p-5">
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
          </section>

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
            <p className="mt-1 text-gray-600 font-medium">
              Deadline: {campaign.application_process.submission_deadline}
            </p>
            <p className="mt-1 text-emerald-700 font-semibold">
              {campaign.application_process.submission_method}
            </p>

            <div className="mt-6 flex gap-4">
            {/* Apply Now button */}
            <Link
              href="/aha/login/" // 👈 change to your application form route or external link
              className="inline-block px-6 py-3 text-white font-semibold text-lg rounded-full shadow-lg bg-[#009639] hover:bg-[#1a5a33f1] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 animate-pulse"
            >
              Apply Now
            </Link>

            {/* Download PDF button */}
            <a
              href="/advert_Vaccination_sample.pdf" // 👈 path to your PDF in /public
              download
              className="inline-block px-6 py-3 text-slate-700 font-semibold text-lg rounded-full shadow-lg border-[1px] border-[#009639] bg-[#0096396d]  transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
            >
              Download Ad
            </a>
          </div>
          </section>
           <div className="flex  flex-row gap-3 overflow-auto">
              <div className="flex-1">
                <Image
                  alt="Agripreneur Expression of Interest Form
        "
                  width={100}
                  height={100}
                  src="/kalro.png"
                  className="md:w-[120px] md:h-[120px] w-[75px] h-[75px]  my-5"
                ></Image>
              </div>
              <div className="flex-1">
                <Image
                  alt="Agripreneur Expression of Interest Form
        "
                  width={100}
                  height={100}
                  src="/navcdp.png"
                  className="md:w-[120px] md:h-[120px] w-[75px] h-[75px]  my-5"
                ></Image>
              </div>
              <div className="flex-1">
                <Image
                  alt="Agripreneur Expression of Interest Form
        "
                  width={100}
                  height={100}
                  src="/fsrp.png"
                  className="md:w-[120px] md:h-[120px] w-[75px] h-[75px]  my-5"
                ></Image>
              </div>
              <div className="flex-1">
                <Image
                  alt="Agripreneur Expression of Interest Form
        "
                  width={100}
                  height={100}
                  src="/worldbank.png"
                  className="md:w-[120px] md:h-[120px] w-[75px] h-[75px] my-5"
                ></Image>
              </div>
            </div>
        </div>

        
      </div>
    </main>
  );
}
