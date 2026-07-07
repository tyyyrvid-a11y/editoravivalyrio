const token = 'APP_USR-6446017048803963-062716-a26b48aa8dbec68667ff8b407afecf42-3502535372';
fetch('https://api.mercadopago.com/checkout/preferences', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    items: [
      {
        title: 'Test',
        quantity: 1,
        unit_price: 10.5
      }
    ]
  })
})
.then(r => r.json())
.then(data => console.log('Init Point:', data.init_point))
.catch(e => console.error(e));
