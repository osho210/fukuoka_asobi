export interface AreaData {
  id: string;
  name: string;
  path: string;
  center: { x: number; y: number };
}

// 福岡県の主要エリアデータ
// 注: pathは簡略化したSVGパスデータです。実際の地図データはより詳細なものを使用してください。
export const fukuokaAreas: AreaData[] = [
  {
    id: '1',
    name: '福岡市',
    path: 'M100,100 L150,80 L180,120 L160,150 L120,140 Z',
    center: { x: 140, y: 120 }
  },
  {
    id: '2',
    name: '北九州市',
    path: 'M200,50 L250,60 L260,100 L230,110 L210,80 Z',
    center: { x: 230, y: 80 }
  },
  {
    id: '3',
    name: '糸島市',
    path: 'M50,120 L100,100 L120,140 L90,160 L60,150 Z',
    center: { x: 80, y: 130 }
  },
  {
    id: '4',
    name: '太宰府市',
    path: 'M150,150 L180,140 L200,170 L170,190 L140,180 Z',
    center: { x: 170, y: 165 }
  },
  {
    id: '5',
    name: '宗像市',
    path: 'M150,80 L190,70 L210,100 L180,120 L160,100 Z',
    center: { x: 180, y: 95 }
  },
  {
    id: '6',
    name: '久留米市',
    path: 'M130,180 L170,170 L190,210 L150,230 L120,210 Z',
    center: { x: 150, y: 200 }
  },
  {
    id: '7',
    name: '大牟田市',
    path: 'M100,230 L140,220 L160,260 L120,270 L90,250 Z',
    center: { x: 120, y: 245 }
  },
  {
    id: '8',
    name: '飯塚市',
    path: 'M180,120 L220,110 L240,150 L200,170 L170,150 Z',
    center: { x: 200, y: 140 }
  },
  {
    id: '9',
    name: '柳川市',
    path: 'M120,210 L160,200 L180,240 L140,250 L110,230 Z',
    center: { x: 140, y: 225 }
  }
];
