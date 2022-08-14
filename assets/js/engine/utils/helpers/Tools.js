export default class Tools {
    static lerp = (a, b, t) => a + (b - a) * t;

    static random(min, max, floor = false) {
        const r = Math.random() * (max - min) + min;
        return floor ? Math.floor(r) : r;
    }

    static xDec = (n, x = 2) =>
        Math.round(n * Math.pow(10, x)) / Math.pow(10, x);

    static max(arr) {
        let maxByFor = arr[0];
        for (let index = 1; index < arr.length; index++) {
            if (arr[index] > maxByFor) {
                maxByFor = arr[index];
            }
        }
        return maxByFor;
    }

    static getIntersection(A, B, C, D) {
        const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
        const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
        const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
        // in case something misfunction I changed this != to !==
        if (bottom !== 0) {
            const t = tTop / bottom;
            const u = uTop / bottom;
            if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
                return {
                    x: Tools.lerp(A.x, B.x, t),
                    y: Tools.lerp(A.y, B.y, t),
                    offset: t
                }
            }
        }

        return null;
    };
}