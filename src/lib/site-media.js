// Media from film-essence-archive stored locally in /archive/
const img = (id) => `/archive/img-${id}.jpg`;
const vid = (id) => `/archive/vid-${id}.mp4`;
const poster = (id) => `/archive/vid-${id}-poster.jpg`;

export const clip = (id, label, portrait = false) => ({
  src: vid(id),
  poster: poster(id),
  label,
  portrait,
});

export const images = {
  workshopBadge: img('822b8f42-e4bc-42c1-8cd2-97b8a0f66741'),
  homeBanner: img('bd1cb60d-90ca-4f8f-89e9-f4c6e5e3b0fc'),
  phantomHero: img('bd65e40b-73f6-4edf-b025-6c32b11b1186'),
  phantom: [
    img('86faa472-b5b6-4f5f-b278-ca7332a676dd'),
    img('f0eff336-b74f-4e26-a71e-f725839bbbac'),
    img('d7484b25-aca9-4648-be0b-11f76d49fcaa'),
    img('f25b4b3a-e877-4dc4-9b8d-5d98fa0f3a8f'),
    img('7dd0687b-7498-44b0-83d6-f3d0ca647d41'),
  ],
  post: [
    img('ee47a7ad-a12f-4d2e-994a-cdc9e1b60cec'),
    img('9ec2cf5e-4916-4654-971a-9b313610618f'),
    img('1c08cc69-6f88-44c1-9c01-ce5ea1f12c4e'),
  ],
  restoration: [
    img('f4160e31-3212-4c8c-8f53-b5649439f7b7'),
    img('206cf664-0ca9-463b-9775-3d6cd304d0ae'),
    img('02da0c35-8c89-4e16-9d31-24f6e883260f'),
  ],
  workshop: [
    img('221eb5a7-7561-43d7-b9b3-a1ecd3eccadc'),
    img('bd65e40b-73f6-4edf-b025-6c32b11b1186'),
    img('ff8a8c81-8794-45a0-acb2-ba1125ca0ec2'),
  ],
  special: [
    img('1cda2235-b6ef-4413-a85d-16df6264ec1e'),
    img('d1c0db72-65d3-46e3-b024-9c06bf1ec75c'),
    img('537fb65d-e03d-4717-90e9-308e4037e42a'),
    img('f7f21eea-8ce2-4975-995b-9a318f5dc9e3'),
    img('3e6acd0e-6e51-453c-9c00-c1987db28f59'),
  ],
  vr: [
    img('bbc5aead-6b5c-409f-85bc-37201a26fec4'),
    img('b57ce553-5c99-41e5-8643-da67b8128063'),
    img('6d970067-b92d-4d10-a7dc-08921873ee05'),
  ],
  contact: img('1c0fe17c-49d8-41e8-a870-efc60df0cb28'),
  equipment: [
    img('9f8f085c-3210-41fc-85ff-2071b83e4268'),
    img('2ad040a2-8030-42ff-b197-2073b764ce60'),
    img('b8310c86-6551-42af-9f10-24ddd951d056'),
    img('f733e80f-345e-4586-91c9-edb4fb52707e'),
    img('419e24f2-3458-4f0b-905f-55f031253824'),
    img('37895587-f4f0-405a-881b-0ba26a76f36f'),
    img('625ad651-f27a-4506-b612-4641d00cecff'),
    img('0ccdb061-7254-43d1-9bc4-74247d9f982a'),
    img('6e60de3d-f373-4ef5-9783-afdfecf22a43'),
    img('4dc65c20-cd98-413b-862c-2dd8fcd6b9ba'),
    img('66de4bd4-c752-4dd3-a18a-6e73ce8ddcd2'),
    img('f2c1fd86-f25f-4c38-ab3e-fa235475d2fa'),
    img('0ce8a2e2-3ced-4f22-bda8-fb8936ece439'),
    img('64f06d0c-a01a-4abf-80a1-c78d57cdff8f'),
    img('f3a19a8f-97b7-4a1d-84d3-2a7edc8b2b85'),
    img('9f560421-ee31-436b-afdd-938b15821235'),
  ],
};

export const clips = {
  hero: {
    src: '/archive/hero-4k.mp4',
    poster: '/archive/img-86faa472-b5b6-4f5f-b278-ca7332a676dd.jpg',
    label: 'Phantom Flex 4K & Flame Ultra HD Reel',
  },
  showcase: [
    clip('60077', 'High speed, two formats at once'),
    clip('148186', 'Phantom Flex 4K footage'),
    clip('171360', 'Music video — shot in 3.5 seconds'),
    clip('224384', 'Extreme sports, surfing, skiing'),
  ],
  relighting: clip('203960', 'Relighting with Autodesk Flame'),
  restoration: clip('190171', '16/35mm scanning & restoration'),
  workshop: [
    clip('306191', 'On location', true),
    clip('306707', 'Hands on the camera', true),
    clip('306188', 'Travel * Learn * Create * Earn', true),
  ],
};

export const contactInfo = {
  phone: '+1 (323) 228-9022',
  phoneHref: 'tel:+13232289022',
  consulting: '+1 (213) 593-6500',
  consultingHref: 'tel:+12135936500',
  email: 'vito@unitedfilms.com',
  emailHref: 'mailto:vito@unitedfilms.com',
};
