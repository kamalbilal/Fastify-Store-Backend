const fs = require("fs");

const data = JSON.parse(fs.readFileSync("output.json", "utf8"));
fs.writeFileSync("output2.json", "[");
let x = 0;
while (x < 6) {
  console.log(x);
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    fs.appendFileSync("output2.json", JSON.stringify(element));
    if (x != 5) {
      fs.appendFileSync("output2.json", ",");
    } else {
      if (index != data.length - 1) {
        fs.appendFileSync("output2.json", ",");
      }
    }
  }
  x += 1;
}
fs.appendFileSync("output2.json", "]");
