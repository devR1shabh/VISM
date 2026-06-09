export function validatePassport(
  passportData
) {
  const errors = [];

  if (
    !passportData.passportNumber
  ) {
    errors.push(
      "Passport number missing"
    );
  }

  if (
    !passportData.fullName
  ) {
    errors.push(
      "Full name missing"
    );
  }

  if (
    !passportData.expiryDate
  ) {
    errors.push(
      "Expiry date missing"
    );
  }

  return {
    valid:
      errors.length === 0,

    errors,
  };
}