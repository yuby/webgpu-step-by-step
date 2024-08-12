function checkCapability() {
  if (navigator.gpu) {
    console.log('WebGPU is supported');
  } else if (navigator.gpu) {
    console.error('WebGPU is not supported');
  }
}


function run() {
  checkCapability();
}

run();
