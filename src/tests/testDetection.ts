import { BadWordDetector } from '../BadWordDetector'
import { badWords, subs } from '../constants'

const testCases: Array<{ expected: boolean; inputs: Array<string> }> = [
    {
        expected: true,
        inputs: ['mrf00l'],
    },
    {
        expected: true,
        inputs: [
            'fool',
            'fork',
            'silly',

            'fooluser',
            'forkuser',
            'sillyuser',

            'userfool',
            'userfork',
            'usersilly',

            'afooluser',
            'aforkuser',
            'asillyuser',
        ],
    },
    {
        expected: true,
        inputs: [
            'f00l',
            'fo4k',
            's111y',

            'fo01user',
            'f04ku$e4',
            '$111yuser',

            'userf0o|',
            'u$erf04k',
            'user5!1ly',

            'afo0|user',
            'af0rku$er',
            'asil|yuser',
        ],
    },
    {
        expected: false,
        inputs: [
            'user',

            'foo',
            'ool',
            'sil',
            'lly',
            'for',
            'ork',

            'userfoo',
            'userool',
            'usersil',
            'userlly',
            'userfor',
            'userork',

            'foouser',
            'ooluser',
            'siluser',
            'llyuser',
            'foruser',
            'orkuser',

            'afoouser',
            'aooluser',
            'asiluser',
            'allyuser',
            'aforuser',
            'aorkuser',
        ],
    },
    {
        expected: false,
        inputs: [
            'u$e4',

            'f00',
            'o01',
            's11',
            '1|y',
            'f04',
            '0rk',

            'userf00',
            'usero01',
            'users11',
            'user1|y',
            'userf04',
            'user0rk',

            'f00user',
            'o01user',
            's11user',
            '1|yuser',
            'f04user',
            '0rkuser',

            'af00user',
            'ao01user',
            'as11user',
            'a1|yuser',
            'af04user',
            'a0rkuser',

            'foxol',
            'f0xxrk',
            's1m1l1ly',
        ],
    },
]

testCases.forEach(({ inputs, expected }, idx) => {
    inputs.forEach((userName, idy) => {
        const detector = new BadWordDetector({ badWords, subs })
        const result = detector.doesUsernameContainBadWord(userName)
        if (result === expected) {
            console.log(`Test ${idx} (Case ${idy}) passed ✅`)
        } else {
            console.error(`Test ${idx} (Case ${idy}) failed ❌`)
        }
    })
})
