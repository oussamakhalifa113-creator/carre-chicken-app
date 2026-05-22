.real-fries-scene {
  position: relative;
  width: min(86vw, 420px);
  aspect-ratio: 1 / 1.1;
  margin: 0 auto;
  overflow: visible;
}

.fries-drop-zone {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 3;
}

.fries-box-empty {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 62%;
  transform: translateX(-50%);
  z-index: 5;
  filter: drop-shadow(0 24px 45px rgba(0,0,0,0.35));
}

.falling-fry {
  position: absolute;
  width: clamp(46px, 8vw, 70px);
  transform: translateX(-50%);
  z-index: 3;
  filter: drop-shadow(0 14px 20px rgba(0,0,0,0.28));
}
