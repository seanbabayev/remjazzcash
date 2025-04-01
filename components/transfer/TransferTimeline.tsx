import React from 'react';
import { format } from 'date-fns';

interface TimelineEvent {
  date: Date;
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'pending';
}

interface TransferTimelineProps {
  events: TimelineEvent[];
  transactionId: string;
}

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
              <div>
                <h3 className="font-['Open_Sans'] font-semibold text-[14px] text-[#333333]">
                  {format(event.date, 'MMMM do')}
                </h3>
                <p className="font-['Open_Sans'] font-semibold text-[14px] text-[#3A3A3A]">
                  {event.title}
                  {event.description && (
                    <span className="block">{event.description}</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <p className="text-gray-500 text-sm">
          TRANS ID:
          <br />
          <span className="font-mono">{transactionId}</span>
        </p>
      </div>
    </div>
  );
};
