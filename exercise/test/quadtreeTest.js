// your code should live in ../index.js
const mod = process.env.VS_EXAMPLE ? require("../example") : require("..");
const quadtree = mod.tree;
const expand = mod.expand;
const _ = require("lodash");

const assert = require("chai").assert;

const t = true;
const f = false;

describe('quadtree', function() {

  describe('compression', function() {

    it('compresses 1bit images', function() {
      const tree = quadtree([
        t,t,
        t,t
      ]);
        
      assert.equal(tree, true);
    })

    it('compresses 1bit subnodes', function() {
      const tree = quadtree([
        t,t,t,f,
        t,t,f,t,
        f,f,t,t,
        f,f,t,t]);


      assert.deepEqual(tree, [t,[t,f,f,t],f,t]);
    });


    it('compresses beyond 1 level', function() {
      // quadtree with final bit false - should
      // have three top level booleans
      const trues = fill(true, 64);
      trues[63] = false;

      const compressed = quadtree(trues);

      assert.equal(compressed[0], true);
      assert.equal(compressed[1], true);
      assert.equal(compressed[2], true);
      assert.deepEqual(compressed[3].slice(0,3), [t,t,t]);
    })
    
    function assertQuadtree(x, msg) {
      assert.isArray(x, msg + " should be a quadtree");
      return x;
    }
    


  })

})

describe('round-trip', function() {

  it('round-trips 4x4', function() {
    const original = [
      t,t,t,t,
      t,t,f,f,
      f,t,f,t,
      f,f,f,f
    ];
    const tree = quadtree(original.slice());

    assert.deepEqual(expand(tree, 4), original);
  })

  it('round trips 32x32', function() {
    const input = fill(true, 32 * 32);
    input[77] = false;
    input[942] = false;
    input[1023] = false;

    const tree = quadtree(input.slice());

    assert.deepEqual(expand(tree, 32), input);
  })

  it('round trips a thumbnail sized image', function() {
    const input = fill(true, 512 * 512);
    
    input[77] = false;
    input[942] = false;
    input[input.length - 1] = false;

    const tree = quadtree(input.slice());

    assert(_.isEqual(expand(tree, 512), input), "unequal (diff too large to display)");
  })

})

describe("expansion", function() {


  it('expands compressed nodes', function() {

    const image = expand(t, 2);

    assert.deepEqual(image, [
      t,t,
      t,t]);

  })

  it('expands base-case trees', function() {
    
    const image = expand([t,t,f,t], 2);

    assert.deepEqual(image, [t,t,f,t]);
  })

  it('expands single depth trees', function() {

    const image = expand([t,[f,t,f,t],t,f], 4);

    assert.deepEqual(image, [
      t,t,f,t,
      t,t,f,t,
      t,t,f,f,
      t,t,f,f]);

    /*
    1 = O
    2 = O + w * 1 + 1
    3 = O + w * 2 + 3

    1xxx
    x2xx
    xxx3 
    */

  })

  it('expands multiple depth trees', function() {

    const image = expand([t,[f,t,[t,f,t,f],t],t,f], 8);

    assert.deepEqual(image, [
      t,t,t,t,f,f,t,t,
      t,t,t,t,f,f,t,t,
      t,t,t,t,t,f,t,t,
      t,t,t,t,t,f,t,t,
      t,t,t,t,f,f,f,f,
      t,t,t,t,f,f,f,f,
      t,t,t,t,f,f,f,f,
      t,t,t,t,f,f,f,f,
    ]);

    /*
    1 = O
    2 = O + w * 1 + 1
    3 = O + w * 2 + 3

    1xxx
    x2xx
    xxx3 
    */

  })

})

function fill(x, n) {
  return Array.from({ length: n }, () => x);
}
