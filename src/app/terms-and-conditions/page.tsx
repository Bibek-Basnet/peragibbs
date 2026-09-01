import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions" effectiveDate="1 September 2026">
      <h2>1. Overview</h2>
      <p>
        Pera Gibbs Movement provides strength and conditioning, performance
        coaching, and skill development delivered through online
        programming and in-person sessions. By engaging in coaching
        services, you agree to the terms outlined in this agreement.
      </p>

      <h2>2. Coaching Services</h2>

      <h3>Online Coaching — Foundation (V1)</h3>
      <ul>
        <li>12-week structured training programme delivered via TeamBuildr</li>
        <li>One onboarding consultation</li>
        <li>Programme allocation based on initial screening</li>
        <li>Single-discipline programming — strength or conditioning based</li>
        <li>Structured block, self-managed</li>
        <li>Messaging support (responses provided within 48 business hours)</li>
      </ul>
      <p>
        <strong>Best for:</strong> Athletes with one clear focus, or just
        getting started and want to keep it simple.
      </p>

      <h3>Online Coaching — Intermediate (V2)</h3>
      <ul>
        <li>12-week structured training programme delivered via TeamBuildr</li>
        <li>One onboarding consultation</li>
        <li>Programme allocation based on initial screening</li>
        <li>
          Strength and conditioning combined into one structured block
        </li>
        <li>Built for well-rounded athletic development</li>
        <li>Structured block, self-managed</li>
        <li>Messaging support (responses provided within 48 business hours)</li>
      </ul>
      <p>
        <strong>Best for:</strong> Athletes who want proper all-around
        development without needing hands-on coaching.
      </p>

      <h3>Online Coaching — Advanced (V3)</h3>
      <ul>
        <li>12-week structured training programme delivered via TeamBuildr</li>
        <li>One onboarding consultation</li>
        <li>Gym and conditioning focused programming</li>
        <li>Fully tailored and mapped out week to week</li>
        <li>Programme adjustments where required</li>
        <li>
          Ongoing messaging support (responses provided within 48 business
          hours)
        </li>
      </ul>
      <p>
        <strong>Best for:</strong> Athletes chasing a specific performance
        target or needing specialised support (e.g. injury rehab).
      </p>

      <h3>In-Person Coaching</h3>
      <ul>
        <li>Sessions focused on movement quality, speed, strength and conditioning</li>
        <li>1:1 and small group sessions available (up to 3 athletes)</li>
        <li>Sessions tailored to individual goals</li>
        <li>Booked based on availability</li>
        <li>
          For groups of 4 or more, pricing is based on group size, session
          structure, and location — please enquire directly
        </li>
      </ul>

      <h2>3. Commitment &amp; Payment</h2>
      <ul>
        <li>All online coaching services operate on a minimum 12-week commitment</li>
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
      <p>
        See our{" "}
        <a href="/refund-and-cancellation">Refund &amp; Cancellation Policy</a>{" "}
        for full details on cancellations and refunds.
      </p>

      <h2>4. Client Responsibilities</h2>
      <p>You agree to:</p>
      <ul>
        <li>
          Provide accurate information regarding injuries, health, and
          training history
        </li>
        <li>Train within your own physical limits</li>
        <li>Communicate any injury or change in health status</li>
        <li>Follow programme guidance responsibly</li>
        <li>
          Seek medical clearance where appropriate before participating in
          training
        </li>
      </ul>
      <p>
        You understand that all training is undertaken at your own
        discretion and risk.
      </p>

      <h2>5. Communication</h2>
      <ul>
        <li>
          Coaching communication occurs via agreed platforms (e.g.
          TeamBuildr)
        </li>
        <li>Responses are typically provided within 48 business hours</li>
        <li>Support is structured based on your selected coaching tier</li>
      </ul>

      <h2>6. Code of Conduct</h2>
      <p>Clients are expected to:</p>
      <ul>
        <li>Communicate respectfully</li>
        <li>Engage appropriately during coaching interactions</li>
      </ul>
      <p>
        Pera Gibbs Movement reserves the right to terminate services where
        behaviour is inappropriate, unsafe, or in breach of this agreement.
      </p>

      <h2>7. Media &amp; Content</h2>
      <p>
        Pera Gibbs Movement may use training content (e.g. images or
        videos) for educational or promotional purposes. Where possible,
        consent will be requested before identifiable content is shared.
        You may opt out of media use at any time by notifying the coach.
      </p>
      <p>
        Where the athlete is under 18, use of identifiable images or video
        requires the consent of a parent or legal guardian, in addition to
        the athlete&rsquo;s own consent.
      </p>

      <h2>8. Privacy &amp; Data Protection</h2>
      <p>
        Pera Gibbs Movement collects and holds personal information —
        including health, injury, and training history — that you provide
        in order to deliver safe and effective coaching services.
      </p>
      <ul>
        <li>
          This information is used only for coaching purposes and to
          communicate with you about your programme
        </li>
        <li>
          Information is not shared with third parties except where
          necessary to deliver services (e.g. the TeamBuildr platform) or
          where required by law
        </li>
        <li>
          You may request access to, or correction of, your personal
          information at any time by contacting{" "}
          <a href="mailto:admin@peragibbsmovement.com">
            admin@peragibbsmovement.com
          </a>
        </li>
      </ul>
      <p>
        Personal information is handled in accordance with the Privacy Act
        2020 (NZ). See our{" "}
        <a href="/privacy-policy">Privacy Policy</a> for further detail.
      </p>

      <h2>9. Minors &amp; Parental Consent</h2>
      <p>
        Athletes under the age of 18 may participate in coaching services
        with the consent of a parent or legal guardian.
      </p>
      <ul>
        <li>
          Where the athlete is under 18, a parent or legal guardian must
          read, agree to, and accept this agreement on the athlete&rsquo;s
          behalf
        </li>
        <li>
          The parent or guardian is responsible for the accuracy of
          information provided, payment of fees, and compliance with this
          agreement
        </li>
        <li>
          Pera Gibbs Movement reserves the right to request confirmation
          of parental or guardian consent prior to commencing services
        </li>
      </ul>

      <h2>10. Liability &amp; Risk</h2>
      <p>
        You acknowledge that participation in physical training carries
        inherent risks, including injury. By engaging in coaching
        services:
      </p>
      <ul>
        <li>You accept responsibility for your participation</li>
        <li>You confirm you are physically able to train</li>
        <li>You agree that participation is undertaken at your own risk</li>
      </ul>
      <p>
        Where the athlete is under 18, the parent or legal guardian
        acknowledges these risks and accepts this responsibility on the
        athlete&rsquo;s behalf.
      </p>
      <p>
        To the extent permitted by law, Pera Gibbs Movement is not liable
        for injury, loss, or damage arising from participation in training
        activities. Pera Gibbs Movement holds public liability insurance.
        Nothing in this agreement limits your rights under the Consumer
        Guarantees Act 1993.
      </p>

      <h2>11. Intellectual Property</h2>
      <p>
        All training programmes, content, and materials provided as part
        of coaching services remain the intellectual property of Pera
        Gibbs Movement. Programmes are licensed to you for personal use
        only and may not be reproduced, shared, or resold without prior
        written consent.
      </p>

      <h2>12. Governing Law &amp; Amendments</h2>
      <p>
        This agreement is governed by the laws of New Zealand, and any
        disputes arising from it are subject to the jurisdiction of the
        New Zealand courts.
      </p>
      <p>
        Pera Gibbs Movement may update these terms from time to time to
        reflect changes in services, pricing, or policy. Where changes
        materially affect your existing agreement, reasonable notice will
        be provided (e.g. via email or messaging platform). Continued use
        of coaching services after changes take effect constitutes
        acceptance of the updated terms. The current version of this
        agreement is available on request.
      </p>

      <h2>13. Acceptance</h2>
      <p>By purchasing coaching services, you confirm that:</p>
      <ul>
        <li>You have read and understood this agreement</li>
        <li>You agree to the terms outlined above</li>
        <li>You accept the commitment and payment structure</li>
        <li>
          If you are a parent or legal guardian consenting on behalf of an
          athlete under 18, you confirm you are legally authorised to do
          so and accept this agreement on their behalf
        </li>
      </ul>
      <p>
        Questions? Contact us at{" "}
        <a href="mailto:admin@peragibbsmovement.com">
          admin@peragibbsmovement.com
        </a>
        .
      </p>
    </LegalLayout>
  );
}