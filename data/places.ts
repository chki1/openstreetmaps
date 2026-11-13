// Газрын зураг дээр marker-ээр тэмдэглэх цэгүүд.
// Шинэ цэг нэмэх бол энэ жагсаалтад нэг мөр нэмэхэд хангалттай.
// lat = өргөрөг (latitude), lng = уртраг (longitude), аравтын бутархай градусаар.

export type Place = {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
};

export const PLACES: Place[] = [
  {
    id: "Mrpltz",
    name: "Marienplatz",
    description: "S-TIER PLACE IN MUNICH",
    lat: 48.1373,
    lng: 11.5755,
  },
  {
    id: "gandan",
    name: "Гандантэгчинлэн хийд",
    description: "Монголын томоохон буддын хийдүүдийн нэг.",
    lat: 47.92306,
    lng: 106.895,
  },
  {
    id: "choijin-lama",
    name: "Чойжин ламын сүм музей",
    description: "1904–1908 онд баригдсан сүм, одоо музей.",
    lat: 47.915,
    lng: 106.91833,
  },
  {
    id: "bogd-khan-palace",
    name: "Богд хааны ордон музей",
    description: "Богд хааны өвлийн ордон, одоо музей.",
    lat: 47.8975,
    lng: 106.90667,
  },
  {
    id: "zaisan",
    name: "Зайсан толгой",
    description: "Хотын өмнөд хэсэгт, хотыг бүхэлд нь харах дурсгалт цогцолбор.",
    lat: 47.88417,
    lng: 106.91583,
  },
];
