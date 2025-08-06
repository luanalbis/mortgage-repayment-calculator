
const submitBtn = document.getElementById('btn-submit');
const form = document.getElementById('conteiner-form-info');
const onlyNumberInputs = document.querySelectorAll('.only-number');
const allInputs = document.querySelectorAll('input');
let allValidInputs = [];

onlyNumberInputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.value == 0) input.value = input.value.replace(0, '');
        input.value = input.value.replace(/[^0-9]/g, '');



    });
});

form.addEventListener('input', (event) => {
    const input = event.target;
    checkInputForm(input);
    submitBtn.disabled = allValidInputs.length !== 4;

});

function markCheckBox(checkbox) {
    const allCheckBox = ['checkbox-repayment', 'checkbox-interest'];

    allCheckBox.forEach(id => {

        const exist = allValidInputs.includes(id);
        let parent = document.getElementById(id).parentElement;

        if (id === checkbox) {
            document.getElementById(id).checked = true;
            parent.id = 'input-checkbox-checked';
            if (!exist) {
                allValidInputs.push(id);
            }

        } else {
            document.getElementById(id).checked = false;
            parent.removeAttribute('id');
            if (exist) {
                allValidInputs.splice(allValidInputs.indexOf(id), 1);
            }
        }
    });
}

function checkInputForm(input) {
    if (isNaN(input.value)) return;

    const valor = input.value.trim();
    const parent = input.parentElement;
    const txtRequiredMsg = document.getElementById('txt-required-' + input.id.split('-')[1]);
    const besideSpan = document.getElementById('beside-span-' + input.id.split('-')[1]);


    parent.style.border = '';
    txtRequiredMsg.style.display = '';
    besideSpan.style.backgroundColor = '';
    besideSpan.style.color = '';

    const exist = allValidInputs.includes(input.id);
    if (valor === '' || !isNaN(valor) && valor < 0) {
        parent.style.border = '2px solid  hsl(4, 69%, 50%)';
        besideSpan.style.backgroundColor = ' hsl(4, 69%, 50%)';
        besideSpan.style.color = 'white';
        txtRequiredMsg.style.display = 'block';

        if (exist) {
            allValidInputs.splice(allValidInputs.indexOf(input.id), 1);
        }

    } else if (!isNaN(valor) && !exist) {
        allValidInputs.push(input.id);
    }
};

function calculateRepayments(event) {
    event.preventDefault();

    const amount = parseFloat(document.getElementById("input-amount").value.trim());
    const term = parseInt(document.getElementById("input-term").value.trim());
    const rate = parseFloat(document.getElementById("input-rate").value.trim());
    const isRepayment = document.getElementById("checkbox-repayment").checked;
    const isInterestOnly = document.getElementById("checkbox-interest").checked;

    const monthlyInterestRate = rate / 100 / 12;
    const totalMonths = term * 12;

    let monthlyPayment = 0;

    if (isRepayment) {
        monthlyPayment = amount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) /
            (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);

    } else if (isInterestOnly) {
        monthlyPayment = amount * monthlyInterestRate;
    }
    const totalPayment = monthlyPayment * totalMonths;
    if (isNaN(totalPayment) || isNaN(monthlyPayment) || monthlyPayment + totalPayment > 100000000000) return;
    document.getElementById('conteiner-img').style.display = 'none';
    document.getElementById('conteiner-payment').style.display = 'flex';
    document.getElementById('total-monthly-payment').innerHTML = '£' + monthlyPayment.toFixed(2);
    document.getElementById('total-term-payment').innerHTML = '£' + totalPayment.toFixed(2);

}

function clearForm() {
    document.getElementById('conteiner-img').style.display = 'flex';
    document.getElementById('conteiner-payment').style.display = 'none';
    allInputs.forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = false;
            input.parentElement.removeAttribute('id');
        } else {
            input.value = '';
        }
    });
    submitBtn.disabled = true;
    allValidInputs = [];
}

