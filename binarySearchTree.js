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

  _deleteLeaf(parent, lastRight) {
    if (lastRight) {
      parent.right = null;
    } else {
      parent.left = null;
    }
  }

  _deleteSingleChildNode(currentNode, parent, lastRight) {
    let child;
    if (currentNode.left) {
      child = currentNode.left;
    } else if (currentNode.right) {
      child = currentNode.right;
    }
    if (lastRight) {
      parent.right = child;
    } else if (!lastRight) {
      parent.left = child;
    }
  }

  _deleteDualChildNode(currentNode, parent, lastRight) {
    currentNode.left.right = currentNode.right;
    if (lastRight) {
      parent.right = currentNode.left;
    } else if (!lastRight) {
      parent.left = currentNode.left;
    }
  }

  _deleteRecursive(node, value) {
    if (node === null) {
      return null;
    }

    if (value < node.value) {
      node.left = this._deleteRecursive(node.left, value);
    } else if (value > node.value) {
      node.right = this._deleteRecursive(node.right, value);
    } else {
      if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      }

      let successor = node.right;
      while (successor.left !== null) {
        successor = successor.left;
      }

      node.value = successor.value;
      node.right = this._deleteRecursive(node.right, successor.value);
    }
    return node;
  }

  _deleteRoot(currentNode) {
    // root has no children
    if (currentNode.left === null && currentNode.right === null) {
      this.root = null;
    }
    // root has one child
    else if (currentNode.left === null) {
      this.root = currentNode.right;
    } else if (currentNode.right === null) {
      this.root = currentNode.left;
    }
    // root has both children
    else {
      let successor = currentNode.right;
      while (successor.left !== null) {
        successor = successor.left;
      }
      this.root.value = successor.value;
      this.root.right = this._deleteRecursive(this.root.right, successor.value);
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

    if (currentNode.value === value && currentNode !== parent) {
      if (currentNode.left === null && currentNode.right === null) {
        this._deleteLeaf(parent, lastRight);
      } else if (
        // why no logical xor js ;_;
        (currentNode.left !== null || currentNode.right !== null) &&
        !(currentNode.left !== null && currentNode.right !== null)
      ) {
        this._deleteSingleChildNode(currentNode, parent, lastRight);
      } else if (currentNode.left !== null && currentNode.right !== null) {
        this._deleteDualChildNode(currentNode, parent, lastRight);
      }
    } else if (currentNode.value === value && currentNode === parent) {
      this._deleteRoot(currentNode);
    }
  }

  find(value) {
    let currentNode = this.root;
    while (currentNode !== null) {
      if (value === currentNode.value) {
        return currentNode;
      } else if (value > currentNode.value) {
        currentNode = currentNode.right;
      } else if (value < currentNode.value) {
        currentNode = currentNode.left;
      }
    }
    throw new Error("Could not find node");
  }

  levelOrder(func) {
    let queue = [this.root];
    let currentNode;
    let resArray = [];

    while (queue.length > 0) {
      currentNode = queue.shift();
      resArray.push(currentNode.value);
      if (currentNode.left !== null) {
        queue.push(currentNode.left);
      }
      if (currentNode.right !== null) {
        queue.push(currentNode.right);
      }
      if (typeof func === "function") {
        func(currentNode);
      }
    }
    if (typeof func !== "function") {
      return resArray;
    }
  }

  inOrder(func) {
    const stack = [];
    const resArray = [];
    let currentNode = this.root;

    while (currentNode !== null || stack.length > 0) {
      while (currentNode !== null) {
        stack.push(currentNode);
        currentNode = currentNode.left;
      }
      currentNode = stack.pop();
      if (typeof func === "function") {
        func(currentNode);
      } else {
        resArray.push(currentNode.value);
      }
      currentNode = currentNode.right;
    }
    if (typeof func !== "function") {
      return resArray;
    }
  }

  preOrder(func) {
    const stack = [this.root];
    const resArray = [];
    let currentNode;
    while (stack.length > 0) {
      currentNode = stack.pop();
      if (currentNode !== null) {
        resArray.push(currentNode.value);
        if (typeof func === "function") {
          func(currentNode);
        }

        stack.push(currentNode.right);
        stack.push(currentNode.left);
      }
    }
    if (typeof func !== "function") {
      return resArray;
    }
  }

  postOrder(func) {
    const resArray = [];
    const stack = [];
    let currentNode = this.root;
    let lastVisitedNode = null;

    while (currentNode || stack.length > 0) {
      if (currentNode) {
        stack.push(currentNode);
        currentNode = currentNode.left;
      } else {
        const peekNode = stack[stack.length - 1];
        if (peekNode.right && peekNode.right !== lastVisitedNode) {
          currentNode = peekNode.right;
        } else {
          if (typeof func === "function") {
            func(peekNode);
          }
          resArray.push(peekNode.value);
          lastVisitedNode = stack.pop();
        }
      }
    }
    if (typeof func !== "function") {
      return resArray;
    }
  }

  height(node, depth = 0) {
    if (node === null) {
      return depth - 1;
    }
    const leftHeight = this.height(node.left, depth + 1);
    const rightHeight = this.height(node.right, depth + 1);

    return leftHeight > rightHeight ? leftHeight : rightHeight;
  }

  depth(node) {
    if (node === this.root) {
      return 0;
    }
    let currentNode = this.root;
    let count = 0;
    while (currentNode !== node) {
      if (currentNode === null) {
        throw new Error("Could not find node, may have been deleted");
      } else if (node.value > currentNode.value) {
        currentNode = currentNode.right;
        count++;
      } else if (node.value < currentNode.value) {
        currentNode = currentNode.left;
        count++;
      }
    }
    return count;
  }

  isBalanced(root = this.root) {
    if (root === null) {
      return true;
    }

    let leftHeight = this.height(root.left);
    let rightHeight = this.height(root.right);

    if (
      Math.abs(leftHeight - rightHeight) <= 2 &&
      this.isBalanced(root.left) === true &&
      this.isBalanced(root.right) === true
    ) {
      return true;
    }
    return false;
  }

  rebalance() {
    const treeArray = this.inOrder();
    this.buildTree(treeArray);
  }
}

module.exports = BinarySearchTree;
