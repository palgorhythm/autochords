export class TrieNode {
    public children: Record<string, TrieNode | undefined>
    public isEndOfWord: boolean

    public constructor(
        children: Record<string, TrieNode | undefined> = {},
        isEndOfWord: boolean = false
    ) {
        this.children = children
        this.isEndOfWord = isEndOfWord
    }
}

export class Trie {
    public root: TrieNode = new TrieNode()

    public containsWord(word: string, allowPrefix = false): boolean {
        // if the word is in our trie, return true. otherwise, return false.
        let curNode = this.root
        for (let i = 0; i < word.length; i++) {
            const curChar = word[i]
            const curChild = curNode.children[curChar]
            if (curChild) {
                curNode = curChild
            } else {
                // our trie does not have a child with this char value
                return false
            }
        }
        // if we allow prefixes, when we've been able to use each char to access a node in the tree,
        // we have a prefix!
        return allowPrefix ? true : curNode.isEndOfWord
    }
}
