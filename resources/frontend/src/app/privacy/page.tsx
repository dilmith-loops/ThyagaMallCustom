import React from 'react';
import Link from 'next/link';
import { Shield, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Thyaga Mall',
  description: 'Learn how Thyaga Mall collects, uses, stores, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
        <Link href="/" className="hover:text-[#36135d] transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold">Privacy Policy</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-linear-to-r from-[#2c0b4d] via-[#3f106d] to-[#581596] text-white rounded-2xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xs text-purple-200 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-white/10">
            <Shield className="w-3.5 h-3.5 text-pink-400" />
            <span>Legal &amp; Data Protection</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-poppins mb-2">Privacy Policy</h1>
          <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
            This Privacy Policy describes how Thyaga Mall (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) collects, uses, stores, and protects your personal information when you access or use our website and services.
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 sm:p-10 space-y-8 text-gray-700 text-sm leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#36135d] text-xs font-black flex items-center justify-center shrink-0">1</span>
            <span>Information We Collect</span>
          </h2>
          <p className="text-gray-600">We may collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
            <li>Personal information such as your name, phone number, email address, and delivery address.</li>
            <li>Voucher redemption information related to Thyaga vouchers.</li>
            <li>Payment and transaction information.</li>
            <li>Website usage information including browser type, IP address, and device information.</li>
          </ul>
        </section>

        <hr className="border-gray-100" />

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#36135d] text-xs font-black flex items-center justify-center shrink-0">2</span>
            <span>How We Use Your Information</span>
          </h2>
          <p className="text-gray-600">Your information may be used for:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
            <li>Processing orders and voucher redemptions.</li>
            <li>Coordinating deliveries and merchant fulfillment.</li>
            <li>Providing customer support.</li>
            <li>Improving our website, products, and customer experience.</li>
            <li>Sending promotional and marketing communications related to Thyaga Mall and Thyaga services.</li>
          </ul>
        </section>

        <hr className="border-gray-100" />

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#36135d] text-xs font-black flex items-center justify-center shrink-0">3</span>
            <span>Sharing of Information</span>
          </h2>
          <p className="text-gray-600">We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
            <li>Merchant partners for order fulfillment.</li>
            <li>Delivery and logistics providers.</li>
            <li>Technical service providers supporting the platform.</li>
            <li>Authorities where required by law.</li>
          </ul>
          <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-3.5 text-xs text-[#36135d] font-semibold">
            We do not sell your personal information to third parties.
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#36135d] text-xs font-black flex items-center justify-center shrink-0">4</span>
            <span>Data Security</span>
          </h2>
          <p className="text-gray-600">
            We take reasonable measures to protect your personal information against unauthorized access, disclosure, alteration, or destruction.
          </p>
        </section>

        <hr className="border-gray-100" />

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#36135d] text-xs font-black flex items-center justify-center shrink-0">5</span>
            <span>Cookies and Website Tracking</span>
          </h2>
          <p className="text-gray-600">
            Our website may use cookies and similar technologies to improve website performance and enhance the user experience.
          </p>
        </section>

        <hr className="border-gray-100" />

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#36135d] text-xs font-black flex items-center justify-center shrink-0">6</span>
            <span>Customer Rights</span>
          </h2>
          <p className="text-gray-600">Customers may request:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
            <li>Access to their personal information.</li>
            <li>Correction of inaccurate information.</li>
            <li>Removal of personal information where legally permissible.</li>
          </ul>
        </section>

        <hr className="border-gray-100" />

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#36135d] text-xs font-black flex items-center justify-center shrink-0">7</span>
            <span>Third-Party Links</span>
          </h2>
          <p className="text-gray-600">
            Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of such websites.
          </p>
        </section>

        <hr className="border-gray-100" />

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#36135d] text-xs font-black flex items-center justify-center shrink-0">8</span>
            <span>Changes to This Policy</span>
          </h2>
          <p className="text-gray-600">
            We may update this Privacy Policy from time to time. Any changes will be published on the Thyaga Mall website.
          </p>
        </section>

        <hr className="border-gray-100" />

        {/* Section 9 */}
        <section className="space-y-4">
          <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#36135d] text-xs font-black flex items-center justify-center shrink-0">9</span>
            <span>Contact Information</span>
          </h2>
          <p className="text-gray-600">
            For questions relating to this Privacy Policy, customers may contact:
          </p>
          <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200/80 space-y-2.5">
            <h4 className="font-bold text-gray-900 text-sm">Thyaga Mall</h4>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Mail className="w-4 h-4 text-[#a7144c]" />
              <a href="mailto:mall@thyaga.lk" className="text-[#36135d] hover:underline font-medium">mall@thyaga.lk</a>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Phone className="w-4 h-4 text-[#a7144c]" />
              <a href="tel:+94706850414" className="text-[#36135d] hover:underline font-medium">+94 70 685 0414</a>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <MapPin className="w-4 h-4 text-[#a7144c]" />
              <span>2A, Suleiman Terrace, Colombo 05, Sri Lanka</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
