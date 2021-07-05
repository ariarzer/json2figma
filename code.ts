 function ahex2rgbaArr(color: string):Array<number> {
  const full:string = color.length === 9 ? color.slice(1) : 'FF' + color.slice(1);
  const result = [];
  for (let i = 0; i < 8; i += 2) {
    result.push(parseInt(full.slice(i, i + 2), 16) / 255)
  }
  return result;
}

figma.showUI(__html__);

figma.ui.onmessage = msg => {
  if (msg.type === 'create-palette') {
    Object.keys(msg.palette).forEach(colorName => {
      const style = figma.createPaintStyle();
      const [a, r, g, b] = ahex2rgbaArr(msg.palette[colorName]);
      const solidPaint: SolidPaint = {
        type: "SOLID",
        color: {
          r: r,
          g: g,
          b: b
        },
        opacity: a,
      };
      style.name = `${msg.name}/${colorName}`;
      style.paints = [solidPaint]
    })
  }

  figma.closePlugin();
};
