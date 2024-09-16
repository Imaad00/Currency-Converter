const BASE_URL_PRIMARY =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const BASE_URL_FALLBACK =
  "https://currency-api.pages.dev/latest/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) { 
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const URL_PRIMARY = `${BASE_URL_PRIMARY}/${fromCurr.value.toLowerCase()}.json`;
  const URL_FALLBACK = `${BASE_URL_FALLBACK}/${fromCurr.value.toLowerCase()}.json`;

  try {
    let response = await fetch(URL_PRIMARY);

    if (!response.ok) {
      console.warn(`Primary source failed. Trying fallback URL: ${URL_FALLBACK}`);
      response = await fetch(URL_FALLBACK);
      if (!response.ok) throw new Error("Both primary and fallback sources failed.");
    }

    let data = await response.json();

    let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
    let finalAmount = amtVal * rate;

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error("Failed to fetch exchange rate", error);
    msg.innerText = "Failed to get exchange rate. Please try again.";
  }
};


const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault(); 
  updateExchangeRate();  
});

// Fetch exchange rate on page load
window.addEventListener("load", () => {
  updateExchangeRate(); 
});


