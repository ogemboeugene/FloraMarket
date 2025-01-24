export const required = value => value ? undefined : "Required";

export const phoneNumber = value => {
  if (
    value &&
    !/^(\+254|0)?7\d{8}$/.test(value)
  ) {
    return "Invalid Kenyan phone number!";
  } else {
    return undefined;
  }
};

export const postcode = value => {
  if (value && !/^\d{5}$/.test(value)) {
    return "Invalid Kenyan postal code!";
  } else {
    return undefined;
  }
};

