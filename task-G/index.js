// index.js
// Author: adapted for registration task
// Date: 2025-10-31

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  const timestampInput = document.getElementById("timestamp");
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const birthDateInput = document.getElementById("birthDate");
  const termsInput = document.getElementById("terms");

  const tbody = document.getElementById("timetable").querySelector("tbody");

  // Error elements
  const err = {
    fullName: document.getElementById("err-fullName"),
    email: document.getElementById("err-email"),
    phone: document.getElementById("err-phone"),
    birthDate: document.getElementById("err-birthDate"),
    terms: document.getElementById("err-terms"),
  };

  // Utility: format timestamp for display
  function formattedNowISO() {
  return new Date().toLocaleString();
}


  // Fill hidden timestamp on load and on focus before submit
  function fillTimestamp() {
    timestampInput.value = formattedNowISO();
  }
  fillTimestamp();

  // Validation rules (custom)
  function validateFullName(value) {
    if (!value) return "Please enter your full name (first and last).";
    // split by spaces, filter empty
    const parts = value.trim().split(/\s+/).filter(Boolean);
    if (parts.length < 2) return "Please include at least two names (e.g., first and last).";
    for (const p of parts) {
      if (p.length < 2) return "Each name in your full name must be at least 2 characters.";
    }
    return "";
  }

  function validateEmail(value) {
    if (!value) return "Please enter your email address.";
    // basic extra-check (not fully RFC)
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) return "That doesn't look like a valid email address.";
    return "";
  }

  function validatePhone(value) {
    if (!value) return "Please enter your phone number.";
    // Allowed: +358 or 0 then digits, allow spaces or hyphens; normalize before check
    const normalized = value.replace(/[\s-]/g, "");
    // Accept +358 followed by 6-12 digits OR 0 followed by 6-12 digits
    const re = /^(\+358|0)\d{6,12}$/;
    if (!re.test(normalized)) {
      return "Phone must start with +358 or 0 and contain 6–12 digits after that (e.g., +358401234567 or 0401234567).";
    }
    return "";
  }

  function validateBirthDate(value) {
    if (!value) return "Please provide your birth date.";
    const date = new Date(value + "T00:00:00");
    const now = new Date();
    if (isNaN(date.getTime())) return "Invalid date format.";
    if (date > now) return "Birth date cannot be in the future.";
    // Minimum age 13
    const minAge = 13;
    const ageDiff = now.getFullYear() - date.getFullYear();
    const monthDiff = now.getMonth() - date.getMonth();
    const dayDiff = now.getDate() - date.getDate();
    let age = ageDiff;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
    if (age < minAge) return `You must be at least ${minAge} years old to register.`;
    return "";
  }

  function validateTerms(checked) {
    return checked ? "" : "You must accept the terms to continue.";
  }

  // Clear error messages
  function clearErrors() {
    Object.values(err).forEach(e => e.textContent = "");
  }

  // Focus first field with error
  function focusFirstError(errors) {
    const order = ["fullName", "email", "phone", "birthDate", "terms"];
    for (const key of order) {
      if (errors[key]) {
        const el = {
          fullName: fullNameInput,
          email: emailInput,
          phone: phoneInput,
          birthDate: birthDateInput,
          terms: termsInput
        }[key];
        if (el) el.focus();
        break;
      }
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();
    fillTimestamp(); // ensure current value

    const values = {
      timestamp: timestampInput.value,
      fullName: fullNameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      birthDate: birthDateInput.value,
      terms: termsInput.checked,
    };

    // Collect custom error messages
    const errors = {
      fullName: validateFullName(values.fullName),
      email: validateEmail(values.email),
      phone: validatePhone(values.phone),
      birthDate: validateBirthDate(values.birthDate),
      terms: validateTerms(values.terms),
    };

    const hasError = Object.values(errors).some(msg => msg);

    if (hasError) {
      // show messages near fields
      Object.entries(errors).forEach(([k, v]) => {
        if (v) err[k].textContent = v;
      });
      focusFirstError(errors);
      return;
    }

    // If valid: append a new row to the table
    const tr = document.createElement("tr");

    // Timestamp
    const tdTimestamp = document.createElement("td");
    tdTimestamp.textContent = values.timestamp;
    tr.appendChild(tdTimestamp);

    // Full name
    const tdName = document.createElement("td");
    tdName.textContent = values.fullName;
    tr.appendChild(tdName);

    // Email
    const tdEmail = document.createElement("td");
    tdEmail.textContent = values.email;
    tr.appendChild(tdEmail);

    // Phone
    const tdPhone = document.createElement("td");
    tdPhone.textContent = values.phone;
    tr.appendChild(tdPhone);

    // Birth date (display in ISO date)
    const tdBirth = document.createElement("td");
    tdBirth.textContent = values.birthDate;
    tr.appendChild(tdBirth);

    // Terms
    const tdTerms = document.createElement("td");
    tdTerms.textContent = values.terms ? "Accepted" : "Not accepted";
    tr.appendChild(tdTerms);

    tbody.appendChild(tr);

    // Optionally: visual feedback (scroll row into view)
    tr.scrollIntoView({ behavior: "smooth", block: "center" });

    // Reset the form for the next entry and refill timestamp
    form.reset();
    fillTimestamp();
    fullNameInput.focus();
  });

  // Real-time validation (optional lightweight: clear message when user types)
  fullNameInput.addEventListener("input", () => { err.fullName.textContent = ""; });
  emailInput.addEventListener("input", () => { err.email.textContent = ""; });
  phoneInput.addEventListener("input", () => { err.phone.textContent = ""; });
  birthDateInput.addEventListener("change", () => { err.birthDate.textContent = ""; });
  termsInput.addEventListener("change", () => { err.terms.textContent = ""; });

});
