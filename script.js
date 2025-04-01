// JavaScript for Remittance App Interactivity

document.addEventListener('DOMContentLoaded', function () {
  const phoneInput = document.querySelector('.phone-input')
  const continueButton = document.querySelector('.continue-button')
  let typingTimer
  const typingInterval = 500 // 0.5 seconds delay

  // Initial button state
  continueButton.disabled = true
  continueButton.setAttribute('disabled', 'disabled')
  continueButton.style.cursor = 'not-allowed'

  // Function to validate phone number
  function validatePhoneNumber() {
    const phoneNumberPattern = /^[0-9]{10,15}$/
    if (phoneInput.value.trim() === '') {
      phoneInput.classList.remove('error')
      continueButton.classList.remove('active')
      continueButton.disabled = true
      continueButton.setAttribute('disabled', 'disabled')
      continueButton.style.cursor = 'not-allowed'
      continueButton.innerText = 'Continue to the amount'
      continueButton.style.backgroundColor = '#E4E4E4'
    } else if (!phoneNumberPattern.test(phoneInput.value)) {
      phoneInput.classList.add('error')
      continueButton.classList.remove('active')
      continueButton.disabled = true
      continueButton.setAttribute('disabled', 'disabled')
      continueButton.style.cursor = 'not-allowed'
      continueButton.innerText = 'Minimum 10 digits'
      continueButton.style.backgroundColor = '#ff6b6b'
    } else {
      phoneInput.classList.remove('error')
      continueButton.classList.add('active')
      continueButton.disabled = false
      continueButton.removeAttribute('disabled')
      continueButton.style.cursor = 'pointer'
      continueButton.innerText = 'Continue to the amount'
      continueButton.style.backgroundColor = '#F4D5B5'
    }
  }

  // Delay validation after typing stops
  phoneInput.addEventListener('input', function () {
    clearTimeout(typingTimer)
    typingTimer = setTimeout(validatePhoneNumber, typingInterval)
  })

  // Handle click on continue button
  continueButton.addEventListener('click', function (event) {
    if (continueButton.disabled) {
      event.preventDefault()
    } else {
      // Navigate to next step (e.g., send money page)
      window.location.href = 'transfer.html'
    }
  })
})

// JavaScript for Money Transfer Page
document.addEventListener('DOMContentLoaded', function () {
  const apiKey = 'dc63553a43b5b3af24e8206c' // API-nyckel
  const baseCurrency = 'EUR'
  const targetCurrency = 'BDT'
  const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`

  let exchangeRate = 1

  // Funktion för att hämta växelkursen
  async function fetchExchangeRate() {
    try {
      const response = await fetch(apiUrl)
      if (!response.ok) {
        throw new Error('Nätverksfel vid hämtning av växelkurs')
      }
      const data = await response.json()
      exchangeRate = data.conversion_rates[targetCurrency]
    } catch (error) {
      console.error('Kunde inte hämta växelkurs:', error)
    }
  }

  // Hämta växelkursen vid sidladdning
  fetchExchangeRate()

  const numpadKeys = document.querySelectorAll('.numpad-key')
  const amountDisplay = document.querySelector('.amount')
  const receivedAmountDisplay = document.querySelector('.received-amount')
  const nextStepButton = document.querySelector('.next-step-button')
  const toggleCurrencyButton = document.querySelector('.toggle-currency')
  const amountDescription = document.querySelector('.amount-description')
  let currentCurrency = 'EUR'
  let amount = ''

  function updateReceivedAmount() {
    if (amount === '') {
      receivedAmountDisplay.textContent =
        currentCurrency === 'EUR'
          ? `The amount to be received: ৳ 0`
          : `The amount you will send: € 0`
    } else {
      if (currentCurrency === 'EUR') {
        const receivedAmount = (parseFloat(amount) * exchangeRate).toFixed(2)
        receivedAmountDisplay.textContent = `The amount to be received: ৳ ${receivedAmount}`
      } else {
        const sendAmount = (parseFloat(amount) / exchangeRate).toFixed(2)
        receivedAmountDisplay.textContent = `The amount you will send: € ${sendAmount}`
      }
    }
  }

  function updateNextStepButtonState() {
    if (amount !== '' && parseFloat(amount) >= 10) {
      nextStepButton.classList.add('active')
      nextStepButton.disabled = false
      nextStepButton.style.cursor = 'pointer'
      nextStepButton.innerText = 'Next step'
      nextStepButton.style.backgroundColor = '#049D52'
    } else if (amount !== '') {
      nextStepButton.classList.remove('active')
      nextStepButton.disabled = true
      nextStepButton.style.cursor = 'not-allowed'
      nextStepButton.innerText = 'Minimum amount €10'
      nextStepButton.style.backgroundColor = '#ff6b6b'
    } else {
      nextStepButton.classList.remove('active')
      nextStepButton.disabled = true
      nextStepButton.style.cursor = 'not-allowed'
      nextStepButton.innerText = 'Next step'
      nextStepButton.style.backgroundColor = '#E4E4E4'
    }
  }

  // Hantera numpad-tryck
  numpadKeys.forEach(key => {
    key.addEventListener('click', function () {
      const value = key.dataset.value
      if (value === 'delete') {
        amount = amount.slice(0, -1)
      } else {
        if (value === '.' && amount.includes('.')) return
        amount += value
      }
      amountDisplay.textContent = amount === '' ? '0' : amount
      updateReceivedAmount()
      updateNextStepButtonState()
    })
  })

  // Hantera växlingsknappen för valuta
  toggleCurrencyButton.addEventListener('click', function () {
    if (currentCurrency === 'EUR') {
      currentCurrency = 'BDT'
      document.querySelector('.currency-symbol').textContent = '৳'
      amountDescription.textContent = 'The amount to be received'
      receivedAmountDisplay.textContent = 'The amount to be received: ৳ 0'
    } else {
      currentCurrency = 'EUR'
      document.querySelector('.currency-symbol').textContent = '€'
      amountDescription.textContent = 'The amount you will send excl fees'
      receivedAmountDisplay.textContent = 'The amount you will send: € 0'
    }
    amount = '' // Återställ beloppet
    amountDisplay.textContent = '0'
    updateReceivedAmount()
    updateNextStepButtonState()
  })

  // Hantera klick på "Next step"-knappen
  nextStepButton.addEventListener('click', function () {
    if (!nextStepButton.disabled) {
      window.location.href = 'confirmation.html'
    }
  })
})

//Förhindra dubbeltap
document.addEventListener(
  'touchstart',
  function preventZoom(event) {
    if (event.touches.length > 1) {
      event.preventDefault() // Förhindra dubbeltryckning som orsakar zoom
    }
  },
  { passive: false }
)

let lastTouchEnd = 0

document.addEventListener(
  'touchend',
  function preventDoubleTapZoom(event) {
    const now = new Date().getTime()
    if (now - lastTouchEnd <= 300) {
      event.preventDefault() // Förhindra zoom vid dubbeltryckning
    }
    lastTouchEnd = now
  },
  false
)
