## Quadtrees for images
{tags:{state:'title'}}

## To simplify - B&W

![black and white cat](src/img/binary cat.png)

## Representing image data

![source](src/img/source image.png)

## Compression

![source](src/img/compressed image.png)

## How?

- We can compress the below:
- `{ size: 8, nodes: [0,0,1,0] }`

![source](src/img/compressible.png)


## Creating

- Compression starts happens at leaves
- Why?

## Recurse up

- Is whole block on or off?
- If so, let's represent it as a boolean
- Otherwise, let's represent it as an array


## One simple coding

- Nodes are arrays: `[1, [1,0,1,0], 1, 0]`
- Store size only at top of tree
- Order is `topLeft, topRight, bottomLeft, bottomRight`

## Ok
{tags: {state: 'notitle'}}

```javascript
const tree = {
  size: 8,
  nodes: [
    // top left + top right...
    [ 
      [0,1,0,1],
      1,
      [0,1,0,0],
      [1,1,0,0],
    ],
```

![source](src/img/compressed image.png)

## Creation

1. Are we at leaf? (Size = 4)
  1. Are all the nodes on or off?
    1. Return boolean
    1. Return Array
  1. Recurse to create 4 quadtrees from sub-areas
  1. Are all my subtrees boolean?
    1. Return boolean
    1. Return Array

## Expansion

1. Is this node constant (`true` or `false`)
  1. Fill area
  1. Recurse into subnodes

## Challenge: stack space

## Image data is large

- 800 x 600 = 480,000

## JS's stack is not

- ~10,000s 

## We can't do simple recursion

```javascript
function quadtree(imageData) {
  if(imageData.length === 4) {
    // compress
  } else {
    return quadtree([
      quadtree(topLeft(imageData)),
      quadtree(topRight(imageData)),
      // ...
    ])
  }
}
```

## Solution

## Make our own stack!

## Recursion to stack

```javascript
function quadtree(imageData) {
  const stack = [() => new WorkNode(imageData)];
  let node;

  while(node = stack.pop) {
    // replace recursion with push to stack
    stack.push(new WorkNode);
  }
}
```

## Cheat-sheets

- [Recursion -> stack](http://haacked.com/archive/2007/03/04/Replacing_Recursion_With_a_Stack.aspx/)

## Goals
{ tags: { state: "title" }}

## Rotation

- Rotate whole tree
- Mirroring

## Scaling

- Scale down image
- Scale up image (resample)

## Visualisation

- Show where the tree nodes are on image

## Colour!

- Support colour trees
