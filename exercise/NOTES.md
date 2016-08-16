# Quadtrees

A way of efficiently storing (some) image data, in a 4 node tree structure that recursively divides up the space:

 _____
|A |B |
|__|__|
|C |D |
|__|__|

e.g we have a tree with A, B, C and D quadrents. If A were 4 black pixels, A would be a leaf. Thus for a 16x16 we have 1 node for a wholly black image, or 9 for a image with 3 black or white 4x4 squares, and one checkerboard square. For checkerboard images (worst case), we require:

2x2
bw
wb

4x4
bwbw
wbwb
bwbw
wbwb

8x8
bwbwbwbw
wbwbwbwb
bwbwbwbw
wbwbwbwb
bwbwbwbw
wbwbwbwb
bwbwbwbw
wbwbwbwb

The leaf nodes are booleans

2x2: 5 node            2^1 + 1 = 5  (1 array, 4 booleans)
4x4: 21 nodes          4^2 + 2^2 + 1 = 16 + 4 + 1 = 21  (1 array of 4 arrays of 16 booleans)
8x8: 85 nodes          8^2 + 4^2 + 2^2 + 1 = 64 + 16 + 4 + 1 = 85

worstCaseSize(k) = k^2 + worstCaseSize(k / 2)
worstCaseSize(1) = 1

vs a straight array, that requires k^2 space.

So it's really terrible for checkboards, but good for images that have lots of redunancy.


## Questions arising

1. total best case = 1 bit for all black/all white image
1. next best case: all but 1 cell the same value, what's the cost to store?
  - probably pretty good - 3 squares = 1 bool each, at each level, with
    final leaf an array of 4
  - threePerLevel * allButLastLevel + finalArrayOfFour
  - 8x8 should be 1 + 3 + 1 + 3 + 1 + 4 = 13
    k = dimension
  - bestSpace(k) = 4 + bestSpace(k / 2)
  - bestSpace(2) = 5
  - bestSpace = Math.log(k, 2) * 4 + 1

8x8
wwwwwwww
wwwwwwww
wwwwwwww
wwwwwwww
wwwwwwww
wwwwwwww
wwwwwwww
wwwwwwwb

      4       2        1
      [f,f,f, [f,f,f, [f,f,f,t]]

1. how many recursive steps?
  - creation - always need to check every node, so linear
  - expansion - depends on compression level. best case - logarithmic

