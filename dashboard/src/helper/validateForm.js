export const validateSchema = (rules, form) => {
  const errors = {};

  for (let field in form) {
    const rule = rules[field];

    if (!rule) continue;

    if (rule.required && !String(form[field] ?? "").trim()) {
      errors[field] = rule.message || `${field} is required`;
    }
  }

  return errors;
};
