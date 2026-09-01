export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  photo: string;
  position: string;
};

// Static for now — when this moves to a CMS/admin panel, this array gets
// replaced by a fetch call. Nothing else in the site needs to change,
// since both the homepage marquee and /testimonials page import from here.
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I had the privilege of working with Pera for several years during my time with the Black Ferns Sevens, where he served as my Strength and Conditioning Coach. Throughout that period, he consistently prepared me to perform at the highest level of international rugby.",
    name: "Sarah Hirini (Goss)",
    role: "Black Ferns Sevens",
    photo: "/testimonials/Sarah Hirini.jpeg",
    position: "50% 20%",
  },
  {
    quote:
      "I had the privilege of being coached by Pera across the 2021, 2022 and 2023 ANZ Premiership seasons as well as between seasons leading into Silver Ferns campaigns. These results gained me selection for the 2022 Commonwealth Games and the 2023 Netball World Cup.",
    name: "Grace Nweke",
    role: "Silver Fern",
    photo: "/testimonials/Grace.jpg",
    position: "50% 15%",
  },
  {
    quote:
      "I have been lucky enough to work with Pera over many stages through both my amateur and professional rugby career. He's clearly very well educated and confident in what he is teaching is right for me specifically at that time as his messaging around what we do and why we do it is always super clear.",
    name: "Brad Weber",
    role: "All Black",
    photo: "/testimonials/Brad Weber.jpg",
    position: "50% 20%",
  },
  {
    quote:
      "I've known Pera for over 20 years and have jumped into plenty of sessions with him over that time, so I've seen first-hand how he operates. He's got an unreal growth mindset and is seriously competitive. His energy rubs off on those around him and undoubtedly brings out the best in people.",
    name: "Jamison Gibson-Park",
    role: "Irish International Rugby | Leinster Rugby",
    photo: "/testimonials/Jamison Gibson Park.webp",
    position: "50% 15%",
  },
  {
    quote:
      "Before training with Pera I felt pretty fit and decent at footy. After working together I noticed I wasn't as fit or as skilled as I thought, and his attention to detail and ability to teach skillsets is impressive.",
    name: "Harry Speight",
    role: "North Harbour Club Rugby",
    photo: "/testimonials/Harry Speight.jpg",
    position: "50% 20%",
  },
];