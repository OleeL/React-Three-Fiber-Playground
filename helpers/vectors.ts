import { Vector2, Vector3, Euler } from "three";

export const distanceN = (
        x1: number,
        x2: number,
        y1: number,
        y2: number,
        z1?: number,
        z2?: number
        ): number=> {
    if (z1 && z2) return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export const distance = (
        p: Vector2
         | Vector3
         | Euler,
        q: Vector2
         | Vector3
         | Euler
        ): number => {
    if (p instanceof Vector3 && q instanceof Vector3)
        return Math.sqrt(Math.pow(q.x - p.x, 2) + Math.pow(q.y - p.y, 2) + Math.pow(q.z - p.z, 2));
    if (p instanceof Euler && q instanceof Euler)
        return Math.sqrt(Math.pow(q.x - p.x, 2) + Math.pow(q.y - p.y, 2) + Math.pow(q.z - p.z, 2));
    return Math.sqrt(Math.pow(q.x - p.x, 2) + Math.pow(q.y - p.y, 2));
}

export const mod = (n: number, m: number): number => ((n % m) + m) % m;