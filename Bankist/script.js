'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

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

let currentAccount;
let sortToggle = true;

accounts.forEach(function(acc){
  return acc.userName = acc.owner.split(" ").map(function(nam){
    return nam[0].toLowerCase();
  }).join("");
});

const displayMovements = function(acc, sort = false){
  containerMovements.innerHTML = "";
  const dispMovements = sort ? [...acc.movements].sort((a, b) => a-b) : acc.movements;
  dispMovements.forEach((amount,index) => {
    const type = amount >= 0? "deposit" : "withdrawal";
    const html = 
    `<div class="movements__row">
      <div class="movements__type movements__type--${type}">${index+1} ${type}</div>
      <div class="movements__date"></div>
      <div class="movements__value">${Math.abs(amount)}€</div>
      </div>`;
      
      containerMovements.insertAdjacentHTML('afterbegin',html);
    });
  }
  
const displayBalance = function(acc){
  acc.balance = acc.movements.reduce(function(acc, mov){
    return acc + mov;
  }, 0);

  labelBalance.textContent = `${acc.balance} €`;
}

const displaySum = function(acc){
  labelSumIn.textContent = acc.movements.filter(function(mov){
    return mov > 0
  }).reduce(function(sum, mov){
    return sum + mov;
  }, 0) + "€";
  
  labelSumOut.textContent = Math.abs(acc.movements.filter(function(mov){
    return mov < 0
  }).reduce(function(sum, mov){
    return sum + mov;
  }, 0)) + "€";

  labelSumInterest.textContent = acc.movements.filter(mov => mov > 0).map(mov => mov * acc.interestRate/100).reduce(
    (sum, mov) => {
      if(mov >= 1)
      return sum + mov;
    return sum;
  }) + "€";
}

const updateUI = function(){
  // Display movements
  displayMovements(currentAccount);
  // Display balance
  displayBalance(currentAccount);
  // Display summary
  displaySum(currentAccount);
}

const loginEvent = function(e){
  e.preventDefault();

  const user = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);
  inputLoginUsername.value = "";
  inputLoginPin.value = "";
  
  containerApp.style.opacity = 0;

  currentAccount = accounts.find(function(acc){
    return acc.userName === user && acc.pin === pin;
  });
  
  if(currentAccount !== undefined){

    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;

    updateUI();
    
    containerApp.style.opacity = 100;
  }
}

const transferEvent = function(e){
  e.preventDefault();
  
  const user = inputTransferTo.value;
  const amount = Number(inputTransferAmount.value);
  const currentBalance = currentAccount.balance;

  inputTransferTo.value = "";
  inputTransferAmount.value = "";
  
  if(user === currentAccount.userName || amount < 0){
    alert("Invalid transfer");
    return;
  }

  const transferAccount = accounts.find(function(acc){
    return acc.userName === user;
  });
  
  if(transferAccount !== undefined && amount <= currentBalance){
    transferAccount.movements.push(amount);
    currentAccount.movements.push(amount * -1);

    updateUI();

    alert("Transfer successful");
  }

  else{
    alert("Transfer Unsuccessful");
  }
}

const requestLoanEvent = function(e){
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);  

  inputLoanAmount.value = "";
  
  if(currentAccount.movements.some(amt => amt >= amount/10)){
    currentAccount.movements.push(amount);

    updateUI();
  }
}

const sortMovementEvent = function(e){
  e.preventDefault();
  
  displayMovements(currentAccount, sortToggle);
  
  sortToggle = !sortToggle;
}

const closeAccountEvent = function(e){
  e.preventDefault();

  const user = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);

  inputCloseUsername.value = "";
  inputClosePin.value = "";

  if(user === currentAccount.userName && pin === currentAccount.pin){
    const index = accounts.findIndex(function(acc){
      return acc.userName === currentAccount.userName;
    });

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
}

btnLogin.addEventListener('click', loginEvent);

btnTransfer.addEventListener('click', transferEvent);

btnLoan.addEventListener('click', requestLoanEvent);

btnClose.addEventListener('click', closeAccountEvent);

btnSort.addEventListener('click', sortMovementEvent);


















/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


const deposits = movements.filter(function(mov){
  return mov >= 0;
});

const withdrawals = movements.filter(function(mov){
  return mov < 0;
});

const balance = movements.reduce(function(acc, mov){
  return acc + mov;
}, 0);

const maxMovement = movements.reduce(function(max, mov){
  if(max < mov)
  return mov;
  return max;
}, movements[0]);

const allDeposits = accounts.reduce(function(prevDep, acc){
  const currentDep = acc.movements.reduce(function(dp, curr){
    if(curr > 0)
    return curr + dp;
    return dp;
  },0)
  return currentDep + prevDep;
},0);

// console.log(allDeposits);

const allDepositsalter = accounts.map((acc) => acc.movements).flat().filter((dep) => dep > 0).reduce((prev, dep) => prev + dep);

// console.log(allDepositsalter);

const numDepos100 = accounts.map((acc)=> acc.movements).flat().reduce((count, dep) => {
  if(dep >= 1000)
  return count + 1;
  return count;
}, 0);

// console.log(numDepos100);

const sumOfDepositsAndWithdrawals = accounts.reduce(function(sum, acc){
  const currentsum = acc.movements.reduce(function(depwith, amt){
    if(amt > 0)
    depwith.deposits += amt;
    else
    depwith.withdrawals += amt;
    return depwith;
  }, {deposits: 0, withdrawals: 0});
  sum.deposits += currentsum.deposits;
  sum.withdrawals += currentsum.withdrawals;
  return sum;
}, {deposits: 0, withdrawals: 0});

console.log(sumOfDepositsAndWithdrawals);
/////////////////////////////////////////////////

// Coding Challenges

const calcAverageHumanAge = function(dogAges){
  const dogHumanAge = dogAges.map(function(age){
    if(age <= 2){
      return age * 2;
    }
    else{
      return 16 + (age * 4); 
    }
  }).filter(function(mov){
    return mov >= 18;
  });
  
  const average = dogAges.reduce(function(sum, age){
    return sum + age;
  }, 0) / dogAges.length;
}

const ages1 = [5, 2, 4, 1, 15, 8, 3];
const ages2 = [16, 6, 10, 5, 6, 1, 4];

calcAverageHumanAge(ages1);
calcAverageHumanAge(ages2);

const dogs = [
  {
    weight: 22,
    curFood: 250,
    owners: ["Alice", "Bob"],
  },

  {
    weight: 8,
    curFood: 200,
    owners: ["Matilda"],
  },
  
  {
    weight: 13,
    curFood: 275,
    owners: ["Sarah", "John"],
  },

  {
    weight: 32,
    curFood: 340,
    owners: ["Micheal"],
  }
];

console.log("First Task: ");

const createreccFood = dogs.forEach(function(dog){
  dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
});

console.log(dogs[2].recommendedFood);

console.log("Second Task: ");
const toomuch = dogs.filter(function(dog){
  return dog.owners.includes("Sarah");
}).forEach(function(dog){
  if(dog.curFood > dog.recommendedFood){
    console.log("Eating Too Much");
  }
  else if(dog.curFood < dog.recommendedFood){
    console.log("Eating Too Little");
  }
  else{
    console.log("Eating correctly");
  }
});

console.log("Third Task: ");

const ownersEatTooMuch = dogs.filter((dog) => dog.curFood > dog.recommendedFood).reduce((arr, dog) => {
  arr.push(dog.owners);
  return arr;
},[]).flat();

const ownersEatTooLittle = dogs.filter((dog) => dog.curFood < dog.recommendedFood).reduce((arr, dog) => {
  arr.push(dog.owners);
  return arr;
},[]).flat();

console.log(ownersEatTooMuch);

console.log(ownersEatTooLittle);


console.log("Task 4: ");

let oetl = "";
ownersEatTooLittle.forEach(function(owner, index){
  if(index == ownersEatTooLittle.length-1){
    oetl += `${owner}'s dogs eat too little`;
  }
  else{
    oetl += `${owner} and `;
  }
});

console.log(oetl);

let oetm = "";
ownersEatTooMuch.forEach(function(owner, index){
  if(index == ownersEatTooLittle.length-1){
    oetm += `${owner}'s dogs eat too much`;
  }
  else{
    oetm += `${owner} and `;
  }
});

console.log(oetm);

const sorted = dogs.slice().sort(function(a, b){
  return a.recommendedFood - b.recommendedFood;
})

console.log(sorted);