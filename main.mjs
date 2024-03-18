import { getWebGPUAdapter, setUpContext } from "./helper.mjs";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("webgpu");
let adapter = null;
let device = null;

try {
  adapter = await getWebGPUAdapter();
  device = await adapter.requestDevice();
  setUpContext(context, device);
} catch (error) {
  console.log(error);
}

// record set of command to be executed by the GPU later
const encoder = device.createCommandEncoder();

const pass = encoder.beginRenderPass({
  colorAttachments: [
    {
      view: context.getCurrentTexture().createView(),
      loadOp: "clear", // clear the texture when the render pass starts
      clearValue: [0, 0.5, 0.7, 1],
      storeOp: "store", // Save the result of any drawing in the texture after the render pass is finished
    },
  ],
});

pass.end();

// can only be used once
// const commandBuffer = encoder.finish();
// submit the commandBuffer to queue
// device.queue.submit([commandBuffer]);

// Finish the command buffer and immediately submit it.
device.queue.submit([encoder.finish()]);
