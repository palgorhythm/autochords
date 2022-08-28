import { BadWordDetector } from '../BadWordDetector'
import { badWords, subs } from '../constants'

const detector = new BadWordDetector({ badWords, subs })
detector.addBadWord('foot')
console.log(detector.doesUsernameContainBadWord('fo0t')) // true
detector.removeBadWord('foot')
console.log(detector.doesUsernameContainBadWord('f0ot')) // false
detector.addBadWord('foot')

detector.addSub({ char: 'o', sub: '=' })
console.log(detector.doesUsernameContainBadWord('fo=t')) // true
console.log(detector.doesUsernameContainBadWord('fo0t')) // true
detector.removeSub({ char: 'o', sub: '=' })
console.log(detector.doesUsernameContainBadWord('fo=t')) // false
console.log(detector.doesUsernameContainBadWord('fo0t')) // false
