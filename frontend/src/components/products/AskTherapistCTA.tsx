import React, { useState } from 'react';
import { MessageSquare, Calendar } from 'lucide-react';
import BookAppointmentModal from '../common/BookAppointmentModal';

interface AskTherapistCTAProps {
  productName: string;
}

const AskTherapistCTA: React.FC<AskTherapistCTAProps> = ({ productName }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-6 h-6 text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">Not sure this is right for your child?</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Book a free 15-min consultation with one of our certified speech therapists.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition flex-shrink-0"
        >
          <Calendar className="w-4 h-4" />
          Book Free Chat
        </button>
      </div>

      <BookAppointmentModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default AskTherapistCTA;
