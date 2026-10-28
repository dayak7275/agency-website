/**
 * Form validation primitives for the Customer Acquisition layer.
 *
 * Pure, side-effect free, deterministic. Every rule returns a typed result
 * so the caller can render field-level errors without leaking internals.
 */

/** RFC-5322-subset email shape: local@domain.tld, no spaces, no control chars. */
const EMAIL_RE = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i;

export interface FieldError {
  readonly message: string;
}

export interface FormState {
  readonly email: string;
  readonly fullName: string;
  readonly company: string;
  readonly message: string;
  readonly errors: Record<string, FieldError>;
  readonly valid: boolean;
  readonly submitting: boolean;
  readonly submitted: boolean;
}

export const EMPTY_FORM: FormState = {
  email: '',
  fullName: '',
  company: '',
  message: '',
  errors: {},
  valid: false,
  submitting: false,
  submitted: false,
};

/** Validate a single field value against its rules. */
function required(value: string, label: string): FieldError | null {
  if (!value || value.trim().length === 0) {
    return { message: `${label} is required.` };
  }
  return null;
}

function validEmail(value: string): FieldError | null {
  if (!EMAIL_RE.test(value)) {
    return { message: 'Please enter a valid email address.' };
  }
  return null;
}

function maxLength(value: string, limit: number, label: string): FieldError | null {
  if (value.length > limit) {
    return { message: `${label} must be ${limit} characters or fewer.` };
  }
  return null;
}

/**
 * Run the full validation suite over a form snapshot.
 * Returns a new FormState with errors populated; never mutates input.
 */
export function validateForm(raw: Partial<Record<keyof FormState, string>>): FormState {
  const email = String(raw.email ?? '');
  const fullName = String(raw.fullName ?? '');
  const company = String(raw.company ?? '');
  const message = String(raw.message ?? '');

  const errors: Record<string, FieldError> = {};
  let m: FieldError | null;

  const eName = required(fullName, 'Full name');
  if (eName) errors.fullName = eName;
  else if ((m = maxLength(fullName, 60, 'Full name'))) errors.fullName = m;

  const eMail = required(email, 'Email');
  if (eMail) errors.email = eMail;
  else if ((m = validEmail(email))) errors.email = m;
  else if ((m = maxLength(email, 254, 'Email'))) errors.email = m;

  if ((m = maxLength(company, 100, 'Company'))) errors.company = m;

  if ((m = maxLength(message, 1000, 'Message'))) errors.message = m;

  return {
    email,
    fullName,
    company,
    message,
    errors,
    valid: Object.keys(errors).length === 0,
    submitting: false,
    submitted: false,
  };
}
