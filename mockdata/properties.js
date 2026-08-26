const fallbackImageSets = [
  [
    "https://imgs.search.brave.com/zbZgWFkh9JztzH2AVfaBiCkFnXDAN9QvodMPxnugs8g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRpYS5pc3RvY2twaG90/by5jb20vaWQvMTQxMDcwMDQ4Mi9waG90/by9iZWF1dGlmdWwtZmFtaWx5LWhvdXNlLW9uLXRoZS1oaWxsLWV4dGVyaW9yLXZpZXctb2YtYS1tb2Rlcm4taG91c2UuanBnP3M9NjEyeDYxMiZ3PTAmaz0yMCZjPVVDc2tGOTFJYVZDMmZ4ZnF3TzVGbXF3dDhuVmhSSWtsWS1rSHd5bzlROHM9",
    "https://imgs.search.brave.com/M4oSIhEmzF8ttjIojbpq-6BV_FumZv8pCKqRHOLKZPQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGhlc3BydWNlLmNv/bS90aG1iLzBoTzI1/dVE5eFF2dGhZRVM3/MVh6WUNhRHFHaz0v/MTUwMHgwL2ZpbHRl/cnM6bm9fdXBzY2Fs/ZSgpOm1heF9ieXRl/cygxNTAwMDApOnN0/cmlwX2ljYygpOmZv/cm1hdCh3ZWJwKS9C/ZWRyb29tc0xlYW5u/ZUZvcmRJbnRlcmlv/cnMtOWMyYTQ0YTE2/NDU2NDRiMjgyNzc4/ZWUyYjdkMWI5ZmMu/anBlZw",
    "https://imgs.search.brave.com/W4ZU4gA2N9qorssH8BHw6s4aqHogo6-dpcHYe3WZPQg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTE2/MTE2MjQxNy9waG90/by92aWV3LW9mLXRo/ZS1raXRjaGVuLWFu/ZC1iYXItaW4tYS1z/bWFsbC1ob3RlbC1y/b29tLXN0dWRpby5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/NDhGWTlBOUZTbDZs/ay16SWxqUzZic3F1/NVZJMmpnV0Y0V2lQ/UnhWOU5TUT0",
    "https://imgs.search.brave.com/GKC7Y0KRcZJu-O0FwB7Xr2KNxgvjVT87ekao-o5CAKE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGhlc3BydWNlLmNv/bS90aG1iL0RhLTBV/WjlTNThCbTl3NWxw/VTJfa0U5ZnhLbz0v/MTUwMHgwL2ZpbHRl/cnM6bm9fdXBzY2Fs/ZSgpOm1heF9ieXRl/cygxNTAwMDApOnN0/cmlwX2ljYygpOmZv/cm1hdCh3ZWJwKS9h/ZjFiZTNfN2YxNWEy/YTA5NjA0NDAyZGEw/MTJkMmE1MTMzZjEw/ZThtdjItZDgyMTY4/ZWU2OTRlNGJlZGIx/M2E0YWUzMzAxNDlj/MDUuanBlZw",
  ],
  [
    "https://imgs.search.brave.com/weG_AW89GoNwjHF27GMT_ATXTTEtFiQKhi55tlo7AMo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTQ0NzcwODUxOC9waG90/by9tb2Rlcm4tdmls/bGEtZXh0ZXJpb3It/aW4tc3VtbWVyLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1l/S0JXWUktNk1WR1Ju/QV9hc1RTYmlyaWdN/THNkQlN6aUdQTVNx/RlBFcF9FPQ",
    "https://imgs.search.brave.com/5OoP1PNpCI0_VHn_Q3ndvx_R1EfhYaXLu9vnRx9bo1I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5ob3VzZWFuZGdh/cmRlbi5jby51ay9w/aG90b3MvNjVmMDI2/NjQ5NzU3ZTNlNTEz/ZThjYmVhLzE6MS93/XzY0MCxjX2xpbWl0/L1dpbGtpbnNvbl8z/LmpwZw",
    "https://imgs.search.brave.com/thBOnc1M9oMuzV-_6vDIZLgIhYuzuxP5nPH9OTnRp9Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTQ0OTY4MTQzNS9waG90/by9sdXh1cnktYXBh/cnRtZW50LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz02Tkg3/SUl2ekVHaEpNRXV4/YWVWdGgxS1hOMGg2/TVNKQ29ORml3cTM4/Mk1FPQ",
    "https://imgs.search.brave.com/6sldFA_u3WCstDZWy8F0EQKPsCwLSFXzlEcWpRD8KW8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0aW1hZ2VzLmNvbS9pZC8xMzQ2NjMxNDc5L3Bob3RvL2VtcHR5LWJhdGhyb29tLmpwZz9zPTYxMng2MTImdz0wJms9MjAmYz1yZnpGTkdwOXhPMl92Yng2NmI4ME5ENk5vTl9ha2ZxVjZENjVOamZvVl9mVT0",
  ],
  [
    "https://imgs.search.brave.com/FecIWp5aAeNfHOpKJfZeBmhYR-rFszPs3NToc5N0B-s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAyLzk3LzYwLzY2/LzM2MF9GXzI5NzYwNjY3N19KV1RKRzd5/aDRDYlM5Zk9nb3ZUcTFHZEFCRzQ1UVM2YS5qcGc",
    "https://imgs.search.brave.com/sZfU1fRfNzjSPGwTi2uE7ZC21cmk2CeVty2HTvA62q4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRpYS5ob3VzZWFuZGdh/cmRlbi5jby51ay9waG90b3MvNjE4OTNlMDE2MmI3MzdhYmFiY2ExMWJjL21hc3Rlci93XzEwMjQsY19saW1pdC8yODUxNDI0LWhvdXNlLTE2bWF5MTYtU2ltb24tQnJvd25fYl8xLmpwZw",
    "https://imgs.search.brave.com/IsSqvHwdGt1uAKQ89AYrS_jm4M2d5Uv_cz7exdRrZHM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRpYS5ob3VzZWFuZGdh/cmRlbi5jby51ay9waG90b3MvNjZjNWNjYzYwNGU2OWFhMzQ0ZDc5ZTNlL21hc3Rlci93XzEwMjQsY19saW1pdC8yMzA4MDdIR0hhSGFIb3VzZTA1OEJJVHNSR0ItcHJvZHVjdGlvbl9kaWdpdGFsLmpwZw",
    "https://imgs.search.brave.com/t6FCFsbIXLoey7MyLLgok1YUpBJpKc2ElGdWvyID720/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRpYS5pc3RvY2twaG90/by5jb20vaWQvMTMxMjE0MzYzNC9waG90/by9tb2Rlcm4tc21h/bGwtYmF0aHJvb20t/aW50ZXJpb3ItZGVz/aWduLmpwZz9zPTYx/Mng2MTImdz0wJms9MjAmYz10Ti1sdTE5UC1TdW5yYnBIbXN0aExLWnRfRVY3Ymh5TUhaMjZ6SlE2MW40PQ",
  ],
  [
    "https://imgs.search.brave.com/UlRXTaDfAhf9VYetMc1H2LyNFto9EG7oiQZr7XqrvPE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tcGhv/dG8vaG91c2Utd2l0/aC1sb3Qtd2luZG93/cy10aGF0LXNheS1j/aHJpc3RtYXMtc2lk/ZV8xMTAzMjkwLTE0/OTc5OS5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQwJnE9ODA",
    "https://imgs.search.brave.com/H06ax64gbIi4e3EtkA2YVN3z5SKgKLY6mgGaDqcTdCs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/bW9zLmNtcy5mdXR1/cmVjZG4ubmV0L3ZQ/OGNkcUFSV01vc1dz/OFpqalE1SkUuanBn",
    "https://imgs.search.brave.com/TrT2ZBiD6LOc2fVaEGoZ9TtmjXwH9rTIiB0E7ID5C34/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVl/ZXp5LmNvbS9zeXN0ZW0vcmVzb3VyY2VzL3RodW1ibmFpbHMvMDI1LzM1OC8wNzgv c21hbGwvc3RvY2stb2YtYS1tb2Rlcm4tc2ltcGxpc3RpYy1raXRjaGVuLW9mLWEtc2NhbmRpbmF2aWFuZ3JhcGh5LWdlbmVyYXRpdmUtYWktcGhvdG8uanBn",
    "https://imgs.search.brave.com/evF1wey8AlZOgQQJ5jAke3jqmvAXqMZ5A4s1fTZFeVQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cuc291dGhlcm5saXZpbmcuY29tL3RobWIvLUNoMEJLOEpocGdwRUlWZ0o4UmhNTFhNUENRPS8xNTAweDAvZmlsdGVyczpub191cHNjYWxlKCk6bWF4X2J5dGVzKDE1MDAwMCk6c3RyaXBfaWNjKCkvMjU4MTUwMV9oZWF0aF8xNDY2LTIwMDAtNzk4YTE2Nzc4OWYyNGJmMzg3ZTMwYTdhZDI4M2NkYjQuanBn",
  ],
  [
    "https://imgs.search.brave.com/BtfFLGan-JfuOXM2svXw5C6NBZRHE6YLYFcZL_FUjJk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2ZhLzBi/LzU5L2ZhMGI1OTQ1NGE4OTU3OGM1OGQwOTU2MDMyODA0MjBhLmpwZw",
    "https://imgs.search.brave.com/rnJU23U1q2AC8xnTX8Eqe1gsbdoN0_92eBgUXl_7V30/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZmFycm93LWJhbGwu/Y29tL21lZGlhL3d5/c2l3ZWcvR3JleS1i/ZWRyb29tcy5qcGc",
    "https://imgs.search.brave.com/LrX4sj8Drd8B35L8D4kOfqgQ-ovdEkRws5mVr_bItuM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTcx/MzQzOTg4L3Bob3Rv/L21vZGVybi1raXRj/aGVuLmpwZz9zPTYx/MngxNjEyJnc9MCZr/PTIwJmM9cDJFV1d1/dHFpMkNHSVZwUGVl/V205bXVyUUF0OTBN/QzZsd2daSDI2ZWtB/bz0",
    "https://imgs.search.brave.com/J0je4eCtVeJz4vu6wE4MXc5jUqsk2cU1F5_5MwN46d0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGhlc3BydWNlLmNv/bS90aG1iL0F0SGJG/QTZSZWcyc0xwMEs0/TktzcHU4aFFYZz0v/MTUwMHgwL2ZpbHRl/cnM6bm9fdXBzY2Fs/ZSgpOm1heF9ieXRl/cygxNTAwMDApOnN0/cmlwX2ljYygpOmZv/cm1hdCh3ZWJwKS9C/ZWNjYUludGVyaW9y/c05ZV2VzdGNoZXN0/ZXJDb3R0YWdlMTQt/NjMxZWVlYTAxM2Nm/NGQzYmJjMWZkNjdk/MGVjMmVmMWQtMjg3/MzhmNzNkN2Y1NGIy/ODllZGRiYTA3NTdl/YzE0NzUuanBn",
  ],
];

const suppliedImageUrls = require("fs")
  .readFileSync(require("path").join(__dirname, "../img-url.md"), "utf8")
  .split("\n")
  .filter((line) => line.startsWith("https://"))
  .map((line) => line.replace(/\s+/g, ""));

const imageSets = Array.from({ length: 5 }, (_, setIndex) =>
  suppliedImageUrls.slice(setIndex * 4, setIndex * 4 + 4),
);

const createImages = (propertyNumber) => {
  const imageSet = imageSets[(propertyNumber - 1) % imageSets.length];

  return imageSet.map((url, imageIndex) => ({
    url,
    publicId: `mock-property-${propertyNumber}-photo-${imageIndex + 1}`,
  }));
};

const properties = [
  {
    title: "Mock Seafront Villa",
    ownerName: "Ahmed Al Khalifa",
    ownerEmail: "ahmed.alkhalifa@propertyseeker.test",
    description:
      "A spacious seafront villa with bright living areas, a private garden, and views across the water.",
    listingType: "sale",
    price: 122500,
    location: "manama",
    area: 320,
    bedrooms: 4,
    bathrooms: 4,
    images: createImages(1),
  },
  {
    title: "Mock Muharraq Townhouse",
    ownerName: "Ahmed Al Khalifa",
    ownerEmail: "ahmed.alkhalifa@propertyseeker.test",
    description:
      "A modern townhouse close to local shops and cafes, with flexible space for family living.",
    listingType: "rent",
    price: 475,
    location: "muharraq",
    area: 210,
    bedrooms: 3,
    bathrooms: 3,
    images: createImages(2),
  },
  {
    title: "Mock Riffa Garden Home",
    ownerName: "Ahmed Al Khalifa",
    ownerEmail: "ahmed.alkhalifa@propertyseeker.test",
    description:
      "A calm family home in a quiet neighborhood with generous bedrooms and a landscaped garden.",
    listingType: "sale",
    price: 89000,
    location: "rifaa",
    area: 260,
    bedrooms: 4,
    bathrooms: 3,
    images: createImages(3),
  },
];

const extraProperties = [
  [
    "Fatima Al Doseri",
    "fatima.aldoseri@propertyseeker.test",
    "Mock Saar Courtyard Villa",
    "A welcoming villa with a shaded courtyard, modern kitchen, and quiet family spaces.",
    "sale",
    198000,
    "jidd hafs",
    285,
    4,
    4,
  ],
  [
    "Fatima Al Doseri",
    "fatima.aldoseri@propertyseeker.test",
    "Mock Saar Family Townhouse",
    "A bright townhouse with an open plan living room and easy access to neighborhood amenities.",
    "rent",
    850,
    "jidd hafs",
    190,
    3,
    3,
  ],
  [
    "Fatima Al Doseri",
    "fatima.aldoseri@propertyseeker.test",
    "Mock Saar Modern Home",
    "A newly finished home with clean lines, generous storage, and a private outdoor terrace.",
    "sale",
    164000,
    "jidd hafs",
    220,
    3,
    3,
  ],
  [
    "Ali Al Zayani",
    "ali.alzayani@propertyseeker.test",
    "Mock Hamad Town Residence",
    "A comfortable residence with a practical layout, private parking, and a leafy front garden.",
    "sale",
    132000,
    "hamad town",
    240,
    4,
    3,
  ],
  [
    "Ali Al Zayani",
    "ali.alzayani@propertyseeker.test",
    "Mock Hamad Town Apartment",
    "A well-kept apartment with a sunny balcony and convenient access to schools and services.",
    "rent",
    620,
    "hamad town",
    125,
    2,
    2,
  ],
  [
    "Ali Al Zayani",
    "ali.alzayani@propertyseeker.test",
    "Mock Hamad Town Villa",
    "A spacious villa offering flexible family accommodation and a generous entertaining area.",
    "rent",
    1100,
    "hamad town",
    300,
    5,
    4,
  ],
  [
    "Noor Al Khalifa",
    "noor.alkhalifa@propertyseeker.test",
    "Mock Isa Town Retreat",
    "A peaceful retreat with warm interiors, a covered patio, and room for a growing family.",
    "sale",
    156000,
    "isa town",
    230,
    4,
    3,
  ],
  [
    "Noor Al Khalifa",
    "noor.alkhalifa@propertyseeker.test",
    "Mock Isa Town Garden Flat",
    "A ground-floor flat with garden access, generous natural light, and a practical floor plan.",
    "rent",
    700,
    "isa town",
    145,
    2,
    2,
  ],
  [
    "Noor Al Khalifa",
    "noor.alkhalifa@propertyseeker.test",
    "Mock Isa Town Corner Villa",
    "A corner villa with multiple living areas, a private driveway, and excellent outdoor space.",
    "sale",
    189000,
    "isa town",
    275,
    4,
    4,
  ],
  [
    "Hassan Al Bahrani",
    "hassan.albahrani@propertyseeker.test",
    "Mock Sitra Waterfront Home",
    "A relaxed waterfront home with open views, airy bedrooms, and a bright family kitchen.",
    "sale",
    172000,
    "sitra",
    250,
    4,
    3,
  ],
  [
    "Hassan Al Bahrani",
    "hassan.albahrani@propertyseeker.test",
    "Mock Sitra Marina Apartment",
    "A modern apartment near the marina with a balcony, secure parking, and shared amenities.",
    "rent",
    780,
    "sitra",
    135,
    2,
    2,
  ],
  [
    "Hassan Al Bahrani",
    "hassan.albahrani@propertyseeker.test",
    "Mock Sitra Seaside Villa",
    "A generous seaside villa with private outdoor space and flexible rooms for entertaining.",
    "rent",
    1250,
    "sitra",
    310,
    5,
    4,
  ],
];

for (const [index, data] of extraProperties.entries()) {
  const [
    ownerName,
    ownerEmail,
    title,
    description,
    listingType,
    price,
    location,
    area,
    bedrooms,
    bathrooms,
  ] = data;
  const propertyNumber = index + 4;
  properties.push({
    title,
    ownerName,
    ownerEmail,
    description,
    listingType,
    price: price / 2,
    location,
    area,
    bedrooms,
    bathrooms,
    images: createImages(propertyNumber),
  });
}

module.exports = properties;
