<script lang="ts">
  import { linear } from "svelte/easing";

  export let direction: "left" | "right";
  function spinAndFly(
    node: any,
    {
      delay = 0,
      duration = 400,
      easing,
      x = 0,
      y = 0,
      opacity = 0,
      direction,
    }: {
      delay?: number;
      duration?: number;
      easing?: any;
      x?: number;
      y?: number;
      opacity?: number;
      direction: "left" | "right";
    }
  ) {
    const style = getComputedStyle(node);
    const target_opacity = +style.opacity;
    const transform = style.transform === "none" ? "" : style.transform;

    const od = target_opacity * (1 - opacity);

    return {
      delay,
      duration,
      easing,
      css: (t: number, u: number) => `
			transform: ${transform} translate(${direction === "left" ? "-" : ""}${
        (1 - t) * x
      }px, ${(1 - t) * y}px) rotate(${direction === "left" ? "" : "-"}${
        (1 - t) * 20
      }deg);
			opacity: ${target_opacity - od * u}`,
    };
  }
</script>

<div
  style="position: absolute; left: 0; top: 0; z-index: 3;"
  out:spinAndFly={{ direction, x: 400, duration: 400, easing: linear, opacity: 1 }}>
  <slot />
</div>
