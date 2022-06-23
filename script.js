'use strict'

const playPauseController = document.querySelector('[play-pause]')
const muteUnmuteController = document.querySelector('[mute-unmute]')
const videoSrc = document.querySelector('[video-src]')
const playPauseIcon = playPauseController.querySelector('.PlayPause')
const progressBar = document.querySelector('[progressbar]')
const progressBarFilled = document.querySelector('[progressbar-filled]')

const currentTime = document.querySelector('[video-current-time]')
const videoDuration = document.querySelector('[video-duration]')

const playPause = (video) => {
  if (video.paused) {
    video.play()
  } else {
    video.pause()
  }
}

const muteUnmute = (video) => {
  video.muted = !video.muted
}

const updateIcon = (video, icon) => {
  if (video.paused) {
    icon.classList.add('is-paused')
  } else {
    icon.classList.remove('is-paused')
  }
}

// Play/Pause VIdeo
playPauseController.addEventListener('click', () => {
  playPause(videoSrc)
  updateIcon(videoSrc, playPauseIcon)
})
videoSrc.addEventListener('click', () => {
  playPause(videoSrc)
  updateIcon(videoSrc, playPauseIcon)
})
videoSrc.addEventListener('timeupdate', () => {
  handleTimeUpdate(videoSrc, progressBarFilled)
})

// Mute/Unmute Video
muteUnmuteController.addEventListener('click', () => muteUnmute(videoSrc))

// rewind
function rewind(e, ...args) {
  const [video, progress] = args

  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration
  video.currentTime = scrubTime
}

const handleTimeUpdate = (video, progressFilled = null) => {
  const percent = (video.currentTime / video.duration) * 100
  progressFilled.style.flexBasis = `${percent}%`
}

let mousedown = false
progressBar.addEventListener('click', (e) => rewind(e, videoSrc, progressBar))
progressBar.addEventListener('mousemove', (e) => mousedown && rewind(e, videoSrc, progressBar))
progressBar.addEventListener('mousedown', () => (mousedown = true))
progressBar.addEventListener('mouseup', () => (mousedown = false))

function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60)
  minutes = minutes >= 10 ? minutes : '0' + minutes
  seconds = Math.floor(seconds % 60)
  seconds = seconds >= 10 ? seconds : '0' + seconds
  return minutes + ':' + seconds
}

videoSrc.addEventListener('loadedmetadata', () => setVideoDuration(videoSrc, videoDuration))

videoSrc.addEventListener('timeupdate', () => handleProgress(videoSrc, currentTime))

function handleProgress(video, currentTime) {
  currentTime.textContent = formatTime(video.currentTime)
}

function setVideoDuration(video, elem) {
  elem.textContent = formatTime(video.duration)
}

// Video finished playing
videoSrc.addEventListener('ended', () => {
  playPauseIcon.classList.add('is-paused')
})
