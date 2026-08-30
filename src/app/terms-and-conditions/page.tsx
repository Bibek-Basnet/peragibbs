import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions" effectiveDate="1 September 2026">
      <h2>1. Acceptance of Terms</h2>
      <p>
        These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your
        access to and use of peragibbsmovement.com (the &ldquo;Site&rdquo;)
        and the coaching Services provided by Pera Gibbs Movement
        (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). By
        applying for, purchasing, or using our Services, you agree to be
        bound by these Terms. If you do not agree, please do not use our
        Services.
      </p>

      <h2>2. Description of Services</h2>
      <p>We provide the following coaching Services:</p>
      <ul>
        <li>
          <strong>Online coaching</strong> across three tiers - Foundation,
          Intermediate, and Advanced - each offering different levels of
          programming and support as described on the Site;
        </li>
        <li>
          <strong>In-person coaching</strong> - 1:1 and small group
          sessions covering skills, speed, movement quality, strength and
          conditioning.
        </li>
      </ul>
      <p>
        Service inclusions, pricing, and structure are as described on the
        Site at the time of application and are subject to change for
        future intakes.
      </p>

      <h2>3. Eligibility &amp; Athletes Under 18</h2>
      <p>
        Our Services are available to athletes of all ages. Where a client
        is under the age of 18, a parent or legal guardian must complete
        the application, agree to these Terms on the athlete&rsquo;s
        behalf, and remain responsible for payment and communication
        regarding the athlete&rsquo;s program.
      </p>

      <h2>4. Coaching Commitment &amp; Program Structure</h2>
      <p>
        Online coaching requires a minimum initial commitment of 12 weeks.
        Following the initial 12-week period, coaching continues on a
        rolling monthly (subscription) basis, which may be cancelled at
        any time in accordance with Section 6.
      </p>
      <p>
        Programming is delivered according to the tier selected at
        application. Advanced-tier clients receive weekly check-ins and
        programming adjustments; Foundation and Intermediate tiers receive
        a structured block designed at the start of the commitment period,
        which is self-managed by the athlete.
      </p>

      <h2>5. Payment Terms</h2>
      <ul>
        <li>
          Online coaching is billed weekly on a rolling basis, or may be
          paid upfront for the applicable commitment period, at the
          client&rsquo;s election.
        </li>
        <li>
          A one-time onboarding fee applies at the start of a new coaching
          engagement, as specified for the selected tier at the time of
          application.
        </li>
        <li>
          In-person session rates are as published on the Site and are
          payable at the time of booking or as otherwise agreed.
        </li>
        <li>
          Prices are subject to change for new clients or new intakes;
          existing clients will be notified of any pricing changes
          affecting their ongoing program in advance.
        </li>
        <li>
          Failure to make payment when due may result in suspension of
          coaching Services until the account is brought current.
        </li>
      </ul>
      <p>
        See our{" "}
        <a href="/refund-and-cancellation">Refund &amp; Cancellation Policy</a>{" "}
        for details on cancelling your coaching subscription and our
        refund terms.
      </p>

      <h2>6. Cancellation</h2>
      <p>
        After the initial 12-week minimum commitment, online coaching may
        be cancelled at any time by notifying us via email or WhatsApp.
        Cancellation takes effect at the end of the current billing
        period. In-person session cancellations are subject to the notice
        requirements set out in our{" "}
        <a href="/refund-and-cancellation">
          Refund &amp; Cancellation Policy
        </a>
        .
      </p>

      <h2>7. Assumption of Risk &amp; Health Disclosure</h2>
      <p>
        Participation in strength and conditioning training, rugby skills
        coaching, and any physical activity carries inherent risk of
        injury, including but not limited to muscle strain, joint injury,
        and in rare cases, more serious harm. By engaging our Services,
        you acknowledge and voluntarily accept these risks.
      </p>
      <p>
        You confirm that you (or, where applicable, your parent or legal
        guardian) have disclosed any known medical conditions, injuries,
        or physical limitations that could affect your ability to safely
        participate in training, and that you will promptly inform us of
        any changes to your health status during your coaching program.
      </p>
      <p>
        Where medically appropriate, we may request confirmation of
        medical clearance before commencing or continuing a training
        program, particularly following injury or where a pre-existing
        condition is disclosed.
      </p>
      <p>
        <strong>
          This section is a general risk disclosure and does not
          constitute a legally binding liability waiver. A separate,
          signed waiver and release of liability, reviewed by a qualified
          lawyer in your jurisdiction, should be completed by every client
          (or parent/guardian, for minors) before commencing training.
        </strong>
      </p>

      <h2>8. Client Conduct</h2>
      <p>
        Clients are expected to follow programming and coaching guidance
        as provided, communicate honestly about their health status and
        progress, and treat coaching staff and other athletes with
        respect. We reserve the right to decline or discontinue Services
        to any individual whose conduct is abusive, unsafe, or
        incompatible with our coaching environment.
      </p>

      <h2>9. Intellectual Property</h2>
      <p>
        All programming, training content, written materials, branding,
        and content on the Site are the intellectual property of Pera
        Gibbs Movement and may not be copied, redistributed, or used for
        commercial purposes without prior written consent.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, Pera Gibbs Movement shall
        not be liable for any indirect, incidental, or consequential
        damages arising from your participation in our Services. Our
        total liability for any claim arising from these Terms or our
        Services shall not exceed the amount paid by you for the Services
        giving rise to the claim in the preceding three months.
      </p>
      <p>
        Nothing in these Terms limits any liability that cannot be
        excluded or limited under applicable New Zealand law, including
        under the Consumer Guarantees Act 1993 where it applies.
      </p>

      <h2>11. Termination</h2>
      <p>
        We reserve the right to suspend or terminate a client&rsquo;s
        access to Services for breach of these Terms, non-payment, or
        conduct that poses a risk to the client or others. Where we
        terminate Services other than for cause, any prepaid fees for
        Services not yet delivered will be refunded on a pro-rata basis.
      </p>

      <h2>12. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Material changes will
        be communicated to active clients. Continued use of our Services
        after changes take effect constitutes acceptance of the updated
        Terms.
      </p>

      <h2>13. Governing Law</h2>
      <p>
        These Terms are governed by the laws of New Zealand. Any disputes
        arising from these Terms or our Services shall be subject to the
        exclusive jurisdiction of the courts of New Zealand.
      </p>

      <h2>14. Contact Us</h2>
      <p>
        Questions about these Terms can be directed to{" "}
        <a href="mailto:admin@peragibbsmovement.com">
          admin@peragibbsmovement.com
        </a>
        .
      </p>
    </LegalLayout>
  );
}