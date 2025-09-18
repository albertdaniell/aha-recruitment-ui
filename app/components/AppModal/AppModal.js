import React from 'react'


export default function AppModal({showClose = true,isOpen=false,setIsOpen,closeText="Close",closeBtnClass="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition mt-3",setIsClose,title="Message",body,className="absolute inset-0 bg-black bg-opacity-50 transition-opacity",
  className1="fixed inset-0 flex items-center justify-center z-50",
  className2="bg-white rounded-lg shadow-lg max-w-md w-full z-10 p-6 transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-in"
}) {
//   const [isOpen, setIsOpen] = useState(false);


  return (
    <>
      {/* Button to open modal */}
     
      {/* Modal */}
      {isOpen && (
        <div className={className1}>
          {/* Overlay */}
          <div
            className={className}
            onClick={() => setIsClose()}
          ></div>

          {/* Modal content */}
          <div className={className2}>
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            {body}
            {/* <p className="mb-4">This is a modal with small fade/scale animations using Tailwind CSS.</p> */}
            {
              showClose &&
               <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsClose()}
                className={closeBtnClass}
              >
                {closeText}
              </button>
              {/* <button
                onClick={() => alert("Action!")}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
              >
                Confirm
              </button> */}
            </div>
            }
           
          </div>
        </div>
      )}

      {/* Tailwind Animations */}
      <style jsx>{`
        @keyframes modal-in {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-modal-in {
          animation: modal-in 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
}