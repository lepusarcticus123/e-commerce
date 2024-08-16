class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

export default class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  search(word) {
    const node = this._findNode(word);
    return node ? node.isEndOfWord : false;
  }

  startsWith(prefix) {
    return !!this._findNode(prefix);
  }

  _findNode(prefix) {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children[char]) {
        return null;
      }
      node = node.children[char];
    }
    return node;
  }

  collectWords(node, prefix) {
    const suggestions = [];
    if (node.isEndOfWord) {
      suggestions.push(prefix);
    }
    for (const char in node.children) {
      suggestions.push(
        ...this.collectWords(node.children[char], prefix + char)
      );
    }
    return suggestions;
  }
}
