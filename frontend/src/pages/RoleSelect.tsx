
import React, { useState } from "react";

const roles = [
  {
    key: "teacher",
    title: "I'm a Teacher",
    desc: "Create polls and view live poll results in real-time.",
    enabled: true,
  },
  {
    key: "student",
    title: "I'm a Student",
    desc: "Submit answers and view live poll results in real-time.",
    enabled: true,
  },
];

export default function RoleSelect({ onSelect }: { onSelect: (role: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    if (selected) onSelect(selected);
  };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white px-10 py-8 rounded-2xl shadow-lg w-full max-w-xl flex flex-col items-center">
//         {/* Badge */}
//         <div className="mb-4">
//           <span className="bg-violet-200 text-violet-700 px-4 py-1 rounded-full text-sm font-semibold">✦ Intervue Poll</span>
//         </div>
//         {/* Heading */}
//         <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
//           Welcome to the <span className="text-black">Live Polling System</span>
//         </h1>
//         {/* Subtitle */}
//         <p className="text-gray-500 text-center mb-8 max-w-lg">
//           Please select the role that best describes you to begin using the live polling system
//         </p>
//         {/* Role Cards */}
//         <div className="flex flex-col md:flex-row gap-4 w-full mb-8">
//           {roles.map((role) => (
//             <button
//               key={role.key}
//               type="button"
//               className={`flex-1 border rounded-xl px-6 py-5 text-left transition-all duration-150 focus:outline-none ${
//                 selected === role.key
//                   ? role.enabled
//                     ? "border-violet-600 bg-violet-50 shadow-md"
//                     : "border-gray-300 bg-gray-100"
//                   : role.enabled
//                   ? "border-gray-200 bg-white hover:border-violet-400"
//                   : "border-gray-200 bg-gray-100 cursor-not-allowed opacity-60"
//               }`}
//               onClick={() => role.enabled && setSelected(role.key)}
//               disabled={!role.enabled}
//               title={role.enabled ? undefined : "Student mode will be available soon."}
//             >
//               <div className={`font-semibold text-lg mb-1 ${selected === role.key && role.enabled ? 'text-violet-700' : ''}`}>{role.title}</div>
//               <div className="text-gray-500 text-sm">{role.desc}</div>
//             </button>
//           ))}
//         </div>
//         {/* Continue Button */}
//         <button
//           className={`w-60 py-2 rounded-full text-white font-semibold text-lg transition-all duration-150 ${
//             selected
//               ? "bg-violet-600 hover:bg-violet-700 shadow"
//               : "bg-violet-300 cursor-not-allowed"
//           }`}
//           disabled={!selected}
//           onClick={handleContinue}
//         >
//           Continue
//         </button>
//       </div>
//     </div>
//   );
// }

 return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-whitish)">
      <div className="w-full max-w-3xl flex flex-col items-center px-6">
        
        {/* Badge */}
        <div className="mb-6">
          <span className="bg-(--color-primary)/10 text-(--color-primary) px-4 py-1 rounded-full text-sm font-semibold">
            ✦ Intervue Poll
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-(--color-dark) mb-3">
          Welcome to the <span className="font-extrabold">Live Polling System</span>
        </h1>

        {/* Subtitle */}
        <p className="text-(--color-dark-light) text-center mb-10 max-w-xl">
          Please select the role that best describes you to begin using the live polling system
        </p>

        {/* Role Cards */}
        <div className="flex flex-col md:flex-row gap-6 w-full mb-12">
          {roles.map((role) => (
            <button
              key={role.key}
              type="button"
              className={`flex-1 rounded-xl px-6 py-6 text-left transition-all duration-200 border ${
                selected === role.key
                  ? "border-(--color-primary) bg-white shadow-md"
                  : "border-gray-200 bg-white hover:border-(--color-primary-light)"
              }`}
              onClick={() => role.enabled && setSelected(role.key)}
              disabled={!role.enabled}
            >
              <div
                className={`font-semibold text-lg mb-2 ${
                  selected === role.key
                    ? "text-(--color-primary)"
                    : "text-(--color-dark)"
                }`}
              >
                {role.title}
              </div>

              <div className="text-(--color-dark-light) text-sm">
                {role.desc}
              </div>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <button
          className={`w-64 py-3 rounded-full text-white font-semibold text-lg transition-all duration-200 ${
            selected
              ? "bg-(--color-primary) hover:bg-(--color-primary-dark) shadow-lg"
              : "bg-(--color-primary)/40 cursor-not-allowed"
          }`}
          disabled={!selected}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
}