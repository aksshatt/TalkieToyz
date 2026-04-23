import { motion } from 'framer-motion';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-soft p-8 md:p-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-teal mb-2">Privacy Policy</h1>
        <p className="text-sm text-warmgray-500 mb-8">Last updated: April 2026</p>

        <div className="prose prose-warmgray max-w-none text-warmgray-700 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-warmgray-900 mb-2">1. Information We Collect</h2>
            <p>
              We collect information you provide directly — name, email, phone, child’s details, assessment responses,
              session notes, and payment information. We also collect usage data such as IP address, device type, and
              browsing behavior for analytics and security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-warmgray-900 mb-2">2. How We Use Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To deliver therapy, assessments, and counselling services.</li>
              <li>To communicate about appointments, progress, and updates.</li>
              <li>To process payments and fulfill orders.</li>
              <li>To improve our platform, content, and user experience.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-warmgray-900 mb-2">3. Child Data Protection</h2>
            <p>
              We treat children’s data with the utmost care. Data is collected only from parents or legal guardians
              and used solely for therapy and developmental support. We do not sell or share child information with
              third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-warmgray-900 mb-2">4. Sharing of Information</h2>
            <p>
              We share information only with assigned therapists, payment processors, and service providers bound by
              confidentiality. We may disclose information if required by law or to protect safety.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-warmgray-900 mb-2">5. Data Security</h2>
            <p>
              We use encryption, secure authentication, and restricted access to protect your data. While we strive
              for strong security, no system is completely immune to risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-warmgray-900 mb-2">6. Cookies</h2>
            <p>
              We use cookies and similar technologies to keep you logged in, remember preferences, and understand
              usage. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-warmgray-900 mb-2">7. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal data, object to processing, and request
              a copy of your data. Contact us to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-warmgray-900 mb-2">8. Data Retention</h2>
            <p>
              We retain data as long as necessary to provide services and meet legal obligations. Assessment records
              are retained per clinical best practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-warmgray-900 mb-2">9. Third-Party Links</h2>
            <p>
              Our platform may contain links to third-party sites. We are not responsible for their privacy practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-warmgray-900 mb-2">10. Changes &amp; Contact</h2>
            <p>
              We may update this policy and will notify users of material changes. For privacy questions, contact
              support@talkietoyz.com.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default Privacy;
