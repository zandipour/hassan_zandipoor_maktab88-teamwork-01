$(() => {
  let countryDatas = [];
  let targetCountry;
  let name;
  let nativeName;
  let capital;
  let region;
  let population;
  let languages;
  let timeZone;
  let callingCode;
  let flagUrl;

  function getCountriesData() {
    $.ajax({
      url: "https://restcountries.com/v3.1/all",
      type: "GET",
      success: function (response) {
        countryDatas = response;
      },
      error: function (err) {
        console.log("error: ", err);
      },
      async: false,
    });
  }

  function setFormSelectMenu() {
    for (const country of countryDatas) {
      $("#formSelectCountries").append(
        `<option value="${country.ccn3}">${country.name.common}</option>`
      );
    }
  }

  function tryGetData(key, index = null) {
    try {
      if (index === null) return targetCountry[key];
      else return targetCountry[key][index];
    } catch (error) {
      return "No Info";
    }
  }

  function getTargetCountryDatas() {
    name = targetCountry.name["official"];
    if (targetCountry.languages) {
      languages = Object.values(targetCountry.languages).join(", ");
      let firstLanguage = Object.keys(targetCountry.languages)[0];
      nativeName = targetCountry.name.nativeName[firstLanguage]["common"];
    } else {
      languages = "No Info";
      nativeName = name;
    }
    capital = tryGetData("capital");
    region = tryGetData("region");
    population = tryGetData("population");
    timeZone = tryGetData("timezones", 0);
    if (targetCountry.idd.root)
      callingCode =
        targetCountry.idd.root.replace("+", "") + targetCountry.idd.suffixes[0];
    else callingCode = "No Info";
    flagUrl = targetCountry.flags.png;
  }

  function renderPage() {
    let pageContent = `
        <div class="d-flex justify-content-center align-content-center border-3 border-danger p-1">
        <div class=" bg-info col-4 p m-1 rounded-1" >
            <h6 class="ps-3"></h6>
            <p class="ps-3">Name: <p>${name}</p></p>
            <p class="ps-3">Native name: <p>${nativeName}</p></p>
            <p class="ps-3">Capital: <p>${capital}</p></p>
            <p class="ps-3">Region: <p>${region}</p></p>
            <p class="ps-3">Population: <p>${population}</p></p>
            <p class="ps-3">Languages: <p>${languages}</p></p>
            <p class="ps-3">Time zone: <p>${timeZone}</p></p>
        </div>
        <div class=" col-4 flex-column bg-warning m-1 rounded-2" >
            <h4 class="bg-warning pt-2 d-flex justify-content-center align-items-center rounded-1">calling code</h4>
            <div class="bg-black text-light  h-75 mt-4 d-flex justify-content-center align-items-center rounded-1" style="font-size: 120px;">${callingCode}</div>
        </div>
        <div class=" col-4 bg-danger d-flex border-2 border-danger m-1 rounded-2" >
            <img class="rounded-1" src=${flagUrl} alt="">
        </div>
    </div>
	`;

    $(".info").html(pageContent);
  }

  getCountriesData();
  countryDatas.sort((a, b) => a.name.common.localeCompare(b.name.common));
  setFormSelectMenu();

  $("#formSelectCountries").on("change", function () {
    targetCountry = countryDatas.find((country) => country.ccn3 === this.value);
    console.log(targetCountry);
    getTargetCountryDatas();
    renderPage();
  });
});
