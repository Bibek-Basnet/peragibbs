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
        This policy explains how cancellations, refunds, and rescheduling
        are handled for both our online coaching programs and in-person
        sessions. It should be read alongside our{" "}
        <a href="/terms-and-conditions">Terms &amp; Conditions</a>.
      </p>

      <h2>2. Online Coaching - Minimum Commitment Period</h2>
      <p>
        Online coaching requires an initial minimum commitment of 12
        weeks. Fees for this period, whether paid weekly or upfront, are
        non-refundable except where required by law, as this period
        reflects the time and programming resources committed to
        designing and delivering your initial training block.
      </p>
      <p>
        If you need to pause or stop training during the 12-week minimum
        period due to injury or exceptional circumstances, contact us -
        we handle these situations on a case-by-case basis and will work
        with you on a reasonable outcome, which may include pausing your
        program rather than cancelling it outright.
      </p>

      <h2>3. Online Coaching - After the Minimum Commitment</h2>
      <p>
        Once the initial 12-week period is complete, coaching continues on
        a rolling monthly subscription. You may cancel at any time by
        notifying us via email or WhatsApp. Cancellation will take effect
        at the end of your current billing cycle - you will not be billed
        for any further weekly or monthly periods after cancellation, and
        no partial refund is issued for the remainder of an already-paid
        billing cycle.
      </p>

      <h2>4. Onboarding Fee</h2>
      <p>
        The one-time onboarding fee charged at the start of a new coaching
        engagement covers the initial assessment, program design, and
        setup, and is non-refundable once your program has been designed
        and delivered, regardless of subsequent cancellation.
      </p>

      <h2>5. In-Person Session Cancellation</h2>
      <ul>
        <li>
          Sessions cancelled with at least{" "}
          <strong>24 hours&rsquo; notice</strong> may be rescheduled at no
          charge, subject to availability.
        </li>
        <li>
          Sessions cancelled with less than 24 hours&rsquo; notice, or
          missed without notice (&ldquo;no-shows&rdquo;), are charged in
          full and are non-refundable.
        </li>
        <li>
          Repeated late cancellations or no-shows may result in a
          requirement to prepay for future sessions or, in ongoing cases,
          discontinuation of in-person coaching availability.
        </li>
      </ul>

      <h2>6. Refund Process</h2>
      <p>
        Where a refund is approved under this policy or at our discretion,
        it will be processed to the original payment method within{" "}
        <strong>7–10 business days</strong>. Please note that your bank or
        card provider may take additional time to reflect the refund in
        your account.
      </p>

      <h2>7. Exceptional Circumstances</h2>
      <p>
        We understand that injury, illness, or significant personal
        circumstances can affect your ability to train. If this happens,
        contact us as soon as possible - we would rather work with you on
        pausing or adjusting your program than apply this policy rigidly.
        Any exception granted under this section is at our discretion and
        does not set a precedent for future requests.
      </p>

      <h2>8. Chargebacks &amp; Disputes</h2>
      <p>
        If you have a concern about a charge, please contact us directly
        before initiating a chargeback or payment dispute with your bank
        or card provider - we are able to resolve most billing questions
        quickly and directly.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. Changes will be
        posted on this page with a revised effective date and will not
        retroactively affect a coaching engagement already in progress
        under the previous terms.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        For any refund, cancellation, or billing question, contact{" "}
        <a href="mailto:admin@peragibbsmovement.com">
          admin@peragibbsmovement.com
        </a>{" "}
        or reach out via{" "}
        <a
          href="https://wa.me/64220470407"
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>
        .
      </p>
    </LegalLayout>
  );
}