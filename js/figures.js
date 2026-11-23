/* Навчальні схеми. Не копії змагальних карт. */
(function () {
  const NS = "http://www.w3.org/2000/svg";

  function el(name, attrs, parent) {
    const node = document.createElementNS(NS, name);
    Object.entries(attrs || {}).forEach(function (pair) {
      node.setAttribute(pair[0], pair[1]);
    });
    if (parent) parent.appendChild(node);
    return node;
  }

  function svg(w, h, label) {
    const node = el("svg", { viewBox: "0 0 " + w + " " + h, width: String(w), height: String(h), role: "img" });
    if (label) node.setAttribute("aria-label", label);
    else node.setAttribute("aria-hidden", "true");
    return node;
  }

  function paper(node, w, h) {
    el("rect", { x: 0, y: 0, width: w, height: h, rx: 10, fill: "#f6f1e4" }, node);
  }

  function iconInner(name, node) {
    if (name === "path") {
      el("path", { d: "M12 40 H68", stroke: "#1a1a1a", "stroke-width": 2, "stroke-dasharray": "5 4", fill: "none" }, node);
    } else if (name === "road") {
      el("path", { d: "M10 40 H70", stroke: "#1a1a1a", "stroke-width": 7, fill: "none" }, node);
    } else if (name === "stream") {
      el("path", { d: "M14 18 C30 32 26 50 46 46 S64 28 68 62", stroke: "#2c6fbf", "stroke-width": 2.6, fill: "none" }, node);
    } else if (name === "contour") {
      el("path", { d: "M12 52 Q40 16 68 52", stroke: "#8a5a32", "stroke-width": 1.8, fill: "none" }, node);
    } else if (name === "boulder") {
      el("circle", { cx: 40, cy: 40, r: 5, fill: "#1a1a1a" }, node);
    } else if (name === "building") {
      el("rect", { x: 24, y: 26, width: 32, height: 24, fill: "#1a1a1a" }, node);
    } else if (name === "marsh") {
      [28, 36, 44, 52].forEach(function (y, row) {
        for (let x = 18 + (row % 2) * 8; x < 66; x += 16) {
          el("path", { d: "M" + x + " " + y + " h8", stroke: "#2c6fbf", "stroke-width": 1.6 }, node);
        }
      });
    } else if (name === "fence") {
      el("path", { d: "M12 40 H68", stroke: "#1a1a1a", "stroke-width": 1.8 }, node);
      for (let x = 18; x <= 64; x += 8) {
        el("path", { d: "M" + x + " 40 V32", stroke: "#1a1a1a", "stroke-width": 1.6 }, node);
      }
    } else if (name === "cliff") {
      el("path", { d: "M14 34 H66", stroke: "#1a1a1a", "stroke-width": 2 }, node);
      for (let x = 20; x <= 60; x += 8) {
        el("path", { d: "M" + x + " 34 L" + (x + 4) + " 46", stroke: "#1a1a1a", "stroke-width": 1.5 }, node);
      }
    } else if (name === "pit") {
      el("path", { d: "M28 30 L40 52 L52 30", fill: "none", stroke: "#8a5a32", "stroke-width": 2 }, node);
      el("path", { d: "M40 44 V54", stroke: "#8a5a32", "stroke-width": 1.5 }, node);
    } else if (name === "knoll") {
      el("ellipse", { cx: 40, cy: 40, rx: 16, ry: 11, fill: "none", stroke: "#8a5a32", "stroke-width": 1.8 }, node);
    } else if (name === "start") {
      el("polygon", { points: "40,18 22,58 58,58", fill: "none", stroke: "#8e2f9b", "stroke-width": 2.4 }, node);
    } else if (name === "control") {
      el("circle", { cx: 40, cy: 40, r: 16, fill: "none", stroke: "#8e2f9b", "stroke-width": 2.4 }, node);
    } else if (name === "finish") {
      el("circle", { cx: 40, cy: 40, r: 18, fill: "none", stroke: "#8e2f9b", "stroke-width": 2.2 }, node);
      el("circle", { cx: 40, cy: 40, r: 11, fill: "none", stroke: "#8e2f9b", "stroke-width": 2.2 }, node);
    } else if (name === "thicket") {
      el("path", { d: "M16 50 C24 24 56 22 64 48 C56 62 24 64 16 50Z", fill: "#2f6b34" }, node);
    } else if (name === "clearing") {
      el("rect", { x: 16, y: 22, width: 48, height: 36, fill: "#f2d24b" }, node);
    } else if (name === "forest") {
      el("rect", { x: 16, y: 22, width: 48, height: 36, fill: "#f7f4ee", stroke: "#c8b89a" }, node);
    } else if (name === "water") {
      el("path", { d: "M18 46 C30 28 50 58 62 34 C58 58 28 62 18 46Z", fill: "#7eb0e6", stroke: "#2c6fbf" }, node);
    } else if (name === "forbidden") {
      el("rect", { x: 16, y: 22, width: 48, height: 36, fill: "#6d6a32" }, node);
    } else if (name === "contours-close") {
      [26, 34, 42, 50].forEach(function (y) {
        el("path", { d: "M14 " + y + " Q40 " + (y - 8) + " 66 " + y, fill: "none", stroke: "#8a5a32", "stroke-width": 1.5 }, node);
      });
    } else if (name === "contours-wide") {
      [24, 40, 56].forEach(function (y) {
        el("path", { d: "M14 " + y + " Q40 " + (y - 6) + " 66 " + y, fill: "none", stroke: "#8a5a32", "stroke-width": 1.5 }, node);
      });
    } else if (name === "compass") {
      el("circle", { cx: 40, cy: 42, r: 20, fill: "none", stroke: "#1f4a38", "stroke-width": 1.4 }, node);
      el("path", { d: "M40 24 L44 42 L40 38 L36 42 Z", fill: "#b42318" }, node);
      el("path", { d: "M40 60 L36 42 L40 46 L44 42 Z", fill: "#f4f1ea", stroke: "#1f4a38" }, node);
      el("text", { x: 36, y: 18, "font-size": 10, fill: "#1f4a38", "font-family": "Arial, sans-serif" }, node).textContent = "Пн";
    }
  }

  function icon(name, caption) {
    const wrap = document.createElement("figure");
    wrap.className = "fig-frame fig-icon";
    const node = svg(80, 80, caption || "Умовний знак");
    paper(node, 80, 80);
    iconInner(name, node);
    wrap.appendChild(node);
    if (caption) {
      const cap = document.createElement("figcaption");
      cap.className = "fig-caption";
      cap.textContent = caption;
      wrap.appendChild(cap);
    }
    return wrap;
  }

  function swatch(color, caption) {
    const wrap = document.createElement("figure");
    wrap.className = "fig-frame fig-swatch";
    const node = svg(160, 72, caption || "Зразок кольору");
    el("rect", { x: 8, y: 10, width: 144, height: 52, rx: 8, fill: color, stroke: "#c8b89a" }, node);
    wrap.appendChild(node);
    if (caption) {
      const cap = document.createElement("figcaption");
      cap.className = "fig-caption";
      cap.textContent = caption;
      wrap.appendChild(cap);
    }
    return wrap;
  }

  function profile(shape) {
    const node = svg(140, 64, "Профіль висоти");
    paper(node, 140, 64);
    el("path", { d: "M12 50 H128", stroke: "#c8b89a", "stroke-width": 1 }, node);
    const paths = {
      overhill: "M16 46 C40 44 50 16 70 16 C90 16 100 46 124 46",
      flat: "M16 34 H124",
      down: "M16 18 C50 20 90 40 124 48",
      up: "M16 48 C50 40 90 20 124 18",
      valley: "M16 18 C40 20 50 48 70 48 C90 48 100 20 124 18",
      step: "M16 46 H50 V22 H124",
      upflatdown: "M16 48 C36 24 52 20 70 20 H98 C112 20 118 36 128 48"
    };
    el("path", { d: paths[shape] || paths.flat, fill: "none", stroke: "#1f4a38", "stroke-width": 2.4 }, node);
    return node;
  }

  function arrow(node, x1, y1, x2, y2, color) {
    el("line", { x1: x1, y1: y1, x2: x2, y2: y2, stroke: color, "stroke-width": 2.2 }, node);
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const size = 8;
    const lx = x2 - size * Math.cos(ang - 0.45);
    const ly = y2 - size * Math.sin(ang - 0.45);
    const rx = x2 - size * Math.cos(ang + 0.45);
    const ry = y2 - size * Math.sin(ang + 0.45);
    el("path", { d: "M" + x2 + " " + y2 + " L" + lx + " " + ly + " L" + rx + " " + ry + " Z", fill: color }, node);
  }

  function northArrow(node, x, y) {
    el("path", { d: "M" + x + " " + (y + 16) + " V" + y, stroke: "#1f4a38", "stroke-width": 1.4 }, node);
    el("path", { d: "M" + x + " " + y + " L" + (x - 4) + " " + (y + 7) + " H" + (x + 4) + " Z", fill: "#b42318" }, node);
  }

  function label(node, x, y, text, fill) {
    const t = el("text", {
      x: x,
      y: y,
      "text-anchor": "middle",
      "font-size": 12,
      "font-family": "Arial, sans-serif",
      fill: fill || "#8e2f9b",
      "font-weight": 700
    }, node);
    t.textContent = text;
  }

  function controlRing(node, x, y, text) {
    el("circle", { cx: x, cy: y, r: 8, fill: "#f6f1e4", stroke: "#8e2f9b", "stroke-width": 1.7 }, node);
    label(node, x, y - 12, text);
  }

  function hillRings(node, cx, cy) {
    el("ellipse", { cx: cx, cy: cy + 6, rx: 78, ry: 42, fill: "none", stroke: "#8a5a32", "stroke-width": 1.5 }, node);
    el("ellipse", { cx: cx + 4, cy: cy + 2, rx: 48, ry: 26, fill: "none", stroke: "#8a5a32", "stroke-width": 1.5 }, node);
    el("ellipse", { cx: cx + 8, cy: cy - 2, rx: 22, ry: 12, fill: "none", stroke: "#8a5a32", "stroke-width": 1.5 }, node);
  }

  function sceneSvg(name) {
    const node = svg(240, 160);
    paper(node, 240, 160);
    if (name === "boulder-sides") {
      node.setAttribute("aria-label", "Камінь і три кола пунктів. Північ угорі.");
      northArrow(node, 24, 16);
      label(node, 24, 46, "Пн", "#1f4a38");
      el("circle", { cx: 120, cy: 90, r: 6, fill: "#1a1a1a" }, node);
      controlRing(node, 120, 60, "А");
      controlRing(node, 156, 90, "Б");
      controlRing(node, 120, 122, "В");
    } else if (name === "path-bend") {
      node.setAttribute("aria-label", "Стежка з вигином і три кола.");
      el("path", { d: "M24 124 H110 V40 H220", fill: "none", stroke: "#1a1a1a", "stroke-width": 2, "stroke-dasharray": "5 4" }, node);
      controlRing(node, 60, 124, "А");
      controlRing(node, 110, 124, "Б");
      controlRing(node, 170, 40, "В");
    } else if (name === "stream-cross") {
      node.setAttribute("aria-label", "Стежка, струмок і три кола.");
      el("path", { d: "M16 80 H224", fill: "none", stroke: "#1a1a1a", "stroke-width": 2, "stroke-dasharray": "5 4" }, node);
      el("path", { d: "M156 18 V146", fill: "none", stroke: "#2c6fbf", "stroke-width": 2.4 }, node);
      el("path", { d: "M78 80 V142", fill: "none", stroke: "#1a1a1a", "stroke-width": 2, "stroke-dasharray": "5 4" }, node);
      controlRing(node, 156, 80, "А");
      controlRing(node, 78, 80, "Б");
      el("circle", { cx: 40, cy: 124, r: 4, fill: "#1a1a1a" }, node);
      controlRing(node, 40, 100, "В");
    } else if (name === "summit-foot" || name === "same-contour") {
      hillRings(node, 100, 70);
      label(node, 138, 62, "120", "#8a5a32");
      label(node, 164, 66, "110", "#8a5a32");
      label(node, 188, 100, "100", "#8a5a32");
      if (name === "summit-foot") {
        node.setAttribute("aria-label", "Пагорб. Пункт А на вершині, В на схилі, Б біля підніжжя.");
        controlRing(node, 108, 68, "А");
        controlRing(node, 158, 90, "В");
        controlRing(node, 108, 136, "Б");
      } else {
        node.setAttribute("aria-label", "Два пункти на горизонталі 100.");
        controlRing(node, 36, 100, "А");
        controlRing(node, 164, 100, "Б");
      }
    } else if (name === "two-boulders") {
      node.setAttribute("aria-label", "Малий камінь на заході й більший на сході. Північ угорі.");
      northArrow(node, 24, 16);
      label(node, 24, 46, "Пн", "#1f4a38");
      el("circle", { cx: 64, cy: 96, r: 3.5, fill: "#1a1a1a" }, node);
      el("circle", { cx: 168, cy: 96, r: 7, fill: "#1a1a1a" }, node);
      controlRing(node, 168, 68, "А");
      controlRing(node, 64, 68, "Б");
      controlRing(node, 168, 126, "В");
    } else if (name === "saddle") {
      node.setAttribute("aria-label", "Дві вершини і сідловина між ними.");
      el("ellipse", { cx: 78, cy: 78, rx: 40, ry: 28, fill: "none", stroke: "#8a5a32", "stroke-width": 1.5 }, node);
      el("ellipse", { cx: 78, cy: 76, rx: 18, ry: 12, fill: "none", stroke: "#8a5a32", "stroke-width": 1.5 }, node);
      el("ellipse", { cx: 162, cy: 78, rx: 40, ry: 28, fill: "none", stroke: "#8a5a32", "stroke-width": 1.5 }, node);
      el("ellipse", { cx: 162, cy: 76, rx: 18, ry: 12, fill: "none", stroke: "#8a5a32", "stroke-width": 1.5 }, node);
      controlRing(node, 78, 74, "А");
      controlRing(node, 120, 96, "Б");
      controlRing(node, 162, 74, "В");
    } else if (name === "north-up-summit-low") {
      node.setAttribute("aria-label", "Північ угорі аркуша, а вершина пагорба ближче до нижнього краю.");
      northArrow(node, 28, 14);
      label(node, 28, 44, "Пн", "#1f4a38");
      el("ellipse", { cx: 130, cy: 118, rx: 70, ry: 28, fill: "none", stroke: "#8a5a32", "stroke-width": 1.5 }, node);
      el("ellipse", { cx: 130, cy: 116, rx: 36, ry: 14, fill: "none", stroke: "#8a5a32", "stroke-width": 1.5 }, node);
      label(node, 130, 112, "вершина", "#8a5a32");
      label(node, 130, 36, "підніжжя", "#8a5a32");
    } else if (name === "slope-arrows") {
      while (node.firstChild) node.removeChild(node.firstChild);
      node.setAttribute("viewBox", "0 0 300 160");
      node.setAttribute("width", "300");
      node.setAttribute("height", "160");
      node.setAttribute("aria-label", "Три схеми схилу зі стрілками А, Б і В та висотами в метрах.");
      paper(node, 300, 160);
      function panel(x, title, mode) {
        label(node, x + 40, 24, title, "#241c16");
        el("path", { d: "M" + (x + 8) + " 48 H" + (x + 70), stroke: "#8a5a32", "stroke-width": 1.6, fill: "none" }, node);
        el("path", { d: "M" + (x + 8) + " 112 H" + (x + 70), stroke: "#8a5a32", "stroke-width": 1.6, fill: "none" }, node);
        if (mode === "down") {
          label(node, x + 84, 52, "120", "#8a5a32");
          label(node, x + 84, 116, "100", "#8a5a32");
          arrow(node, x + 40, 58, x + 40, 102, "#d4530a");
        } else if (mode === "up") {
          label(node, x + 84, 52, "120", "#8a5a32");
          label(node, x + 84, 116, "100", "#8a5a32");
          arrow(node, x + 40, 102, x + 40, 58, "#1f4a38");
        } else {
          label(node, x + 84, 52, "110", "#8a5a32");
          label(node, x + 84, 116, "110", "#8a5a32");
          arrow(node, x + 16, 80, x + 64, 80, "#2c6fbf");
        }
      }
      panel(8, "А", "down");
      panel(108, "Б", "up");
      panel(208, "В", "flat");
    } else if (name === "route-thicket") {
      node.setAttribute("aria-label", "Старт, гущавина посередині, стежка зверху і пункт.");
      el("path", { d: "M96 48 C120 20 168 28 176 70 C168 112 112 108 96 48Z", fill: "#2f6b34" }, node);
      el("path", { d: "M36 120 V28 H200 V90", fill: "none", stroke: "#1a1a1a", "stroke-width": 2, "stroke-dasharray": "5 4" }, node);
      el("polygon", { points: "36,120 26,136 46,136", fill: "none", stroke: "#8e2f9b", "stroke-width": 2 }, node);
      controlRing(node, 200, 90, "1");
      label(node, 136, 78, "гущавина", "#f7f4ee");
    } else if (name === "route-marsh") {
      node.setAttribute("aria-label", "Озеро, північна стежка і південний берег через болото.");
      el("path", { d: "M70 50 C110 30 160 40 180 70 C160 110 100 112 70 50Z", fill: "#7eb0e6", stroke: "#2c6fbf" }, node);
      el("path", { d: "M24 36 H210", fill: "none", stroke: "#1a1a1a", "stroke-width": 2, "stroke-dasharray": "5 4" }, node);
      el("path", { d: "M24 128 H210", fill: "none", stroke: "#1a1a1a", "stroke-width": 2, "stroke-dasharray": "5 4" }, node);
      [96, 108, 120].forEach(function (y) {
        el("path", { d: "M40 " + y + " h18 M80 " + y + " h16 M120 " + y + " h14", stroke: "#2c6fbf", "stroke-width": 1.4 }, node);
      });
      label(node, 118, 28, "Пн", "#1f4a38");
      label(node, 118, 146, "Пд", "#1f4a38");
      el("polygon", { points: "24,80 16,94 34,94", fill: "none", stroke: "#8e2f9b", "stroke-width": 2 }, node);
      controlRing(node, 214, 80, "1");
    } else if (name === "route-fence") {
      node.setAttribute("aria-label", "Паркан упоперек із проходом праворуч.");
      el("path", { d: "M16 78 H150", stroke: "#1a1a1a", "stroke-width": 2 }, node);
      for (let x = 24; x <= 146; x += 12) {
        el("path", { d: "M" + x + " 78 V68", stroke: "#1a1a1a", "stroke-width": 1.5 }, node);
      }
      el("path", { d: "M186 78 H224", stroke: "#1a1a1a", "stroke-width": 2 }, node);
      label(node, 168, 74, "прохід", "#1f4a38");
      el("polygon", { points: "40,130 30,146 50,146", fill: "none", stroke: "#8e2f9b", "stroke-width": 2 }, node);
      controlRing(node, 120, 36, "1");
    } else if (name === "route-over-hill" || name === "route-along" || name === "route-down") {
      hillRings(node, 100, 74);
      if (name === "route-over-hill") {
        node.setAttribute("aria-label", "Шлях через вершину пагорба.");
        el("path", { d: "M28 120 L112 66 L196 120", fill: "none", stroke: "#8e2f9b", "stroke-width": 2 }, node);
        el("polygon", { points: "28,120 18,136 38,136", fill: "none", stroke: "#8e2f9b", "stroke-width": 2 }, node);
        controlRing(node, 196, 120, "1");
      } else if (name === "route-along") {
        node.setAttribute("aria-label", "Шлях уздовж однієї горизонталі, без виходу на вершину.");
        el("path", { d: "M36 96 H190", fill: "none", stroke: "#8e2f9b", "stroke-width": 2 }, node);
        el("polygon", { points: "36,96 26,110 46,110", fill: "none", stroke: "#8e2f9b", "stroke-width": 2 }, node);
        controlRing(node, 190, 96, "1");
      } else {
        node.setAttribute("aria-label", "Шлях з вершини до підніжжя.");
        el("path", { d: "M112 66 L104 132", fill: "none", stroke: "#8e2f9b", "stroke-width": 2 }, node);
        el("polygon", { points: "112,58 102,72 122,72", fill: "none", stroke: "#8e2f9b", "stroke-width": 2 }, node);
        controlRing(node, 104, 136, "1");
      }
    }
    return node;
  }

  function north4(order) {
    const grid = document.createElement("div");
    grid.className = "fig-grid";
    const letters = ["А", "Б", "В", "Г"];
    order.forEach(function (deg, index) {
      const fig = document.createElement("figure");
      fig.className = "fig-frame fig-map";
      const node = svg(120, 108, "Схема " + letters[index]);
      paper(node, 120, 108);
      const g = el("g", { transform: "rotate(" + deg + " 60 62)" }, node);
      northArrow(g, 60, 18);
      el("ellipse", { cx: 48, cy: 70, rx: 16, ry: 12, fill: "none", stroke: "#8a5a32", "stroke-width": 1.4 }, g);
      el("ellipse", { cx: 86, cy: 70, rx: 14, ry: 10, fill: "#7eb0e6", stroke: "#2c6fbf" }, g);
      label(node, 16, 18, letters[index], "#241c16");
      fig.appendChild(node);
      grid.appendChild(fig);
    });
    const cap = document.createElement("p");
    cap.className = "fig-caption";
    cap.textContent = "Пагорб коричневим, озеро синім. Червона стрілка — північ на схемі.";
    const wrap = document.createElement("div");
    wrap.appendChild(grid);
    wrap.appendChild(cap);
    return wrap;
  }

  function render(desc) {
    if (!desc) return null;
    if (desc.type === "icon") return icon(desc.name, desc.caption);
    if (desc.type === "swatch") return swatch(desc.color, desc.caption);
    if (desc.type === "profile") {
      const wrap = document.createElement("div");
      wrap.appendChild(profile(desc.shape));
      return wrap;
    }
    if (desc.type === "scene") {
      const wrap = document.createElement("figure");
      wrap.className = "fig-frame fig-map";
      wrap.appendChild(sceneSvg(desc.name));
      if (desc.caption) {
        const cap = document.createElement("figcaption");
        cap.className = "fig-caption";
        cap.textContent = desc.caption;
        wrap.appendChild(cap);
      }
      return wrap;
    }
    if (desc.type === "north4") return north4(desc.order);
    return null;
  }

  window.ORIENT_FIGURES = { render: render };
})();
