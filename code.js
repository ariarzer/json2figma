function ahex2rgbaArr(color) {
    const full = color.length === 9 ? color.slice(1) : 'FF' + color.slice(1);
    const result = [];
    for (let i = 0; i < 8; i += 2) {
        result.push(parseInt(full.slice(i, i + 2), 16) / 255);
    }
    return result;
}
figma.showUI(__html__);
figma.ui.onmessage = msg => {
    if (msg.type === 'create-palette') {
        Object.keys(msg.palette).forEach(colorName => {
            const style = figma.createPaintStyle();
            const [a, r, g, b] = ahex2rgbaArr(msg.palette[colorName]);
            const solidPaint = {
                type: "SOLID",
                color: {
                    r: r,
                    g: g,
                    b: b
                },
                opacity: a,
            };
            style.name = `${msg.name}/${colorName}`;
            style.paints = [solidPaint];
        });
    }
    if (msg.type === 'create-scheme') {
        Object.keys(msg.scheme).forEach(schemeName => {
            Object.keys(msg.scheme[schemeName].colors).forEach((colorName) => {
                const color_identifier = msg.scheme[schemeName].colors[colorName].color_identifier;
                const colorAhex = msg.palette[color_identifier];
                const style = figma.createPaintStyle();
                const [a, r, g, b] = ahex2rgbaArr(colorAhex);
                const solidPaint = {
                    type: "SOLID",
                    color: {
                        r: r,
                        g: g,
                        b: b
                    },
                    opacity: a,
                };
                style.name = `${msg.name}/${schemeName}/${colorName.split('_').join(' ')}`;
                style.paints = [solidPaint];
                const currentComputedStyle = Array.from(figma.getLocalPaintStyles()).find((style) => {
                    return style.description.includes(colorName);
                });
                if (currentComputedStyle && currentComputedStyle.description) {
                    currentComputedStyle.description = `${currentComputedStyle.description}
${msg.scheme[schemeName].appearance}: ${color_identifier} ${colorAhex}`;
                } else {
                    style.description = `${colorName}
${msg.scheme[schemeName].appearance}: ${color_identifier} ${colorAhex}`;
                }
            });
        });
    }
    figma.closePlugin();
};
