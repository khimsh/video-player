;(() => {
  'use strict'

  if (!document.querySelector('.vd-player')) return

  const togglePlayController = document.querySelector('[play-pause]')
  const toggleMuteController = document.querySelector('[mute-unmute]')
  const video = document.querySelector('[video-src]')
  const playPauseIcon = togglePlayController.querySelector('.PlayPause')
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

  const toggleMute = (video, button) => {
    if (video.muted) {
      video.muted = false
      button.classList.remove('muted')
    } else {
      video.muted = true
      button.classList.add('muted')
    }
  }

  const updateIcon = (video, icon) => {
    if (video.paused) {
      icon.classList.add('is-paused')
    } else {
      icon.classList.remove('is-paused')
    }
  }

  // Play/Pause Video
  togglePlayController.addEventListener('click', () => {
    playPause(video)
    updateIcon(video, playPauseIcon)
  })

  video.addEventListener('click', () => {
    playPause(video)
    updateIcon(video, playPauseIcon)
  })

  video.addEventListener('timeupdate', () => {
    handleTimeUpdate(video, progressBarFilled)
  })

  video.addEventListener('loadedmetadata', () => setVideoDuration(video, videoDuration))

  video.addEventListener('timeupdate', () => handleProgress(video, currentTime))

  // Video finished playing
  video.addEventListener('ended', () => {
    playPauseIcon.classList.add('is-paused')
  })

  // Keyboard support
  document.body.onkeyup = function (e) {
    if (e.key == ' ' || e.code == 'Space' || e.code == 32) {
      playPause(video)
      updateIcon(video, playPauseIcon)
    }

    if (e.key == 'm' || e.code == 'KeyM' || e.code == 77) {
      toggleMute(video, toggleMuteController)
    }
  }

  // Mute/Unmute Video
  toggleMuteController.addEventListener('click', () => toggleMute(video, toggleMuteController))

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
  progressBar.addEventListener('click', (e) => rewind(e, video, progressBar))
  progressBar.addEventListener('mousemove', (e) => mousedown && rewind(e, video, progressBar))
  progressBar.addEventListener('mousedown', () => (mousedown = true))
  progressBar.addEventListener('mouseup', () => (mousedown = false))

  function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60)
    minutes = minutes >= 10 ? minutes : '0' + minutes
    seconds = Math.floor(seconds % 60)
    seconds = seconds >= 10 ? seconds : '0' + seconds
    return minutes + ':' + seconds
  }

  function handleProgress(video, currentTime) {
    currentTime.textContent = formatTime(video.currentTime)
  }

  function setVideoDuration(video, elem) {
    elem.textContent = formatTime(video.duration)
  }
})()
