// utils/sanitize.js

export const sanitize = (obj) => {
  const cleanObj = {};

  for (let key in obj) {
    let value = obj[key];

    if (typeof value === "string") {
      value = value.trim(); // remove spaces
      value = value.replace(/[<>]/g, ""); // remove HTML tags
      value = value.replace(/['";]/g, ""); // remove SQL injection characters
    }

    cleanObj[key] = value;
  }

  return cleanObj;
};
