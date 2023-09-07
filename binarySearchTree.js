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
    let noDuplicatesArray = sortedArray.filter(
      (value, index, self) => self.indexOf(value) === index
    );
    this.root = this._buildRecursive(noDuplicatesArray);
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
  insert(value) {
    let currentNode = this.root;
    while (!this._canInsert(value, currentNode)) {
      if (value > currentNode.value) {
        currentNode = currentNode.right;
      } else if (value < currentNode.value) {
        currentNode = currentNode.left;
      }
    }
    const insertSide = this._canInsert(value, currentNode);
    if (insertSide === "right") {
      currentNode.right = new Node(value);
    } else if (insertSide === "left") {
      currentNode.left = new Node(value);
    } else if (insertSide === "duplicate") {
      return;
    }
  }
  _canInsert(value, node) {
    if (value === node.value) {
      return "duplicate";
    } else if (value > node.value && node.right === null) {
      return "right";
    } else if (value < node.value && node.left === null) {
      return "left";
    }
  }
  delete(value) {
    let currentNode = this.root;
    let parent = this.root;
    let lastRight = false;

    while (true) {
      if (value > currentNode.value) {
        parent = currentNode;
        lastRight = true;
        currentNode = currentNode.right;
      } else if (value < currentNode.value) {
        parent = currentNode;
        lastRight = false;
        currentNode = currentNode.left;
      } else if (currentNode.value === value) {
        break;
      } else {
        break;
      }
    }
    if (currentNode.value === value) {
      if (currentNode.left === null && currentNode.right === null) {
        if (lastRight) {
          parent.right = null;
        } else {
          parent.left = null;
        }
      } else if (currentNode.left != null ) // incomplete, finishing tomorrow
    }
  }
}

const testArray = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
let tree = new BinarySearchTree();
tree.buildTree(testArray);
tree.insert(10);
tree.insert(6);
tree.delete(10);

prettyPrint(tree.root);
