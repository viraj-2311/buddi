import { Map } from "immutable";
import _ from "lodash";
import moment from "moment";
import { openWeather } from "@iso/config/env";
import { OrderBy } from "./appConstant";
import MemoPriceTypes from "@iso/enums/memo_price_types";
import MemoTypes from "@iso/enums/memo_types";
import BookCrewStatusTypes from "@iso/enums/book_crew_status_types";

export function clearToken() {
  localStorage.removeItem("id_token");
}

export function getToken() {
  try {
    const idToken = localStorage.getItem("id_token");
    return new Map({ idToken });
  } catch (err) {
    clearToken();
    return new Map();
  }
}

export function showServerError(error) {
  if (!error) return;

  if (_.isError(error)) {
    return error.message;
  }

  if (_.isObject(error)) {
    const errorTypes = Object.keys(error);

    if (errorTypes.length === 0) return null;

    if (errorTypes.length > 0) {
      const firstError = error[errorTypes[0]];

      if (_.isString(firstError)) {
        return firstError;
      } else if (_.isArray(firstError)) {
        return firstError.join(",");
      } else {
        return "Unknown error happened";
      }
    }
  }

  return error;
}

export function timeDifference(givenTime) {
  givenTime = new Date(givenTime);
  const milliseconds = new Date().getTime() - givenTime.getTime();
  const numberEnding = (number) => {
    return number > 1 ? "s" : "";
  };
  const number = (num) => (num > 9 ? "" + num : "0" + num);
  const getTime = () => {
    let temp = Math.floor(milliseconds / 1000);
    const years = Math.floor(temp / 31536000);
    if (years) {
      const month = number(givenTime.getUTCMonth() + 1);
      const day = number(givenTime.getUTCDate());
      const year = givenTime.getUTCFullYear() % 100;
      return `${day}-${month}-${year}`;
    }
    const days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
      if (days < 28) {
        return days + " day" + numberEnding(days);
      } else {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const month = months[givenTime.getUTCMonth()];
        const day = number(givenTime.getUTCDate());
        return `${day} ${month}`;
      }
    }
    const hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
      return `${hours} hour${numberEnding(hours)} ago`;
    }
    const minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
      return `${minutes} minute${numberEnding(minutes)} ago`;
    }
    return "a few seconds ago";
  };
  return getTime();
}

export const timeAgo = (date) => {
  const givenTime = moment(date);
  return givenTime.fromNow();
};

export function stringToInt(value, defValue = 0) {
  if (!value) {
    return 0;
  } else if (!isNaN(value)) {
    return parseInt(value, 10);
  }
  return defValue;
}
export function stringToPosetiveInt(value, defValue = 0) {
  const val = stringToInt(value, defValue);
  return val > -1 ? val : defValue;
}

export const stringToDate = (dateString, format = "YYYY-MM-DD") => {
  return dateString ? moment(dateString, format) : "";
};

export const stringToTime = (timeString, format = "hh:mm A") => {
  return timeString ? moment(timeString, format) : "";
};

export const formatDateString = (dateString, format = "YYYY-MM-DD") => {
  return dateString ? moment(dateString).format(format) : "";
};

export const formatNumberToFixed = (num, fixed = 2) => {
  return num.toFixed(fixed);
};

export const formatDateRange = (startDate, endDate) => {
  const sDate = moment(startDate);
  const eDate = moment(endDate);
  if (!sDate.isValid() || !eDate.isValid()) {
    return null;
  }

  const sYear = sDate.format("YYYY");
  const sMonth = sDate.format("MMM");
  const sDay = sDate.format("Do");

  const eYear = eDate.format("YYYY");
  const eMonth = eDate.format("MMM");
  const eDay = eDate.format("Do");

  // Check if month and year are the same
  if (sYear === eYear && sMonth === eMonth) {
    return `${sMonth} ${sDay} - ${eMonth} ${eDay}, ${eYear}`;
  }

  // Check if year is the same
  if (sYear === eYear) {
    return `${sMonth} ${sDay} - ${eMonth} ${eDay}, ${eYear}`;
  }

  return `${sMonth} ${sDay}, ${sYear} - ${eMonth} ${eDay}, ${eYear}`;
};

export const formatTimeString = (timeString, format = "hh:mm A") => {
  return timeString ? moment(timeString, "HH:mm:ss").format(format) : "";
};

export const formatNumber = (number = 0) => {
  return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const formatPhoneNumber = (number) => {
  //Filter only numbers from the input
  const cleaned = `${number}`.replace(/\D/g, "");
  //Check if the input is of correct length
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  return number;
};

export const formatCurrency = (unit, number = 0) => {
  let num = number;
  if (typeof num !== "number") {
    num = isNaN(parseFloat(num)) ? 0 : parseFloat(num);
  }
  return `${unit}${formatNumber(formatNumberToFixed(num))}`;
};

export const splitFullName = (fullName) => {
  if (!fullName) return {};
  const chunks = fullName.split(" ");

  return { firstName: chunks[0], lastName: chunks[1] || "" };
};

export const isSequenceDates = (dates) => {
  const minDate = _.min(dates);
  const maxDate = _.max(dates);
  const diffDays = moment(maxDate).diff(moment(minDate), "days") + 1;

  return dates.length === diffDays ? true : false;
};

export const convertTZ = (date, timeZone) => {
  return new Date(
    typeof date === "number" || typeof date === "string" ? new Date(date) : date
  )
    .toLocaleString("en-US", { timeZone })
    .split(",")[1];
};

export const getWeather = (lat, lng) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  return fetch(
    `${openWeather.url}/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=hourly,minutely&units=metric&appid=${openWeather.key}`,
    requestOptions
  ).then((response) => response.text());
};

export const base64Image = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${url}?timestamp=${Date.now()}`);
    xhr.responseType = "blob";
    xhr.send();

    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
  });
};

export const getWeatherData = (data) => {
  const { current, timezone } = data;
  const { sunrise, sunset, temp, wind_speed } = current;
  const sunRiseWithTimeZone = convertTZ(sunrise * 1000, timezone);
  const sunSetWithTimeZone = convertTZ(sunset * 1000, timezone);
  const date = formatDateString(current.dt * 1000, "dddd, MMMM D, YYYY");
  return { sunRiseWithTimeZone, sunSetWithTimeZone, temp, wind_speed, date };
};

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const isValidEmail = (email) =>
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
    email
  );

export const getMutualConnections = (connections) => {
  let mutualConnectionText;
  if (connections.length) {
    mutualConnectionText = connections[0].fullName;
    if (connections.length > 1) {
      mutualConnectionText += ` and ${connections.length - 1} other${
        connections.length === 2 ? "" : "s"
      }`;
    }
  }
  return mutualConnectionText;
};

export const sortData = (arr, field, order = OrderBy.ASC) => {
  const sortByData = _.orderBy(
    arr,
    [(user) => (user[field] || "").toLowerCase()],
    [order]
  );
  return sortByData;
};

export const sortContact = (arr, field, order = OrderBy.ASC) => {
  const sortedData = _.orderBy(
    arr,
    [
      (user) =>
        user[field]
          ? (user[field] || "").toLowerCase()
          : (user["email"] || "").toLowerCase(),
    ],
    [order]
  );
  return sortedData;
};

export const getMemoAmount = (memoDetail) => {
  let calcAmt = 0;
  const { workingDays, workingRate, kitFee, projectRate, priceType } =
    memoDetail;
  if (priceType === MemoPriceTypes.HOURLY) {
    calcAmt = eval(workingDays * workingRate) + kitFee;
  } else {
    calcAmt = eval(projectRate + kitFee);
  }
  return calcAmt;
};

export const getMemoExtraRateFieldsAmount = (rates) => {
  let rateAmount = 0;
  rates.forEach((rate) => {
    const { dayRate, priceType, projectRate, numberOfDays } = rate;
    if (priceType === MemoPriceTypes.FIXED && projectRate) {
      rateAmount += isNaN(projectRate) ? 0 : projectRate;
    } else if (priceType === MemoPriceTypes.HOURLY && dayRate && numberOfDays) {
      rateAmount += isNaN(dayRate * numberOfDays) ? 0 : dayRate * numberOfDays;
    }
  });
  return rateAmount;
};

export const getMemoPriceWithAddRateExtraField = (memoDetail) => {
  let totalMemoPrice = 0;
  const { rates } = memoDetail;
  const memoAmount = getMemoAmount(memoDetail);
  const memoExtraRateAmount = getMemoExtraRateFieldsAmount(rates || []);
  totalMemoPrice = formatNumberToFixed(memoAmount + memoExtraRateAmount);
  return totalMemoPrice;
};

export const sortList = (optionA, optionB, sortOption) => {
  let valueA = _.get(optionA, sortOption.sortKey);
  let valueB = _.get(optionB, sortOption.sortKey);
  if (valueA && typeof valueA === "string") {
    valueA = valueA.toUpperCase();
  }
  if (valueB && typeof valueB === "string") {
    valueB = valueB.toUpperCase();
  }
  let sortVal = 0;
  if (valueA > valueB) {
    sortVal = 1;
  }
  if (valueA < valueB) {
    sortVal = -1;
  }
  if (sortVal !== 0 && sortOption.sortDir === "DESC") {
    return sortVal * -1;
  }
  return sortVal;
};

export const tagFormattedEmails = (emails) => {
  if (!emails) return [];
  return emails.map((email) => ({ id: email, name: email }));
};

export const downloadFile = (data, fileName) => {
  const downloadUrl = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const replaceBlankSpace = (value, replaceText = "_") => {
  return value.replace(/ /g, replaceText);
};

export const getW9AttachmentName = (authUser, file) => {
  return replaceBlankSpace(
    `${authUser.fullName}_W9.${file.name.split(".").pop()}`
  );
};

export const formatRatesFields = (rates) => {
  rates.forEach((e) => {
    delete e.isEdit;
    if (e.priceType === MemoPriceTypes.FIXED) {
      delete e.numberOfDays;
      delete e.dayRate;
    } else if (e.priceType === MemoPriceTypes.HOURLY) {
      delete e.projectRate;
    }
  });
};

export const getBookCrewStatus = ({ crew }) => {
  if (crew.memoType === MemoTypes.HOLD) {
    return "";
  } else {
    if (crew.accepted) {
      return BookCrewStatusTypes.CONFIRMED;
    } else if (crew.decline) {
      return BookCrewStatusTypes.DECLINED;
    } else if (crew.booked) {
      return BookCrewStatusTypes.MEMO_SENT;
    } else {
      return BookCrewStatusTypes.MEMO_SAVED;
    }
  }
};

export const getIsShouldBookCrewConsidered = (crew, crewIndex, crewList) => {
  if (crew?.memoStatus !== BookCrewStatusTypes.MEMO_SAVED) {
    return false;
  }
  if (crewIndex !== 0) {
    const filteredCrewList = crewList.filter((_, i) => i < crewIndex);
    for (let i = 0; i < filteredCrewList.length; i++) {
      if (
        !filteredCrewList[i].memoStatus ||
        filteredCrewList[i].memoStatus !== BookCrewStatusTypes.DECLINED
      ) {
        return false;
      }
    }
    return true;
  }
  return true;
};

export const generateInvitationList = (emails, query) => {
  const emailArr = [];
  emails.forEach((email) => {
    emailArr.push({
      full_name: email,
      email,
    });
  });

  if (query && isValidEmail(query)) {
    // Check duplicated email
    const invitationArray = emails.map((name) => name.toLowerCase());
    if (!invitationArray.includes(query.toLowerCase())) {
      emailArr.push({
        full_name: query,
        email: query,
      });
    }
  }
  return emailArr;
};

export const generateWindowDimensions = () => {
  const { screen } = window;
  const width = screen.width > 797 ? 600 : screen.width - 30;
  const height = screen.width > 797 ? 600 : screen.width - 30;
  const left = screen.width / 2 - width / 2;
  const top = screen.height / 2 - height / 2;
  return { width, height, left, top };
};
export const truncateWithEllipses = (input, max = 10) =>
  input.length > max ? `${input.substring(0, max - 1)}...` : input;