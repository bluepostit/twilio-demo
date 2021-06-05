const { connect, createLocalVideoTrack } = require('twilio-video')

const NO_CALL = 1
const WAITING_FOR_BUDDY = 2
const BUDDY_CONNECTED = 3

let TOKEN, ROOM_ID, ROOM

const setTokenAndRoom = () => {
  let tokenJson = document.getElementById('video-call-token')
  if (tokenJson) {
    const token = JSON.parse(tokenJson.dataset.videoCallToken)
    TOKEN = token.token
    ROOM_ID = token.room
  }
}

const changeCallState = (state, buddy = null) => {
  if (state === WAITING_FOR_BUDDY) {
    setNoCallMessageVisible(false)
    setWaitingMessageVisible(true)
    addLocalVideo()
    connectToRoom()
  } else if (state === BUDDY_CONNECTED) {
    console.log("buddy connected")
    if (!buddy) {
      setWaitingMessageVisible(false)
      return
    }

    buddy.tracks.forEach(publication => {
      if (publication.isSubscribed) {
        const track = publication.track
        showRemoteVideo(track)
      }
    })
    setWaitingMessageVisible(false)

    buddy.on('trackSubscribed', track => {
      showRemoteVideo(track)
    })
  } else if (state === NO_CALL) {
    disconnectRemoteVideo()
    onSelfDisconnect()
    setNoCallMessageVisible(true)
  }
}

const showRemoteVideo = (track) => {
  const videoElement = document.getElementById('remote-video')
  videoElement.appendChild(track.attach())
}

const disconnectRemoteVideo = () => {
  const streamElements = document.querySelectorAll('#remote-video video, #remote-video audio')
  if (streamElements) {
    streamElements.forEach((element) => {
      element.parentNode.removeChild(element)
    })
  }
  ROOM.disconnect()
}

// Add video from local webcam to page
const addLocalVideo = () => {
  createLocalVideoTrack().then((track) => {
    const video = document.getElementById('local-video')
    video.appendChild(track.attach())
  })
}

const onSelfConnect = () => {
  // Someone is already in the room
  if (ROOM.participants.size > 0) {
    changeCallState(BUDDY_CONNECTED)
  }
  ROOM.participants.forEach(participant => {
    participant.tracks.forEach(publication => {
      if (publication.track) {
        showRemoteVideo(publication.track)
      }
    })

   participant.on('trackSubscribed', track => {
      showRemoteVideo(track)
    })
  })
}

const onSelfDisconnect = () => {
  ROOM.localParticipant.tracks.forEach(publication => {
    const attachedElements = publication.track.detach()
    attachedElements.forEach(element => element.remove())
  })
  const videoElement = document.getElementById('local-video')
  videoElement.innerHTML = ''
}

const connectToRoom = () => {
  connect(TOKEN, {
    name: ROOM_ID,
    audio: true,
    video: { width: 640 }
  }).then(room => {
    console.log(`Successfully joined a room: ${room}`)
    ROOM = room
    onSelfConnect()
    room.on('participantConnected', (buddy) => changeCallState(BUDDY_CONNECTED, buddy))
    room.on('participantDisconnected', () => changeCallState(NO_CALL))
    room.on('disconnected', () => changeCallState(NO_CALL))
  }, error => {
    console.error(`Unable to connect to room: ${error.message}`)
  })
}

const setupStartCallButton = () => {
  const button = document.querySelector('.btn-start-call')
  button.addEventListener('click', (e) => {
    e.preventDefault()
    changeCallState(WAITING_FOR_BUDDY)
  })
}

const setupEndCallButton = () => {
  const button = document.querySelector('.btn-end-call')
  button.addEventListener('click', (e) => {
    e.preventDefault()
    changeCallState(NO_CALL)
  })
}

// Show or hide an element
const setElementVisible = (selector, visible) => {
  const element = document.querySelector(selector)
  if (visible) {
    element.classList.remove('hidden')
  } else {
    element.classList.add('hidden')
  }
}

const setNoCallMessageVisible = (visible) => {
  setElementVisible('.no-call', visible)
}

const setWaitingMessageVisible = (visible) => {
  setElementVisible('.waiting-for-buddy', visible)
}

const setupVideoCall = () => {
  setTokenAndRoom()
  if (!(TOKEN && ROOM_ID)) {
    return
  }

  setupStartCallButton()
  setupEndCallButton()
}


export { setupVideoCall }
