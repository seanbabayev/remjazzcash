import { NextResponse } from 'next/server';
import { getEnvVar } from '@/lib/env';

async function getAccessToken() {
  try {
    const clientId = getEnvVar('ONELINK_API_KEY');
    const clientSecret = getEnvVar('ONELINK_API_SECRET');
    const baseUrl = getEnvVar('ONELINK_API_URL');
    
    console.log('Getting access token...');
    
    const tokenUrl = `${baseUrl}/oauth2/token`;
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-IBM-Client-Id': clientId,
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'scope': '1LinkApi',
        'client_id': clientId,
        'client_secret': clientSecret,
      }).toString()
    });

    const responseText = await response.text();
    console.log('Token response:', responseText);

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.status} ${responseText}`);
    }

    try {
      const data = JSON.parse(responseText);
      console.log('Successfully got access token');
      return data.access_token;
    } catch (e) {
      console.error('Failed to parse token response as JSON:', e);
      throw new Error('Invalid token response format');
    }
  } catch (error) {
    console.error('Error in getAccessToken:', error);
    throw error;
  }
}

function getCurrentDateTime() {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return {
    transmissionDateTime: `${year}${month}${day}${hours}${minutes}${seconds}`,
    time: `${hours}${minutes}${seconds}`,
    date: `${month}${day}`,
  };
}

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json();
    console.log('Processing request for phone number:', phoneNumber);

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Ta bort '+' från telefonnumret
    const cleanPhoneNumber = phoneNumber.replace(/^\+/, '');
    console.log('Clean phone number:', cleanPhoneNumber);

    const clientId = getEnvVar('ONELINK_API_KEY');
    const clientSecret = getEnvVar('ONELINK_API_SECRET');
    const baseUrl = getEnvVar('ONELINK_API_URL');
    console.log('Using client ID:', clientId);
    console.log('Using base URL:', baseUrl);
    
    const accessToken = await getAccessToken();

    const requestBody = {
      TransactionAmount: "000000100000",
      TransmissionDateAndTime: "0220170000",
      STAN: "102050",
      Time: "170000",
      Date: "0220",
      MerchantType: "0003",
      FromBankIMD: "998876",
      RRN: "000000024420",
      CardAcceptorTerminalId: "40260275",
      CardAcceptorIdCode: "402626030259047",
      CardAcceptorNameLocation: {
        Location: "Park Towers",
        City: "Karachi",
        State: "Sindh",
        ZipCode: "34234",
        AgentName: "Ali Qazi",
        AgentCity: "Karachi",
        ADCLiteral: "Any Channel",
        BankName: "Allied Bank",
        Country: "PK"
      },
      PaymentDetail: "0320 Donations  Charity                     ",
      CurrencyCodeTransaction: "586",
      ToBankIMD: "221166",
      AccountNumberTo: cleanPhoneNumber,
      PosEntMode: "000",
      PAN: "4250108749566"
    };

    console.log('Making request to 1Link API...');
    const apiUrl = `${baseUrl}/path-1`;
    console.log('URL:', apiUrl);
    console.log('Headers:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'X-IBM-Client-Id': clientId,
    });
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-IBM-Client-Id': clientId,
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    console.log('1Link API response status:', response.status);
    console.log('1Link API response headers:', Object.fromEntries(response.headers.entries()));
    console.log('1Link API response text:', responseText);

    if (!response.ok) {
      throw new Error(`1Link API error: ${response.status} ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log('Parsed response data:', JSON.stringify(data, null, 2));
    
    if (data.ResponseCode === "00" && data.AccountTitleTo) {
      return NextResponse.json({
        name: data.AccountTitleTo.trim(),
        responseCode: data.ResponseCode,
        responseDetail: data.ResponseDetail
      });
    } else {
      throw new Error(data.ResponseDetail || 'Failed to fetch account title');
    }

  } catch (error) {
    console.error('Title fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch account details', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}