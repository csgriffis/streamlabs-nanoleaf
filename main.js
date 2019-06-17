const fetch = require('isomorphic-fetch');
const io = require('socket.io-client');

// Connection Parameters
const auth_token = '';
const baseURL = ``;
const socketToken = '';

// Scene Definitions
const defaultScene = '';
const onSubscriptionScene = '';
const onFollowScene = '';
const onDonationScene = '';
const onBitsScene = '';
const onHostScene = '';
const onRaidScene = '';

// Connect to Streamlabs socket https://dev.streamlabs.com/docs/socket-api
const streamlabs = io(`https://sockets.streamlabs.com?token=${socketToken}`, {
  transports: ['websocket']
});

streamlabs.on('connect', () => {
  console.log('Connected to Socket');
});

streamlabs.on('event', eventData => {
  let duration = 60000; // time in ms;

  if (eventData.type === 'donation') {
    setEffect(onDonationScene);
  }

  if (eventData.for === 'twitch_account') {
    switch (eventData.type) {
      case 'follow':
        setEffect(onFollowScene);
        duration = 10000;
        break;
      case 'subscription':
        setEffect(onSubscriptionScene);
        break;
      case 'host':
        setEffect(onHostScene);
        break;
      case 'bits':
        setEffect(onBitsScene);
        break;
      case 'raids':
        setEffect(onRaidScene);
        break;
      default:
        return;
    }
  }

  // Change scene to default after `duration`
  setTimeout(() => {
    setEffect(defaultScene);
  }, duration);
});

/**
 * Set Effect on NanoLeaf
 */
function setEffect(effect) {
  fetch(`${baseURL}/api/v1/${auth_token}/effects/select`, {
    method: 'PUT',
    body: JSON.stringify({ select: effect })
  }).catch(err => console.log('Error updating to effect', err));
}
