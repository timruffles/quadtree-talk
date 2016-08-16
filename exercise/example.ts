type BinaryNode = Boolean;
type BinaryQuadtree = BinaryQuadtreeArray | BinaryNode;
type BinaryImage = BinaryQuadtree;
interface BinaryQuadtreeArray extends Array<BinaryQuadtree> {}


declare var Uint8ClampedArray : any;
type Uint8ClampedArray = any;

export = {
  tree: tree,
  expand: expand,
}

function tree(source : BinaryQuadtreeArray) : BinaryQuadtree {
  if(typeof source === "boolean") {
    return source;
  }

  // base case - where recursion ends and our
  // compression begins
  if(source.length === 4) {
    if(typeof source[0] === "boolean" && (source[0] === source[1] && source[1] === source[2] && source[2] === source[3])) {
      // compression
      return source[0];
    } else {
      return source;
    }
  } else {
    const squareDimension = Math.sqrt(source.length);
    assertIsInteger(squareDimension, "square size must be integer");

    const quadSize = squareDimension / 2;
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
    const subtrees = [1,1,1,1].map(() => []);
    for(let i = 0; i < source.length; i++) {
      const x = i % squareDimension >= quadSize ? 1 : 0;
      const y = Math.floor(i / squareDimension) >= quadSize ? 2 : 0;
      subtrees[x + y].push(source[i]);
    }

    return tree(subtrees.map(tree));
  }
}


function assert(t, msg) {
  if(!t) throw Error(msg); 
}

function assertIsInteger(x, msg) {
  assert(typeof x === 'number' && x === Math.round(x), x + " " + msg);
}

function expand(source: BinaryQuadtree, squareDimension: number) : boolean[] {
  // expand the quadtree recursively, using an explicit queue
  // to avoid blowing the stack
  const image = new Array(squareDimension * squareDimension);
  const stack = [fill(source, squareDimension, 0)];
  const max = worstCaseSize(squareDimension);

  if(squareDimension < 2) {
    throw Error("not a square");
  }

  let node;

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

  while(node = stack.pop()) {
    if(stack.length > max) {
      throw new Error("too big!");
    }

    // a compressed or leaf node, where the source is a boolean
    if(node.constant) {
      const count = node.squareSize * node.squareSize;
      // offset will be to top left of a quad
      for(let i = 0; i < count; i++)  {
        const x = i % node.squareSize;
        const y = Math.floor(i / node.squareSize);
        const ii = node.offset + x + (y * squareDimension);
        image[ii] = node.source;
      }
    } else {
      // as we walk down the tree, the squareDimension of the nodes
      // will go down by a power of 4 each time
      const subSquareSize = node.squareSize / 2;

      stack.push(fill(node.source[0], subSquareSize, node.offset));
      stack.push(fill(node.source[1], subSquareSize, node.offset + subSquareSize));
      stack.push(fill(node.source[2], subSquareSize, node.offset + subSquareSize * squareDimension));
      stack.push(fill(node.source[3], subSquareSize, node.offset + subSquareSize + subSquareSize * squareDimension));
    }
  }

  return image;
}

function pp(image) {
  const v = [];
  for(let i = 0; i < image.length; i++) {
    v[i] = image[i] == null ? 'x' : image[i] ? "t" : "f";
  }
  return v.join("");
}


function fill(source,squareSize,offset): ExpansionFrame {
  return new ExpansionFrame(source,squareSize,offset);
} 

function worstCaseSize(sideLength: number) {
  return sideLength === 1 ? 1 : sideLength * sideLength + worstCaseSize(sideLength / 2);
} 

// one 'stack frame' of expansion - we need to know where we are,
// and how big we are, when we start expanding booleans to pixels
class ExpansionFrame {
  constant = false;

  constructor(public source, public squareSize: number, public offset:number) {
    this.constant = typeof source === "boolean";
  }
} 
