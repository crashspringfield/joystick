import { PWMOscillator } from 'tone'

// Set up OSC, elements
const MIDDLE_C  = 261
const MOD_RATIO = 50
const osc       = new PWMOscillator(MIDDLE_C, 0).toDestination()
const joystick  = document.getElementById('joystick')
const fDisplay  = document.getElementById('frequency-display')
const mDisplay  = document.getElementById('modulation-display')
const resetBtn  = document.getElementById('reset')
const holdBtn   = document.getElementById('hold')
const initial   = joystick.getBoundingClientRect()

let pos1 = 0, pos2 = 2, pos3 = 0, pos4 = 0
let hold = false

// Initiate sound and movement
const dragMouseDown = e => {
  e = e || window.event
  e.preventDefault()

  pos3 = e.clientX
  pos4 = e.clientY

  osc.start()

  document.onmouseup   = closeDragElement
  document.onmousemove = elementDrag
}

// Update display && OSC
const elementDrag = e => {
  e = e || window.event
  e.preventDefault()

  pos1 = pos3 - e.clientX
  pos2 = pos4 - e.clientY
  pos3 = e.clientX
  pos4 = e.clientY

  const difY       = initial.y - pos4
  const frequency  = MIDDLE_C + difY > 0 ? MIDDLE_C + difY : 0
  const difX       = -(initial.x - pos3)
  const modulation = difX > 0 ? (difX / MOD_RATIO) : 0

  osc.set({
    frequency:           frequency,
    modulationFrequency: modulation
  })

  fDisplay.innerHTML = frequency.toFixed(2)
  mDisplay.innerHTML = modulation.toFixed(2)

  joystick.style.top  = `${(joystick.offsetTop - pos2)}px`
  joystick.style.left = `${(joystick.offsetLeft - pos1)}px`
}

// Stop the nonsense
const closeDragElement = () => {
  document.onmouseup   = null
  document.onmousemove = null

  if (!hold) {
    osc.stop()
  }
}

// Assign shit to joystick
joystick.onmousedown = dragMouseDown

// Reset
resetBtn.addEventListener('click', () => {
  pos1 = pos2 = pos3 = pos4 = 0

  joystick.style.top  = null
  joystick.style.left = null

  osc.stop()

  osc.set({
    frequency:           MIDDLE_C,
    modulationFrequency: MOD_RATIO
  })
})

// Hold
holdBtn.addEventListener('change', function() {
  hold = this.checked
})
