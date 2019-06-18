export default class Simplex {
  normalizeRestrictions(operation, constraints, x1, x2) {
    if ("maximizar" === operation) {
      let slackIndex = 3;
      for (let constraint of constraints) {
        if (constraint.type === "<=") {
          constraint.x1.label = x1.label;
          constraint.x1.value = x1.value;
          constraint.z = "({0}) {1}".format(
            constraint.x1.factor,
            constraint.x1.label
          );

          constraint.x2.label = x2.label;
          constraint.x2.value = x2.value;
          if (constraint.x2.factor > 0) {
            constraint.z += " + ({0}) {1}".format(
              constraint.x2.factor,
              constraint.x2.label
            );
          }
          constraint.slack = {};
          constraint.slack.factor = 1;
          constraint.slack.id = slackIndex;
          constraint.slack.label = "X" + slackIndex;

          constraint.z += " + ({0}) {1} = {2}".format(
            constraint.slack.factor,
            constraint.slack.label,
            constraint.result
          );

          slackIndex++;
        }
      }

      return constraints;
    }
  }

  buildInitialBoard(constraints) {
    if (!constraints || !Array.isArray(constraints)) return "none";
    let response = {};
    let DisplayTable = [];
    let Matrix = [];
    let Z = [
      "Z",
      NaN,
      0,
      constraints[0].x1.value * -1,
      constraints[0].x2.value * -1
    ];
    let Base = [
      "Input",
      NaN,
      NaN,
      constraints[0].x1.value,
      constraints[0].x2.value
    ];
    let headers = ["Label", "Cb", "P0", "P1", "P2"];

    for (let element of constraints) {
      let P = [];
      Z.push(0); //Z
      Base.push(0); //Base
      headers.push("P" + element.slack.id); //Headers
      P.push("P" + element.slack.id); //Label
      P.push(0); //Cb
      P.push(element.result);
      P.push(element.x1.factor);
      P.push(element.x2.factor);
      for (let constraint of constraints) {
        if (constraint.slack.id === element.slack.id) {
          P.push(constraint.slack.factor);
        } else {
          P.push(0);
        }
      }
      DisplayTable.push(P);
    }
    Matrix = DisplayTable;

    DisplayTable.unshift(headers);
    DisplayTable.unshift(Base);
    DisplayTable.push(Z);

    let smallestZ = 0;
    let pivotColumn = 0;
    for (let idx = 0; idx < Z.length; idx++) {
      if (Z[idx] < smallestZ) {
        smallestZ = Z[idx];
        pivotColumn = idx;
      }
    }

    let largest = 0;
    let pivotRow = 0;
    for (let idx = 0; idx < Matrix.length; idx++) {
      if (Matrix[idx][pivotColumn] > largest) {
        largest = Matrix[idx][pivotColumn];
        pivotRow = idx;
      }
    }

    response.pivotValue = Matrix[pivotRow][pivotColumn];
    response.pivot = [pivotRow, pivotColumn];
    response.input = Base;
    response.headers = headers;
    response.matrix = Matrix;
    response.display = DisplayTable;
    return response;
  }

  printTable(table, pivot) {
    let tableText = "<table class='table' border='1'>";
    table.forEach((row, idxRow) => {
      tableText += "<tr>";
      row.forEach((cell, idxCol) => {
        if (idxRow === pivot[0] && idxCol === pivot[1])
          tableText += "<th>{0}</th>".format(cell);
        else tableText += "<td>{0}</td>".format(cell);
      });
      tableText += "</tr>";
    });
    tableText += "</table>";
    return tableText;
  }
}

String.prototype.format = function() {
  var formatted = this;
  for (var arg in arguments) {
    formatted = formatted.replace("{" + arg + "}", arguments[arg]);
  }
  return formatted;
};
