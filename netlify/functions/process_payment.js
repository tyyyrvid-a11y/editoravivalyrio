// Node 18+ tem fetch nativo, sem dependencias!

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }
  
  try {
    const paymentData = JSON.parse(event.body);
    const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
    if (!ACCESS_TOKEN) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'MP_ACCESS_TOKEN não configurado nas variáveis de ambiente.' })
      };
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

    // O bypass de teste (PIX falso) foi removido para que erros reais do
    // Mercado Pago sejam exibidos ao cliente — evita "falso sucesso" em produção.

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
