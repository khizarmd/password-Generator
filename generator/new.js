const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copyBtn]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const resetBtn = document.querySelector(".resetBtn");
const symbols = "!@#$%^&*()_+=-}{][|\';:|?><,./"



let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength circle to gray

setIndicator("#ccc");

//set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
      //or kuch bhi karna chahiye ? - HW
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
    
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    //math.floor is using to get integer(round of value) or full number (0,1,2)
    //math.random's value is lie between 0-1 (0.11,.98,.77)
    return Math.floor( Math.random() * (max-min)) + min;
}


function generateRndNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
//   sky value of a = 97 and z=123 to convert in alphabet we use string.fromcharcode
    return String.fromCharCode(getRndInteger(97,123));
}
 
function generateUpperCase(){
   //   sky value of A= 65 and Z=91 to convert in alphabet we use string.fromcharcode
    return String.fromCharCode(getRndInteger(65,90));
}


function generateSymbol() {
    const randNum = getRndInteger(0,symbols.length);
        // charAt => character at that index 
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied"
    }
    catch(e){
   copyMsg.innerText = "failed"
    }
    //to make copy vala span visible
 copyMsg.classList.add("active");

   setTimeout(()=>{
    copyMsg.classList.remove("active")
      },2000);
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckboxChange(){
    checkCount = 0;
allCheckbox.forEach((checkbox)=>{
    if(checkbox.checked)
    checkCount++;
});

//special condition
if(passwordLength < checkCount)
  passwordLength = checkCount;
  handleSlider();

}

allCheckbox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckboxChange)
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider()
})


copyBtn.addEventListener('click',()=>{
    //check another method byself password>0 OR PASSword !=''
  if(passwordDisplay.value)
  copyContent();
})




generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";


    

    //let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRndNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);


    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");

    //remaining adddition

    
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }

    console.log("Remaining adddition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calcStrength();
});

resetBtn.addEventListener('click',()=>{
     passwordDisplay.value = "";
})















