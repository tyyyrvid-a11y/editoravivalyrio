const fs = require('fs');

const path = 'c:\\Users\\Artur\\Downloads\\files\\viva_lyrio.html';
let html = fs.readFileSync(path, 'utf8');

// 1. Add Address HTML
const addressHtml = `
      <div id="endereco-campos" style="display:none; margin-bottom:24px;">
        <label style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#888;font-weight:700;margin-bottom:8px;display:block;">Endereço de Entrega</label>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <input id="input-rua" placeholder="Rua / Logradouro" style="padding:12px 16px;border:1px solid #DDD;border-radius:10px;font-size:14px;font-family:Inter,sans-serif;outline:none;" readonly>
          <div style="display:flex; gap:10px;">
            <input id="input-numero" placeholder="Número" style="flex:1;padding:12px 16px;border:1px solid #DDD;border-radius:10px;font-size:14px;font-family:Inter,sans-serif;outline:none;">
            <input id="input-complemento" placeholder="Complemento" style="flex:2;padding:12px 16px;border:1px solid #DDD;border-radius:10px;font-size:14px;font-family:Inter,sans-serif;outline:none;">
          </div>
          <div style="display:flex; gap:10px;">
            <input id="input-bairro" placeholder="Bairro" style="flex:1;padding:12px 16px;border:1px solid #DDD;border-radius:10px;font-size:14px;font-family:Inter,sans-serif;outline:none;" readonly>
            <input id="input-cidade" placeholder="Cidade" style="flex:1;padding:12px 16px;border:1px solid #DDD;border-radius:10px;font-size:14px;font-family:Inter,sans-serif;outline:none;" readonly>
            <input id="input-uf" placeholder="UF" style="width:60px;padding:12px 16px;border:1px solid #DDD;border-radius:10px;font-size:14px;font-family:Inter,sans-serif;outline:none;" readonly>
          </div>
        </div>
      </div>
`;
// Insert after cep-resultado
if (!html.includes('id="endereco-campos"')) {
    html = html.replace(
        '<div id="cep-resultado" style="display:none;font-size:13px;color:#555;background:#F5F5F5;border-radius:10px;padding:12px;margin-bottom:24px;line-height:1.5;"></div>',
        '<div id="cep-resultado" style="display:none;font-size:13px;color:#555;background:#F5F5F5;border-radius:10px;padding:12px;margin-bottom:24px;line-height:1.5;"></div>\n' + addressHtml
    );
}

// 2. Modify calcularFrete
const oldCalcularFrete = `      document.getElementById('resumo-total-val').textContent = 'R$ ' + total.toFixed(2).replace('.',',');
    } catch(e) {
      el.innerHTML = '⚠️ CEP não encontrado. Verifique o número e tente novamente.';
    }
  }`;

const newCalcularFrete = `      document.getElementById('resumo-total-val').textContent = 'R$ ' + total.toFixed(2).replace('.',',');

      // PREENCHER ENDEREÇO
      const endCampos = document.getElementById('endereco-campos');
      if (endCampos) {
        endCampos.style.display = 'block';
        document.getElementById('input-rua').value = data.logradouro || '';
        document.getElementById('input-bairro').value = data.bairro || '';
        document.getElementById('input-cidade').value = data.localidade || '';
        document.getElementById('input-uf').value = data.uf || '';
        document.getElementById('input-numero').focus();
      }
    } catch(e) {
      el.innerHTML = '⚠️ CEP não encontrado. Verifique o número e tente novamente.';
      const endCampos = document.getElementById('endereco-campos');
      if (endCampos) endCampos.style.display = 'none';
    }
  }`;

html = html.replace(oldCalcularFrete, newCalcularFrete);

// 3. Modify onSubmit in renderPaymentBrick
const oldOnSubmit = `onSubmit: ({ selectedPaymentMethod, formData }) => {
          return new Promise((resolve, reject) => {
            // Append items and total to the payload for our backend
            // formData.items = items;
            // formData.total = totalAmount;
            
            fetch('http://localhost:3000/process_payment', {`;

const newOnSubmit = `onSubmit: ({ selectedPaymentMethod, formData }) => {
          return new Promise((resolve, reject) => {
            
            // ===== SUPABASE SALVAR =====
            const clienteCep = document.getElementById('input-cep') ? document.getElementById('input-cep').value : '';
            const clienteRua = document.getElementById('input-rua') ? document.getElementById('input-rua').value : '';
            const clienteNumero = document.getElementById('input-numero') ? document.getElementById('input-numero').value : '';
            const clienteComp = document.getElementById('input-complemento') ? document.getElementById('input-complemento').value : '';
            const clienteBairro = document.getElementById('input-bairro') ? document.getElementById('input-bairro').value : '';
            const clienteCidade = document.getElementById('input-cidade') ? document.getElementById('input-cidade').value : '';
            const clienteUf = document.getElementById('input-uf') ? document.getElementById('input-uf').value : '';

            const pedidoParaSalvar = {
              detalhes: {
                itens: items,
                total: totalAmount,
                cliente: {
                  cep: clienteCep,
                  rua: clienteRua,
                  numero: clienteNumero,
                  complemento: clienteComp,
                  bairro: clienteBairro,
                  cidade: clienteCidade,
                  uf: clienteUf
                }
              },
              status: 'pendente'
            };
            
            fetch(SB_URL + '/rest/v1/pedidos', {
              method: 'POST',
              headers: {
                'apikey': SB_KEY,
                'Authorization': 'Bearer ' + SB_KEY,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
              },
              body: JSON.stringify(pedidoParaSalvar)
            }).catch(e => console.error('Erro ao salvar no Supabase:', e));
            // ===========================

            fetch('http://localhost:3000/process_payment', {`;

html = html.replace(oldOnSubmit, newOnSubmit);

fs.writeFileSync(path, html, 'utf8');
console.log('viva_lyrio.html updated successfully with address fields and Supabase integration!');
