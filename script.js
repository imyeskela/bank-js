'use strict';

// Simply Bank App

const account1 = {
  userName: 'Cecil Ireland',
  transactions: [500, 250, -300, 5000, -850, -110, -170, 1100],
  interest: 1.5,
  pin: 1111,
};

const account2 = {
  userName: 'Amani Salt',
  transactions: [2000, 6400, -1350, -70, -210, -2000, 5500, -30],
  interest: 1.3,
  pin: 2222,
};

const account3 = {
  userName: 'Corey Martinez',
  transactions: [900, -200, 280, 300, -200, 150, 1400, -400],
  interest: 0.8,
  pin: 3333,
};

const account4 = {
  userName: 'Kamile Searle',
  transactions: [530, 1300, 500, 40, 190],
  interest: 1,
  pin: 4444,
};

const account5 = {
  userName: 'Oliver Avila',
  transactions: [630, 800, 300, 50, 120],
  interest: 1.1,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.total__value--in');
const labelSumOut = document.querySelector('.total__value--out');
const labelSumInterest = document.querySelector('.total__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerTransactions = document.querySelector('.transactions');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayTransactions = function (transactions) {
  containerTransactions.innerHTML = '';

  transactions.forEach(function (trans, index) {
    const transType = trans > 0 ? 'Депозит' : 'Вывод средств';
    const transTypeStyle = transType === 'Депозит' ? 'deposit' : 'withdrawal';
    const transActionRow = `
    <div class="transactions__row">
        <div class="transactions__type transactions__type--${transTypeStyle}">
            ${index+1} ${transType}
        </div>
        <div class="transactions__value">${trans}$</div>
    </div>
    `
    containerTransactions.insertAdjacentHTML("afterbegin", transActionRow);
  });
};


const createNicknames = function (accs) {
  accs.forEach(function (acc){
    const userName = acc.userName
    acc.nickname = userName.toLowerCase().split(' ').map(word => word[0]).join('')
  });
}

createNicknames(accounts);

const displayBalance = function (account) {
  const balance = account.transactions.reduce((acc, trans) => acc + trans, 0);
  account.balance = balance;
  labelBalance.textContent = `${balance}$`;
}


const displayTotal = function (transactions, interest) {
  const depositsTotal = transactions.filter(trans => trans > 0)
      .reduce((acc, trans) => acc + trans, 0);
  const withdrawTotal = transactions.filter(trans => trans < 0)
      .reduce((acc, trans) => acc + trans, 0);

  const interestTotal = transactions
      .filter(trans => trans > 0)
      .map(dep => (dep * interest) / 100)
      .filter((interes, index, arr) =>{
        return interes >= 5;
      })
      .reduce((acc, inter) => acc + inter, 0);

  labelSumIn.textContent = `${depositsTotal}$`;
  labelSumOut.textContent = `${withdrawTotal}$`;
  labelSumInterest.textContent = `${interestTotal}$`;
}


let currentAccount;

const updateUi = function (account){
  displayBalance(account);
  displayTotal(account.transactions, account.interest);
  displayTransactions(account.transactions);

}


btnLogin.addEventListener('click', function (e){
  e.preventDefault();
  currentAccount = accounts.find(account => account.nickname === inputLoginUsername.value);
  // console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)){
    labelWelcome.textContent = `Рады, что вы снова с нами, ${currentAccount.userName.split(' ')[0]}!`;
    containerApp.style.opacity = 100

    inputLoginUsername.value = '';
    inputLoginPin.value = '';

    updateUi(currentAccount);

  } else{
    alert('Incorrect username or pin. Please, try again.');
  }
})

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const transferAmount = Number(inputTransferAmount.value);
  const recipientNickname =  inputTransferTo.value;
  const recipientAccount = accounts.find(account => account.nickname === recipientNickname);

  if (transferAmount > 0 && currentAccount.balance >= transferAmount
      && currentAccount.nickname !== recipientAccount?.nickname && recipientAccount){
    currentAccount.transactions.push(-transferAmount);
    recipientAccount.transactions.push(transferAmount);
    updateUi(currentAccount);
    inputTransferTo.value = '';
    inputTransferAmount.value = '';
  }else{
   console.log('Error');
  }
})

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const closePin = Number(inputClosePin.value);
  const closeNickname = inputCloseUsername.value;

  if (closeNickname === currentAccount.nickname && closePin === currentAccount.pin) {
    const currentAccountIndex = accounts.findIndex(account => account.nickname === currentAccount.nickname);
    accounts.splice(currentAccountIndex, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Войдите в свой аккаунт';
    inputCloseUsername.value = '';
    inputClosePin.value = '';
  }else{
    console.log('error');
  }
  inputCloseUsername.value = '';
  inputClosePin.value = '';
});


btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);
  const loanAmountByPercent = (loanAmount * 20) / 100;
  const balanceByPercent = (currentAccount.balance * 20) / 100;


  if (loanAmount > 0 && balanceByPercent >= loanAmountByPercent){
    currentAccount.transactions.push(loanAmount);
    updateUi(currentAccount);

  }else{
    console.log('error');
  }
  inputLoanAmount.value = '';
});