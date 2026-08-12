import MandateForm from "@/components/investors/MandateForm";

export default function NewMandatePage() {
  return (
    <div>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: 24, marginBottom: 8 }}>New capital mandate</h1>
      <p style={{ fontSize: 13, color: "var(--t-mid)", marginBottom: 24, maxWidth: 480 }}>
        Describes what a Regenera project needs, structurally distinct from an investor&apos;s own appetite record.
        Starts as a draft; compliance fields (offering pathway, accredited-only, broker-dealer involvement) can be
        set from the mandate detail page once counsel has reviewed the raise.
      </p>
      <MandateForm />
    </div>
  );
}
