"use strict";
function tree(source) {
    if (typeof source === "boolean") {
        return source;
    }
    // base case - where recursion ends and our
    // compression begins
    if (source.length === 4) {
        if (typeof source[0] === "boolean" && (source[0] === source[1] && source[1] === source[2] && source[2] === source[3])) {
            // compression
            return source[0];
        }
        else {
            return source;
        }
    }
    else {
        var squareDimension = Math.sqrt(source.length);
        assertIsInteger(squareDimension, "square size must be integer");
        var quadSize = squareDimension / 2;
        assertIsInteger(quadSize, "quad size must be integer");
        /*   0123 4567
         * 0 tttt yyyy
         * 1 tttt yyyy
         * 2 tttt yyyy
         * 3 tttt yyyy
         *
         * 4 bbbb rrrr
         *   ...  ....
         *
         */
        var subtrees = [1, 1, 1, 1].map(function () { return []; });
        for (var i = 0; i < source.length; i++) {
            var x = i % squareDimension >= quadSize ? 1 : 0;
            var y = Math.floor(i / squareDimension) >= quadSize ? 2 : 0;
            subtrees[x + y].push(source[i]);
        }
        return tree(subtrees.map(tree));
    }
}
function assert(t, msg) {
    if (!t)
        throw Error(msg);
}
function assertIsInteger(x, msg) {
    assert(typeof x === 'number' && x === Math.round(x), x + " " + msg);
}
function expand(source, squareDimension) {
    // expand the quadtree recursively, using an explicit queue
    // to avoid blowing the stack
    var image = new Array(squareDimension * squareDimension);
    var stack = [fill(source, squareDimension, 0)];
    var max = worstCaseSize(squareDimension);
    if (squareDimension < 2) {
        throw Error("not a square");
    }
    var node;
    /**
     * tttt
     * tttt
     * ttff
     * ttff
     *
     * would compress to:
     *
     * t t
     *
     * t f
     *
     * cellCount = 4
     *
     * means equal constant node @ top level = 4x4
     * nodes inside that = 1
     *
     */
    while (node = stack.pop()) {
        if (stack.length > max) {
            throw new Error("too big!");
        }
        // a compressed or leaf node, where the source is a boolean
        if (node.constant) {
            var count = node.squareSize * node.squareSize;
            // offset will be to top left of a quad
            for (var i = 0; i < count; i++) {
                var x = i % node.squareSize;
                var y = Math.floor(i / node.squareSize);
                var ii = node.offset + x + (y * squareDimension);
                image[ii] = node.source;
            }
        }
        else {
            // as we walk down the tree, the squareDimension of the nodes
            // will go down by a power of 4 each time
            var subSquareSize = node.squareSize / 2;
            stack.push(fill(node.source[0], subSquareSize, node.offset));
            stack.push(fill(node.source[1], subSquareSize, node.offset + subSquareSize));
            stack.push(fill(node.source[2], subSquareSize, node.offset + subSquareSize * squareDimension));
            stack.push(fill(node.source[3], subSquareSize, node.offset + subSquareSize + subSquareSize * squareDimension));
        }
    }
    return image;
}
function pp(image) {
    var v = [];
    for (var i = 0; i < image.length; i++) {
        v[i] = image[i] == null ? 'x' : image[i] ? "t" : "f";
    }
    return v.join("");
}
function fill(source, squareSize, offset) {
    return new ExpansionFrame(source, squareSize, offset);
}
function worstCaseSize(sideLength) {
    return sideLength === 1 ? 1 : sideLength * sideLength + worstCaseSize(sideLength / 2);
}
// one 'stack frame' of expansion - we need to know where we are,
// and how big we are, when we start expanding booleans to pixels
var ExpansionFrame = (function () {
    function ExpansionFrame(source, squareSize, offset) {
        this.source = source;
        this.squareSize = squareSize;
        this.offset = offset;
        this.constant = false;
        this.constant = typeof source === "boolean";
    }
    return ExpansionFrame;
}());
module.exports = {
    tree: tree,
    expand: expand
};
