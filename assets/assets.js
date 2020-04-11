const previewStyles = document.createElement('style');
previewStyles.innerHTML = `
iframe#peekr_iframe {
  position     : fixed;
  width        : 90vw;
  height       : 90vh;
  left         : 5vw;
  top          : 5vh;
  border       : 0;
  background   : white;
  z-index      : 2147483645;
  box-shadow   : 4px 4px 10px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  display      : none;
}

#peekr_overlay {
  position        : fixed;
  width           : 100%;
  height          : 100%;
  left            : 0;
  top             : 0;
  background-color: #00000099;
  backdrop-filter : blur(10px);
  z-index         : 2147483640;
  display         : none;
}

#peekr_loading_border_container {
  position : absolute;
  clip-path: polygon(-100% -100%, -100% 200%, 0 200%, 0 0, 100% 0, 100% 100%, 0 100%, 0 200%, 200% 200%, 200% -100%);
  z-index  : 2147483620;
  display  : none;
}

#peekr_loading_border {
  position: relative;
  width   : 100%;
  height  : 100%;
}

#peekr_loading_border:after,
#peekr_loading_border:before {
  content        : '';
  position       : absolute;
  left           : -2px;
  top            : -2px;
  background     : linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000);
  background-size: 400%;
  width          : calc(100% + 4px);
  height         : calc(100% + 4px);
  z-index        : -1;
  animation      : steam 20s linear infinite;
  border-radius  : 4px;
}

#peekr_loading_border:after {
  filter: blur(3px);
}

@keyframes steam {
  0% {
    background-position: 0 0;
  }

  50% {
    background-position: 400% 0;
  }

  100% {
    background-position: 0 0;
  }
}

.iframeIn {
  animation-name           : iframeIn;
  animation-duration       : 0.3s;
  animation-timing-function: ease-out;
  animation-delay          : 0s;
  animation-iteration-count: 1;
  animation-direction      : normal;
  animation-fill-mode      : none;
}

@keyframes iframeIn {
  0% {

    margin-top: -10vh;
    
    opacity          : 0;
  }
80% {
  opacity: 0.3;
}
  100% {
    margin-top: 0;
    
    opacity          : 1;
  }
}

.iframeOut {
  -webkit-animation: iframeOut .3s ease-in both;
  animation        : iframeOut .3s ease-in both;
}

@keyframes iframeOut {
  0% {
    margin-top: 0;
    opacity  : 1;
  }
  80% {
    opacity: 0.3;
  }
  100% {
    margin-top: -10vh;
    opacity  : 0;
  }
}

.overlayIn {
  animation-name           : overlayIn;
  animation-duration       : .4s;
  animation-timing-function: ease;
  animation-delay          : 0s;
  animation-iteration-count: 1;
  animation-direction      : normal;
  animation-fill-mode      : none;
}

@keyframes overlayIn {
  0% {

    opacity                 : .3;
    transform: scale(0)
  }

  100% {

    opacity                 : 1;
    transform: scale(1)
  }
}

.overlayOut {
  animation-name           : overlayOut;
  animation-duration       : .4s;
  animation-timing-function: easeOut;
  animation-delay          : 0s;
  animation-iteration-count: 1;
  animation-direction      : normal;
  animation-fill-mode      : none;
}

@keyframes overlayOut {
  0% {

    transform: scale(1);
  }

  100% {

    transform: scale(0)
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    
 
  }

  to {
    opacity: .4;
    
    transform: scale(1)
  }
}

.fadeIn {
  -webkit-animation-name: fadeIn;
  animation-name        : fadeIn;
}

@keyframes fadeOut {
  from {
    opacity: .4;
  }

  to {
    opacity: 0;
  }
}

.fadeOut {
  -webkit-animation-name: fadeOut;
  animation-name        : fadeOut;
}

.pkr_anim {
  animation-duration         : .3s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode        : both;
  display                    : block !important;
}
`;
document.head.appendChild(previewStyles);
