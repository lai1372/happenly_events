import { addDoc, collection } from "firebase/firestore";
import { db } from "../src/core/firebase/client";

const events = [
  {
    categoryId: "arts",
    createdAt: "17 December 2025 at 10:05:18 UTC",
    date: "2025-07-10",
    title: "Evening Life Drawing",
    description:
      "Life drawing session with a live model in an informal studio setting.",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2340&auto=format&fit=crop",
    imageDescription:
      "Sketchbooks and pencils arranged around a life drawing studio.",
    location: "Northern Quarter, Manchester",
  },
  {
    categoryId: "food_and_drink",
    createdAt: "18 December 2025 at 14:41:02 UTC",
    date: "2025-06-22",
    title: "Seasonal Supper",
    description: "Pop-up supper club celebrating seasonal British produce.",
    imageUrl:
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=2340&auto=format&fit=crop",
    imageDescription: "Communal dining table with seasonal dishes and candles.",
    location: "Hackney Wick, London",
  },
  {
    categoryId: "health_and_wellbeing",
    createdAt: "19 December 2025 at 08:19:44 UTC",
    date: "2025-07-06",
    title: "Slow Sunday Breathwork",
    description:
      "Guided breathwork and meditation session suitable for beginners.",
    imageUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2340&auto=format&fit=crop",
    imageDescription: "Person meditating outdoors on a calm summer morning.",
    location: "Sefton Park, Liverpool",
  },
  {
    categoryId: "music",
    createdAt: "20 December 2025 at 21:02:11 UTC",
    date: "2025-08-01",
    title: "New Sounds Night",
    description:
      "Intimate live gig featuring emerging indie and alternative artists.",
    imageUrl:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2340&auto=format&fit=crop",
    imageDescription:
      "Small venue stage lit with warm lights during a live performance.",
    location: "The Exchange, Bristol",
  },
  {
    categoryId: "arts",
    createdAt: "21 December 2025 at 12:56:33 UTC",
    date: "2025-09-12",
    title: "Cut & Paste Collage",
    description:
      "Hands-on collage workshop using found materials and print ephemera.",
    imageUrl:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=2340&auto=format&fit=crop",
    imageDescription:
      "Hands cutting paper and arranging collage materials on a table.",
    location: "The Tetley, Leeds",
  },
];

export async function seedEvents() {
  const eventsRef = collection(db, "events");

  for (const event of events) {
    await addDoc(eventsRef, event);
  }
}
