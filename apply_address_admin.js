const fs = require('fs');

const path = 'c:\\Users\\Artur\\Downloads\\files\\admin.html';
let html = fs.readFileSync(path, 'utf8');

const oldCode = `        const cep = p.detalhes.cliente?.cep || 'Não informado';
        
        let resumoItens = '';`;

const newCode = `        const c = p.detalhes.cliente || {};
        let enderecoHtml = c.cep ? 'CEP: ' + c.cep : 'Não informado';
        if (c.rua) {
          enderecoHtml = \`\${c.rua}, \${c.numero}\`;
          if (c.complemento) enderecoHtml += \` - \${c.complemento}\`;
          enderecoHtml += \`<br>\${c.bairro} - \${c.cidade}/\${c.uf}<br>CEP: \${c.cep}\`;
        }
        
        let resumoItens = '';`;

html = html.replace(oldCode, newCode);

const oldTd = `<td style="padding:12px 10px;vertical-align:top;">CEP: \${cep}</td>`;
const newTd = `<td style="padding:12px 10px;vertical-align:top;font-size:12px;line-height:1.4;">\${enderecoHtml}</td>`;

html = html.replace(oldTd, newTd);

// also update the table header just in case it says "Cliente (CEP)"
html = html.replace('<th style="padding:12px 10px;">Cliente (CEP)</th>', '<th style="padding:12px 10px;">Endereço de Entrega</th>');

fs.writeFileSync(path, html, 'utf8');
console.log('admin.html updated successfully with address display!');
