import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
};

export default function RefundPolicyPage() {
  return (
    <LegalLayout
      title="Refund & Cancellation Policy"
      effectiveDate="1 September 2026"
    >
      <h2>1. Overview</h2>
      <p>
        This policy explains how cancellations and refunds are handled for
        online coaching and in-person sessions. It should be read
        alongside our{" "}
        <a href="/terms-and-conditions">Terms &amp; Conditions</a>.
      </p>

      <h2>2. Commitment &amp; Payment</h2>
      <ul>
        <li>
          All online coaching services operate on a minimum 12-week
          commitment
        </li>
        <li>
          Payment is made either via recurring subscription, or as an
          upfront 12-week payment
        </li>
        <li>A one-off onboarding fee applies to online coaching services</li>
        <li>
          Following the initial 12-week period, subscriptions continue
          automatically unless cancelled prior to the next billing cycle
        </li>
        <li>
          In-person coaching has no minimum commitment and is booked on a
          session-by-session basis
        </li>
      </ul>

      <h2>3. Cancellation &amp; Refund Policy</h2>
      <ul>
        <li>Payments are non-refundable</li>
        <li>
          Subscription cancellations must be made before the next billing
          cycle
        </li>
        <li>
          Cancellation during the initial 12-week period does not remove
          the obligation to complete payment
        </li>
      </ul>

      <h3>In-Person Sessions</h3>
      <ul>
        <li>A minimum of 24 hours&rsquo; notice is required to cancel or reschedule</li>
        <li>
          Late cancellations or no-shows will result in the session being
          forfeited and charged in full
        </li>
      </ul>

      <h2>4. Exceptional Circumstances</h2>

      <h3>Online</h3>
      <p>
        In cases of injury, illness, or unforeseen circumstances that
        significantly impact your ability to train, the following
        applies: for minor niggles, modify or skip the affected exercise
        and continue at your own discretion. For significant injury,
        pause training, consult a medical professional, and notify your
        coach as soon as possible.
      </p>
      <p>
        Please note: individual programme modifications for injury
        management are not included in the Foundation or Intermediate
        programme. If ongoing injury management and programme adjustments
        are required, this is available through the Advanced programme.
        Contact your coach to discuss upgrading.
      </p>
      <p>
        All other adjustments are made at the discretion of Pera Gibbs
        Movement and assessed on a case-by-case basis.
      </p>

      <h3>In-Person</h3>
      <p>
        In cases of genuine unforeseen circumstances (e.g. illness,
        injury, or significant events), rescheduling may be considered.
        Any exceptions are made at the discretion of Pera Gibbs Movement
        and assessed on a case-by-case basis.
      </p>

      <h2>5. Contact Us</h2>
      <p>
        For any refund, cancellation, or billing question, contact{" "}
        <a href="mailto:admin@peragibbsmovement.com">
          admin@peragibbsmovement.com
        </a>{" "}
        or reach out via{" "}
        <a href="https://wa.me/64220470407" target="_blank" rel="noreferrer">
          WhatsApp
        </a>
        .
      </p>
    </LegalLayout>
  );
}