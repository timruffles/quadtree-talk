# Quadtrees

[![Build Status](https://travis-ci.org/timruffles/quadtree-talk.svg?branch=master)](https://travis-ci.org/timruffles/quadtree-talk)

Hello - welcome to the `./slides` and `./exericse` for my quadtrees talk!

I've made some notes in `NOTES.md` about things I found interesting as I coded up my implementation. Maybe you'll spot some interesting things about the algorithm too!

If you do run into issues today, first off: sorry! Secondly please [file an issue](https://github.com/timruffles/quadtree-talk/issues/new).

![Image of quadtree of cat](/src/img/compressed image.png?raw=true)

## Install

Pre-requisites:

- Node >= 6.0.0 (you can use [`nvm`](https://github.com/creationix/nvm) if you have another version)
- Chrome

```sh
npm install
```

## Running

```sh
npm start
```

## Exercise

There are two parts - first the unit-tests, which you can complete in TDD style. Secondly the example where you can see your image displayed!

### Unit-tests

```sh
cd exericses
npm run tddd
```

This will kick off mocha, and re-run the tests each time you make a change. Avoid using DOM APIs in your `index.js` as the tests run in Node. All browser-related stuff lives in `demo.js` and is taken care for you!

### Demo

```
cd exercises
npm start
```

This will open a browser window with your code running! It will live-reload as you make a change.

### Example code

There is a working example in `example.js`. Try not to use it! :) If you're stuck and it feels like the system is at fault, not you, set the `VS_EXAMPLE` env variable to anything. The tests and demo will then work vs the example, e.g:

```sh
VS_EXAMPLE=1 npm start

# or
VS_EXAMPLE=1 npm test
```
