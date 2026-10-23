export default async function handler(req, res) {
  if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
        }

          const { tenantName, houseNo, phone, amount } = req.body;

            const subscriptionKey = process.env.MOMO_SUBSCRIPTION_KEY;
              const userId = process.env.MOMO_USER_ID;
                const apiKey = process.env.MOMO_API_KEY;
                  const baseUrl = process.env.MOMO_BASE_URL || 'https://proxy.momoapi.mtn.com';
                    const momoEnv = process.env.MOMO_ENV || 'mtnug';

                      // Check if environment variables exist
                        if (!subscriptionKey || !userId || !apiKey) {
                            return res.status(500).json({ 
                                  success: false, 
                                        message: 'Missing Vercel Environment Variables: Check MOMO_SUBSCRIPTION_KEY, MOMO_USER_ID, or MOMO_API_KEY.' 
                                            });
                                              }

                                                // Auto-format phone number to 256...
                                                  let cleanPhone = phone.replace(/[^0-9]/g, '');
                                                    if (cleanPhone.startsWith('0')) {
                                                        cleanPhone = '256' + cleanPhone.slice(1);
                                                          }

                                                            try {
                                                                // 1. Get Access Token from MTN
                                                                    const authString = Buffer.from(`${userId}:${apiKey}`).toString('base64');
                                                                        const tokenResponse = await fetch(`${baseUrl}/collection/token/`, {
                                                                              method: 'POST',
                                                                                    headers: {
                                                                                            'Authorization': `Basic ${authString}`,
                                                                                                    'Ocp-Apim-Subscription-Key': subscriptionKey,
                                                                                                          },
                                                                                                              });

                                                                                                                  const tokenData = await tokenResponse.json();

                                                                                                                      if (!tokenResponse.ok || !tokenData.access_token) {
                                                                                                                            return res.status(500).json({ 
                                                                                                                                    success: false, 
                                                                                                                                            message: `MTN Auth Failed: ${tokenData.message || tokenData.error || 'Check User ID / API Key / Subscription Key'}` 
                                                                                                                                                  });
                                                                                                                                                      }

                                                                                                                                                          // 2. Request Payment (RequestToPay)
                                                                                                                                                              const referenceId = crypto.randomUUID();
                                                                                                                                                                  const payResponse = await fetch(`${baseUrl}/collection/v1_0/requesttopay`, {
                                                                                                                                                                        method: 'POST',
                                                                                                                                                                              headers: {
                                                                                                                                                                                      'Authorization': `Bearer ${tokenData.access_token}`,
                                                                                                                                                                                              'X-Reference-Id': referenceId,
                                                                                                                                                                                                      'X-Target-Environment': momoEnv,
                                                                                                                                                                                                              'Ocp-Apim-Subscription-Key': subscriptionKey,
                                                                                                                                                                                                                      'Content-Type': 'application/json',
                                                                                                                                                                                                                            },
                                                                                                                                                                                                                                  body: JSON.stringify({
                                                                                                                                                                                                                                          amount: amount.toString(),
                                                                                                                                                                                                                                                  currency: 'UGX',
                                                                                                                                                                                                                                                          externalId: houseNo,
                                                                                                                                                                                                                                                                  payer: {
                                                                                                                                                                                                                                                                            partyIdType: 'MSISDN',
                                                                                                                                                                                                                                                                                      partyId: cleanPhone,
                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                      payerMessage: `Rent payment for ${houseNo}`,
                                                                                                                                                                                                                                                                                                              payeeNote: `Payment from ${tenantName}`,
                                                                                                                                                                                                                                                                                                                    }),
                                                                                                                                                                                                                                                                                                                        });

                                                                                                                                                                                                                                                                                                                            if (payResponse.status === 202) {
                                                                                                                                                                                                                                                                                                                                  return res.status(200).json({ success: true, message: 'Payment prompt sent successfully!' });
                                                                                                                                                                                                                                                                                                                                      } else {
                                                                                                                                                                                                                                                                                                                                            const errorText = await payResponse.text();
                                                                                                                                                                                                                                                                                                                                                  return res.status(400).json({ success: false, message: `MTN Payment Failed (${payResponse.status}): ${errorText}` });
                                                                                                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                                                                                                        } catch (error) {
                                                                                                                                                                                                                                                                                                                                                            return res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
                                                                                                                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                                                                                                                              }
