module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const paymentData = req.body;
    const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
    if (!ACCESS_TOKEN) {
      return res.status(500).json({ error: 'MP_ACCESS_TOKEN não configurado nas variáveis de ambiente.' });
    }

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'X-Idempotency-Key': Math.random().toString(36).substring(7),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    let data = await response.json();

    // O bypass de teste foi removido para que erros reais do Mercado Pago sejam exibidos.

    return res.status(200).json(data);
  } catch (error) {
    console.error('Payment processing error:', error);
    return res.status(500).json({ error: error.message });
  }
};
