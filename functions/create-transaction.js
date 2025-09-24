// functions/create-transaction.js

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Use POST' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const total_amount = Number(body.total_amount);
    if (!total_amount) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Valor inválido' }) };
    }

    const VIPERPAY_SECRET = process.env.VIPERPAY_SECRET;
    if (!VIPERPAY_SECRET) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Chave não configurada' }) };
    }

    const payload = {
      external_id: body.external_id || `pedido_${Date.now()}`,
      total_amount,
      payment_method: "PIX",
      items: [{
        id: "item1",
        title: "Doação",
        description: "Doação via site",
        price: total_amount,
        quantity: 1,
        is_physical: false
      }],
      customer: {
        name: body.customer?.name || "Usuário Teste",
        email: body.customer?.email || "teste@exemplo.com",
        document_type: body.customer?.document_type || "CPF",
        document: body.customer?.document?.replace(/\D/g, '') || "11144477735" // CPF válido de teste
      },
      webhook_url: "https://juntoscomasofia.site/webhook",
      ip: "127.0.0.1"
    };

    const resp = await fetch("https://api.viperpay.org/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-secret": VIPERPAY_SECRET
      },
      body: JSON.stringify(payload)
    });

    const data = await resp.json();

    return {
      statusCode: resp.status,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Erro no servidor",
        details: err.message
      })
    };
  }
};
