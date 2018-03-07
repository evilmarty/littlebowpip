const PIP_MODE = 'picture-in-picture';
const ID_PROP = 'videoid';
let lastId = 0;

function handleMessage(event) {
  switch (event.name) {
    case 'activatepip':
      activatePictureInPicture(event.message);
      break;
    case 'refreshvideos':
      dispatchVideoELementList();
      break;
  }
}

function activatePictureInPicture(id) {
  const videoElements = getVideoElementsById(id);
  videoElements.forEach(function(videoElement) {
    videoElement.webkitSetPresentationMode(PIP_MODE);
  });
}

function getVideoElements() {
  const results = document.querySelectorAll('video');
  return [].slice.call(results);
}

function getVideoElementsById(id) {
  const videoElements = getVideoElements();
  return videoElements.filter(function(videoElement) {
    return videoElement.dataset[ID_PROP] === id;
  });
}

function getVideoElementId(videoElement) {
  let id = videoElement.dataset[ID_PROP];

  if (!id) {
    id = (++lastId).toString();
    videoElement.dataset[ID_PROP] = id;
  }

  return id;
}

function dispatchVideoELementList() {
  const videoElements = getVideoElements();

  const items = videoElements.map(function(videoElement, index) {
    return {
      id: getVideoElementId(videoElement),
      title: 'Video ' + (index + 1),
      activated: videoElement.webkitPresentationMode === PIP_MODE,
    };
  });

  dispatch('update', items);
}

function dispatch(name, msg) {
  safari.self.tab.dispatchMessage(name, msg);
}

if (window.top === window) {
  safari.self.addEventListener('message', handleMessage, true);
  setTimeout(dispatchVideoELementList, 50);
}

