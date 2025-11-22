// import React, { useState } from "react";

// const Warehouse = () => {
//   const [form, setForm] = useState({
//     name: "",
//     shortCode: "",
//     address: "",
//   });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Warehouse Submitted:", form);
//   };

//   return (
//     <div className="flex justify-center items-start min-h-screen pt-2 px-4">
//       <div
//         className="
//           w-full
//           max-w-3xl
//           p-10
//           rounded-2xl
//           shadow-xl
//           backdrop-blur-xl
//           bg-yellow-200/10
//           border border-yellow-300/20
//         "
//       >
//         <h1 className="text-4xl font-bold text-yellow-300 mb-8 text-center">
//           Warehouse
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Name */}
//           <div>
//             <label className="block mb-1 text-white text-sm">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               className="
//                 w-full
//                 p-3
//                 rounded-md
//                 bg-black/40
//                 border border-yellow-300/30
//                 text-white
//                 focus:outline-none
//                 focus:border-yellow-300
//               "
//             />
//           </div>

//           {/* Short Code */}
//           <div>
//             <label className="block mb-1 text-white text-sm">Short Code</label>
//             <input
//               type="text"
//               name="shortCode"
//               value={form.shortCode}
//               onChange={handleChange}
//               className="
//                 w-full
//                 p-3
//                 rounded-md
//                 bg-black/40
//                 border border-yellow-300/30
//                 text-white
//                 focus:outline-none
//                 focus:border-yellow-300
//               "
//             />
//           </div>

//           {/* Address */}
//           <div>
//             <label className="block mb-1 text-white text-sm">Address</label>
//             <input
//               type="text"
//               name="address"
//               value={form.address}
//               onChange={handleChange}
//               className="
//                 w-full
//                 p-3
//                 rounded-md
//                 bg-black/40
//                 border border-yellow-300/30
//                 text-white
//                 focus:outline-none
//                 focus:border-yellow-300
//               "
//             />
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             className="
//               px-6 py-3
//               bg-yellow-400
//               hover:bg-yellow-500
//               text-black
//               font-semibold
//               rounded-md
//               transition

//             "
//           >
//             Add Warehouse
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Warehouse;

import React, { useState } from "react";

const Warehouse = () => {
  const [form, setForm] = useState({
    name: "",
    shortCode: "",
    address: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Warehouse Submitted:", form);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <div
        className="
          w-full 
          max-w-3xl 
          p-10 
          rounded-2xl 
          shadow-2xl 
          bg-gray-800/50
          border border-gray-700
          text-white
        "
      >
        {/* Centered Title */}
        <h1 className="text-4xl font-bold mb-10 text-center text-yellow-400">
          Warehouse
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block mb-1 text-md">Name</label>
            <input
              type="text"
              placeholder="Enter the Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="
                w-full 
                p-3 
                rounded-md 
                bg-gray-900 
                border border-gray-600
                text-white
                focus:outline-none 
                focus:border-yellow-400
              "
            />
          </div>

          {/* Short Code */}
          <div>
            <label className="block mb-1 text-md">Short Code</label>
            <input
              type="text"
              placeholder="Enter the Short Code"
              name="shortCode"
              value={form.shortCode}
              onChange={handleChange}
              className="
                w-full 
                p-3 
                rounded-md 
                bg-gray-900 
                border border-gray-600
                text-white
                focus:outline-none 
                focus:border-yellow-400
              "
            />
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1 text-md">Address</label>
            <input
              type="text"
              placeholder="Enter the Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="
                w-full 
                p-3 
                rounded-md 
                bg-gray-900 
                border border-gray-600
                text-white
                focus:outline-none 
                focus:border-yellow-400
              "
            />
          </div>

          {/* Centered Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="
                px-8 py-3 
                bg-yellow-400 
                hover:bg-yellow-500 
                text-black 
                font-semibold 
                rounded-md 
                transition
              "
            >
              Add Warehouse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Warehouse;