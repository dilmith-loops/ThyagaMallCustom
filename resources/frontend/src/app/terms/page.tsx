import React from 'react';
import Link from 'next/link';
import { FileText, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Thyaga Mall',
  description: 'Terms and Conditions governing the use of Thyaga Mall website, voucher redemptions, and order fulfillments.',
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
        <Link href="/" className="hover:text-[#36135d] transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold">Terms of Service</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-linear-to-r from-[#2c0b4d] via-[#3f106d] to-[#581596] text-white rounded-2xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xs text-purple-200 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-white/10">
            <FileText className="w-3.5 h-3.5 text-pink-400" />
            <span>Terms &amp; Conditions</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-poppins mb-2">Terms of Service</h1>
          <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
            These Terms and Conditions govern the use of the Thyaga Mall website and services. By accessing or using the website, customers agree to comply with and be bound by the following terms.
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 sm:p-10 space-y-8 text-gray-700 text-sm leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#36135d] text-xs font-black flex items-center justify-center shrink-0">1</span>
            <span>General</span>
          </h2>
          <p className="text-gray-600">
            Thyaga Mall operates as an online retail and voucher redemption platform that enables customers to redeem Thyaga vouchers for products listed on the store. By using the website, customers agree to these Terms and Conditions.
          </p>
        </section>

        <hr className="border-gray-100" />

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#36135d] text-xs font-black flex items-center justify-center shrink-0">2</span>
            <span>Eligibility</span>
          </h2>
          <p className="text-gray-600">
            Customers must be at least 18 years of age or use the website under the supervision of a parent or legal guardian.
          </p>
        </section>

        <hr className="border-gray-100" />

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#36135d] text-xs font-black flex items-center justify-center shrink-0">3</span>
            <span>Voucher Redemption</span>
          </h2>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
            <li>Thyaga vouchers may only be redeemed for eligible products listed on the Thyaga Mall website.</li>
            <li>Voucher balances cannot be exchanged for cash unless required by law.</li>
            <li>Expired or invalid vouchers may not be accepted.</li>
            <li>Thyaga Mall reserves the right to reject fraudulent or unauthorized voucher transactions.</li>
          </ul>
        </section>

        <hr className="border-gray-100" />

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#36135d] text-xs font-black flex items-center justify-center shrink-0">4</span>
            <span>Products and Availability</span>
          </h2>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
            <li>Products listed on the website are subject to availability.</li>
            <li>Product images are for illustrative purposes only.</li>
            <li>Thyaga Mall reserves the right to modify, remove, or replace products without prior notice.</li>
            <li>Prices and product availability may change at any time.</li>
          </ul>
        </section>

        <hr className="border-gray-100" />

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#36135d] text-xs font-black flex items-center justify-center shrink-0">5</span>
            <span>Orders and Fulfillment</span>
          </h2>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
            <li>Orders placed through the website will be fulfilled by merchant partners or logistics providers.</li>
            <li>Delivery timelines are estimates and may vary depending on product availability and delivery location.</li>
            <li>Thyaga Mall is not responsible for delays caused by third-party delivery providers or unforeseen circumstances.</li>
          </ul>
        </section>

        <hr className="border-gray-100" />

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#36135d] text-xs font-black flex items-center justify-center shrink-0">6</span>
            <span>Returns and Refunds</span>
          </h2>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
            <li>Customers must report damaged or incorrect products within 48 hours of delivery.</li>
            <li>Refunds or replacements shall be reviewed on a case-by-case basis.</li>
            <li>Voucher-based purchases may be refunded in the form of store credit or voucher credit where applicable.</li>
          </ul>
        </section>

        <hr className="border-gray-100" />

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#36135d] text-xs font-black flex items-center justify-center shrink-0">7</span>
            <span>User Conduct</span>
          </h2>
          <p className="text-gray-600">Users agree not to:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
            <li>Use the website for unlawful purposes.</li>
            <li>Attempt to disrupt or interfere with the website or platform.</li>
            <li>Submit false or misleading information.</li>
          </ul>
        </section>

        <hr className="border-gray-100" />

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#36135d] text-xs font-black flex items-center justify-center shrink-0">8</span>
            <span>Intellectual Property</span>
          </h2>
          <p className="text-gray-600">
            All content on the Thyaga Mall website including logos, branding, images, text, and software are the property of Thyaga Mall or its licensors and may not be copied or used without permission.
          </p>
        </section>

        <hr className="border-gray-100" />

        {/* Section 9 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#36135d] text-xs font-black flex items-center justify-center shrink-0">9</span>
            <span>Limitation of Liability</span>
          </h2>
          <p className="text-gray-600">Thyaga Store shall not be liable for:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
            <li>Indirect or consequential losses.</li>
            <li>Delays caused by third-party merchants or logistics providers.</li>
            <li>Technical interruptions or website downtime.</li>
          </ul>
        </section>

        <hr className="border-gray-100" />

        {/* Section 10 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#36135d] text-xs font-black flex items-center justify-center shrink-0">10</span>
            <span>Privacy</span>
          </h2>
          <p className="text-gray-600">
            Customer information collected through the website shall be handled in accordance with the{' '}
            <Link href="/privacy" className="text-[#36135d] hover:underline font-semibold">
              Thyaga Mall Privacy Policy
            </Link>.
          </p>
        </section>

        <hr className="border-gray-100" />

        {/* Section 11 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#36135d] text-xs font-black flex items-center justify-center shrink-0">11</span>
            <span>Changes to Terms</span>
          </h2>
          <p className="text-gray-600">
            Thyaga Mall reserves the right to modify these Terms and Conditions at any time. Continued use of the website after changes are published constitutes acceptance of the updated terms.
          </p>
        </section>

        <hr className="border-gray-100" />

        {/* Section 12 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#36135d] text-xs font-black flex items-center justify-center shrink-0">12</span>
            <span>Governing Law</span>
          </h2>
          <p className="text-gray-600">
            These Terms and Conditions shall be governed by and interpreted in accordance with the laws of the Democratic Socialist Republic of Sri Lanka.
          </p>
        </section>

        <hr className="border-gray-100" />

        {/* Section 13 */}
        <section className="space-y-4">
          <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#36135d] text-xs font-black flex items-center justify-center shrink-0">13</span>
            <span>Contact Information</span>
          </h2>
          <p className="text-gray-600">
            For questions relating to these Terms and Conditions, customers may contact:
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
