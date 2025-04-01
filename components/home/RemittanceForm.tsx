'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function RemittanceForm() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [displayedNumber, setDisplayedNumber] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const validatePhoneNumber = useCallback((number: string) => {
    const phoneNumberPattern = /^[0-9]{10,15}$/
    return phoneNumberPattern.test(number)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedNumber(phoneNumber)
      setIsValid(validatePhoneNumber(phoneNumber))
    }, 500) // 0.5 seconds delay

    return () => clearTimeout(timer)
  }, [phoneNumber, validatePhoneNumber])

  if (!mounted) {
    return null // Undvik hydreringsfel genom att inte rendera något innan klienten är redo
  }

  return (
    <section className="mt-8 w-full">
      <h2 className="text-2xl text-[#171717]">New remittance transfer</h2>

      <input
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="Enter phone number"
        value={phoneNumber}
        onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
        className="h-12 border border-[#E7ECF0] rounded-full px-4 mt-4 w-full box-border text-[#171717]"
      />

      <button
        onClick={() => isValid && router.push('/transfer')}
        disabled={!isValid}
        className={`
          w-full h-12 mt-4 rounded-2xl font-semibold transition-colors
          ${isValid
            ? 'bg-[#F4D5B5] cursor-pointer hover:bg-[#e6c1a3] text-[#1B1B1B]'
            : displayedNumber.length > 0 
              ? 'bg-[#ff6b6b] cursor-not-allowed text-white'
              : 'bg-[#E4E4E4] cursor-not-allowed text-[rgba(27,27,27,0.5)]'
          }
        `}
      >
        {isValid 
          ? 'Continue to the amount'
          : displayedNumber.length > 0 
            ? 'Minimum 10 digits'
            : 'Enter valid phone number'
        }
      </button>
    </section>
  )
}
