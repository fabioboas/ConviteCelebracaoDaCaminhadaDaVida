document.addEventListener('DOMContentLoaded', function () {
  const selectPresenca = document.getElementById('presenca');
  const grupoDormir = document.getElementById('grupo-dormir');
  const selectDormir = document.getElementById('dormir');
  const avisoAusencia = document.getElementById('aviso-ausencia');
  const campoMensagem = document.getElementById('mensagem');
  const inputAcompanhantes = document.getElementById('acompanhantes');
  const inputTelefone = document.getElementById('telefone');
  const erroTelefone = document.getElementById('erro-telefone');

  function sincronizarCorSelect(selectEl) {
    if (!selectEl) return;
    if (!selectEl.value) {
      selectEl.classList.add('campo-placeholder');
    } else {
      selectEl.classList.remove('campo-placeholder');
    }
  }

  function atualizarFluxoPresenca(focarMensagem) {
    if (!selectPresenca) return;

    const valor = selectPresenca.value;

    if (valor === 'Sim, estarei lá!') {
      if (grupoDormir && selectDormir) {
        grupoDormir.style.display = 'block';
        selectDormir.setAttribute('required', 'required');
      }
      if (avisoAusencia) {
        avisoAusencia.style.display = 'none';
      }
    } else if (valor === 'Não vou conseguir ir :(') {
      if (grupoDormir && selectDormir) {
        grupoDormir.style.display = 'none';
        selectDormir.removeAttribute('required');
        selectDormir.value = '';
      }
      if (avisoAusencia) {
        avisoAusencia.style.display = 'block';
      }
      if (focarMensagem && campoMensagem) {
        campoMensagem.focus();
      }
    } else {
      if (grupoDormir && selectDormir) {
        grupoDormir.style.display = 'none';
        selectDormir.removeAttribute('required');
        selectDormir.value = '';
      }
      if (avisoAusencia) {
        avisoAusencia.style.display = 'none';
      }
    }

    sincronizarCorSelect(selectPresenca);
    sincronizarCorSelect(selectDormir);
  }

  atualizarFluxoPresenca(false);

  if (selectPresenca) {
    selectPresenca.addEventListener('change', function () {
      atualizarFluxoPresenca(true);
    });
  }

  if (selectDormir) {
    selectDormir.addEventListener('change', function () {
      sincronizarCorSelect(selectDormir);
    });
  }

  if (inputAcompanhantes) {
    inputAcompanhantes.addEventListener('focus', function () {
      this.classList.remove('campo-placeholder');
    });

    inputAcompanhantes.addEventListener('input', function () {
      this.classList.remove('campo-placeholder');
    });
  }

  function formatarTelefone(valorBruto) {
    const temMais = valorBruto.trim().startsWith('+');
    const digitos = valorBruto.replace(/\D/g, '');

    if (temMais) {
      const limitados = digitos.slice(0, 15);
      if (!limitados) return '+';

      const ccLen = limitados.length > 11 ? 3 : limitados.length > 9 ? 2 : 1;
      const cc = limitados.slice(0, ccLen);
      const resto = limitados.slice(ccLen);

      const grupos = resto.match(/.{1,4}/g) || [];
      return `+${cc}${grupos.length ? ' ' + grupos.join(' ') : ''}`;
    }

    const br = digitos.slice(0, 11);
    if (br.length === 0) return '';
    if (br.length <= 2) return `(${br}`;
    if (br.length <= 6) return `(${br.slice(0, 2)}) ${br.slice(2)}`;
    if (br.length <= 10) {
      return `(${br.slice(0, 2)}) ${br.slice(2, 6)}-${br.slice(6)}`;
    }
    return `(${br.slice(0, 2)}) ${br.slice(2, 7)}-${br.slice(7)}`;
  }

  function validarTelefone(valorFormatado) {
    const trimmed = valorFormatado.trim();
    const temMais = trimmed.startsWith('+');
    const digitos = trimmed.replace(/\D/g, '');

    if (!digitos) {
      return { valido: false, mensagem: 'Informe um telefone para contato.' };
    }

    if (/^(\d)\1+$/.test(digitos)) {
      return {
        valido: false,
        mensagem: 'Esse número parece inválido. Confira os dígitos.',
      };
    }

    if (temMais) {
      if (digitos.length < 8 || digitos.length > 15) {
        return {
          valido: false,
          mensagem:
            'Número internacional deve ter entre 8 e 15 dígitos (ex.: +44 20 7946 0958).',
        };
      }
      if (digitos.startsWith('0')) {
        return {
          valido: false,
          mensagem: 'O código do país não começa com 0.',
        };
      }
      return { valido: true, mensagem: '' };
    }

    if (digitos.length !== 10 && digitos.length !== 11) {
      return {
        valido: false,
        mensagem:
          'Digite DDD + número (10 dígitos fixo ou 11 dígitos celular, ou use + para exterior).',
      };
    }

    const ddd = parseInt(digitos.slice(0, 2), 10);
    if (ddd < 11 || ddd > 99) {
      return { valido: false, mensagem: 'DDD inválido no número brasileiro.' };
    }

    if (digitos.length === 11 && digitos[2] !== '9') {
      return {
        valido: false,
        mensagem:
          'Celular com 11 dígitos no Brasil deve começar com 9 após o DDD.',
      };
    }

    return { valido: true, mensagem: '' };
  }

  function atualizarEstadoTelefone(exibirErro) {
    if (!inputTelefone) return true;

    const formatado = formatarTelefone(inputTelefone.value);
    if (inputTelefone.value !== formatado) {
      inputTelefone.value = formatado;
    }

    const resultado = validarTelefone(formatado);

    if (!resultado.valido && exibirErro) {
      inputTelefone.classList.add('campo-invalido');
      inputTelefone.setCustomValidity(resultado.mensagem);
      if (erroTelefone) {
        erroTelefone.textContent = resultado.mensagem;
        erroTelefone.style.display = 'block';
      }
    } else if (resultado.valido) {
      inputTelefone.classList.remove('campo-invalido');
      inputTelefone.setCustomValidity('');
      if (erroTelefone) {
        erroTelefone.textContent = '';
        erroTelefone.style.display = 'none';
      }
    } else {
      inputTelefone.setCustomValidity(resultado.mensagem);
    }

    return resultado.valido;
  }

  if (inputTelefone) {
    inputTelefone.addEventListener('input', function () {
      const temConteudo =
        this.value.replace(/\D/g, '').length > 0 || this.value.trim() === '+';
      const digitos = this.value.replace(/\D/g, '');
      const deveValidarJa =
        digitos.length >= 10 ||
        (this.value.startsWith('+') && digitos.length >= 8);
      atualizarEstadoTelefone(deveValidarJa && temConteudo);
    });

    inputTelefone.addEventListener('blur', function () {
      const temAlgo = this.value.trim().length > 0;
      atualizarEstadoTelefone(temAlgo);
    });

    const form = inputTelefone.closest('form');
    if (form) {
      form.addEventListener('submit', function (event) {
        const valido = atualizarEstadoTelefone(true);
        if (!valido) {
          event.preventDefault();
          inputTelefone.focus();
        }
      });
    }
  }
});
