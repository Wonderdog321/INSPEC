//Importing JSON file
import data from "./materialdata.JSON" assert { type: "json" };
import wheels from "./wheels.json" assert { type: "json" };
//-------Global Variables--//
let searchText, material, degree;
function openListener() {
  // Button handling to show the blade material stats and change to + or -
  document.querySelectorAll("button.open").forEach((item) => {
    item.addEventListener("click", (event) => {
      const li = event.target.closest("li").children[1];
      li.classList.toggle("hidden");
      if (!li.classList.contains("hidden")) {
        event.target.src = "img/svg/minus-whole.svg";
      } else {
        event.target.src = "img/svg/plus-whole.svg";
      }
    });
    item.addEventListener("mouseover", (event) => {
      const li = event.target.closest("li").children[1];
      if (!li.classList.contains("hidden")) {
        event.target.src = "img/svg/minus-whole.svg";
      } else {
        event.target.src = "img/svg/plus-whole.svg";
      }
    });
    item.addEventListener("mouseout", (event) => {
      const li = event.target.closest("li").children[1];
      if (li.classList.contains("hidden")) {
        event.target.src = "img/svg/plus-empty.svg";
      } else {
        event.target.src = "img/svg/minus-empty.svg";
      }
    });
  });
}
//Makes the print button print material and change img
function printListener() {
  document.querySelectorAll("button.print").forEach((item) => {
    item.addEventListener("click", (event) => {
      let printableHTML = event.target.closest("li");
      printableHTML.children[1].removeAttribute("class", "hidden");
      printableHTML.children[1].setAttribute("id", "print");
      const headerText = printableHTML.children[0].innerText;
      printJS({
        printable: "print",
        type: "html",
        targetStyles: ["*"],
        header: headerText,
        headerStyle: ["text-align:center"],
        documentTitle: "",
      });
      printableHTML.removeAttribute("id", "print");
    });
    item.addEventListener("mouseover", (event) => {
      event.target.src = "img/svg/printer-whole.svg";
    });
    item.addEventListener("mouseout", (event) => {
      event.target.src = "img/svg/printer-empty.svg";
    });
  });
}
function listeners() {
  searchText = document.querySelector(".search-text").value;
  clearResults();
  divideSearch(searchText);
  if (material) displayResults(material, degree, data);
  openListener();
  printListener();
}
//Grab the search text
document.querySelector(".search-button").addEventListener("click", (event) => {
  listeners();
});
document.querySelector(".search-text").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    listeners();
  }
});
//Returns the spec range
const returnSpecRange = function (specs, range) {
  specs = parseFloat(specs);
  return `${(specs - range).toFixed(3)} - ${(specs + range).toFixed(3)}`;
};
//Gets the toothspacing
function returnTS(tsNum) {
  switch (tsNum) {
    case 4:
      return 0.5;
    case 5:
      return 0.656;
    case 6:
      return 0.75;
    case 7:
      return 0.875;
    case 8:
      return 1;
    case 9:
      return 1.125;
    case 10:
      return 1.25;
  }
}
function findToothSpacing(material) {
  let toothspacingNumber = parseInt(material.slice(1, 2));
  if (toothspacingNumber === 1) {
    toothspacingNumber = 10;
  }
  if (!toothspacingNumber) {
    for (
      toothspacingNumber = 4;
      toothspacingNumber <= 10;
      toothspacingNumber++
    ) {
      return returnTS(toothspacingNumber);
    }
  } else return returnTS(toothspacingNumber);
}
//Gives the wheel number
function wheelNumber(material, degree) {
  const toothspacing = findToothSpacing(material);
  return wheels[toothspacing][degree];
}
//Split the search text into material and degree
function divideSearch(s) {
  if (s.indexOf("-") !== -1) {
    material = s.slice(0, s.indexOf("-"));
    degree = s.slice(s.indexOf("-"));
  } else {
    material = s;
  }
}
//Spit out search results onto the DOM based on JSON
function displayResults(material, degree) {
  if (degree) {
    for (const dg in data[material]) {
      if (dg.startsWith(degree)) htmlMarkup(dg, material, data[material][dg]);
    }
  } else {
    for (const ma in data) {
      if (ma.startsWith(material)) {
        for (const dg in data[ma]) {
          htmlMarkup(dg, ma, data[ma][dg]);
        }
      }
    }
  }
}
const clearResults = function () {
  document.querySelector("ul").innerHTML = "";
  degree = "";
};
//Make number of cells to print out
//makeCells will make HTML tags inside an HTML tag if repeat is set to true
function makeCells(
  count,
  htmltag,
  classes = "",
  repeat = false,
  a = 0,
  b = "",
  c = ""
) {
  let cellsHtml = "";
  for (let i = 1; i <= count; i++) {
    repeat
      ? (cellsHtml += `<${htmltag} class="${classes}"> ${makeCells(
          a,
          b,
          c
        )} </${htmltag}>`)
      : (cellsHtml += `<${htmltag} class="${classes}"></${htmltag}>`);
  }
  return cellsHtml;
}
//Markup to be sent out
function htmlMarkup(degree, ma, blade) {
  if (blade !== undefined) {
    let html = `<li class="blade">
                  <div class="title">
                    <h1 class="blade-material">${ma}${degree}</h1>
                    <div class="buttons">
                      <button class="open">
                        <img
                          class="openimg"
                          src="img/svg/plus-empty.svg"
                          alt="Expand specs"
                        />
                      </button>
                      <button class="print">
                        <img
                          class="printimg"
                          src="img/svg/printer-empty.svg"
                          alt="Print"
                        />
                      </button>
                    </div>
                  </div>
                  <div class="specs-container hidden">
                      <table class="top">
                        <tr>
                          <td></td>
                          <th class="coilID">COIL ID:______</th>
                          <th class="line">LINE:______</th>
                          <th class="setup">SETUP BY:______________</th>
                          <th class="date">DATE:_____________</th>
                          <td></td>
                        </tr>
                        <tr>
                          <td></td>
                          <th class="degree">Degree</th>
                          <th class="decimal">Decimal</th>
                          <th class="BTG">Back to Gullet(BTG)_____________</th>
                          <th class="wheel">Wheel: ${wheelNumber(
                            ma,
                            degree
                          )}</th>
                        </tr>
                        <tr>
                          <th class="face">Face:______</th>
                          <td class="facedg">${blade["face degree"]}</td>
                          <td class="facedc">${blade["face decimal"]}</td>
                        </tr>
                        <tr>
                          <th class="hook">Hook:______</th>
                          <td class="hookdg">${blade["hook degree"]}"</td>
                          <td class="hookdc">${blade["hook decimal"]}</td>
                        </tr>
                        <tr>
                          <th class="back">Back:______</th>
                          <td class="backdg">${blade["back degree"]}</td>
                          <td class="backdc">${blade["back decimal"]}</td>
                        </tr>
                      </table>
                      <br/>
                      <table class="specs">
                        <tr class="specs-top" >
                          <th>Grind</th>
                          <th>Primary BL's</th>
                          <th>Secondary BL's</th>
                          <th>Primary Set</th>
                          <th>Secondary Set</th>
                          <th>Camber</th>
                          <th>Notes</th>
                        </tr>
                        <tr class="specs-body">
                          <td>${returnSpecRange(blade["grind"], 0.002)}</td>
                          <td>${returnSpecRange(
                            blade["bend location"],
                            0.005
                          )}</td>
                          <td>${returnSpecRange(
                            blade["bend location"],
                            0.005
                          )}</td>
                          <td>${returnSpecRange(blade["sets"], 0.002)}</td>
                          <td>${returnSpecRange(blade["sets"], 0.002)}</td>
                          <td>${returnSpecRange(blade["camber"], 0.002)}</td>
                          <td class="Notes"></td>
                        </tr>
                        ${makeCells(10, "tr", "specs-body", true, 7, "td")}
                      </table>
                    </div>
              </li>`;
    document.querySelector("ul").insertAdjacentHTML("beforeEnd", html);
  }
}
