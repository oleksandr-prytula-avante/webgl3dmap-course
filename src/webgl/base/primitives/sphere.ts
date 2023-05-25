import { IPoint, IPrimitive } from "@/interfaces/IPrimitive";

export function sphere(radius: number, sectorCount: number, stackCount: number, center: IPoint = [0, 0, 0]): IPrimitive {
  const sectorStep = 2 * Math.PI / sectorCount;
  const stackStep = Math.PI / stackCount;
  const points: number[] = [];
  const normals: number[] = [];
  const indexes: number[] = [];
  const [cx, cy, cz] = center;

  for(let i = 0; i <= stackCount; ++i) {
    const stackAngle = Math.PI / 2 - i * stackStep;

    const xy = radius * Math.cos(stackAngle);             // r * cos(u)
    const z = cz + radius * Math.sin(stackAngle);              // r * sin(u)

    for(let j = 0; j <= sectorCount; ++j)
    {
      const  sectorAngle = j * sectorStep;           // starting from 0 to 2pi
      const x = cx + xy * Math.cos(sectorAngle);             // r * cos(u) * cos(v)
      const y = cy + xy * Math.sin(sectorAngle);             // r * cos(u) * sin(v)

      points.push(x, y, z);
      normals.push(x, y, z);
    }
  }

  for(let i = 0; i < stackCount; ++i){
    let k1 = i * (sectorCount + 1);     // beginning of current stack
    let k2 = k1 + sectorCount + 1;      // beginning of next stack

    for(let j = 0; j < sectorCount; ++j, ++k1, ++k2)
    {
        // 2 triangles per sector excluding first and last stacks
        // k1 => k2 => k1+1
        if(i != 0){
          indexes.push(k1, k2, k1 + 1);
        }

        // k1+1 => k2 => k2+1
        if(i != (stackCount-1)) {
          indexes.push(k1 + 1, k2, k2 + 1);
        }
    }
  }

  const sphere: IPrimitive = {
    points,
    indexes,
    normals,
  }

  return sphere;
}
