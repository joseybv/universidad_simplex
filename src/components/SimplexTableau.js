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
    let Pi = [];
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
      constraints[0].x1.value * -1,
      constraints[0].x2.value * -1
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
      Pi.push(P);
    }
    Pi.unshift(headers);
    Pi.unshift(Base);
    Pi.push(Z);
    response.headers = headers;
    response.tableau = Pi;
    response.pivot = [];
    return response;
  }

  printTable(table) {
    let tableText = "<table class='table' border='1'>";
    for (let row of table) {
      tableText += "<tr>";
      for (let cell of row) {
        tableText += "<td>{0}</td>".format(cell);
      }
      tableText += "</tr>";
    }
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
