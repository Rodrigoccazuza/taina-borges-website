// Photography data — Taína Borges portfolio.
// Web images are generated from the untouched files in `assets original/`.
(function () {
  // L/P/S orientation maps reserve the right amount of space before each
  // lazy image downloads, preventing masonry jumps on long project pages.
  const PHOTO_LAYOUTS = {
    'ariane-long-beach-2025': 'LLLLLLLLLLLLLLLLLLLLLLLPLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLPLLLLLLLLLLLLLLLLLLLL',
    'behind-the-camera': 'PPPPLPLPPPPPPPPLLLLLLLPLLLLPPPLPPLLPPPP',
    'leanne-2024': 'LLLLLLLLL',
    'naruna-2024': 'LLLLLLLPLLPLLLLLLLLLPLLLLLPLPPPLLLLLLPPLLPLLLLLLLLLLLPL',
    'talita-central-park-2024': 'LPLLLLLLPLLLLLLLLLLLLLLLLLLPLLLLPLLLLPLLLLLLPLLLLLLLLLLLLLLLLLLL',
    'talita-long-beach-2025': 'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLPLLLLLLLLLLLLLLLLLLPLLPLLLPLLLLLLLLLLLLLLLLLLLPLLLLLLLLLLLLLLLLLLLPLLLPLLLLLLLLLLLPLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLPLLLLLLLLLLLLLLLLLLLLLLLLLLLLLPLLLLLLLL',
  };
  const DIMENSIONS = { L: [1600, 1067], P: [1067, 1600], S: [1600, 1600] };

  const asset = (folder, frame) =>
    `assets/gallery/${folder}/${String(frame).padStart(3, '0')}.jpg${folder === 'behind-the-camera' ? '?v=20260714' : ''}`;

  const projectPhotos = (folder, count, title) =>
    Array.from({ length: count }, (_, index) => {
      const [width, height] = DIMENSIONS[PHOTO_LAYOUTS[folder]?.[index] || 'L'];
      return {
        src: asset(folder, index + 1),
        title: `${title} · frame ${String(index + 1).padStart(3, '0')}`,
        width,
        height,
      };
    });

  const galleryFrame = (id, folder, frame, title, meta, year, genre, ratio) => ({
    id, src: asset(folder, frame), title, meta, year, genre, ratio,
  });

  window.TB_PHOTOS = {
    hero: asset('talita-central-park-2024', 1),
    about: 'assets/photos/taina.png',
    aboutCamera: 'assets/photos/taina-camera.jpg',
    // A small, balanced edit for the animated home-page gallery. The full
    // 487-frame archive lives on Projects.html and lazy-loads as it is viewed.
    gallery: [
      galleryFrame('g01', 'talita-central-park-2024', 1, 'Talita in Central Park', 'portrait', '2024', 'portraits', '3 / 2'),
      galleryFrame('g02', 'ariane-long-beach-2025', 8, 'Ariane at Long Beach', 'portrait', '2025', 'portraits', '2 / 3'),
      galleryFrame('g03', 'naruna-2024', 4, 'Naruna', 'portrait', '2024', 'portraits', '3 / 2'),
      galleryFrame('g04', 'behind-the-camera', 3, 'Behind the camera', 'behind the scenes', '2025', 'behind-the-scenes', '3 / 4'),
      galleryFrame('g05', 'talita-long-beach-2025', 12, 'Talita at Long Beach', 'lifestyle', '2025', 'lifestyle', '3 / 2'),
      galleryFrame('g06', 'leanne-2024', 2, 'Leanne', 'portrait', '2024', 'portraits', '4 / 5'),
      galleryFrame('g07', 'ariane-long-beach-2025', 23, 'Long Beach afternoon', 'lifestyle', '2025', 'lifestyle', '3 / 2'),
      galleryFrame('g08', 'talita-central-park-2024', 18, 'Spring in Central Park', 'lifestyle', '2024', 'lifestyle', '2 / 3'),
      galleryFrame('g09', 'naruna-2024', 19, 'Naruna in New York', 'portrait', '2024', 'portraits', '2 / 3'),
      galleryFrame('g10', 'talita-long-beach-2025', 44, 'At the waterline', 'lifestyle', '2025', 'lifestyle', '3 / 2'),
      galleryFrame('g11', 'behind-the-camera', 12, 'Tainá at work', 'behind the scenes', '2025', 'behind-the-scenes', '4 / 5'),
      galleryFrame('g12', 'ariane-long-beach-2025', 41, 'Ariane, late light', 'portrait', '2025', 'portraits', '2 / 3'),
      galleryFrame('g13', 'talita-central-park-2024', 37, 'A walk through the park', 'lifestyle', '2024', 'lifestyle', '3 / 2'),
      galleryFrame('g14', 'naruna-2024', 33, 'Naruna, available light', 'portrait', '2024', 'portraits', '4 / 5'),
      galleryFrame('g15', 'talita-long-beach-2025', 88, 'Long Beach study', 'portrait', '2025', 'portraits', '3 / 2'),
      galleryFrame('g16', 'behind-the-camera', 25, 'Making the picture', 'behind the scenes', '2025', 'behind-the-scenes', '3 / 2'),
    ],
    testimonials: [
      { quote: 'tainá showed up like a friend who happens to make pictures. we forgot the camera was there.', name: 'may & theo', meta: 'new york portrait', img: asset('talita-central-park-2024', 9) },
      { quote: 'the only photographer i\u2019ve worked with who didn\u2019t once say "smile."', name: 'jules okafor', meta: 'long beach portrait', img: asset('ariane-long-beach-2025', 16) },
      { quote: 'she sees the small thing nobody else noticed. that\u2019s the whole point.', name: 'aria pham', meta: 'portrait session', img: asset('naruna-2024', 11) },
      { quote: 'the photographs feel like the afternoon itself: warm, easy, and completely us.', name: 'leila & sam', meta: 'new york session', img: asset('talita-long-beach-2025', 31) },
    ],
  };

  window.TB_COLLECTIONS = [
    {
      id: 'ariane-long-beach', src: asset('ariane-long-beach-2025', 1),
      title: 'Ariane · Long Beach', year: '2025', location: 'long beach, ny',
      frames: 100, category: 'portraits',
      blurb: 'a portrait session shaped by salt air, open sky, and the last light over Long Beach.',
      photos: projectPhotos('ariane-long-beach-2025', 100, 'Ariane · Long Beach'),
    },
    {
      id: 'behind-the-camera', src: asset('behind-the-camera', 1),
      title: 'Behind the Camera', year: '2025', location: 'new york, ny',
      frames: 39, category: 'behind-the-scenes',
      blurb: 'Tainá at work, with the quiet direction, movement, and attention that shape every finished photograph.',
      photos: projectPhotos('behind-the-camera', 39, 'Behind the Camera'),
    },
    {
      id: 'leanne', src: asset('leanne-2024', 1),
      title: 'Leanne', year: '2024', location: 'new york, ny',
      frames: 9, category: 'portraits',
      blurb: 'a concise portrait study made with available light and an unhurried pace.',
      photos: projectPhotos('leanne-2024', 9, 'Leanne'),
    },
    {
      id: 'naruna', src: asset('naruna-2024', 1),
      title: 'Naruna', year: '2024', location: 'new york, ny',
      frames: 55, category: 'portraits',
      blurb: 'soft light, direct expression, and a portrait session allowed to unfold naturally.',
      photos: projectPhotos('naruna-2024', 55, 'Naruna'),
    },
    {
      id: 'talita-central-park', src: asset('talita-central-park-2024', 1),
      title: 'Talita · Central Park', year: '2024', location: 'central park, ny',
      frames: 64, category: 'lifestyle',
      blurb: 'a spring photography walk through Central Park with open shade, new green, and quiet pauses along the paths.',
      photos: projectPhotos('talita-central-park-2024', 64, 'Talita · Central Park'),
    },
    {
      id: 'talita-long-beach', src: asset('talita-long-beach-2025', 1),
      title: 'Talita · Long Beach', year: '2025', location: 'long beach, ny',
      frames: 220, category: 'lifestyle',
      blurb: 'a full afternoon by the Atlantic, moving from bright shoreline to the softer color of dusk.',
      photos: projectPhotos('talita-long-beach-2025', 220, 'Talita · Long Beach'),
    },
  ];
})();
