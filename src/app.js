const handleMtnPayment = async (e) => {
  e.preventDefault();
    setLoading(true);
      setStatusMessage('Initiating MTN MoMo Prompt...');

        try {
            const response = await fetch('/api/pay-mtn-rent', {
                  method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ tenantName, houseNo, phone, amount }),
                                  });

                                      const data = await response.json();

                                          if (response.ok && data.success) {
                                                setStatusMessage('✅ Payment prompt sent! Check your phone screen to enter PIN.');
                                                    } else {
                                                          setStatusMessage(`❌ ${data.message || 'Payment initiation failed.'}`);
                                                              }
                                                                } catch (error) {
                                                                    setStatusMessage(`❌ Server connection error: ${error.message}`);
                                                                      } finally {
                                                                          setLoading(false);
                                                                            }
                                                                            };
