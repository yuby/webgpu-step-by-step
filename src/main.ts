import vs from './shaders/vertex.wgsl';
import fs from './shaders/fragment.wgsl';


function checkCapability(): boolean {
  if (navigator.gpu) {
    console.log('WebGPU is supported');
    return true;
  } else {
    console.error('WebGPU is not supported');
    return false;
  }
}

async function initialize() {
  const canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('gfx-main');
  const adapter: GPUAdapter = <GPUAdapter> await navigator.gpu?.requestAdapter();
  if (!adapter) {
    return;
  }
  const device: GPUDevice = <GPUDevice> await adapter.requestDevice();
  const context: GPUCanvasContext = <GPUCanvasContext> canvas.getContext('webgpu');
  if (!context) {
    return;
  }
  const format: GPUTextureFormat = 'bgra8unorm';
  const alphaMode: GPUCanvasAlphaMode = 'opaque';

  context.configure({
    device,
    format,
    alphaMode,
  });

  const bindGroupLayout = device.createBindGroupLayout({
    entries: [],
  });

  const bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [],
  });

  const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [bindGroupLayout],
  });

  const pipeline = device.createRenderPipeline({
    vertex: {
      module: device.createShaderModule({
        code: vs,
      }),
      entryPoint: 'vs_main',
    },
    fragment: {
      module: device.createShaderModule({
        code: fs,
      }),
      entryPoint: 'fs_main',
      targets: [
        { format }
      ]
    },
    primitive: {
      topology: 'triangle-list',
    },
    layout: pipelineLayout,
  });

  const commandEncoder: GPUCommandEncoder = device.createCommandEncoder();
  const textureView: GPUTextureView = context.getCurrentTexture().createView();
  const renderPass: GPURenderPassEncoder = commandEncoder.beginRenderPass({
    colorAttachments: [
      {
        view: textureView,
        clearValue: { r: 0.5, g: 0.0, b: 0.25, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
  });
  renderPass.setPipeline(pipeline);
  renderPass.setBindGroup(0, bindGroup);
  renderPass.draw(3, 1, 0, 0);
  renderPass.end();

  device.queue.submit([commandEncoder.finish()]);
}



function run() {
  if (checkCapability()) {
    initialize();
  }
}

run();
