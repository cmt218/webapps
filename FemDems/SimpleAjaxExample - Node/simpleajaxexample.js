var express = require("express");
var path = require("path");

var app = express();

var publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

app.get("/colors/:colorscheme", (req, res) => {
   switch (req.params.colorscheme) {
       case "RGB": 
           res.end("<option>Red</option><option>Green</option><option>Blue</option>")
           break;
       case "CMYK": 
           res.end("<option>Cyan</option><option>Magenta</option><option>Yellow</option><option>Black</option>");
           break;
       default:
           res.end("<option>ERROR</option>");
           break;
   }
});

app.get("/colors", (req, res) => {
    if (req.query.colorscheme === "HSB") {
        res.end("<option>Hue</option><option>Saturation</option><option>Brightness</option>");
    } else {
        res.end("<option>ERROR</option>");
    }
});

app.listen(3000);
