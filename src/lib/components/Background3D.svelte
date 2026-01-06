<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  export let animationSpeed = 1.0;

  let canvas;
  let ctx;
  let frameId;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let gridSpacing = 56;
  let gridOffsetX = 0;
  let gridOffsetY = 0;
  let cols = 0;
  let rows = 0;
  let gridLayer;
  let lights = [];
  let lastTime = 0;
  let reduceMotion = false;
  let motionQuery;

  const teal = {
    core: 'rgba(64, 224, 208, 0.95)',
    glow: 'rgba(64, 224, 208, 0.35)'
  };
  const orange = {
    core: 'rgba(255, 159, 67, 0.95)',
    glow: 'rgba(255, 159, 67, 0.35)'
  };

  const edgePoints = {
    left: () => ({ col: 0, row: randomInt(0, rows) }),
    right: () => ({ col: cols, row: randomInt(0, rows) })
  };

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function toPixel(point) {
    return {
      x: gridOffsetX + point.col * gridSpacing,
      y: gridOffsetY + point.row * gridSpacing
    };
  }

  function buildGridPath(startEdge, endEdge) {
    const start = edgePoints[startEdge]();
    const end = edgePoints[endEdge]();
    const points = [start];
    let current = { ...start };
    let moveHorizontal = true;
    const turnCount = randomInt(4, 7);

    for (let i = 0; i < turnCount; i += 1) {
      if (moveHorizontal) {
        const dir = end.col >= current.col ? 1 : -1;
        const minCol = dir === 1 ? current.col + 1 : end.col + 1;
        const maxCol = dir === 1 ? end.col - 1 : current.col - 1;
        if (minCol > maxCol) {
          moveHorizontal = false;
          continue;
        }
        const nextCol = randomInt(minCol, maxCol);
        current = { col: nextCol, row: current.row };
      } else {
        let nextRow = randomInt(0, rows);
        if (nextRow === current.row) {
          nextRow = Math.max(0, Math.min(rows, nextRow + (Math.random() > 0.5 ? 1 : -1)));
        }
        current = { col: current.col, row: nextRow };
      }
      points.push(current);
      moveHorizontal = !moveHorizontal;
    }

    if (current.col !== end.col) {
      points.push({ col: end.col, row: current.row });
    }
    if (current.row !== end.row) {
      points.push(end);
    }

    return dedupePoints(points);
  }

  function dedupePoints(points) {
    const cleaned = [points[0]];
    for (let i = 1; i < points.length; i += 1) {
      const last = cleaned[cleaned.length - 1];
      const current = points[i];
      if (last.col !== current.col || last.row !== current.row) {
        cleaned.push(current);
      }
    }
    return cleaned;
  }

  function buildSegments(points) {
    const segments = [];
    let total = 0;
    for (let i = 0; i < points.length - 1; i += 1) {
      const start = toPixel(points[i]);
      const end = toPixel(points[i + 1]);
      const length = Math.hypot(end.x - start.x, end.y - start.y);
      if (length > 0) {
        segments.push({ start, end, length });
        total += length;
      }
    }
    return { segments, total };
  }

  function createLight(startEdge, endEdge, palette) {
    const path = buildGridPath(startEdge, endEdge);
    const { segments, total } = buildSegments(path);
    return {
      segments,
      total,
      palette,
      progress: 0,
      speed: gridSpacing * (2.2 + Math.random()),
      tail: gridSpacing * 4.2
    };
  }

  function getPointAtDistance(segments, distance) {
    let traveled = 0;
    for (const segment of segments) {
      if (traveled + segment.length >= distance) {
        const t = (distance - traveled) / segment.length;
        return {
          x: lerp(segment.start.x, segment.end.x, t),
          y: lerp(segment.start.y, segment.end.y, t)
        };
      }
      traveled += segment.length;
    }
    const last = segments[segments.length - 1];
    return last ? last.end : { x: 0, y: 0 };
  }

  function drawPathSegment(segments, startDist, endDist, style) {
    let traveled = 0;
    let started = false;
    ctx.save();
    ctx.strokeStyle = style.stroke;
    ctx.lineWidth = style.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (style.shadow) {
      ctx.shadowBlur = style.shadow.blur;
      ctx.shadowColor = style.shadow.color;
    } else {
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
    }

    ctx.beginPath();
    for (const segment of segments) {
      const segStart = traveled;
      const segEnd = traveled + segment.length;
      if (segEnd < startDist) {
        traveled = segEnd;
        continue;
      }
      if (segStart > endDist) {
        break;
      }

      const startT = Math.max(0, (startDist - segStart) / segment.length);
      const endT = Math.min(1, (endDist - segStart) / segment.length);

      if (endT > 0 && startT < 1) {
        const startPoint = {
          x: lerp(segment.start.x, segment.end.x, startT),
          y: lerp(segment.start.y, segment.end.y, startT)
        };
        const endPoint = {
          x: lerp(segment.start.x, segment.end.x, endT),
          y: lerp(segment.start.y, segment.end.y, endT)
        };

        if (!started) {
          ctx.moveTo(startPoint.x, startPoint.y);
          started = true;
        } else {
          ctx.lineTo(startPoint.x, startPoint.y);
        }
        ctx.lineTo(endPoint.x, endPoint.y);
      }

      traveled = segEnd;
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawHeadGlow(point, palette) {
    const radius = gridSpacing * 0.6;
    const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
    gradient.addColorStop(0, palette.core);
    gradient.addColorStop(0.4, palette.glow);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.save();
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawGrid() {
    if (!gridLayer) return;
    ctx.drawImage(gridLayer, 0, 0, width, height);
  }

  function renderFrame(delta) {
    ctx.clearRect(0, 0, width, height);
    drawGrid();

    lights.forEach(light => {
      const adjustedSpeed = light.speed * animationSpeed;
      if (!reduceMotion) {
        light.progress += adjustedSpeed * delta;
      }

      if (!reduceMotion && light.progress > light.total + light.tail) {
        light.progress = 0;
        const startEdge = light.palette === teal ? 'left' : 'right';
        const endEdge = light.palette === teal ? 'right' : 'left';
        const newLight = createLight(startEdge, endEdge, light.palette);
        Object.assign(light, newLight);
      }

      const startDist = reduceMotion ? 0 : Math.max(0, light.progress - light.tail);
      const endDist = reduceMotion ? light.total : Math.min(light.total, light.progress);

      drawPathSegment(light.segments, startDist, endDist, {
        stroke: light.palette.glow,
        width: 10,
        shadow: { blur: 28, color: light.palette.glow }
      });

      drawPathSegment(light.segments, startDist, endDist, {
        stroke: light.palette.core,
        width: 3,
        shadow: { blur: 12, color: light.palette.core }
      });

      if (!reduceMotion && light.progress <= light.total) {
        const head = getPointAtDistance(light.segments, light.progress);
        drawHeadGlow(head, light.palette);
      }
    });
  }

  function animate(time) {
    if (!ctx || reduceMotion) return;
    const delta = lastTime ? (time - lastTime) / 1000 : 0.016;
    lastTime = time;
    renderFrame(delta);
    frameId = requestAnimationFrame(animate);
  }

  function rebuildScene() {
    lights = [
      createLight('left', 'right', teal),
      createLight('right', 'left', orange)
    ];
    buildGridLayer();
    if (reduceMotion) {
      renderFrame(0);
    }
  }

  function buildGridLayer() {
    gridLayer = document.createElement('canvas');
    gridLayer.width = width * dpr;
    gridLayer.height = height * dpr;
    const gctx = gridLayer.getContext('2d');
    gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    gctx.clearRect(0, 0, width, height);

    gctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    gctx.lineWidth = 1;

    for (let col = 0; col <= cols; col += 1) {
      const x = gridOffsetX + col * gridSpacing;
      gctx.beginPath();
      gctx.moveTo(x, gridOffsetY);
      gctx.lineTo(x, gridOffsetY + rows * gridSpacing);
      gctx.stroke();
    }

    for (let row = 0; row <= rows; row += 1) {
      const y = gridOffsetY + row * gridSpacing;
      gctx.beginPath();
      gctx.moveTo(gridOffsetX, y);
      gctx.lineTo(gridOffsetX + cols * gridSpacing, y);
      gctx.stroke();
    }
  }

  function handleResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const minDimension = Math.min(width, height);
    gridSpacing = Math.round(Math.max(40, Math.min(72, minDimension / 10)));
    cols = Math.max(6, Math.floor(width / gridSpacing));
    rows = Math.max(6, Math.floor(height / gridSpacing));
    const gridWidth = cols * gridSpacing;
    const gridHeight = rows * gridSpacing;
    gridOffsetX = (width - gridWidth) / 2;
    gridOffsetY = (height - gridHeight) / 2;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    rebuildScene();
  }

  onMount(() => {
    if (!browser) return;
    ctx = canvas?.getContext('2d');
    if (!ctx) {
      return;
    }
    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduceMotion = motionQuery.matches;

    const addMotionListener = motionQuery.addEventListener ? 'addEventListener' : 'addListener';
    const removeMotionListener = motionQuery.removeEventListener ? 'removeEventListener' : 'removeListener';
    const handleMotion = event => {
      reduceMotion = event.matches;
      if (reduceMotion) {
        cancelAnimationFrame(frameId);
        renderFrame(0);
      } else {
        lastTime = 0;
        frameId = requestAnimationFrame(animate);
      }
    };

    motionQuery[addMotionListener]('change', handleMotion);
    handleResize();
    window.addEventListener('resize', handleResize);

    if (!reduceMotion) {
      frameId = requestAnimationFrame(animate);
    }

    return () => {
      motionQuery[removeMotionListener]('change', handleMotion);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
    };
  });

  onDestroy(() => {
    cancelAnimationFrame(frameId);
  });
</script>

<div class="background-3d">
  <canvas class="tron-canvas" bind:this={canvas}></canvas>
</div>

<style>
  .background-3d {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -10;
    overflow: hidden;
    pointer-events: none;
    background: radial-gradient(circle at top left, rgba(64, 224, 208, 0.08), transparent 55%),
      radial-gradient(circle at bottom right, rgba(255, 159, 67, 0.08), transparent 55%),
      linear-gradient(135deg, #06070f 0%, #0c1224 45%, #101b2e 100%);
  }

  .tron-canvas {
    width: 100%;
    height: 100%;
    display: block;
    pointer-events: none;
  }
</style>
