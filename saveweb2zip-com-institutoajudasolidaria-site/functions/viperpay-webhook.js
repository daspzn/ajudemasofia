// netlify/functions/viperpay-webhook.js
exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Use POST' };
  }
  try {
    const payload = JSON.parse(event.body || '{}');
    console.log('Webhook ViperPay recebido:', payload);
    // Aqui você pode salvar status no DB, enviar email, etc.
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    console.error('Erro webhook:', e);
    return { statusCode: 500, body: 'erro' };
  }
};