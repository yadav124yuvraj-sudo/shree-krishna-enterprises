/** Result of a public (customer) form. `values` lets the form keep what the customer typed after an error. */
export type PublicFormState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
  refCode?: string;
  values?: Record<string, string>;
} | null;
