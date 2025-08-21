import React from "react";
import AdminSelector from "./AdminSelector";

function AdminSelectorGroup({
  data,
  handleWardSelect,
  recent_wards,
  recent_subcounties,
  counties_data,
  county_selected,
  subcounty_selected,
  ward_selected,
  handleCountySelect,handleSubCountySelect,
  showCounty=true
}) {
  return (
    <div className={`grid ${showCounty ?"lg:grid-cols-3":"lg:grid-cols-6"}  gap-3 p-3`}>
        {showCounty &&
        <AdminSelector
        key_value="id"
        key_name="County"
        label="Select county"
        data={counties_data}
        handleSelect={handleCountySelect}
        defaultVal={
          county_selected !== null ? county_selected.id : null
        }
      />
        }
      
      <AdminSelector
        key_value="id"
        key_name="Subcounty"
        label="Select sub-county"
        data={recent_subcounties}
        handleSelect={handleSubCountySelect}
        defaultVal={
          subcounty_selected !== null ? subcounty_selected.id : null
        }

        //   defaultVal={subCountySelected !== null && subCountySelected}
      />
      <AdminSelector
        key_value="id"
        key_name="Ward"
        label="Select ward"
        data={recent_wards}
        handleSelect={handleWardSelect}
        defaultVal={ward_selected !== null ? ward_selected.id : null}
      />
      {/* {JSON.stringify(subcounty_selected)} */}

      
    </div>
  );
}

export default AdminSelectorGroup;
