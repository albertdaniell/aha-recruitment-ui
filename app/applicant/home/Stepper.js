import React from "react";
const steps = [
  { id: 1, name: "Profile Updated" },
  { id: 2, name: "Draft Application" },
  { id: 3, name: "Application Submitted" },
  { id: 4, name: "Shortlisted" },
];

export default function Stepper({ currentStep }) {
  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between px-4 mb-5 relative">
      {/* Horizontal Line (Desktop) */}
      <div className="hidden md:block absolute top-4 left-0 w-full h-0.5 bg-gray-300 z-0"></div>
      <div
        className="hidden md:block absolute top-4 left-0 h-0.5 bg-green-500 z-0 transition-all duration-300"
        style={{ width: `${progressPercent}%` }}
      ></div>
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        return (
          <div
            key={step.id}
            className="flex md:flex-col items-center md:items-center relative z-10 mb-4 md:mb-0"
          >
            {/* Vertical Line (Mobile) */}
            {index < steps.length - 1 && (
              <div
                className={`md:hidden absolute left-4 top-8 w-0.5 h-full transition-colors duration-300 ${
                  isCompleted ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
            )}

            {/* Circle */}
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 text-sm font-bold transition-colors duration-300
                ${
                  isCompleted || isActive
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
            >
              {isCompleted ? "✓" : step.id}
            </div>

            {/* Label */}
            <p
              className={`mt-2 ml-3 md:ml-0 text-sm font-medium transition-colors duration-300 ${
                isCompleted || isActive ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {step.name}
            </p>
          </div>
        );
      })}
    </div>
  );
}
