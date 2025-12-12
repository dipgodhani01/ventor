export function validationErrors(zodError) {
  let errorMessage = "Validation Failed";
  let allErrors = [];

  if (zodError?.issues && Array.isArray(zodError?.issues)) {
    allErrors = zodError.issues.map((issue) => ({
      field: issue.path ? issue.path.join(".") : "unknown",
      message: issue.message || "Validation Error",
      code: issue.code,
    }));

    return (errorMessage = allErrors[0] || "Validation Error");
  }
}
