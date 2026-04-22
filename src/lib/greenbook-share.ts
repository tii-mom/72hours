import { getGreenBookContent } from "../content/greenbook";
import { localized, type Locale } from "./locale";

const POSTER_WIDTH = 1600;
const POSTER_HEIGHT = 2000;
const POSTER_FILE_NAME = "72hours-green-book-card.png";

const TITLE_FONT = "'Sora', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', sans-serif";
const MONO_FONT = "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace";
type GreenBookPosterContent = ReturnType<typeof getGreenBookContent>;

export type GreenBookExportFeedback = {
  message: string;
};

function ensureBrowserEnvironment() {
  if (typeof document === "undefined" || typeof window === "undefined") {
    throw new Error("Green Book export is only available in the browser.");
  }
}

async function ensureCanvasFontsReady() {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return;
  }

  try {
    await document.fonts.ready;
  } catch {
    // Keep going with fallback fonts if loading fails.
  }
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function fillRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  roundedRectPath(ctx, x, y, width, height, radius);
  ctx.fill();
}

function strokeRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  roundedRectPath(ctx, x, y, width, height, radius);
  ctx.stroke();
}

function segmentText(text: string, locale: Locale) {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(locale === "en-US" ? "en" : "zh", { granularity: "word" });
    return Array.from(segmenter.segment(text), (segment) => segment.segment);
  }

  return Array.from(text);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, locale: Locale) {
  const lines: string[] = [];
  const paragraphs = text.split(/\n+/);

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      lines.push("");
      continue;
    }

    let current = "";

    for (const segment of segmentText(paragraph, locale)) {
      if (!current && segment.trim() === "") {
        continue;
      }

      const candidate = current + segment;

      if (current && ctx.measureText(candidate).width > maxWidth) {
        lines.push(current.trimEnd());
        current = segment.trimStart();
        continue;
      }

      current = candidate;
    }

    if (current) {
      lines.push(current.trimEnd());
    }
  }

  return lines;
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  locale: Locale,
  options: {
    font: string;
    fillStyle: string;
    lineHeight: number;
    letterSpacing?: number;
  }
) {
  ctx.save();
  ctx.font = options.font;
  ctx.fillStyle = options.fillStyle;
  ctx.textBaseline = "top";

  const lines = wrapText(ctx, text, maxWidth, locale);
  let currentY = y;

  for (const line of lines) {
    if (options.letterSpacing && options.letterSpacing !== 0) {
      let currentX = x;
      for (const char of line) {
        ctx.fillText(char, currentX, currentY);
        currentX += ctx.measureText(char).width + options.letterSpacing;
      }
    } else {
      ctx.fillText(line, x, currentY);
    }

    currentY += options.lineHeight;
  }

  ctx.restore();

  return currentY;
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  options: {
    fillStyle?: string;
    strokeStyle?: string;
    textStyle?: string;
    width?: number;
    height?: number;
  } = {}
) {
  const paddingX = 18;

  ctx.save();
  ctx.font = `600 20px ${MONO_FONT}`;
  const measuredWidth = Math.ceil(ctx.measureText(text).width);
  const width = options.width ?? measuredWidth + paddingX * 2;
  const height = options.height ?? 46;

  ctx.fillStyle = options.fillStyle ?? "rgba(124, 255, 102, 0.12)";
  ctx.strokeStyle = options.strokeStyle ?? "rgba(124, 255, 102, 0.24)";
  ctx.lineWidth = 2;
  fillRoundedRect(ctx, x, y, width, height, 999);
  strokeRoundedRect(ctx, x, y, width, height, 999);

  ctx.fillStyle = options.textStyle ?? "#dfffe0";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + paddingX, y + height / 2 + 1);
  ctx.restore();
}

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.028)";

  for (let x = 0; x <= width; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(124, 255, 102, 0.04)";
  for (let y = 136; y <= height; y += 180) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawPosterBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const base = ctx.createLinearGradient(0, 0, width, height);
  base.addColorStop(0, "#030603");
  base.addColorStop(0.55, "#070d08");
  base.addColorStop(1, "#020402");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);

  const glowTopRight = ctx.createRadialGradient(width * 0.82, height * 0.16, 24, width * 0.82, height * 0.16, width * 0.44);
  glowTopRight.addColorStop(0, "rgba(124, 255, 102, 0.24)");
  glowTopRight.addColorStop(0.3, "rgba(91, 255, 103, 0.08)");
  glowTopRight.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glowTopRight;
  ctx.fillRect(0, 0, width, height);

  const glowBottomLeft = ctx.createRadialGradient(width * 0.1, height * 0.86, 0, width * 0.1, height * 0.86, width * 0.34);
  glowBottomLeft.addColorStop(0, "rgba(74, 255, 133, 0.14)");
  glowBottomLeft.addColorStop(0.38, "rgba(74, 255, 133, 0.05)");
  glowBottomLeft.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glowBottomLeft;
  ctx.fillRect(0, 0, width, height);

  const diagonal = ctx.createLinearGradient(width * 0.18, 0, width * 0.8, height);
  diagonal.addColorStop(0, "rgba(124, 255, 102, 0.05)");
  diagonal.addColorStop(0.5, "rgba(124, 255, 102, 0.015)");
  diagonal.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = diagonal;
  ctx.fillRect(0, 0, width, height);

  drawGrid(ctx, width, height);

  ctx.save();
  ctx.globalAlpha = 0.11;
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 18; i += 1) {
    const lineY = 176 + i * 82;
    ctx.fillRect(0, lineY, width, 2);
  }
  ctx.restore();

  ctx.save();
  const border = ctx.createLinearGradient(0, 0, width, height);
  border.addColorStop(0, "rgba(124, 255, 102, 0.34)");
  border.addColorStop(0.5, "rgba(255, 255, 255, 0.08)");
  border.addColorStop(1, "rgba(124, 255, 102, 0.14)");
  ctx.strokeStyle = border;
  ctx.lineWidth = 4;
  strokeRoundedRect(ctx, 24, 24, width - 48, height - 48, 44);
  ctx.restore();
}

function drawTitleBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  content: GreenBookPosterContent,
  locale: Locale
) {
  const { hero, quickFacts, share } = content;
  const heroColumnWidth = 806;
  const factsColumnX = x + heroColumnWidth + 44;
  const factsColumnWidth = width - heroColumnWidth - 44;

  drawLabel(ctx, x, y, localized(locale, "规范 / 可分享", "CANONICAL / SHARE READY"), {
    fillStyle: "rgba(124, 255, 102, 0.14)",
    strokeStyle: "rgba(124, 255, 102, 0.3)",
    textStyle: "#c9ffb8",
    width: 354,
  });

  drawLabel(ctx, x + 370, y, "1080 × 1350", {
    fillStyle: "rgba(255, 255, 255, 0.04)",
    strokeStyle: "rgba(255, 255, 255, 0.12)",
    textStyle: "rgba(241, 255, 242, 0.82)",
    width: 286,
  });

  drawLabel(ctx, x + 672, y, "X / TG / WECHAT", {
    fillStyle: "rgba(255, 255, 255, 0.04)",
    strokeStyle: "rgba(255, 255, 255, 0.12)",
    textStyle: "rgba(241, 255, 242, 0.82)",
    width: 324,
  });

  ctx.save();
  ctx.shadowColor = "rgba(124, 255, 102, 0.24)";
  ctx.shadowBlur = 20;
  ctx.fillStyle = "#f3fff2";
  ctx.textBaseline = "top";
  ctx.font = `700 150px ${TITLE_FONT}`;
  ctx.fillText(hero.title, x, y + 84);

  ctx.fillStyle = "#7cff66";
  ctx.font = `700 92px ${TITLE_FONT}`;
  ctx.fillText("Green Book", x, y + 234);
  ctx.restore();

  drawWrappedText(ctx, share.subtitle, x, y + 342, heroColumnWidth * 0.88, locale, {
    font: `500 42px ${TITLE_FONT}`,
    fillStyle: "rgba(236, 255, 237, 0.84)",
    lineHeight: 56,
  });

  drawWrappedText(ctx, hero.lead, x, y + 430, heroColumnWidth * 0.82, locale, {
    font: `500 28px ${TITLE_FONT}`,
    fillStyle: "rgba(236, 255, 237, 0.62)",
    lineHeight: 40,
  });

  drawLabel(ctx, x, y + 520, localized(locale, "使用 / 参与 / 学习", "Use / Participate / Learn"), {
    fillStyle: "rgba(124, 255, 102, 0.12)",
    strokeStyle: "rgba(124, 255, 102, 0.24)",
    textStyle: "#d8ffd1",
    width: 234,
  });

  drawLabel(ctx, x + 252, y + 520, "100,000,000,000", {
    fillStyle: "rgba(255, 255, 255, 0.04)",
    strokeStyle: "rgba(255, 255, 255, 0.1)",
    textStyle: "rgba(241, 255, 242, 0.9)",
    width: 286,
  });

  drawLabel(ctx, x + 552, y + 520, "4:5 / PNG / Ready", {
    fillStyle: "rgba(255, 255, 255, 0.04)",
    strokeStyle: "rgba(255, 255, 255, 0.1)",
    textStyle: "rgba(241, 255, 242, 0.82)",
    width: 254,
  });

  quickFacts.forEach((fact, index) => {
    const cardY = y + 74 + index * 120;
    const cardHeight = 108;

    ctx.save();
    const cardGradient = ctx.createLinearGradient(factsColumnX, cardY, factsColumnX + factsColumnWidth, cardY + cardHeight);
    cardGradient.addColorStop(0, "rgba(255, 255, 255, 0.05)");
    cardGradient.addColorStop(1, "rgba(255, 255, 255, 0.025)");
    ctx.fillStyle = cardGradient;
    ctx.strokeStyle = "rgba(124, 255, 102, 0.12)";
    ctx.lineWidth = 1.5;
    fillRoundedRect(ctx, factsColumnX, cardY, factsColumnWidth, cardHeight, 28);
    strokeRoundedRect(ctx, factsColumnX, cardY, factsColumnWidth, cardHeight, 28);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = index === 1 ? "rgba(124, 255, 102, 0.16)" : "rgba(255, 255, 255, 0.05)";
    ctx.strokeStyle = "rgba(124, 255, 102, 0.18)";
    ctx.lineWidth = 1.5;
    fillRoundedRect(ctx, factsColumnX + 18, cardY + 18, 104, 42, 999);
    strokeRoundedRect(ctx, factsColumnX + 18, cardY + 18, 104, 42, 999);
    ctx.fillStyle = index === 1 ? "#9bff81" : "rgba(241, 255, 242, 0.82)";
    ctx.font = `600 20px ${TITLE_FONT}`;
    ctx.textBaseline = "middle";
    ctx.fillText(fact.label, factsColumnX + 38, cardY + 39);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = index === 1 ? "#7cff66" : "#f4fff4";
    ctx.font = index === 1 ? `700 32px ${MONO_FONT}` : `700 30px ${MONO_FONT}`;
    ctx.textBaseline = "top";
    ctx.fillText(fact.value, factsColumnX + 18, cardY + 70);
    ctx.restore();

    drawWrappedText(ctx, fact.body, factsColumnX + factsColumnWidth - 230, cardY + 24, 210, locale, {
      font: `500 18px ${TITLE_FONT}`,
      fillStyle: "rgba(236, 255, 237, 0.66)",
      lineHeight: 24,
    });
  });
}

function drawSimpleShareCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  content: GreenBookPosterContent,
  locale: Locale
) {
  const { share, quickFacts } = content;
  const bullets = share.bullets.slice(0, 3);

  ctx.save();
  ctx.fillStyle = "rgba(3, 8, 4, 0.82)";
  ctx.strokeStyle = "rgba(124, 255, 102, 0.18)";
  ctx.lineWidth = 2;
  fillRoundedRect(ctx, x, y, width, height, 42);
  strokeRoundedRect(ctx, x, y, width, height, 42);
  ctx.restore();

  drawLabel(ctx, x + 28, y + 28, localized(locale, "可分享", "SHARE READY"), {
    fillStyle: "rgba(124, 255, 102, 0.14)",
    strokeStyle: "rgba(124, 255, 102, 0.28)",
    textStyle: "#d8ffd1",
    width: 194,
  });

  drawLabel(ctx, x + width - 274, y + 28, "1080 × 1350", {
    fillStyle: "rgba(255,255,255,0.04)",
    strokeStyle: "rgba(255,255,255,0.12)",
    textStyle: "rgba(241,255,242,0.82)",
    width: 246,
  });

  ctx.save();
  ctx.fillStyle = "rgba(124,255,102,0.88)";
  ctx.font = `700 26px ${MONO_FONT}`;
  ctx.fillText(localized(locale, "72H 绿书", "72H GREEN BOOK"), x + 28, y + 118);

  ctx.fillStyle = "#f4fff4";
  ctx.font = `700 150px ${TITLE_FONT}`;
  ctx.fillText("72H", x + 28, y + 152);

  ctx.fillStyle = "#7cff66";
  ctx.font = `700 102px ${TITLE_FONT}`;
  ctx.fillText(localized(locale, "绿书", "Green Book"), x + 28, y + 278);
  ctx.restore();

  drawWrappedText(ctx, share.subtitle, x + 28, y + 404, width - 56, locale, {
    font: `500 34px ${TITLE_FONT}`,
    fillStyle: "rgba(236,255,237,0.82)",
    lineHeight: 46,
  });

  const factY = y + 506;
  const factWidth = (width - 72) / 2;
  quickFacts.forEach((fact, index) => {
    const factX = x + 28 + (index % 2) * (factWidth + 16);
    const rowY = factY + Math.floor(index / 2) * 118;
    const actualWidth = index === 2 ? width - 56 : factWidth;

    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1.4;
    fillRoundedRect(ctx, factX, rowY, actualWidth, 96, 24);
    strokeRoundedRect(ctx, factX, rowY, actualWidth, 96, 24);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "rgba(236,255,237,0.46)";
    ctx.font = `600 18px ${TITLE_FONT}`;
    ctx.fillText(fact.label, factX + 20, rowY + 20);
    ctx.fillStyle = "#f4fff4";
    ctx.font = `700 30px ${TITLE_FONT}`;
    ctx.fillText(fact.value, factX + 20, rowY + 52);
    ctx.restore();
  });

  const bulletStartY = y + 770;
  bullets.forEach((bullet, index) => {
    const rowY = bulletStartY + index * 108;

    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1.4;
    fillRoundedRect(ctx, x + 28, rowY, width - 56, 88, 24);
    strokeRoundedRect(ctx, x + 28, rowY, width - 56, 88, 24);
    ctx.fillStyle = "#7cff66";
    fillRoundedRect(ctx, x + 50, rowY + 37, 12, 12, 999);
    ctx.restore();

    drawWrappedText(ctx, bullet, x + 82, rowY + 24, width - 132, locale, {
      font: `500 26px ${TITLE_FONT}`,
      fillStyle: "rgba(236,255,237,0.84)",
      lineHeight: 34,
    });
  });

  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 28, y + height - 98);
  ctx.lineTo(x + width - 28, y + height - 98);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "rgba(236,255,237,0.58)";
  ctx.font = `500 24px ${TITLE_FONT}`;
  ctx.fillText(content.share.footerNote, x + 28, y + height - 72);
  ctx.fillStyle = "#7cff66";
  ctx.font = `600 20px ${MONO_FONT}`;
  ctx.textAlign = "right";
  ctx.fillText(localized(locale, "可直接分享", "READY TO SHARE"), x + width - 28, y + height - 68);
  ctx.textAlign = "left";
  ctx.restore();
}

function drawHighlightsCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  content: GreenBookPosterContent,
  locale: Locale
) {
  const { useCases } = content;
  const cardHeight = 438;

  ctx.save();
  ctx.fillStyle = "rgba(4, 10, 6, 0.76)";
  ctx.strokeStyle = "rgba(124, 255, 102, 0.16)";
  ctx.lineWidth = 2;
  fillRoundedRect(ctx, x, y, width, cardHeight, 36);
  strokeRoundedRect(ctx, x, y, width, cardHeight, 36);
  ctx.restore();

  drawLabel(ctx, x + 24, y + 24, localized(locale, "三大使用场景", "USE CASES"), {
    fillStyle: "rgba(124, 255, 102, 0.12)",
    strokeStyle: "rgba(124, 255, 102, 0.26)",
    textStyle: "#c9ffb8",
    width: 202,
  });

  ctx.save();
  ctx.fillStyle = "#f4fff4";
  ctx.font = `700 42px ${TITLE_FONT}`;
  ctx.fillText(localized(locale, "三大使用场景", "Three use scenarios"), x + 24, y + 88);
  ctx.fillStyle = "rgba(236, 255, 237, 0.64)";
  ctx.font = `500 24px ${TITLE_FONT}`;
  ctx.fillText(localized(locale, "使用 / 参与 / 学习", "Use / Participate / Learn"), x + 286, y + 96);
  ctx.restore();

  const rowTop = y + 146;
  const rowHeight = 88;
  const rowGap = 12;

  useCases.forEach((item, index) => {
    const rowY = rowTop + index * (rowHeight + rowGap);

    ctx.save();
    const rowGradient = ctx.createLinearGradient(x, rowY, x + width, rowY + rowHeight);
    rowGradient.addColorStop(0, "rgba(255, 255, 255, 0.04)");
    rowGradient.addColorStop(1, "rgba(255, 255, 255, 0.02)");
    ctx.fillStyle = rowGradient;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1.4;
    fillRoundedRect(ctx, x + 24, rowY, width - 48, rowHeight, 24);
    strokeRoundedRect(ctx, x + 24, rowY, width - 48, rowHeight, 24);
    ctx.restore();

    drawLabel(ctx, x + 40, rowY + 22, `${String(index + 1).padStart(2, "0")}`, {
      fillStyle: index === 0 ? "rgba(124, 255, 102, 0.18)" : "rgba(255, 255, 255, 0.04)",
      strokeStyle: "rgba(124, 255, 102, 0.22)",
      textStyle: index === 0 ? "#97ff7e" : "rgba(241, 255, 242, 0.88)",
      width: 82,
      height: 42,
    });

    drawLabel(ctx, x + 140, rowY + 22, item.kicker.toUpperCase(), {
      fillStyle: "rgba(124, 255, 102, 0.1)",
      strokeStyle: "rgba(124, 255, 102, 0.18)",
      textStyle: "#d8ffd1",
      width: 176,
      height: 42,
    });

    ctx.save();
    ctx.fillStyle = "#f4fff4";
    ctx.font = `700 28px ${TITLE_FONT}`;
    ctx.fillText(item.title, x + 140, rowY + 58);
    ctx.restore();

    drawWrappedText(ctx, item.body, x + 512, rowY + 24, width - 560, locale, {
      font: `500 18px ${TITLE_FONT}`,
      fillStyle: "rgba(236, 255, 237, 0.7)",
      lineHeight: 22,
    });

    ctx.save();
    ctx.strokeStyle = "rgba(124, 255, 102, 0.18)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + width - 104, rowY + 44);
    ctx.lineTo(x + width - 36, rowY + 44);
    ctx.stroke();
    ctx.restore();
  });
}

function drawSupplyCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  content: GreenBookPosterContent,
  locale: Locale
) {
  const { supply } = content;
  const segments = supply.buckets.map((bucket) => ({
    ...bucket,
    color:
      bucket.label === "Shadow Supply"
        ? "rgba(124, 255, 102, 0.9)"
        : bucket.label === "Sale Pool"
          ? "rgba(179, 255, 132, 0.92)"
          : bucket.label === "House Vault"
            ? "rgba(109, 255, 155, 0.9)"
            : bucket.label === "LP Reserve"
              ? "rgba(224, 255, 122, 0.88)"
              : "rgba(95, 255, 179, 0.84)",
  }));

  const cardHeight = 624;

  ctx.save();
  ctx.fillStyle = "rgba(4, 10, 6, 0.82)";
  ctx.strokeStyle = "rgba(124, 255, 102, 0.18)";
  ctx.lineWidth = 2;
  fillRoundedRect(ctx, x, y, width, cardHeight, 36);
  strokeRoundedRect(ctx, x, y, width, cardHeight, 36);
  ctx.restore();

  drawLabel(ctx, x + 24, y + 24, localized(locale, "供给模型", "SUPPLY MODEL"), {
    fillStyle: "rgba(124, 255, 102, 0.12)",
    strokeStyle: "rgba(124, 255, 102, 0.24)",
    textStyle: "#c9ffb8",
    width: 214,
  });

  drawLabel(ctx, x + width - 174, y + 24, localized(locale, "100% 固定", "100% FIXED"), {
    fillStyle: "rgba(255, 255, 255, 0.04)",
    strokeStyle: "rgba(255, 255, 255, 0.1)",
    textStyle: "rgba(241, 255, 242, 0.86)",
    width: 150,
  });

  ctx.save();
  ctx.fillStyle = "#f4fff4";
  ctx.font = `700 42px ${TITLE_FONT}`;
  ctx.fillText(localized(locale, "固定总量 100,000,000,000 72H", "Fixed total supply of 100,000,000,000 72H"), x + 24, y + 88);

  ctx.fillStyle = "rgba(236, 255, 237, 0.72)";
  ctx.font = `500 24px ${TITLE_FONT}`;
  ctx.fillText(supply.note, x + 24, y + 140);

  ctx.fillStyle = "#7cff66";
  ctx.font = `700 76px ${MONO_FONT}`;
  ctx.fillText(supply.totalSupply, x + 24, y + 188);
  ctx.restore();

  const barX = x + 24;
  const barY = y + 294;
  const barWidth = width - 48;
  const barHeight = 26;

  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  fillRoundedRect(ctx, barX, barY, barWidth, barHeight, 999);
  ctx.restore();

  let currentX = barX;
  segments.forEach((segment, index) => {
    const segmentWidth =
      index === segments.length - 1
        ? barX + barWidth - currentX
        : Math.max(18, Math.round((barWidth * segment.share) / 100));

    ctx.save();
    ctx.fillStyle = segment.color;
    fillRoundedRect(ctx, currentX, barY, segmentWidth, barHeight, 999);
    ctx.restore();

    currentX += segmentWidth;
  });

  const rowStartY = y + 350;
  const leftColumnX = x + 24;
  const rightColumnX = x + width * 0.52;
  const rowWidth = width * 0.44;

  segments.forEach((segment, index) => {
    const columnX = index < 3 ? leftColumnX : rightColumnX;
    const rowIndex = index < 3 ? index : index - 3;
    const rowY = rowStartY + rowIndex * 84;

    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1.4;
    fillRoundedRect(ctx, columnX, rowY, rowWidth, 66, 22);
    strokeRoundedRect(ctx, columnX, rowY, rowWidth, 66, 22);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = segment.color;
    fillRoundedRect(ctx, columnX + 16, rowY + 25, 12, 12, 999);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "#f4fff4";
    ctx.font = `600 24px ${TITLE_FONT}`;
    ctx.fillText(segment.label, columnX + 38, rowY + 16);

    ctx.fillStyle = "rgba(236, 255, 237, 0.74)";
    ctx.font = `500 20px ${MONO_FONT}`;
    ctx.fillText(segment.value, columnX + 38, rowY + 40);

    ctx.fillStyle = "rgba(124, 255, 102, 0.95)";
    ctx.font = `600 20px ${MONO_FONT}`;
    ctx.textAlign = "right";
    ctx.fillText(`${segment.share}%`, columnX + rowWidth - 18, rowY + 31);
    ctx.textAlign = "left";
    ctx.restore();
  });
}

function drawFooter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  content: GreenBookPosterContent
) {
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "rgba(236, 255, 237, 0.74)";
  ctx.font = `500 26px ${TITLE_FONT}`;
  ctx.textBaseline = "top";
  ctx.fillText(content.share.footerNote, x, y + 24);

  ctx.fillStyle = "#7cff66";
  ctx.font = `600 22px ${MONO_FONT}`;
  ctx.fillText(content.share.canonicalUrl, x, y + 72);

  ctx.fillStyle = "rgba(236, 255, 237, 0.54)";
  ctx.font = `500 18px ${TITLE_FONT}`;
  ctx.textAlign = "right";
  ctx.fillText("Optimized for X / Telegram / WeChat", x + width, y + 40);
  ctx.textAlign = "left";
  ctx.restore();
}

function buildGreenBookPosterCanvas(locale: Locale = "zh-CN") {
  ensureBrowserEnvironment();
  const content = getGreenBookContent(locale);

  const canvas = document.createElement("canvas");
  canvas.width = POSTER_WIDTH;
  canvas.height = POSTER_HEIGHT;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to create a 2D canvas context for the Green Book card.");
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.textAlign = "left";
  context.textBaseline = "top";

  drawPosterBackground(context, POSTER_WIDTH, POSTER_HEIGHT);
  drawSimpleShareCard(context, 92, 84, POSTER_WIDTH - 184, 1820, content, locale);

  return canvas;
}

function dataUrlToBlob(dataUrl: string) {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = header.match(/data:(.*?);base64/);
  const mimeType = mimeMatch?.[1] ?? "image/png";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mimeType });
}

async function canvasToBlob(canvas: HTMLCanvasElement) {
  if (typeof canvas.toBlob === "function") {
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((candidate) => {
        if (candidate) {
          resolve(candidate);
          return;
        }

        reject(new Error("Unable to serialize the Green Book card."));
      }, "image/png", 1);
    });
  }

  return dataUrlToBlob(canvas.toDataURL("image/png"));
}

async function buildGreenBookPosterAsset(locale: Locale = "zh-CN") {
  ensureBrowserEnvironment();
  await ensureCanvasFontsReady();

  const canvas = buildGreenBookPosterCanvas(locale);
  const blob = await canvasToBlob(canvas);
  const file = typeof File === "function" ? new File([blob], POSTER_FILE_NAME, { type: blob.type || "image/png" }) : null;

  return {
    blob,
    file,
    fileName: POSTER_FILE_NAME,
  };
}

function triggerDownload(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.rel = "noreferrer";
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 3000);
}

async function writeClipboardText(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall back to the legacy clipboard path below.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    throw new Error("Clipboard copy failed.");
  }
}

export async function downloadGreenBookPoster(locale: Locale = "zh-CN"): Promise<GreenBookExportFeedback> {
  ensureBrowserEnvironment();
  const asset = await buildGreenBookPosterAsset(locale);
  triggerDownload(asset.blob, asset.fileName);

  return {
    message: locale === "en-US" ? "The card has been generated and started downloading." : "卡片已生成并开始下载。",
  };
}

export async function shareGreenBookPoster(locale: Locale = "zh-CN"): Promise<GreenBookExportFeedback> {
  ensureBrowserEnvironment();
  const asset = await buildGreenBookPosterAsset(locale);
  const content = getGreenBookContent(locale);
  const sharePayload = {
    title: content.share.title,
    text: content.share.shareText,
    url: content.share.canonicalUrl,
    files: asset.file ? [asset.file] : undefined,
  };

  if (typeof navigator.share === "function") {
    let canShareFiles = false;
    try {
      canShareFiles =
        Boolean(asset.file) &&
        (typeof navigator.canShare !== "function" || navigator.canShare(sharePayload));
    } catch {
      canShareFiles = false;
    }

    if (canShareFiles) {
      await navigator.share(sharePayload);
      return {
        message: locale === "en-US" ? "The system share sheet has opened." : "已打开系统分享面板。",
      };
    }
  }

  let clipboardCopied = false;
  try {
    await writeClipboardText(content.share.canonicalUrl);
    clipboardCopied = true;
  } catch {
    clipboardCopied = false;
  }

  triggerDownload(asset.blob, asset.fileName);

  return {
    message: clipboardCopied
      ? locale === "en-US"
        ? "This device does not support file sharing, so the card was downloaded and the link copied."
        : "当前设备不支持文件分享，已下载卡片并复制链接。"
      : locale === "en-US"
        ? "This device does not support file sharing, so the card was downloaded."
        : "当前设备不支持文件分享，已下载卡片。",
  };
}

export async function copyGreenBookLink(locale: Locale = "zh-CN"): Promise<GreenBookExportFeedback> {
  ensureBrowserEnvironment();
  const content = getGreenBookContent(locale);
  await writeClipboardText(content.share.canonicalUrl);

  return {
    message: locale === "en-US" ? "The Green Book link has been copied to the clipboard." : "绿书链接已复制到剪贴板。",
  };
}
