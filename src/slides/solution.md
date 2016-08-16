## Our meta-algorithm
{tags:{state:"title"}}

## Divide and conquer

## How can we cut big challenges down...

![1d problem](src/img/1d problem.png)

## ...to simpler, related challenges

## 1d search

![1d problem](src/img/1d search.png)

## Big idea

- Capturing logic of our data, in our structure

## e.g proximity

## Unsorted

- `[10, 15, 4, 5, 16, 13]`
- Which numbers are closer than 2 apart?

## Brute-force

- Compare each to each
- `[10, 15, 4, 5]`
- `10 vs 15, 10 vs 4, 10 vs 5`
- `15 vs 4,  15 vs 5`
- `4  vs 5`

## Why bad?

```javascript
const runtime = (n, t = 0) => n 
  ? runtime(n - 1, t += n - 1) 
  : t


const times = Array.from({ length: 10 },
   (_, i) => runtime((i + 1) * 10))
// [45, 190, 435, 780, 1225, 1770,
   2415, 3160, 4005, 4950]
```

## Hugely longer for more nodes

![runtimes](src/img/runtimes.png)

## Sorted

- `[4, 5, 10, 15, 13, 16]`
- Closest bigger and smaller number are neighbours
- So we can just check neighbours!
- Linear runtime

## Quadtrees
{tags:{state:"title"}}

## 4-node

- quad = 4
- tree = parent child

## Why?

## 1D search

![1d problem](src/img/1d problem.png)

- Which numbers are closer than 2 apart?

## 2D search

![2d problem](src/img/2d problem.png)

- Which nodes are closer than 2 apart?

## Can't index on 2D

- Distance is `sqrt(xDistance(a,b)^2 + yDistance(a,b)^2)` (Pythagoras)
- Can't collapse our dimension

## Asking each node is costly

- Again, quadratic runtime

## Divide harder

![2d problem](src/img/2d problem.png)

- Which nodes collide?

## Into easier

![2d search](src/img/2d search.png)

## Our first quadtree

![2d search](src/img/2d search.png)


