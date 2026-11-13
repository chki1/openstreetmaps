# /map хуудас — OpenStreetMap + Leaflet (Next.js, TypeScript)

Улаанбаатарын 5 газрыг marker-ээр тэмдэглэсэн газрын зургийн шинэ хуудас.
Газрын зургийн дэвсгэр (tile) нь OpenStreetMap-ийнх, газрын зургийг Leaflet 1.9 зурна.

## Файлууд

```
app/map/page.tsx              ← шинэ хуудас (/map)
components/map/MapLoader.tsx  ← Leaflet-ийг зөвхөн browser дээр ачаална (ssr: false)
components/map/OsmMap.tsx     ← газрын зураг, marker, popup, жагсаалт
components/map/osm-map.css    ← хуудас, marker, жагсаалтын загвар
data/places.ts                ← координатууд (энд шинэ цэг нэмнэ)
```

## Алхам алхмаар (Windows PowerShell)

### 1. Төсөл бэлдэх

Хэрэв `openstreetmaps` төсөл хараахан байхгүй бол шинээр үүсгэнэ:

```powershell
cd F:\dev\projects
npx create-next-app@latest openstreetmaps
```

Асуултад: TypeScript → **Yes**, App Router → **Yes**. Бусдыг default-оор нь үлдээж болно.

Төсөл аль хэдийн байгаа бол энэ алхмыг алгасна.

### 2. Төслийн хавтас руу орох

```powershell
cd F:\dev\projects\openstreetmaps
```

### 3. Leaflet суулгах

```powershell
npm install leaflet@1.9.4
npm install -D @types/leaflet@1.9
```

`@1.9.4` гэж заасан нь чухал: Leaflet 2.x-ийн API өөр (`L.map` гэх мэт функц байхгүй) тул энэ код 1.9 дээр бичигдсэн.

### 4. Файлуудыг хуулах

Zip файлыг төслийн үндсэн хавтас руу задлана:

```powershell
Expand-Archive -Path "$HOME\Downloads\openstreetmaps-map.zip" -DestinationPath .
```

Үр дүнд нь `app\map\page.tsx`, `components\map\...`, `data\places.ts` гарч ирнэ.

> Хэрэв төсөл чинь `src\` хавтас ашигладаг бол (`src\app\...`) `app`, `components`, `data` гурвыг
> `src\` дотор зөөнө. Импортууд харьцангуй замаар бичигдсэн тул өөр юм өөрчлөх шаардлагагүй.

### 5. Ажиллуулах

```powershell
npm run dev
```

Browser дээр **http://localhost:3000/map** нээнэ.
Баруун талын (утсан дээр доорх) жагсаалтаас газар сонгоход газрын зураг тэр цэг рүү нисээд popup нээгдэнэ.

### 6. Build шалгах (заавал биш)

```powershell
npm run build
```

### 7. Нүүр хуудаснаас холбоос нэмэх (заавал биш)

`app\page.tsx` дотор:

```tsx
import Link from "next/link";
// ...
<Link href="/map">Газрын зураг</Link>
```

## Шинэ координат нэмэх

`data\places.ts` дотор жагсаалтад нэг объект нэмнэ:

```ts
{
  id: "national-museum",
  name: "Үндэсний музей",
  description: "Тайлбар энд.",
  lat: 47.92,   // өргөрөг
  lng: 106.91,  // уртраг
},
```

Координат олох арга: openstreetmap.org дээр газар дээр баруун товч дараад **"Show address"** →
зүүн талд lat, lng гарна. Эсвэл URL-ийн `#map=zoom/lat/lng` хэсгээс авна.

## OpenStreetMap ашиглах үед анхаарах зүйлс

- **Attribution заавал**: газрын зургийн буланд "© OpenStreetMap contributors" бичиг харагдах ёстой. Кодонд аль хэдийн орсон — устгаж болохгүй.
- **Referer**: tile.openstreetmap.org нь хүсэлт бүрт Referer толгойг шаарддаг. Browser үүнийг өөрөө явуулдаг; харин `Referrer-Policy: no-referrer` тохиргоо хийвэл tile-ууд блоклогдоно.
- **Ачаалал**: OSM-ийн tile сервер сайн дурынхны зардлаар ажилладаг. Сургалтын болон жижиг төсөлд болно; их хандалттай production сайтад өөр tile үйлчилгээ эсвэл өөрийн tile сервер ашиглах ёстой.

## Асуудал гарвал

| Шинж тэмдэг | Шалтгаан / шийдэл |
|---|---|
| `window is not defined` | `OsmMap`-ийг шууд page дотор import хийсэн байна. Зөвхөн `MapLoader`-оор дамжуулж ашигла. |
| Газрын зураг хоосон/саарал | `leaflet/dist/leaflet.css` import алга, эсвэл `.osm-map`-д өндөр байхгүй. |
| Tile дээр "Referer is required" | Сайтын Referrer-Policy-г `strict-origin-when-cross-origin` болго. |
| `L.map is not a function` | Leaflet 2.x суусан байна → `npm install leaflet@1.9.4` |
