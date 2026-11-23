document.addEventListener('DOMContentLoaded', function () {
  // Garante que exista uma tag <link rel="icon"> no <head>
  let linkIcon = document.querySelector('link[rel~="icon"]');
  if (!linkIcon) {
    linkIcon = document.createElement('link');
    linkIcon.rel = 'icon';
    linkIcon.type = 'image/svg+xml';
    document.head.appendChild(linkIcon);
  }

  // Quatro elementos alinhados à paleta do convite (Terra, Água, Ar, Fogo)
  const elementos = [
    {
      nome: 'Terra',
      cor: '#3b4d3c',
      detalhe: '#d9b35f',
      svg: `
        <circle cx="32" cy="32" r="30" fill="#3b4d3c"/>
        <path d="M12 43 Q24 27 36 43 Z" fill="#6b8e5a"/>
        <path d="M26 44 Q40 21 54 44 Z" fill="#d9b35f"/>
        <circle cx="46" cy="18" r="5" fill="#fdf8ec"/>
      `,
    },
    {
      nome: 'Água',
      cor: '#0e4c5e',
      detalhe: '#89d4e8',
      svg: `
        <circle cx="32" cy="32" r="30" fill="#0e4c5e"/>
        <path d="M32 13 C32 13 17 31 17 41 A15 15 0 0 0 47 41 C47 31 32 13 32 13 Z" fill="#89d4e8"/>
        <path d="M25 41 A7 7 0 0 0 32 48" fill="none" stroke="#fdf8ec" stroke-width="2.5" stroke-linecap="round"/>
      `,
    },
    {
      nome: 'Ar',
      cor: '#1b365d',
      detalhe: '#fdf8ec',
      svg: `
        <circle cx="32" cy="32" r="30" fill="#1b365d"/>
        <path d="M14 25 H39 A6 6 0 1 0 33 19" fill="none" stroke="#fdf8ec" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M16 35 H46 A5.5 5.5 0 1 1 40.5 40.5" fill="none" stroke="#f3d58d" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M19 44 H33" fill="none" stroke="#fdf8ec" stroke-width="2.8" stroke-linecap="round"/>
      `,
    },
    {
      nome: 'Fogo',
      cor: '#8f3527',
      detalhe: '#f5b700',
      svg: `
        <circle cx="32" cy="32" r="30" fill="#8f3527"/>
        <path d="M33 12 C33 12 45 24 45 36 A13 13 0 1 1 19 36 C19 29 24 24 27 21 C26 26 29 28 31 28 C28 21 33 12 33 12 Z" fill="#f5b700"/>
        <path d="M32 29 C32 29 38 35 38 41 A6 6 0 1 1 26 41 C26 37 29 35 32 29 Z" fill="#fff3c4"/>
      `,
    },
  ];

  let indiceAtual = 0;
  let alternanciaAtiva = true;

  function aplicarElemento(indice) {
    const el = elementos[indice % elementos.length];
    const svgCompleto = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${el.svg}</svg>`;
    linkIcon.href = 'data:image/svg+xml,' + encodeURIComponent(svgCompleto);
  }

  // Inicia no primeiro elemento
  aplicarElemento(indiceAtual);

  // Alterna suavemente entre Terra, Água, Ar e Fogo a cada 2,5s
  const intervalo = setInterval(function () {
    if (!alternanciaAtiva) return;
    indiceAtual = (indiceAtual + 1) % elementos.length;
    aplicarElemento(indiceAtual);
  }, 2500);

  // Interação 1: clicar/tocar em qualquer lugar avança para o próximo elemento e pausa o ciclo automático por 6s
  let retomadaTimeout = null;
  document.addEventListener('pointerdown', function () {
    indiceAtual = (indiceAtual + 1) % elementos.length;
    aplicarElemento(indiceAtual);

    alternanciaAtiva = false;
    clearTimeout(retomadaTimeout);
    retomadaTimeout = setTimeout(function () {
      alternanciaAtiva = true;
    }, 6000);
  });

  // Interação 2: rolar a página também passa pelos 4 elementos suavemente
  window.addEventListener(
    'scroll',
    function () {
      const alturaRolavel =
        document.documentElement.scrollHeight - window.innerHeight;
      if (alturaRolavel <= 0) return;
      const progresso = Math.min(
        0.999,
        Math.max(0, window.scrollY / alturaRolavel),
      );
      const proximoIndice = Math.floor(progresso * elementos.length);
      if (proximoIndice !== indiceAtual) {
        indiceAtual = proximoIndice;
        aplicarElemento(indiceAtual);
      }
    },
    { passive: true },
  );

  // Interação 3: trocar de aba ou voltar para a aba atualiza o ícone na hora
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
      aplicarElemento(indiceAtual);
    }
  });
});
