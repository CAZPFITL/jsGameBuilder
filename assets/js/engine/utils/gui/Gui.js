import Tools from "./../helpers/Tools.js";

export default class Gui {
    constructor(app, callback = (fn) => fn()) {
        this.app = app;
        this.get = Gui;
        this.ctx = Gui.createCanvas('gameCanvas');
        this.app.factory.addGameEntity(this);
        callback(()=> {
            this.app.log.registerEvent(
                `New Gui Created`,
                `\x1b[32;1m| \x1b[0mNew \x1b[32;1mApp Gui\x1b[0m Created`
            );
        });
    }

    /**
     * Static
     */
    static createCanvas(id) {
        const canvas = document.getElementById(id);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        return canvas.getContext('2d');
    }

    static isClicked(entity, click, callback) {
        if (!entity) return;
        const {x, y, width, height} = entity;
        if (click.x > x && click.x < x + width && click.y > y && click.y < y + height) {
            callback();
        }
    }

    static isHover(entity, click) {
        const {x, y, width, height} = entity;
        return (
            click.x > x &&
            click.x < x + width &&
            click.y > y &&
            click.y < y + height
        );
    }

    static viewportCoords = ({x, y}, viewport)  => ({
        x: x / viewport.scale[0] + viewport.left,
        y: y / viewport.scale[1] + viewport.top
    })

    static clickCoords = (e, viewport) => ({
        x: e.clientX / viewport.scale[0] + viewport.left,
        y: e.clientY / viewport.scale[1] + viewport.top
    })

    static entityAt(click, collection) {
        if (!collection) return;
        for (let i = 0; i < collection.length; i++) {
            const entity = collection[i];

            if (entity.polygons instanceof Array) {
                const polysIntersect = Gui.isPointInsidePolygon(click, entity.polygons);
                if (polysIntersect)
                    return entity;
            }
        }
    }

    static isPointInsidePolygon = (point, polygon) => {
        let isInside = false;
        let i = 0;
        let j = polygon.length - 1;

        for (; i < polygon.length; j = i++) {
            const x = {
                dividend: (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y),
                divisor: (polygon[j].y - polygon[i].y)
            }
            const condition1 = (polygon[i].y > point.y) !== (polygon[j].y > point.y);
            const condition2 = (point.x < x.dividend / x.divisor + polygon[i].x);

            if (condition1 && condition2) {
                isInside = !isInside;
            }
        }
        return isInside;
    }

    static checkHoverCollection({collection, event, viewport, isHover, isOut, caller}) {
        for (const key in collection) {
            if (
                Gui.isHover(collection[key], {x: event.clientX, y: event.clientY}) ||
                Gui.isHover(collection[key], Gui.viewportCoords(event, viewport))
            ) {
                isHover(key);
            } else {
                if (caller === key) {
                    isOut(key);
                }
            }
        }
    }

    static createPolygon(entity) {
        const shape = entity.shape();
        if (shape.length < 1) return;
        const points = [];
        for (let i = 0; i < shape.length; i++) {
            points.push({
                x: shape[i].x,
                y: shape[i].y
            });
        }
        entity.polygons = points;
    }

    static drawPolygon(ctx, entity) {
        if (entity.polygons.length < 1) return;

        ctx.beginPath();
        ctx.moveTo(entity.polygons[0].x, entity.polygons[0].y);

        for (let i = 1; i < entity.polygons.length; i++) {
            ctx.lineTo(entity.polygons[i].x, entity.polygons[i].y);
        }

        ctx.fillStyle = entity.color ?? '#000';
        ctx.fill();
    }

    static polysIntersect(poly1, poly2) {
        for (let i = 0; i < poly1.length; i++) {
            for (let j = 0; j < poly2.length; j++) {
                const touch = Tools.getIntersection(
                    poly1[i],
                    poly1[(i + 1) % poly1.length],
                    poly2[j],
                    poly2[(j + 1) % poly2.length],
                )
                if (touch) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Screen instantiable objects
     */
    static button({ctx, font, x, y, width, height, text, bg = '#ffffff', color = '#000', stroke = '#000', center = true, widthStroke = 1}) {
        this.square({ctx, x, y, width, height, color: bg, stroke, widthStroke});
        this.text({ctx, font, color, text, x, y, width, height, center});
    }

    static square({ctx, x, y, width, height, color = '#FFF', stroke = false, widthStroke = 1}) {
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.fillStyle = color;
        ctx.fill();
        if (stroke) {
            const cache = ctx.lineWidth;
            ctx.strokeStyle = stroke;
            ctx.lineWidth = widthStroke;
            ctx.stroke();
            ctx.lineWidth = cache;
        }
    }

    static text({ctx, font, color, text, x, y, width, height, center = false}) {
        ctx.font = font;
        ctx.fillStyle = color;
        const xText = x + width / 2 - ctx.measureText(text).width / 2;
        const yText = y + height / 2 + 5;
        ctx.fillText(text, center ? xText : x, center ? yText : y);
        return ctx.measureText(text).width;
    }

    static bar({ctx, x, y, text, cap, fill, height = 10, fillColor, barColor = 'transparent', stroke}, negative = false) {
        const normalizedProgress = fill / (cap / 255);
        const progress = negative ? (cap - fill) : fill

        ctx.fillStyle = barColor;
        ctx.fillRect(x, y, cap, height);
        stroke && (ctx.strokeStyle = stroke);
        stroke && (ctx.strokeRect(x, y, cap, height));

        ctx.fillStyle = fillColor === 'green-red' ?
            `rgb(${normalizedProgress}, ${255 - normalizedProgress}, 0)` :
            'red-green' ? `rgb(${255 - normalizedProgress}, ${normalizedProgress}, 0)` : fillColor;
        ctx.fillRect(x, y, progress, height);


        text && (this.text({ctx, font: '12px Mouse', color: '#000', text, x, y: y - height}));
    }

    static line ({ ctx, x1, y1, x2, y2, color = '#000' }) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.stroke();
    }
}