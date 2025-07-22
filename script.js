// Global variebles
// Element selectors
const navBtnDiv = document.querySelectorAll('.nav-btn-div');
const form1Inputs = document.querySelectorAll('#form-1 input');
const periodBtn = document.querySelector('#period-btn');
const choiceBtnArr = document.querySelectorAll('.plan-choice-btn');
const addOnBtnArr = document.querySelectorAll('.add-on-btn');
const changePlanBtn = document.querySelector('#change-plan-btn');
const homeBtn = document.querySelector('#home-btn');
// Program variable
let currentForm = +localStorage.getItem('currentForm');
let currentPlan = 0;

// #region User data
let fname = "";
let email = "";
let phoneNumber = "";
// use clicks and not css classes to determine whether the button is on or off
const addOns = {
    current: [0, 0, 0],
    clicks: [0, 0, 0]
}
const timePeriod = {
    current: 0,
    clicks: 0
};
const services = {
    'plan': {
        'Arcade': {
            'yearly': '$90/yr',
            'monthly': '$9/mo'
        },
        'Advanced': {
            'yearly': '$120/yr',
            'monthly': '$12/mo'
        },
        'Pro': {
            'yearly': '$150/yr',
            'monthly': '$15/mo'
        }
    },
    'addOns': {
        'Online Service': {
            'yearly': '+$10/yr',
            'monthly': '+$1/mo'
        },
        'Larger Storage': {
            'yearly': '+$20/yr',
            'monthly': '+$2/mo'
        },
        'Customizable Profile': {
            'yearly': '+$20/yr',
            'monthly': '+$2/mo'
        }
    }
}
// #endregion

// Main program
window.onload = () => {
    if (currentForm === null) {
        currentForm = 1;
        localStorage.setItem('currentForm', currentForm);
    }
    loadForm(currentForm, 0);
    window.scroll(0, 0);
}

// #region Functions
function loadForm(nextFormNumber, currentFormNumber) {
    document.querySelector(`#form-${nextFormNumber}`).classList.remove('hidden');
    const sidebarCircles = document.querySelectorAll('.circle');
    if (nextFormNumber !== 5) {
        sidebarCircles[nextFormNumber - 1].style.backgroundColor = '#bfe2fd';
        sidebarCircles[nextFormNumber - 1].querySelector('p').style.color = '#02295a';
    }
    else {
        sidebarCircles[3].style.backgroundColor = '#f0f5ff';
        sidebarCircles[3].querySelector('p').style.color = '#02295a';
    }

    calculateFormHeight(nextFormNumber);
    if (currentFormNumber === 1) {
        fname = form1Inputs[0].value;
        email = form1Inputs[1].value;
        phoneNumber = form1Inputs[2].value;
    }

    if (nextFormNumber === 4) {
        printReceipt();
    }

    if (currentFormNumber !== 0) {
        document.querySelector(`#form-${currentFormNumber}`).classList.add('hidden');
        if (nextFormNumber !== 5 && currentFormNumber !== 5) {
            sidebarCircles[currentFormNumber - 1].removeAttribute('style');
            sidebarCircles[currentFormNumber - 1].querySelector('p').removeAttribute('style');
        }
    }
}

// If form is covered add scrolling
function calculateFormHeight(currentForm) {
    if (window.innerWidth < 700 && currentForm !== 5) {
        const form = document.querySelector(`#form-${currentForm}`);
        const formContainer = document.querySelector(`#${form.id} .form-container`);
        form.style.height = `${formContainer.offsetHeight - 15}px`;
    }
    else if (currentForm === 5) {
        const form = document.querySelector(`#form-${currentForm}`);
        form.style.height = `${form.offsetHeight - 15}px`;
    }
    else {
        document.querySelector(`#form-${currentForm}`).removeAttribute('style');
    }
}

function printReceipt() {
    const subscribtionType = document.querySelector('#subscription-type');
    const subscribtionDuration =  document.querySelector('#subscription-duration');
    const subscribtionPrice = document.querySelector('#subscription > p');
    const monthOrYear = timePeriod.current === 0 ? 'monthly' : 'yearly';

    currentSub = Object.entries(services.plan)[currentPlan];
    subscribtionType.textContent = currentSub[0];
    subscribtionDuration.textContent = timePeriod.current === 0 ? '(Monthly)' : '(Yearly)';
    subscribtionPrice.textContent = currentSub[1][monthOrYear];

    const oldServices = document.querySelectorAll('.service-item');
    if (oldServices.length > 0) {
        oldServices.forEach(el => {
            document.querySelector('#receipt').removeChild(el);
        })
    }

    currentAddOns = Object.entries(services.addOns);
    let i = 0;
    addOns.current.forEach((el, index) => {
        if (el === 1) {
            createReceiptItem(currentAddOns[index][0], currentAddOns[index][1][monthOrYear])
            i++;
        }
    })
    if (i > 0) {
        document.querySelector('.break-line').classList.remove('hidden');
    }
    else {
        document.querySelector('.break-line').classList.add('hidden');
    }

    printTotal();
}

function createReceiptItem(name, price) {
    const serviceItem = document.createElement('div');
    serviceItem.classList.add('service-item');

    const serviceName = document.createElement('p');
    serviceName.textContent = name;

    const servicePrice = document.createElement('p');
    servicePrice.classList.add('service-price');
    servicePrice.textContent = price;

    serviceItem.appendChild(serviceName);
    serviceItem.appendChild(servicePrice);

    document.querySelector('#receipt').appendChild(serviceItem);

}

function printTotal() {
    const priceRegex = /\d+/;
    let total = 0;
    const monthOrYear = timePeriod.current === 0 ? 'monthly' : 'yearly';
    const currentPlanPrice = Object.entries(services.plan)[currentPlan][1][monthOrYear];
    total += +priceRegex.exec(currentPlanPrice);
    const currentAddOns = Object.entries(services.addOns);
    addOns.current.forEach((el, index) => {
        if (el === 1) {
            total += +priceRegex.exec(currentAddOns[index][1][monthOrYear]);
        }
    })
    document.querySelector('#total span').textContent = timePeriod.current === 0 ? 'month' : 'year';
    document.querySelector('#total h4').textContent = `+${total}$/mo`;
}

// Year/month button
function toggleButton(direction) {
    const toggleArr = document.querySelectorAll('#period-btn img');
    const btnSpanArr = document.querySelectorAll('#period-btn span');
    if (direction === 0) {
        toggleArr[1].classList.add('hidden');
        toggleArr[0].classList.remove('hidden');

        btnSpanArr[0].classList.remove('period-text-inactive');
        btnSpanArr[0].classList.add('period-text-active');

        btnSpanArr[1].classList.add('period-text-inactive');
        btnSpanArr[1].classList.remove('period-text-active');
    }
    else {
        toggleArr[0].classList.add('hidden');
        toggleArr[1].classList.remove('hidden');

        btnSpanArr[1].classList.remove('period-text-inactive');
        btnSpanArr[1].classList.add('period-text-active');

        btnSpanArr[0].classList.add('period-text-inactive');
        btnSpanArr[0].classList.remove('period-text-active');
    }
}

function yearToMonth() {
    const planPriceArr = document.querySelectorAll('.plan-price');
    const addOnPriceArr = document.querySelectorAll('.add-on-price');
    const freeMonths = document.querySelectorAll('.free-months');
    if (timePeriod.current === 0) {
        if (planPriceArr.length === 3) {
            planPriceArr[0].textContent = services.plan.Arcade.monthly;
            planPriceArr[1].textContent = services.plan.Advanced.monthly;
            planPriceArr[2].textContent = services.plan.Pro.monthly;
        }
        if (addOnPriceArr.length === 3) {
            addOnPriceArr[0].textContent = services.addOns["Online Service"].monthly;
            addOnPriceArr[1].textContent = services.addOns["Larger Storage"].monthly;
            addOnPriceArr[2].textContent = services.addOns["Customizable Profile"].monthly;
        }
        freeMonths.forEach(el => {
            el.classList.add('hidden');
        })
    }
    else {
        if (planPriceArr.length === 3) {
            planPriceArr[0].textContent = services.plan.Arcade.yearly;
            planPriceArr[1].textContent = services.plan.Advanced.yearly;
            planPriceArr[2].textContent = services.plan.Pro.yearly;
        }
        if (addOnPriceArr.length === 3) {
            addOnPriceArr[0].textContent = services.addOns["Online Service"].yearly;
            addOnPriceArr[1].textContent = services.addOns["Larger Storage"].yearly;
            addOnPriceArr[2].textContent = services.addOns["Customizable Profile"].yearly;
        }
        freeMonths.forEach(el => {
            el.classList.remove('hidden');
        })
    }
}

// Form 2 plan choice focus
function buttonFocus(el) {
    const focusedBtn = document.querySelector('#form-2').querySelector('.focus');
    if (focusedBtn !== null && el !== focusedBtn) {
        focusedBtn.classList.remove('focus');
    }
    el.classList.add('focus');
}

// Form 3 add on buttons
function addCheckbox(el, state) {
    const checkbox = el.querySelector('.checkbox')
    if (state === 0) {
        checkbox.classList.remove('filled');
        el.classList.remove('focus');
        checkbox.classList.add('empty');
    }
    else {
        checkbox.classList.add('filled');
        el.classList.add('focus');
        checkbox.classList.remove('empty');
    }
}
// #endregion

// #region Event listeners
window.addEventListener('resize', () => {
    calculateFormHeight(currentForm);
});

// Nav bar
navBtnDiv.forEach(el => {
    el.addEventListener('click', e => {
        if (e.target.classList.contains('back-btn')) {
            loadForm(currentForm - 1, currentForm)
            currentForm--;
            localStorage.setItem('currentForm', currentForm);
        }
        else if (e.target.classList.contains('next-btn')) {
            form1Errors = 0;
            document.querySelectorAll('#form-1 .invalid-input').forEach(el => {
                el.classList.add('hidden');
            })
            if (document.querySelector('#main-container > form').reportValidity()) {
                // Use window onload event listener to load form 5 only when the whole page laods
                if (currentForm !== 4) {
                    loadForm(currentForm + 1, currentForm);
                }
                currentForm++;
                localStorage.setItem('currentForm', currentForm);
            }
        }
    })
})

// Form 2 buttons
choiceBtnArr.forEach((el, index) => {
    el.addEventListener('click', () => {
        buttonFocus(el);
        currentPlan = index;
    })
})

periodBtn.addEventListener('click', () => {
    timePeriod.clicks++;
    timePeriod.current = timePeriod.clicks % 2;
    toggleButton(timePeriod.current);
    yearToMonth();
})

// Form 3 buttons
addOnBtnArr.forEach((el, index) => {
    el.addEventListener('click', () => {
        addOns.clicks[index]++;
        addOns.current[index] = addOns.clicks[index] % 2;
        addCheckbox(el, addOns.current[index]);
    })
})

// Form 4 change plan
changePlanBtn.addEventListener('click', () => {
    loadForm(2, 4);
    currentForm = 2;
    localStorage.setItem('currentForm', currentForm);
})

homeBtn.addEventListener('click', () => {
    loadForm(4, 5);
    currentForm = 4;
    localStorage.setItem('currentForm', currentForm);
})
// #endregion