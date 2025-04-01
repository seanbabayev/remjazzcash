import React from 'react';
import { format } from 'date-fns';
import { TimelineEvent, TransferTimelineProps } from '../types/transfer-types';

export const TransferTimeline: React.FC<TransferTimelineProps> = ({ events, transactionId }) => {
  return (
    <div className="px-[36px] py-[24px]">
      <div className="space-y-8">
        {events.map((event, index) => (
          <div key={index} className="relative">
            {/* Vertical line */}
            {index !== events.length - 1 && (
              <div className="absolute left-[15px] top-[30px] w-[2px] h-[calc(100%+10px)] bg-gray-200" />
            )}
            
            {/* Event */}
            <div className="flex items-start gap-4 h-[75px]">
              {/* Circle */}
              <div className={`w-8 h-8 rounded-full border-2 flex-shrink-0 ${
                event.status === 'completed' ? 'bg-black border-black' :
                event.status === 'current' ? 'bg-white border-black' :
                'bg-white border-gray-200'
              }`} />
              
              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-medium text-gray-900">
                    {event.title}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {format(event.date, 'HH:mm')}
                  </span>
                </div>
                {event.description && (
                  <p className="mt-1 text-sm text-gray-500">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
