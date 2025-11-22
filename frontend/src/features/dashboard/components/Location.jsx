// import React, { useState } from "react";

// const Location = () => {
//   const [form, setForm] = useState({
//     name: "",
//     shortCode: "",
//     warehouse: "",
//   });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Location Submitted:", form);
//   };

//   return (
//     <div className="p-6 text-light">
//       <h1 className="text-3xl font-semibold text-primary mb-6">Location</h1>

//       <form
//         onSubmit={handleSubmit}
//         className="bg-dark border border-primary rounded-lg p-6 max-w-xl"
//       >
//         {/* Name */}
//         <label className="block mb-4">
//           <span className="text-light text-sm">Name:</span>
//           <input
//             type="text"
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             className="w-full mt-1 p-2 bg-dark border border-primary text-light rounded"
//           />
//         </label>

//         {/* Short Code */}
//         <label className="block mb-4">
//           <span className="text-light text-sm">Short Code:</span>
//           <input
//             type="text"
//             name="shortCode"
//             value={form.shortCode}
//             onChange={handleChange}
//             className="w-full mt-1 p-2 bg-dark border border-primary text-light rounded"
//           />
//         </label>

//         {/* Warehouse dropdown */}
//         <label className="block mb-6">
//           <span className="text-light text-sm">Warehouse:</span>
//           <select
//             name="warehouse"
//             value={form.warehouse}
//             onChange={handleChange}
//             className="w-full mt-1 p-2 bg-dark border border-primary text-light rounded"
//           >
//             <option value="">Select Warehouse</option>
//             <option value="WH1">WH1</option>
//             <option value="Main Warehouse">Main Warehouse</option>
//             <option value="Secondary Warehouse">Secondary Warehouse</option>
//           </select>
//         </label>

//         {/* Submit */}
//         <button
//           type="submit"
//           className="px-4 py-2 bg-primary text-dark font-semibold rounded hover"
//         >
//           Add Location
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Location;

import React, { useState } from "react";

const Location = () => {
  const [form, setForm] = useState({
    name: "",
    shortCode: "",
    warehouse: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Location Submitted:", form);
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
          Location
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block mb-1 text-md">Name</label>
            <input
              type="text"
              placeholder="Enter Location Name"
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
              placeholder="Enter Short Code"
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

          {/* Warehouse Dropdown */}
          <div>
            <label className="block mb-1 text-md">Warehouse</label>
            <select
              name="warehouse"
              value={form.warehouse}
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
            >
              <option value="">Select Warehouse</option>
              <option value="WH1">WH1</option>
              <option value="Main Warehouse">Main Warehouse</option>
              <option value="Secondary Warehouse">Secondary Warehouse</option>
            </select>
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
              Add Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Location;