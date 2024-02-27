const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton")
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}];:"<,>.?/';

// initially password is empty
let password = "";
// default lenght 0f password
let passwordLength = 10;
// default input check box
let checkCount = 0;
handleSlider(); // handleSlider is there to reflect Password Length in UI only
// default password indicator color is grey

setIndicator("#ccc");


// set password length 
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    // to fill the slider color depending on the range selected
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}
 function getRndInteger(min , max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123)); 
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91)); 
}

function generateSymbols(){
    const randNum= getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    } else if(
        (hasLower || hasUpper)&&
        (hasNum || hasSym)&&
        passwordLength >=6
    ) {
        setIndicator("#ff0");
    } else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        navigator.clipboard.writeText(passwordDisplay.value); // returning a promise- when it completes
        copyMsg.innerText="copied";
    } 
    catch(e){
        copyMsg.innerText="failed";
    }
    // to make copy span visible
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    //Fisher yates method
    // Allow us to shuffle the array by applying on it

    // finding random j, using random function
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // swaping index i and index j
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// counting the check count everytime whenever we update the checkboxs
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkBox) => {
        if(checkBox.checked){
            checkCount++;
        }
    });
    //special condition
    // corner case if password length is less than the checkbox count
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        // if password length is changed then call handleSlider to reflect on UI as well
        handleSlider();
    }
}

allCheckBox.forEach((checkBox) => {
    checkBox.addEventListener('change', handleCheckBoxChange);
})

// changing the value of password lenght via input slider
inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay){
        copyContent();
    }
})

generateBtn.addEventListener('click',()=>{
    // no checkbox ticked = no password genrated
    if(checkCount<=0) 
        return;
    // password length < check count
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider(); 
    }

    // password creation

    // removing old password
    password = "";

    let funcArr = [];
    // pushing the checked elements into the array format
    
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbols);
    }

    // compulsory addition
    for(let i = 0; i<funcArr.length ; i++){
        password += funcArr[i]();
    }
    // remaining addition
    for(let i=0; i< passwordLength-funcArr.length ; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // shuffle the pasword
    password =shufflePassword(Array.from(password)); // sending password in the form of an array

    // show in UI
    passwordDisplay.value = password;

    // calculate strength
    calcStrength();
});

