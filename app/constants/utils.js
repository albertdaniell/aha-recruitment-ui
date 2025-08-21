function FormatDate(d) {
  let date = new Date(d);
  var parts = date.toString().split(" ");

  // console.log(parts);

  var months = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  return d === undefined
    ? ""
    : `${parts[1]} ${parts[2]}, ${parts[3]} Time: ${parts[4]}`;
}
function groupDataByForecastPeriod(data) {
  const groupedData = {};

  // Iterate over each object in the data array
  data.forEach((item) => {
    // Extract the forecast period
    const forecastPeriod = item.forecast_period;

    // If the forecast period doesn't exist in the grouped data, create an empty array for it
    if (!groupedData[forecastPeriod]) {
      groupedData[forecastPeriod] = [];
    }

    // Push the current item into the array corresponding to its forecast period
    groupedData[forecastPeriod].push(item);
  });

  return groupedData;
}

function isEmptyString(value) {
  return (
    value == null || (typeof value === "string" && value.trim().length === 0)
  );
}

const JsonToformData = (item) => {
  var form_data = new FormData();
  // console.log(item)
  for (var key in item) {
    //check if item is an array

    if (Array.isArray(item[key])) {
      item[key].map((i) => {
        form_data.append(key, i);
      });
    } else {
      form_data.append(key, item[key]);
    }
  }

  return form_data;
};
function isEmail(text) {
  // Regular expression for a simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Test if the provided text matches the email regex
  return emailRegex.test(text);
}

const sortedData = (data) => {
  return [...data].sort((a, b) => {
    const statsWardA = Number(a.stats_ward);
    const statsWardB = Number(b.stats_ward);

    if (statsWardA < statsWardB) {
      return 1;
    } else if (statsWardA > statsWardB) {
      return -1;
    } else {
      return 0;
    }
  });
};

const sortedApplicationsData = (data) => {
  
  return [...data].sort((a, b) => {
    const statsWardA = Number(a.score);
    const statsWardB = Number(b.score);

    if (statsWardA < statsWardB) {
      return 1;
    } else if (statsWardA > statsWardB) {
      return -1;
    } else {
      return 0;
    }
  });
};

function getFileTypeFromUrl(url) {
  // Extract the file extension from the URL
  const parts = url.split(".");
  const extension = parts[parts.length - 1].toLowerCase();

  // Define a mapping of common file extensions to file types
  const fileTypeMap = {
    jpg: "pic",
    jpeg: "pic",
    png: "pic",
    gif: "pic",
    svg: "pic",
    pdf: "pdf",
    csv: "csv",
    // Add more file extensions and types as needed
  };

  // Look up the file type based on the file extension
  const fileType = fileTypeMap[extension] || "unknown";

  return fileType;
}

async function getFileSize(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const contentLength = response.headers.get("content-length");
    if (contentLength) {
      const fileSizeInBytes = parseInt(contentLength, 10);
      return fileSizeInBytes;
    } else {
      throw new Error("Content-Length header not found");
    }
  } catch (error) {
    // console.error("Error getting file size:", error);
    return null;
  }
}

const make_WardApplicants_Enumerators = (data, COUNTY = null) => {
  if (COUNTY != "admin") {
    let wards = data.map((d) => d.ward);
    let applications = data.map((d) => d.stats_ward);
    // stats_ward
    // ward_enumerators
    let enumerators = data.map((d) => d.ward_enumerators);

    let options = {
      chart: {
        type: "column",
      },
      title: {
        text: "",
      },

      xAxis: {
        categories: wards,
      },
      yAxis: {
        title: {
          text: "Count",
        },
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true,
          },
          enableMouseTracking: false,
        },
      },
      series: [
        {
          name: "Applications",
          data: applications,
        },
        {
          name: "Agripreneurs",
          data: enumerators,
        },
      ],
    };

    return options;
  } else {
    let wards = data.map((d) => d.county);
    let applications = data.map((d) => d.data.stats_);
    // stats_ward
    // ward_enumerators
    // console.log({ data });
    let enumerators = data.map((d) => d.data._enumerators);

    let options = {
      chart: {
        type: "column",
      },
      title: {
        text: "",
      },

      xAxis: {
        categories: wards,
      },
      yAxis: {
        title: {
          text: "Count",
        },
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true,
          },
          enableMouseTracking: false,
        },
      },
      series: [
        {
          name: "Applications",
          data: applications,
        },
        {
          name: "Agripreneurs",
          data: enumerators,
        },
      ],
    };

    return options;
  }
};

const make_gender_pie = (data) => {
  let male = data.male_applicants;
  let female = data.female_applicants;
  let others =
    data.total_applicants - (data.male_applicants + data.female_applicants);

  return {
    chart: {
      type: "pie",
    },
    title: {
      text: "",
    },
    tooltip: {
      valueSuffix: "",
    },

    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: [
          {
            enabled: true,
            distance: 20,
          },
          {
            enabled: true,
            distance: -40,
            format: "{point.percentage:.1f}%",
            style: {
              fontSize: "1.2em",
              textOutline: "none",
              opacity: 0.7,
            },
            filter: {
              operator: ">",
              property: "percentage",
              value: 10,
            },
          },
        ],
      },
    },
    series: [
      {
        name: "Applications",
        colorByPoint: true,
        data: [
          {
            name: "Male",
            y: male,
          },
          {
            name: "Female",
            sliced: true,
            selected: true,
            y: female,
          },
          {
            name: "Others",
            y: others,
          },
        ],
      },
    ],
  };
};

const make_data_past_7_days_graph = (data, COUNTY = null) => {
  let x_axis = data.map((d) => d.date);
  let y_axis = data.map((d) => d.count);

  let options = {
    chart: {
      type: "column",
    },
    title: {
      text: "",
    },

    xAxis: {
      categories: x_axis,
    },
    yAxis: {
      title: {
        text: "Count",
      },
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
        },
        enableMouseTracking: false,
      },
    },
    series: [
      {
        name: "Applications",
        data: y_axis,
      },
    ],
  };

  return options;
};

const getCookie = (name) => {
  const cookieValue = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(name))
    ?.split("=")[1];
  return cookieValue ? decodeURIComponent(cookieValue) : "";
};

const countWords = (text) => {
  const wordsArray = text.split(/\s+/);

  // Count the number of words
  const wordCount = wordsArray.length;

  return wordCount;
};

const generateCountySubCountyWard = (data) => {
  // data = data.data.data
  // data =data.data.data.counties
  // console.log(data.data.counties)
  data = data.data.counties;
  // return 0
  let subcounties = new Set();
  let counties = new Set();

  const uniqueData = [];
  const uniqueCounties = [];

  if (Array.isArray(data)) {
    console.log("is array");

    data.forEach((entry) => {
      const subcounty = entry["Subcounty"];
      // console.log(subcounty)
      if (!subcounties.has(subcounty) && subcounty !==null && subcounty !== "") {
        uniqueData.push(entry);
        subcounties.add(subcounty);
      }

      data.forEach((entry) => {
        const county = entry["County"];
        if (!counties.has(county)) {
          uniqueCounties.push(entry);
          counties.add(county);
        }
      });
    });


  } else {
    console.log("Not array");
  }

  // console.log(uniqueData);

 
  // let wards = data.counties.map((d)=>d.Ward)
  return {
    "subcounties":uniqueData.sort((a, b) => a["Subcounty"].localeCompare(b["Subcounty"])),
    "counties":uniqueCounties.sort((a, b) => a["County"].localeCompare(b["County"])),
    "wards":data
  };
};

const isNumberCheck = (word) => {
  // Check if ahag1 is a number
  if (!isNaN(parseFloat(word)) && isFinite(word)) {
    // console.log('ahag1 is a number.');
    return true;
  } else {
    return false;
    // console.log('ahag1 is not a number.');
  }
};
export {
  generateCountySubCountyWard,
  isNumberCheck,
  countWords,
  groupDataByForecastPeriod,
  getCookie,
  isEmptyString,
  JsonToformData,
  FormatDate,
  isEmail,
  sortedData,
  getFileTypeFromUrl,
  sortedApplicationsData,
  getFileSize,
  make_WardApplicants_Enumerators,
  make_gender_pie,
  make_data_past_7_days_graph,
};
