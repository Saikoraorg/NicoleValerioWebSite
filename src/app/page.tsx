'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { WorkSection } from '@/components/WorkSection';
import { PressSection } from '@/components/PressSection';
import { BooksSection } from '@/components/BooksSection';
import { FollowSection } from '@/components/FollowSection';
import { ReviewsSection } from '@/components/ReviewsSection';
import { CtaSection } from '@/components/CtaSection';
import { Footer } from '@/components/Footer';
import { BookGalleryModal } from '@/components/BookGalleryModal';
import { BookingModal } from '@/components/BookingModal';

export default function Home() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedBookingService, setSelectedBookingService] = useState<string>('Boda');
  const [activeBookSlug, setActiveBookSlug] = useState<string | null>(null);

  const handleOpenBooking = (service?: string) => {
    if (service) {
      setSelectedBookingService(service);
    }
    setBookingModalOpen(true);
  };

  const handleOpenBook = (slug: string) => {
    setActiveBookSlug(slug);
  };

  return (
    <main>
      <Header onOpenBooking={() => handleOpenBooking()} />
      <Hero onOpenBooking={() => handleOpenBooking()} />
      <WorkSection onOpenBook={(slug) => handleOpenBook(slug)} />
      <PressSection onOpenBook={(slug) => handleOpenBook(slug)} onOpenBooking={() => handleOpenBooking()} />
      <BooksSection onSelectBook={(slug) => handleOpenBook(slug)} onRequestTarifas={() => handleOpenBooking()} />
      <FollowSection />
      <ReviewsSection />
      <CtaSection onOpenBooking={(service) => handleOpenBooking(service)} />
      <Footer />

      {/* Interactive Modals */}
      <BookGalleryModal
        bookSlug={activeBookSlug}
        onClose={() => setActiveBookSlug(null)}
        onInquire={(bookTitle) => {
          setActiveBookSlug(null);
          handleOpenBooking(bookTitle);
        }}
      />

      <BookingModal
        isOpen={bookingModalOpen}
        preselectedService={selectedBookingService}
        onClose={() => setBookingModalOpen(false)}
      />
    </main>
  );
}
