document.addEventListener('DOMContentLoaded', function () {
  const selectPresenca = document.getElementById('presenca');
  const grupoDormir = document.getElementById('grupo-dormir');
  const selectDormir = document.getElementById('dormir');

  function sincronizarCorSelect(selectEl) {
    if (!selectEl) return;
    if (!selectEl.value) {
      selectEl.classList.add('campo-placeholder');
    } else {
      selectEl.classList.remove('campo-placeholder');
    }
  }

  function atualizarCampoDormir() {
    if (!selectPresenca || !grupoDormir || !selectDormir) return;

    if (selectPresenca.value === 'Sim, estarei lá!') {
      grupoDormir.style.display = 'block';
      selectDormir.setAttribute('required', 'required');
    } else {
      grupoDormir.style.display = 'none';
      selectDormir.removeAttribute('required');
      selectDormir.value = '';
    }

    sincronizarCorSelect(selectPresenca);
    sincronizarCorSelect(selectDormir);
  }

  atualizarCampoDormir();

  if (selectPresenca) {
    selectPresenca.addEventListener('change', atualizarCampoDormir);
  }

  if (selectDormir) {
    selectDormir.addEventListener('change', function () {
      sincronizarCorSelect(selectDormir);
    });
  }
});
const inputAcompanhantes = document.getElementById('acompanhantes');

if (inputAcompanhantes) {
  inputAcompanhantes.addEventListener('focus', function () {
    this.classList.remove('campo-placeholder');
  });

  inputAcompanhantes.addEventListener('input', function () {
    this.classList.remove('campo-placeholder');
  });
}
