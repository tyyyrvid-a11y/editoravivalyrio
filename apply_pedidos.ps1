$path = "c:\Users\Artur\Downloads\files\admin.html"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# 1. Add "Pedidos" to Sidebar
$navReplacement = @"
      <button class="nav-item" onclick="setView('pedidos')">
        <span class="icon">??</span> Pedidos
      </button>
    </nav>
"@
$content = $content.Replace("</nav>", $navReplacement)

# 2. Add the Pedidos View
$viewHtml = @"
      <!-- PEDIDOS -->
      <div id="view-pedidos" class="section-hidden">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
          <h2 style="font-size:20px;color:var(--text);margin:0;">Últimos Pedidos</h2>
          <button class="btn btn-secondary btn-sm" onclick="carregarPedidos()">?? Atualizar</button>
        </div>
        <div class="posts-table">
          <table style="width:100%;text-align:left;border-collapse:collapse;font-size:14px;">
            <thead>
              <tr style="border-bottom:2px solid var(--border);color:var(--muted);">
                <th style="padding:12px 10px;">ID / Data</th>
                <th style="padding:12px 10px;">Cliente (CEP)</th>
                <th style="padding:12px 10px;">Resumo</th>
                <th style="padding:12px 10px;">Total</th>
                <th style="padding:12px 10px;">Status</th>
              </tr>
            </thead>
            <tbody id="tabela-pedidos-body">
              <tr><td colspan="5" style="padding:20px;text-align:center;"><div class="loading"><div class="spinner"></div> Carregando pedidos...</div></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- NOVO
"@
$content = $content.Replace("<!-- NOVO", $viewHtml)

# 3. Update JavaScript variables and view array
$viewsPattern = "const views = \['dashboard', 'posts', 'novo'\];"
$viewsReplacement = "const views = ['dashboard', 'posts', 'novo', 'pedidos'];"
$content = $content -replace [regex]::Escape($viewsPattern), $viewsReplacement

# 4. Modify the notification system and add carregarPedidos()
$oldLogicPattern = '(?s)// ===== SISTEMA DE NOTIFICAÇÃO DE PEDIDOS =====.*?// ============================================='
$newLogic = @"
  // ===== SISTEMA DE PEDIDOS =====
  let ultimoPedidoId = null;
  
  function showToastPedido(mensagem) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = '#32BCAD'; // Tema verde da editora
    toast.style.color = '#fff';
    toast.style.padding = '15px 20px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    toast.style.zIndex = '9999';
    toast.style.fontFamily = 'Inter, sans-serif';
    toast.style.fontWeight = 'bold';
    toast.innerHTML = '??? ' + mensagem;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transition = 'opacity 0.5s';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 500);
    }, 5000);
  }

  async function verificarNovosPedidos() {
    try {
      const res = await fetch(SB_URL + '/rest/v1/pedidos?order=criado_em.desc&limit=1', {
        headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY }
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.length > 0) {
        const pedidoMaisRecente = data[0];
        
        // Se for a primeira vez rodando, apenas salva qual é o mais recente
        if (ultimoPedidoId === null) {
          ultimoPedidoId = pedidoMaisRecente.id;
        } 
        // Se mudou o ID, é um pedido novo!
        else if (ultimoPedidoId !== pedidoMaisRecente.id) {
          ultimoPedidoId = pedidoMaisRecente.id;
          showToastPedido('Novo pedido! (R$ ' + pedidoMaisRecente.detalhes.total.toFixed(2).replace('.', ',') + ')');
          
          // Se a aba de pedidos estiver aberta, recarrega a tabela automaticamente
          if (!document.getElementById('view-pedidos').classList.contains('section-hidden')) {
            carregarPedidos();
          }
        }
      }
    } catch (e) {}
  }

  async function carregarPedidos() {
    const tbody = document.getElementById('tabela-pedidos-body');
    tbody.innerHTML = '<tr><td colspan="5" style="padding:20px;text-align:center;"><div class="loading"><div class="spinner"></div> Carregando pedidos...</div></td></tr>';
    
    try {
      const res = await fetch(SB_URL + '/rest/v1/pedidos?order=criado_em.desc', {
        headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY }
      });
      if (!res.ok) throw new Error('Falha ao carregar');
      const data = await res.json();
      
      if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="padding:20px;text-align:center;color:var(--muted);">Nenhum pedido encontrado.</td></tr>';
        return;
      }
      
      let html = '';
      data.forEach(p => {
        const dataFormatada = new Date(p.criado_em).toLocaleString('pt-BR');
        const total = 'R$ ' + (p.detalhes.total || 0).toFixed(2).replace('.', ',');
        const cep = p.detalhes.cliente?.cep || 'Não informado';
        
        let resumoItens = '';
        if (p.detalhes.itens && Array.isArray(p.detalhes.itens)) {
           resumoItens = p.detalhes.itens.map(i => `${i.quantity}x ${i.title}`).join('<br>');
        }
        
        let statusBadge = '';
        if(p.status === 'pendente') statusBadge = '<span style="background:var(--terra);color:#fff;padding:4px 8px;border-radius:12px;font-size:11px;">Pendente</span>';
        else statusBadge = `<span style="background:var(--success);color:#fff;padding:4px 8px;border-radius:12px;font-size:11px;">${p.status}</span>`;
        
        html += `
          <tr style="border-bottom:1px solid var(--border);">
            <td style="padding:12px 10px;vertical-align:top;">
              <strong>#${p.id.substring(0,8).toUpperCase()}</strong><br>
              <span style="font-size:11px;color:var(--muted);">${dataFormatada}</span>
            </td>
            <td style="padding:12px 10px;vertical-align:top;">CEP: ${cep}</td>
            <td style="padding:12px 10px;vertical-align:top;font-size:12px;line-height:1.4;">${resumoItens}</td>
            <td style="padding:12px 10px;vertical-align:top;font-weight:600;">${total}</td>
            <td style="padding:12px 10px;vertical-align:top;">${statusBadge}</td>
          </tr>
        `;
      });
      tbody.innerHTML = html;
      
    } catch (e) {
      tbody.innerHTML = '<tr><td colspan="5" style="padding:20px;text-align:center;color:red;">Erro ao carregar os pedidos.</td></tr>';
    }
  }

  // Inicializa
  verificarNovosPedidos();
  setInterval(verificarNovosPedidos, 15000);
  
  // Ao carregar a tela de pedidos, renderiza
  // Adiciona um observer simples no botao pra carregar na primeira vez
  document.querySelector('.nav-item[onclick*="pedidos"]').addEventListener('click', carregarPedidos);

  // =============================================
"@

$content = $content -replace $oldLogicPattern, $newLogic

[System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Modifications completed!"
