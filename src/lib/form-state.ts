/** Shared result shape for admin forms that use useActionState. */
export type FormState = { ok?: boolean; message?: string; fieldErrors?: Record<string, string> } | null;
