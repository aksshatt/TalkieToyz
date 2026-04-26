import { motion } from 'framer-motion';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-soft p-8 md:p-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-teal mb-2">Terms &amp; Conditions</h1>
        <p className="text-sm text-warmgray-500 mb-8">Last updated: April 2026</p>

        <div className="prose prose-warmgray max-w-none text-warmgray-700 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-warmgray-900 mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Talkie Toyz — including our therapy services, assessments, products, and digital
              platform — you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use
              our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-warmgray-900 mb-2">2. Services Provided</h2>
            <p>
              Talkie Toyz offers Speech Therapy, Occupational Therapy, Physiotherapy, Special Education, Psychological
              Assessment, Behaviour Management, Child Counselling, and Parent Counselling Sessions. Services are
              delivered by qualified therapists and are customized to each child’s needs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-warmgray-900 mb-2">3. Bookings &amp; Appointments</h2>
            <p>
              Sessions must be booked in advance. Rescheduling or cancellation requests should be made at least 24
              hours before the scheduled time. No-shows or late cancellations may be charged in full.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-warmgray-900 mb-2">4. Payments</h2>
            <p>
              All fees must be paid in advance or as per agreed schedule.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-warmgray-900 mb-2">5. Use of Platform</h2>
            <p>
              You agree not to misuse the platform, share assessment content, impersonate others, upload malicious
              content, or attempt to disrupt services. Accounts may be suspended for violations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-warmgray-900 mb-2">6. Medical Disclaimer</h2>
            <p>
              Information on this platform is for educational purposes and does not replace medical advice, diagnosis,
              or treatment. Always consult a qualified professional for concerns about your child’s development.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-warmgray-900 mb-2">7. Intellectual Property</h2>
            <p>
              All content, logos, assessments, and resources on Talkie Toyz are owned by us or our licensors and may
              not be reproduced without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-warmgray-900 mb-2">8. Limitation of Liability</h2>
            <p>
              Talkie Toyz will not be liable for indirect, incidental, or consequential damages arising from use of
              services. Total liability is limited to the amount paid for the specific service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-warmgray-900 mb-2">9. Changes to Terms</h2>
            <p>
              We may update these terms periodically. Continued use of services after changes indicates acceptance of
              the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-warmgray-900 mb-2">10. Contact</h2>
            <p>
              For questions about these Terms, contact us via the Contact page or email support@talkietoyz.com.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default Terms;
