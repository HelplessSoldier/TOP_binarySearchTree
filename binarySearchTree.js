const prettyPrint = require("./prettyPrint");

class Node {
  constructor(value = null, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  buildTree(array) {
    let sortedArray = array.slice().sort((a, b) => a - b);
    console.log(`sorted array: ${sortedArray}`);
    this.root = this._buildRecursive(sortedArray);
  }
  _buildRecursive(sortedArray) {
    if (sortedArray.length === 0) {
      return null;
    } else if (sortedArray.length === 1) {
      return new Node(sortedArray[0]);
    }
    const midPoint = Math.floor(sortedArray.length / 2);
    const left = sortedArray.slice(0, midPoint);
    const right = sortedArray.slice(midPoint + 1, sortedArray.length);

    let currentNode = new Node(sortedArray[midPoint]);
    currentNode.left = this._buildRecursive(left);
    currentNode.right = this._buildRecursive(right);

    return currentNode;
  }
}

const testArray = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
let tree = new BinarySearchTree();
tree.buildTree(testArray);

prettyPrint(tree.root);
