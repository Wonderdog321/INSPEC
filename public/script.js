//-------Global Variables--//
let searchText,
  isLoggedIn = false,
  openLoginModal = false,
  userInfo,
  animationTimer = 600,
  bladesData,
  wheelData,
  useSpecRange = false,
  editBladeMaterial;
//Login forum
const loginbtn = document.querySelector(".loginbtn");
const loginmodal = document.querySelector(".login-form-container");
const clsBtnLoginModal = document.querySelector(".clsLoginForm");
const nameText = document.querySelector(".name");
const modal = document.querySelector(".blade-edit-container");
//All the input boxes for the modal
const bladeID = document.querySelector(".bladeID");
const faceText = document.querySelector("#faceText");
const hookText = document.querySelector("#hookText");
const backText = document.querySelector("#backText");
const grindText = document.querySelector("#grindText");
const blText = document.querySelector("#blText");
const setText = document.querySelector("#setText");
const camberText = document.querySelector("#camberText");
const lastedited = document.querySelector(".lastedited");
//Grabs the specs while loading page and saving it to local storage.
const getBlades = async function (searchQuery) {
  await fetch("/get-blades", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      material: searchQuery,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        localStorage.setItem("bladesData", JSON.stringify(data.blades));
      } else {
        errorHandler(
          `An error has occured while retrieving blades! Error: ${data.message}. Using Local Storage DB till resolved.`
        );
      }
      bladesData = JSON.parse(localStorage.getItem("bladesData"));
    })
    .catch((error) => {
      errorHandler(
        `Oops! An unknown error has occured. Contact developer! ${error}.`
      );
    });
};
const getWheels = async function (searchQuery) {
  await fetch("/get-wheels", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      wheel: searchQuery,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        localStorage.setItem("wheelsData", JSON.stringify(data.wheels));
      } else {
        errorHandler(
          `An error has occured while retrieving blades! Error: ${data.message}. Using Local Storage DB till resolved.`
        );
      }
      wheelData = JSON.parse(localStorage.getItem("wheelsData"));
    })
    .catch((error) => {
      errorHandler(
        `Oops! An unknown error has occured. Contact developer! ${error}.`
      );
    });
};
//Send data to update blade on the server
const updateBlade = async function () {
  const blade = returnBladeObj(bladeID.textContent);
  await fetch("/update-blade", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bladeID: blade["_id"],
      bladeInfo: {
        material: bladeID.textContent,
        face: faceText.value,
        hook: hookText.value,
        back: backText.value,
        grind: grindText.value,
        bendLocation: blText.value,
        set: setText.value,
        camber: camberText.value,
        lastChanged: `Last edited by, ${userInfo.firstname} ${
          userInfo.lastname
        } on ${returnDate()}.`,
      },
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        getBlades("");
        modal.classList.toggle("hidden");
        listeners();
      } else {
        errorHandler(
          `An error has occured while updating blade! Error: ${data.message}.`
        );
      }
    })
    .catch((error) => {
      errorHandler(
        `Oops! An unknown error has occured. Contact developer! ${error}.`
      );
    });
};

//Getting data from database
getBlades("");
getWheels("");
///////////////////////////////////////////////////////////
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
//Edit listener
function editListener() {
  // Button handling to show the blade material stats and change to + or -
  document.querySelectorAll(".editbtn").forEach((item) => {
    item.addEventListener("click", (event) => {
      editBladeMaterial =
        event.target.parentNode.parentNode.parentNode.children[0].textContent;
      const blade = returnBladeObj(editBladeMaterial);
      bladeID.textContent = editBladeMaterial;
      faceText.value = blade.face;
      backText.value = blade.back;
      hookText.value = blade.hook;
      grindText.value = blade.grind.$numberDecimal;
      setText.value = blade.set.$numberDecimal;
      blText.value = blade.bendLocation.$numberDecimal;
      camberText.value = blade.camber.$numberDecimal;
      lastedited.textContent = blade.lastChanged;
      modal.classList.toggle("hidden");
    });
    item.addEventListener("mouseover", (event) => {
      event.target.src = "img/svg/pencil-tool.svg";
    });
    item.addEventListener("mouseout", (event) => {
      event.target.src = "img/svg/pencil-tool-empty.svg";
    });
  });
}
//Modal close event listener on the modal
function closeModalListener() {
  document
    .querySelector("button.btn-close")
    .addEventListener("click", (event) => {
      modal.classList.toggle("hidden");
    });
}
//Probably add this to the edit icon logic when clicked
//Deals with most listeners as well search query text
function listeners() {
  searchText = document.querySelector(".search-text").value;
  displayResults(searchText);
  openListener();
  printListener();
  editListener();
}
//Activates the buttons to view the specs when you hit search
document.querySelector(".search-button").addEventListener("click", (event) => {
  listeners();
});
//Updates blade when clicking send
document.querySelector(".submitbtn").addEventListener("click", (event) => {
  event.preventDefault();
  updateBlade();
});
//Grab the search text
document.querySelector(".search-text").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    listeners();
  }
});
//Returns matching blade
const returnBladeObj = function (materialToMatch) {
  const result = bladesData.filter(
    (blade) => blade.material === materialToMatch
  );
  return result[0];
};
//returns Dates and Time for when the blade was edited
const returnDate = function () {
  const currentDate = new Date();
  const dateString = `${
    currentDate.getMonth() + 1
  }/${currentDate.getDate()}/${currentDate.getFullYear()} @ ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
  return dateString;
};
//Returns the spec range
const returnSpecRange = function (specs, range) {
  specs = parseFloat(specs);
  if (useSpecRange) {
    return `${(specs - range).toFixed(3)} - ${(specs + range).toFixed(3)}`;
  } else {
    return `${specs.toFixed(
      3
    )}<br/><span class="plusminus">&#177;</span>${range}`;
  }
};
const returnSpecDegree = function (decimalDegree) {
  const degree = decimalDegree.toFixed(2).toString().split(".");
  degree[1] = `${(degree[1] / 100) * 60}`;
  return `${degree[0]}&deg${degree[1]}&quot`;
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
    default:
      return false;
  }
}
function findToothSpacing(material) {
  let toothspacingNumber = returnTS(parseInt(material.slice(1, 2)));
  if (toothspacingNumber !== false) {
    return toothspacingNumber;
  } else {
    toothspacingNumber = returnTS(parseInt(material.slice(1, 3)));
    return toothspacingNumber;
  }
}
//Gives the wheel number
function wheelNumber(material) {
  const toothspacing = findToothSpacing(material);
  const degree = material.substring(material.indexOf("-"));
  const results = wheelData.filter(
    (wheel) => wheel.wheel === `${toothspacing}${degree}`
  );
  return results[0].wheelNumber;
}
//Spit out search results onto the DOM based on JSON
function displayResults(searchQuery) {
  clearResults();
  searchQuery = searchQuery.trim();
  if (searchQuery !== "") {
    const results = bladesData.filter((blade) =>
      blade.material.startsWith(searchQuery)
    );
    if (results.length === 0) {
      return errorHandler("No results found with given search query.");
    } else {
      for (const blade in results) {
        htmlMarkup(results[blade]);
      }
    }
  }
}
function clearResults() {
  document.querySelector("ul").innerHTML = "";
}
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
function htmlMarkup(blade) {
  let html = `<li class="blade">
                  <div class="title">
                    <h1 class="blade-material">${blade.material}</h1>
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
                      ${
                        isLoggedIn
                          ? `<button class="editbtn">
                            <img
                              class="editimg"
                              src="img/svg/pencil-tool-empty.svg"
                              alt="Edit blade specs"
                            />
                          </button>`
                          : ""
                      }
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
                            blade.material
                          )}</th>
                        </tr>
                        <tr>
                          <th class="face">Face:______</th>
                          <td class="facedg">${blade.face}&deg - ${
    blade.face
  }&deg45"</td>
                          <td class="facedc">${blade.face} - ${
    blade.face
  }.75</td>
                        </tr>
                        <tr>
                          <th class="hook">Hook:______</th>
                          <td class="hookdg">${returnSpecDegree(
                            blade.hook - 0.5
                          )} - ${returnSpecDegree(blade.hook + 0.5)}</td>
                          <td class="hookdc">${(blade.hook - 0.5).toFixed(
                            2
                          )} - ${(blade.hook + 0.5).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <th class="back">Back:______</th>
                          <td class="backdg">${returnSpecDegree(
                            blade.back - 0.5
                          )} - ${returnSpecDegree(blade.back + 0.5)}</td>
                          <td class="backdc">${(blade.back - 0.5).toFixed(
                            2
                          )} - ${(blade.back + 0.5).toFixed(2)}</td>
                        </tr>
                      </table>
                      <br/>
                      <table class="specs">
                        <tr class="specs-top" >
                          <th>Grind</th>
                          <th>Primary<br/> BL's</th>
                          <th>Secondary<br/> BL's</th>
                          <th>Primary<br/> Set</th>
                          <th>Secondary<br/> Set</th>
                          <th>Camber</th>
                          <th>Notes</th>
                        </tr>
                        <tr class="specs-body">
                          <td>${returnSpecRange(
                            blade.grind.$numberDecimal,
                            0.002
                          )}</td>
                          <td>${returnSpecRange(
                            blade.bendLocation.$numberDecimal,
                            0.005
                          )}</td>
                          <td>${returnSpecRange(
                            blade.bendLocation.$numberDecimal,
                            0.005
                          )}</td>
                          <td>${returnSpecRange(
                            blade.set.$numberDecimal,
                            0.002
                          )}</td>
                          <td>${returnSpecRange(
                            blade.set.$numberDecimal,
                            0.002
                          )}</td>
                          <td>${returnSpecRange(
                            blade.camber.$numberDecimal,
                            0.002
                          )}</td>
                          <td class="Notes"></td>
                        </tr>
                        ${makeCells(10, "tr", "specs-body", true, 7, "td")}
                      </table>
                    </div>
              </li>`;
  document.querySelector("ul").insertAdjacentHTML("beforeEnd", html);
}
//Show error onto page
function errorHandler(text) {
  const errorDiv = document.querySelector(".error");
  errorDiv.innerText = text;
  console.log(text);
  errorDiv.classList.remove("fade");
  errorDiv.classList.remove("hidden");
  errorDiv.classList.add("fadein");
  setTimeout(() => errorDiv.classList.remove("fadein"), animationTimer);
  setTimeout(() => {
    errorDiv.classList.add("fade");
    setTimeout(() => {
      errorDiv.classList.add("hidden");
    }, animationTimer - 50);
  }, 3000);
}
//Dealing with the response from server
async function getLogin(username, password, remember) {
  await fetch("/sign-in", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
      remember: remember,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        userInfo = data.user;
        isLoggedIn = true;
      } else {
        errorHandler(data.message);
        isLoggedIn = false;
      }
      isSignedIn();
      //Force it to rerenderthe edit button
      listeners();
    })
    .catch((error) => {
      errorHandler(
        `Oops! An unknown error has occured. Contact developer! ${error}.`
      );
    });
}
//Dealing with sign-in form logic
function SignInsubmitForm() {
  const formElem = document.querySelector(".login-form-container");
  formElem.addEventListener(
    "submit",
    async (event) => {
      //REMEMBER TO PUT THIS BEFORE SUBMISSION
      event.preventDefault();
      const username = document.getElementById("username").value.toLowerCase();
      const password = document.getElementById("password").value;
      const remember = document.getElementById("remember").checked;
      await getLogin(username, password, remember);
    },
    false
  );
}
//Login logic and animations
function loginButtonTransition() {
  if (openLoginModal) {
    loginbtn.classList.add("fade");
    loginmodal.classList.toggle("hidden");
    loginmodal.classList.add("fadein");
    setTimeout(() => {
      loginbtn.classList.remove("fade");
      loginmodal.classList.remove("fadein");
      loginbtn.classList.toggle("hidden");
    }, animationTimer);
  } else {
    loginmodal.classList.add("fade");
    loginbtn.classList.toggle("hidden");
    loginbtn.classList.add("fadein");
    setTimeout(() => {
      loginmodal.classList.remove("fade");
      loginbtn.classList.remove("fadein");
      loginmodal.classList.toggle("hidden");
    }, animationTimer);
  }
}
function isSignedIn() {
  if (!isLoggedIn) {
    nameText.textContent = "";
    loginbtn.textContent = "Login";
  } else {
    loginbtn.textContent = "Sign Out";
    openLoginModal = false;
    loginButtonTransition();
    nameText.classList.toggle("nameanimation");
    nameText.textContent = `Hello ${userInfo.firstname}!`;
    setTimeout(() => {
      nameText.classList.toggle("nameanimation");
    }, 1500);
  }
}
function LoggedIn() {
  clsBtnLoginModal.addEventListener("click", (event) => {
    openLoginModal = false;
    loginButtonTransition();
  });
  loginbtn.addEventListener("click", (event) => {
    if (loginbtn.innerText !== "Sign Out") {
      openLoginModal = true;
      loginButtonTransition();
    } else {
      isLoggedIn = false;
      nameText.textContent = "";
      loginbtn.textContent = "Login";
      //Force it to rerenderthe edit button
      listeners();
    }
  });
  SignInsubmitForm();
}
//Must call to start the processes.
LoggedIn();
//Calls closebtn listener so it doesn't duplicate
closeModalListener();
