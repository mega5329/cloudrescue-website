'use client';

import React, { useState } from 'react';
import { Download, Heart, MessageCircle, FileCheck, Camera, DollarSign } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import FadeIn from '../animations/FadeIn';

export default function HowItWorks() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'adopters' | 'shelters'>('adopters');

  const adopterSteps = [
    {
      icon: <Download className="w-8 h-8" />,
      title: t.howItWorks.adopters.step1.title,
      description: t.howItWorks.adopters.step1.description,
      color: '#FF6B35',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: t.howItWorks.adopters.step2.title,
      description: t.howItWorks.adopters.step2.description,
      color: '#4ECDC4',
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: t.howItWorks.adopters.step3.title,
      description: t.howItWorks.adopters.step3.description,
      color: '#FFC107',
    },
  ];

  const shelterSteps = [
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: t.howItWorks.shelters.step1.title,
      description: t.howItWorks.shelters.step1.description,
      color: '#FF6B35',
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: t.howItWorks.shelters.step2.title,
      description: t.howItWorks.shelters.step2.description,
      color: '#4ECDC4',
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: t.howItWorks.shelters.step3.title,
      description: t.howItWorks.shelters.step3.description,
      color: '#FFC107',
    },
  ];

  const steps = activeTab === 'adopters' ? adopterSteps : shelterSteps;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        <FadeIn className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3E50] mb-4">
            {t.howItWorks.title}
          </h2>
        </FadeIn>

        {/* Tab Switcher */}
        <FadeIn delay={0.2} className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-full p-2 shadow-lg">
            <button
              onClick={() => setActiveTab('adopters')}
              className={`px-6 md:px-8 py-3 rounded-full font-semibold transition-all duration-300 min-h-[48px] ${
                activeTab === 'adopters'
                  ? 'bg-[#FF6B35] text-white shadow-md'
                  : 'text-[#2C3E50] hover:bg-gray-50'
              }`}
            >
              {t.howItWorks.forAdopters}
            </button>
            <button
              onClick={() => setActiveTab('shelters')}
              className={`px-6 md:px-8 py-3 rounded-full font-semibold transition-all duration-300 min-h-[48px] ${
                activeTab === 'shelters'
                  ? 'bg-[#4ECDC4] text-white shadow-md'
                  : 'text-[#2C3E50] hover:bg-gray-50'
              }`}
            >
              {t.howItWorks.forShelters}
            </button>
          </div>
        </FadeIn>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
          {/* Connection Lines (hidden on mobile) */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B35] via-[#4ECDC4] to-[#FFC107] opacity-20"
               style={{ width: 'calc(100% - 200px)', marginLeft: '100px' }}
          />

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 md:p-8 h-full border-t-4 min-h-[280px] flex flex-col"
                   style={{ borderColor: step.color }}>
                {/* Step Number */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg z-10"
                     style={{ backgroundColor: step.color }}>
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-6 mt-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center"
                       style={{ backgroundColor: `${step.color}20`, color: step.color }}>
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-lg md:text-xl font-bold text-[#2C3E50] mb-4 text-center">
                    {step.title}
                  </h3>
                  <p className="text-[#90A4AE] leading-relaxed text-center text-sm md:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

