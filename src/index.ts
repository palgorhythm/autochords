import { Midi } from '@tonejs/midi'
import fs from 'fs'
import _ from 'lodash'

const intervals = [-4, -3, -2, -1, 0, 1, 2, 3, 4]
const notesInOctave = 12
const lowestChordNote = 60
// const highestChordNote = lowestChordNote + notesInOctave * 3
const lowestBassNote = 36
// const highestBassNote = lowestBassNote + notesInOctave * 1

interface MidiNote {
    midi: number // midi note
    time: number // when it happens
    duration: number // how long it happens for
}

const midi = new Midi()
const TEMPO_BPM = 120
midi.header.setTempo(TEMPO_BPM)
const BASE_TIME_INTERVAL = 2
const BASE_DURATION = BASE_TIME_INTERVAL / 4
const NOTES_IN_CHORD = 4
const timeIntervalPossibilities = [
    BASE_TIME_INTERVAL,
    BASE_TIME_INTERVAL / 2,
    BASE_TIME_INTERVAL / 4,
]
const track = midi.addTrack()

const getRandomChord = (): Array<MidiNote> => {
    const chord: Array<MidiNote> = []
    chord.push({
        midi: Math.round(Math.random() * notesInOctave * 1 + lowestBassNote),
        duration: BASE_DURATION,
        time: 0,
    })
    for (let j = 0; j < NOTES_IN_CHORD - 1; j++) {
        chord.push({
            midi: Math.round(
                Math.random() * notesInOctave * 3 + lowestChordNote
            ),
            duration: BASE_DURATION,
            time: 0,
        })
    }
    return chord
}

const buildSong = (): Array<MidiNote> => {
    let currentTime = 0
    const notes: Array<MidiNote> = []
    const numChords = Math.round(Math.random() * 10 + 16)
    let curChord = getRandomChord()
    notes.push(...curChord)
    for (let i = 1; i < numChords; i++) {
        console.log('current chord', curChord)
        const nextChord: Array<MidiNote> = []
        const nextTime = _.round(
            currentTime +
                timeIntervalPossibilities[
                    Math.round(
                        Math.random() * (timeIntervalPossibilities.length - 1)
                    )
                ],
            2
        )
        for (const note of curChord) {
            const nextMidi = _.round(
                note.midi +
                    intervals[
                        Math.round(Math.random() * (intervals.length - 1))
                    ],
                2
            )
            nextChord.push({
                midi: nextMidi,
                time: nextTime,
                duration: BASE_DURATION,
            })
        }
        notes.push(...nextChord)
        curChord = nextChord
        currentTime = nextTime
    }

    return notes
}

const createMidiFile = () => {
    const notes: Array<MidiNote> = buildSong()
    for (const note of notes) {
        track.addNote(note)
    }
    const midiBuffer = Buffer.from(midi.toArray())
    fs.writeFileSync('test.mid', midiBuffer)
}

createMidiFile()

console.log('all done!')

process.exit(0)
