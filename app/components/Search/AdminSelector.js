import React from "react";

function AdminSelector({
  data,
  handleSelect,
  defaultVal,
  label,
  key_value = "id",
  key_name = "name",
}) {
  const handleSel = (val) => {
    if (val !== "null") {
      // alert(val)
      handleSelect(val);
    }
  };
  return (
    <div className="relative">
      {/* {JSON.stringify(defaultVal)} */}
      <label for="selection">
        {label}
      </label>
      <select
        // defaultValue={defaultVal !== null ? defaultVal : null}
        onChange={(e) => handleSel(e.target.value)}
        class="block md:mt-2 mt-1 min-h-[40px]  w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:border-gray-500"
      >
        {/* <select
        defaultValue={defaultVal !== null ? JSON.stringify(defaultVal) : ""}
        onChange={(e) => handleSelect(e.target.value)}
        className="mt-4 w-[100%] h-[60px] p-4 border-0 rounded-lg"
      > */}
        {data !== null && (
          <>
           {!defaultVal &&
            <option value={JSON.stringify(null)}>---------</option>
           
           }
            {/* <option value={JSON.stringify(null)}>---------</option> */}


            {data.map((val) => {
              return (
                <option
                  selected={defaultVal === val[key_value] ? true : false}
                  class="bg-white text-gray-700"
                  value={JSON.stringify(val)}
                  //   value={val[key_value]}
                >
                  {val[key_name].toUpperCase()}
                </option>
              );
            })}
          </>
        )}
      </select>
    </div>
  );
}

export default AdminSelector;
