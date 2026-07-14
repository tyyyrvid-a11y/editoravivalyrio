/**
 * ============================================================================
 *  PEDIDOS DA EDITORA VIVA LYRIO  →  Planilha do Google + e-mail de aviso
 * ============================================================================
 *
 *  PASSO A PASSO (uma vez só, ~5 minutos):
 *
 *  1) Entre em https://sheets.google.com e crie uma planilha nova em branco.
 *     Dê o nome que quiser (ex.: "Pedidos Viva Lyrio").
 *
 *  2) No menu da planilha: Extensões → Apps Script.
 *
 *  3) Apague qualquer código que aparecer e COLE todo este arquivo.
 *
 *  4) Na linha do EMAIL_AVISO abaixo, troque pelo SEU e-mail (onde quer
 *     receber o aviso de cada pedido).
 *
 *  5) Clique em "Implantar" (Deploy) → "Nova implantação" (New deployment).
 *        - Tipo: "App da Web" (Web app)
 *        - Executar como: "Eu" (Me)
 *        - Quem tem acesso: "Qualquer pessoa" (Anyone)
 *     Clique em Implantar e AUTORIZE (é a sua conta que vai mandar o e-mail).
 *
 *  6) Copie a URL do "App da Web" (termina em /exec).
 *
 *  7) No arquivo index.html da loja, cole essa URL na linha:
 *        const PEDIDOS_WEBHOOK = 'COLE_AQUI_A_URL_DO_APPS_SCRIPT';
 *
 *  Pronto. Cada compra vira uma linha na planilha e um e-mail pra você.
 *  Para mudar o status, é só usar o menu suspenso da coluna "Status".
 *
 *  OBS: se depois você mudar este código, precisa "Implantar → Gerenciar
 *  implantações" e criar uma NOVA VERSÃO (ou editar a existente).
 * ============================================================================
 */

var EMAIL_AVISO = 'COLOQUE_SEU_EMAIL_AQUI@gmail.com';
var STATUS_OPCOES = ['Preparando', 'Enviando', 'Enviado'];

// Abrir a URL /exec no navegador faz um GET e cai aqui — só confirma que está no ar.
// (Os pedidos chegam por POST, na função doPost abaixo.)
function doGet(e) {
  return ContentService
    .createTextOutput('Webhook de pedidos da Editora Viva Lyrio esta ATIVO. Os pedidos chegam por POST.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    var dados = JSON.parse(e.postData.contents);
    var c = dados.cliente || {};

    var sheet = pegarAbaPedidos_();

    var itensTexto = (dados.itens || []).map(function (i) {
      var qtd = i.quantity && i.quantity > 1 ? ' x' + i.quantity : '';
      return (i.title || '') + qtd;
    }).join(', ');

    var endereco = (c.rua || '') + ', ' + (c.numero || '') +
      (c.complemento ? ' - ' + c.complemento : '') +
      ' - ' + (c.bairro || '');
    var cidadeUf = (c.cidade || '') + '/' + (c.uf || '');
    var totalFmt = 'R$ ' + Number(dados.total || 0).toFixed(2).replace('.', ',');

    sheet.appendRow([
      new Date(),
      c.nome || '',
      c.telefone || '',
      c.email || '',
      itensTexto,
      totalFmt,
      c.cep || '',
      endereco,
      cidadeUf,
      'Preparando'
    ]);

    // Menu suspenso de status na linha recém-criada
    var linha = sheet.getLastRow();
    var regra = SpreadsheetApp.newDataValidation().requireValueInList(STATUS_OPCOES, true).build();
    sheet.getRange(linha, 10).setDataValidation(regra);

    enviarEmail_(c, itensTexto, totalFmt, endereco, cidadeUf);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, erro: String(err) });
  }
}

function pegarAbaPedidos_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Pedidos');
  if (!sheet) sheet = ss.insertSheet('Pedidos');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Data', 'Nome', 'Telefone', 'E-mail', 'Itens', 'Total',
                     'CEP', 'Endereço', 'Cidade/UF', 'Status']);
    sheet.getRange('A1:J1').setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function enviarEmail_(c, itensTexto, totalFmt, endereco, cidadeUf) {
  if (!EMAIL_AVISO || EMAIL_AVISO.indexOf('COLOQUE_SEU_EMAIL') === 0) return;
  var corpo =
    'Novo pedido recebido na loja!\n\n' +
    'Cliente: ' + (c.nome || '') + '\n' +
    'Telefone: ' + (c.telefone || '') + '\n' +
    'E-mail: ' + (c.email || '') + '\n\n' +
    'Itens: ' + itensTexto + '\n' +
    'Total: ' + totalFmt + '\n\n' +
    'Endereço de entrega:\n' + endereco + '\n' + cidadeUf + '\nCEP: ' + (c.cep || '') + '\n';
  MailApp.sendEmail({
    to: EMAIL_AVISO,
    subject: 'Novo pedido — Editora Viva Lyrio (' + totalFmt + ')',
    body: corpo
  });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
