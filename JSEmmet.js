// function makeCells(HTMLEmmet = "") {
//   let HTMLCells, htmlPieces;
//   htmlPieces = HTMLEmmet.split(">");
//   for (const piece in htmlPieces) {
//     let HTMLEle = piece.split(/[*.+$]/);
//     let x = 0;
//     let index, classes;
//     switch (piece) {
//       case piece.contains("."):
//         index = piece.indexOf(".");
//         classes = piece[index + 1];
//       case piece.contains("*") || piece.contains("$"):
//         index =
//           piece.indexOf("*") != -1 ? (index = piece.indexOf("*")) : (index = 0);
//         for (let i = 0; i < piece[index + 1]; i++) {
//           outterHtmlCells += `<${HTMLEle[x]} class="${
//             piece.contains("$") ? classes + i : classes
//           }">${innerHTMLCells ? innerHTMLCells : ""}<${HTMLEle[x]}>`;
//         }
//     }
//   }
//   x++;
// }
function makeCells(HTMLEmmet = "div>li*6+ul.coding+++") {
  let htmlPieces = HTMLEmmet.split(">"),
    outterHtmlCells,
    innerHtmlCells,
    getNumberofElements,
    num,
    htmltag;
  for (let piece in htmlPieces) {
    innerHtmlCells = [...htmlPieces[piece]];
    const symbols = ["*", ".", "+", "$", "@", "#", "(", ")"];
    let symbolIndex = [];
    for (const iH in innerHtmlCells) {
      for (const s in symbols) {
        if (innerHtmlCells[iH] === symbols[s]) {
          symbolIndex.push([iH, symbols[s]]);
        }
      }
    }
    for (index in symbolIndex) {
      let spot = symbolIndex[index][0];
      let symbol = symbolIndex[index][1];
      switch (symbol) {
        case "*":
          getNumberofElements = [];
          for (let i = spot; i < innerHtmlCells.length; i++) {
            if (Number.isInteger(Number.parseInt(innerHtmlCells[i]))) {
              getNumberofElements.push(innerHtmlCells[i]);
            }
          }
          num = getNumberofElements.reduce((pre, curr, index) => {
            return (pre += curr);
          });
          getNumberofElements = [];
          for (let i = spot - 1; i >= 0; i--) {
            if (typeof innerHtmlCells[i] === "string") {
              getNumberofElements.push(innerHtmlCells[i]);
            }
          }
          htmltag = getNumberofElements.reverse().join("");
          console.log(htmltag);
        case ".":

        case "+":

        case "$":

        case "@":

        case "#":

        case "(":
      }
    }
    for (let i = 0; i < num; i++) {
      innerHtmlCells += `<${htmltag}></${htmltag}>`;
    }
    let HTMLElm = `<${outterHtmlCells}>${innerHtmlCells}</${outterHtmlCells}>`;
    console.log(HTMLElm);
  }
}
makeCells();
