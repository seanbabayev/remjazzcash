'use client'

import React from 'react'
import Image from 'next/image'

export default function EventReminder() {
  return (
    <section className="mt-10">
      <h3 className="text-2xl text-[#171717]">Event Reminder</h3>

      <div className="relative mt-4">
        <div className="relative w-full h-[240px]">
          <Image
            src="/img/mosque.jpg"
            alt="Mosque"
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover rounded-2xl"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
        </div>

        <div className="absolute bottom-6 left-6 text-white">
          <p className="text-2xl font-bold mb-2">
            Don't forget Eid in<br />three days
          </p>
          <a href="#" className="font-medium hover:text-[#F4D5B5] underline transition-colors">
            Send Eid gift today
          </a>
        </div>
      </div>
    </section>
  )
}
