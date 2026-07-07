$path = "c:\Users\Artur\Downloads\files\admin.html"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

$replacement = @"
  // ===== SISTEMA DE NOTIFICAÇÃO DE PEDIDOS =====
  let ultimoPedidoId = null;
  
  // AudioContext às vezes precisa de interação do usuário para iniciar (autoplay policy). 
  // O toast visual garante que o admin veja mesmo se o áudio não tocar.
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  function playBeep() {
    if(audioContext.state === 'suspended') {
      audioContext.resume();
    }
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    osc.start();
    osc.stop(audioContext.currentTime + 0.3);
  }

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
          playBeep();
          showToastPedido('Novo pedido recebido! (R$ ' + pedidoMaisRecente.detalhes.total.toFixed(2).replace('.', ',') + ')');
        }
      }
    } catch (e) {
      console.error('Erro ao verificar pedidos:', e);
    }
  }

  // Inicializa o primeiro fetch e define o loop
  verificarNovosPedidos();
  setInterval(verificarNovosPedidos, 15000); // 15 segundos
  // =============================================
</script>
"@

$content = $content.Replace("</script>", $replacement)
[System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Admin notification logic injected!"
