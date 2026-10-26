'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Mail,
  Phone,
  Truck,
  CreditCard,
  RotateCcw,
  Sparkles,
  Search,
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

const FAQ_LIST: FAQItem[] = [
  {
    id: 'delivery-cost',
    category: 'Shipping & Delivery',
    icon: Truck,
    question: 'How much does delivery cost?',
    answer:
      'Delivery charges are calculated at checkout based on your location. Delivery within the Colombo region is Rs. 400, while outstation delivery is Rs. 500. Orders above Rs. 2,999 qualify for free delivery within the Colombo region.',
  },
  {
    id: 'islandwide-delivery',
    category: 'Shipping & Delivery',
    icon: Truck,
    question: 'Do you deliver across Sri Lanka?',
    answer: 'Yes, we deliver island wide to all 25 districts across Sri Lanka.',
  },
  {
    id: 'payment-methods',
    category: 'Vouchers & Payments',
    icon: CreditCard,
    question: 'What payment methods do you accept?',
    answer:
      'We accept Thyaga Vouchers as the primary payment method. If the value of your order exceeds the voucher amount, the remaining balance can be paid online via credit/debit card. All prices are listed in Sri Lankan Rupees (LKR).',
  },
  {
    id: 'request-return',
    category: 'Returns & Refunds',
    icon: RotateCcw,
    question: 'How do I request a return?',
    answer:
      "Contact us at mall@thyaga.lk or reach out via +94 70 685 0414 with your order number within 48 hours of delivery and our team will guide you through the return or replacement process.",
  },
  {
    id: 'get-in-touch',
    category: 'Customer Support',
    icon: Mail,
    question: 'How do I get in touch?',
    answer:
      'Reach us at mall@thyaga.lk or call/WhatsApp +94 70 685 0414. Our support team replies within 24 to 48 hours during business days.',
  },
];

export default function FAQPage() {
  const [openIds, setOpenIds] = useState<string[]>(['delivery-cost', 'payment-methods']);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQ_LIST.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
        <Link href="/" className="hover:text-[#36135d] transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold">Frequently Asked Questions</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-linear-to-r from-[#2c0b4d] via-[#3f106d] to-[#581596] text-white rounded-2xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xs text-purple-200 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-white/10">
            <HelpCircle className="w-3.5 h-3.5 text-pink-400" />
            <span>Help &amp; Support Center</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-poppins mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
            Everything you need to know about shopping on Thyaga Mall, redeeming gift vouchers, islandwide shipping, and order tracking.
          </p>
        </div>
      </div>

      {/* Intro Note Card: A New Way to Experience Your Thyaga Vouchers */}
      <div className="bg-linear-to-br from-purple-50 via-pink-50/40 to-white rounded-2xl border border-purple-100 p-6 sm:p-8 space-y-3 shadow-2xs">
        <div className="flex items-center gap-2 text-[#a7144c] font-black text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>A New Way to Experience Your Thyaga Vouchers</span>
        </div>
        <h2 className="text-lg sm:text-xl font-black text-gray-900 font-poppins">
          Effortless, meaningful, and instantly usable rewards
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Welcome to the <strong>Thyaga Mall</strong>, the newest way to enjoy the freedom and flexibility of your Thyaga gift vouchers. We created this store with one simple idea in mind: to make your rewards feel effortless, meaningful, and instantly usable.
        </p>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Thyaga has always been about giving you the power to choose. With the Thyaga Mall, we’ve taken that idea even further. Now you can browse a curated collection of products, add your favourites to the cart, and redeem your Thyaga gift vouchers directly at checkout. If your purchase exceeds your voucher value, you can simply pay the balance with your credit or debit card.
        </p>
        <p className="text-xs sm:text-sm text-[#36135d] font-semibold">
          It’s gifting made simple, personal, and seamless.
        </p>
      </div>

      {/* Search Input Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions (e.g. delivery fee, returns, vouchers)..."
          className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-[#36135d] focus:ring-2 focus:ring-purple-100 shadow-2xs transition"
        />
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-500">
            No questions found matching &ldquo;{searchQuery}&rdquo;. Please contact us directly below!
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            const Icon = faq.icon;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-gray-200/90 shadow-2xs overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-5 sm:px-6 py-4 flex items-center justify-between text-left gap-4 hover:bg-gray-50/70 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#36135d] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        {faq.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 font-poppins">
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#36135d]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/40">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still Have Questions Contact Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xs">
        <div>
          <h3 className="text-base sm:text-lg font-black text-gray-900 font-poppins mb-1">
            Still Have Questions?
          </h3>
          <p className="text-xs text-gray-500 max-w-md">
            Can&apos;t find what you&apos;re looking for? Reach out to the Thyaga Mall customer care team. We reply within 24 to 48 hours.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="mailto:mall@thyaga.lk"
            className="inline-flex items-center gap-2 bg-[#36135d] hover:bg-[#250b42] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Us</span>
          </a>
          <a
            href="tel:+94706850414"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xs transition"
          >
            <Phone className="w-3.5 h-3.5 text-gray-500" />
            <span>+94 70 685 0414</span>
          </a>
        </div>
      </div>
    </div>
  );
}
