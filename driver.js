const BinarySearchTree = require("./binarySearchTree");
const prettyPrint = require("./prettyPrint");

function buildTestArray(length, max) {
  const res = [];
  for (let i = 0; i < length; i++) {
    res.push(Math.floor(Math.random() * max));
  }
  return res;
}

function addRandomNums(tree, count, max) {
  for (let i = 0; i < count; i++) {
    tree.insert(Math.floor(Math.random() * max));
  }
}

const testArray = buildTestArray(34, 233);

const tree = new BinarySearchTree();

tree.buildTree(testArray);

console.log(`is balanced: ${tree.isBalanced()}`);
console.log(`levelOrder: ${tree.levelOrder()}`);
console.log(`preOrder: ${tree.preOrder()}`);
console.log(`postOrder: ${tree.postOrder()}`);
console.log(`inOrder: ${tree.inOrder()}`);

addRandomNums(tree, 100, 233);

console.log(`is balanced after insertion: ${tree.isBalanced()}`);

tree.rebalance();

console.log(`is balanced after rebalance: ${tree.isBalanced()}`);
console.log(`levelOrder after insertion and rebalance: ${tree.levelOrder()}`);
console.log(`preOrder after insertion and rebalance: ${tree.preOrder()}`);
console.log(`postOrder after insertion and rebalance: ${tree.postOrder()}`);
console.log(`inOrder after insertion and rebalance: ${tree.inOrder()}`);

prettyPrint(tree.root);
