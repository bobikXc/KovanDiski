const HONEYPOT_FIELDS = ["website", "company_url"] as const;

export function createLeadFormStartedAt(): string {
  return String(Date.now());
}

export function appendLeadSecurityFields(formData: FormData, formStartedAt: string) {
  HONEYPOT_FIELDS.forEach((field) => {
    if (!formData.has(field)) formData.append(field, "");
  });
  formData.set("form_started_at", formStartedAt);
}

export function LeadHoneypotFields({ formStartedAt }: { formStartedAt: string }) {
  return (
    <div aria-hidden="true" className="hidden">
      <label>
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label>
        Company URL
        <input name="company_url" tabIndex={-1} autoComplete="off" />
      </label>
      <input type="hidden" name="form_started_at" value={formStartedAt} />
    </div>
  );
}
