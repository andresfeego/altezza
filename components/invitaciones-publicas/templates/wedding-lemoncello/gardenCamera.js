import composition from './gardenComposition.json';

// All objects have fixed coordinates in the painting. Only the camera pose changes.
export function gardenGeometry(width, height, column) {
  const { landscape, sign, paper } = composition;
  const panel = Math.max(width, height * 548 / 957);
  const scale = panel * landscape.panels / landscape.width;
  const left = column * width + (panel - width) / 2;
  const top = (height - landscape.height * scale) / 2;
  const signHeight = sign.width * sign.imageHeight / sign.imageWidth;
  const surface = {
    x: left + (sign.x + paper.left * sign.width) * scale,
    y: top + (sign.y + paper.top * signHeight) * scale,
    width: paper.width * sign.width * scale,
    height: paper.height * signHeight * scale,
  };
  const wideScale = height / (landscape.height * scale);
  // Center the referenced chapel and its two baskets; the former easel anchor
  // no longer determines the church framing after the umbrella transition.
  const wide = { x: width / 2 - (left + landscape.chapelCenterX * scale) * wideScale, y: -top * wideScale, scale: wideScale };
  // Crop above the chapel cross, without stretching or revealing canvas edges.
  const skyScale = height / (landscape.skyBottom * scale);
  const sky = { x: width / 2 - (left + landscape.chapelCenterX * scale) * skyScale, y: -top * skyScale, scale: skyScale };
  const closeScale = Math.min((width - 32) / surface.width, (height - 80) / surface.height);
  const close = {
    x: width / 2 - (surface.x + surface.width / 2) * closeScale,
    y: height / 2 - (surface.y + surface.height / 2) * closeScale,
    scale: closeScale,
  };
  return { left, top, scale, surface, wide, close, sky };
}

// Project the same fixed world object directly into the viewport. Keeping the
// sign out of nested downscale/upscale surfaces lets Safari paint its live type
// and full-resolution artwork at the final scale. This is not a second camera.
export function projectGardenSign(geometry, camera) {
  const { sign } = composition;
  return {
    x: camera.x + (geometry.left + sign.x * geometry.scale) * camera.scale,
    y: camera.y + (geometry.top + sign.y * geometry.scale) * camera.scale,
    scale: geometry.scale * sign.width / sign.designWidth * camera.scale,
  };
}

// Keep the resting scene in the normal paint tree instead of retaining a low
// resolution 3D compositor surface after a large zoom on iOS.
export const cameraTransform = pose => `translate(${pose.x}px, ${pose.y}px) scale(${pose.scale})`;
