/**
 * Solution should continue to work well as the list of bad words and substitutions grows.
  Solution should be resilient to DOS attacks, 
  the user should not be able to construct a username that causes the service to perform a large amount of work.
  Solution should optimize for runtime speed, the faster the check the fewer people will bounce from the registration flow.
 */

import { Trie, TrieNode } from './trie'

// f -> o and 0, each of those maps to o and 0, each of those nodes maps to l

// mvp approach: we enumerate all possible bad word spellings and store in array - O(length of array) to check any given string
// trie approach: - O(length of the string we are checking) time to check a string - technically constant bc string length is at most 64

export class BadWordDetector {
    // TODO: implement word removal from trie - will allow us to remove a bad word and also to remove + re-add when a sub is removed.
    private _badWords: Set<string>
    private _subs: Record<string, Set<string>>
    private _trie: Trie = new Trie()

    public constructor({
        badWords,
        subs,
    }: {
        badWords: Set<string>
        subs: Record<string, Set<string>>
    }) {
        this._badWords = badWords
        this._subs = subs
        this._trie = this._buildTrie()
    }

    public doesUsernameContainBadWord = (userName: string): boolean => {
        return this._testWord(userName)
    }

    public addBadWord(badWord: string): void {
        this._badWords.add(badWord)
        this._insertWord({
            badWord,
        })
    }

    public removeBadWord(badWord: string): void {
        this._badWords.delete(badWord)
        this._removeWord({
            badWord,
        })
    }

    public addSub({ char, sub }: { char: string; sub: string }): void {
        if (!this._subs[char]) {
            this._subs[char] = new Set([sub])
        } else {
            this._subs[char].add(sub)
        }
        for (const badWord of this._badWords) {
            if (badWord.includes(char)) {
                // need to refresh the entries that this word affects -
                // old links will be retained but we'll potentially add new ones
                this._insertWord({
                    badWord,
                })
            }
        }
    }

    public removeSub({ char, sub }: { char: string; sub: string }): void {
        if (!this._subs[char]) {
            return
        }
        this._subs[char].delete(sub)
        for (const badWord of this._badWords) {
            if (badWord.includes(char)) {
                // need to refresh the entries that this word affects -
                // old links will be retained but we'll potentially add new ones
                this._removeWord({
                    badWord,
                })
            }
        }
    }

    // O(maxLengthOfBadWord * numBadWords * maxNumSubstitutions), because we have to take a step for each
    // char in a bad word as well as its substition(s), and we have to do this for every bad word.
    // luckily, once we build this trie, it's easy to add new words to it, so the solution is quite scalable.
    private _buildTrie = (): Trie => {
        const trie = new Trie()
        for (const badWord of this._badWords) {
            this._insertWord({ badWord, trieNode: trie.root })
        }
        return trie
    }

    private _insertWord = ({
        badWord,
        trieNode = this._trie.root,
    }: {
        badWord: string
        trieNode?: TrieNode
    }): void => {
        const variants = [badWord[0], ...(this._subs[badWord[0]] ?? [])].filter(
            (char) => char !== undefined
        )
        if (variants.length === 0) {
            trieNode.isEndOfWord = true
        }
        for (const curChar of variants) {
            const curChild = trieNode.children[curChar]
            if (!curChild) {
                const newNode = new TrieNode()
                trieNode.children[curChar] = newNode
                this._insertWord({
                    badWord: badWord.substring(1),
                    trieNode: newNode,
                })
            } else {
                this._insertWord({
                    badWord: badWord.substring(1),
                    trieNode: curChild,
                })
            }
        }
    }

    private _removeWord = ({
        badWord,
        trieNode = this._trie.root,
    }: {
        badWord: string
        trieNode?: TrieNode
    }): void => {
        const variants = [badWord[0], ...(this._subs[badWord[0]] ?? [])].filter(
            (char) => char !== undefined
        )
        if (variants.length === 0) {
            trieNode.isEndOfWord = false
        }
        for (const curChar of variants) {
            const curChild = trieNode.children[curChar]
            if (curChild) {
                delete trieNode.children[curChar]
                this._removeWord({
                    badWord: badWord.substring(1),
                    trieNode: curChild,
                })
            }
        }
    }

    // O(length of userName) time, because at worst, we take 1 + 2 + ... + (length of username) steps
    // in the case that the whole word is a bad word.
    private _testWord = (userName: string): boolean => {
        let left = 0
        let right = 1
        while (right <= userName.length) {
            const curWord = userName.substring(left, right)
            if (this._trie.containsWord(curWord, false)) {
                return true
            } else if (this._trie.containsWord(curWord, true)) {
                right++
            } else {
                left = right
                right++
            }
        }
        return false
    }
}
