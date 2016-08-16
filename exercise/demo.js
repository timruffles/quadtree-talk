"use strict";

var quadtree = process.env.VS_EXAMPLE ? require("./example") : require("./index");

var target = process.env.TARGET || "target.jpg";

demo();

function demo() {
    var quadView = document.getElementById("tree");
    var source = document.getElementById("source");
    var context = source.getContext("2d");
    var target = document.getElementById("target");
    var targetContext = target.getContext("2d");
    var extractor = document.getElementById("extractor");
    var extractorContext = extractor.getContext("2d");

    createTree(extractor, function (err, tree, img) {
        if (err) {
            console.error(err);
        } else {
            var dimension = img.height;
            target.width = source.width = dimension;
            target.height = source.height = dimension;

            draw(tree);
            rotateUi();
        }

        function rotateUi() {
            var button = document.querySelector("#rotate");
            button.addEventListener("click", function () {
                tree = rotate(tree);
                draw(tree);
            });
            button.removeAttribute("disabled");
        }

        function draw(targetTree) {
            var dimension = img.height;
            console.log("drawing", img.height);
            quadView.innerHTML = JSON.stringify(targetTree, null, 2);
            context.drawImage(img, 0, 0);
            drawTree(targetContext, targetTree, dimension);
        }
    });
}

function createTree(extractor, cb) {
    var context = extractor.getContext("2d");
    var image = new Image;
    image.src = "images/" + target;
    image.onerror = cb;
    image.onload = function () {
        extractor.width = extractor.height = image.width;
        context.drawImage(image, 0, 0);
        var imageData = context.getImageData(0, 0, image.width, image.height);

        var output = imageToBw(image, imageData);

        console.time("create quadtree");
        var tree = quadtree.tree(output);
        console.timeEnd("create quadtree");
        cb(null, tree, image);
    };
}

function imageToBw(image, imageData) {
  var data = imageData.data;

  // end up with 2d array of black/white pixels
  var output = new Array(image.width * image.height);
  // image data is rgba tuples
  for (var y = 0; y < image.height; y++) {
      for (var x = 0; x < image.width; x++) {
          // convert colour to black and white
          var index = x + y * image.width;
          var pixelIndex = index * 4;
          var white = colourToBinary(data[pixelIndex], data[pixelIndex + 1], data[pixelIndex + 2]);
          output[index] = white;
      }
  }

  return output;
}

function rotate(qt) {
    return qt.slice(1).concat([qt[0]]);
}

function drawTree(ctx, tree, dimension) {
    console.time("quadtree expansion");
    var input = quadtree.expand(tree, dimension);
    console.timeEnd("quadtree expansion");
    var pixels = new Uint8ClampedArray(input.length * 4);
    for (var i = 0; i < input.length; i++) {
        var colour = input[i] ? 255 : 0;
        var baseI = i * 4;
        pixels[baseI] = colour;
        pixels[baseI + 1] = colour;
        pixels[baseI + 2] = colour;
        pixels[baseI + 3] = 255;
    }
    var img = new ImageData(pixels, dimension, dimension);
    ctx.putImageData(img, 0, 0);
}

function colourToBinary(R, G, B) {
    return Math.sqrt(R * R * .241 +
        G * G * .691 +
        B * B * .068) >= 128;
}
