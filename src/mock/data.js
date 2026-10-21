// Sample data used only for UI preview (no backend).
const ago = (h) => new Date(Date.now() - h * 3600e3).toISOString();

const svg = (bg, fg, label) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="${bg}"/><text x="400" y="330" font-family="Arial" font-size="56" font-weight="bold" fill="${fg}" text-anchor="middle">${label}</text></svg>`
  )}`;

export const photo = (label, n = 0) => svg(['#cfe5d3', '#e2efd9', '#bcd9c4'][n % 3], '#1f4d36', label);

export const me = { _id: 'u1', name: 'Anjali Nair', email: 'anjali@example.com', phone: '9876543210', role: 'user' };
export const admin = { _id: 'a1', name: 'Admin', email: 'admin@refound.com', role: 'admin' };

const U = {
  u1: { _id: 'u1', name: 'Anjali Nair', email: 'anjali@example.com', phone: '9876543210' },
  u2: { _id: 'u2', name: 'Rahul Menon', email: 'rahul@example.com', phone: '9847012345' },
  u3: { _id: 'u3', name: 'Meera Pillai', email: 'meera@example.com', phone: '9946098765' },
  u4: { _id: 'u4', name: 'Arjun Das', email: 'arjun@example.com', phone: '9745011223' },
};

export const categories = ['Wallet', 'Phone', 'Bag', 'Keys', 'Documents', 'Electronics', 'Jewellery', 'Clothing', 'Others'].map((name, i) => ({ _id: `c${i + 1}`, name }));

const mk = (o) => ({
  brand: '', color: '', description: '', statusNote: '', questions: [], verification: 'unverified', verificationNote: '', flags: [],
  geo: { coordinates: [75.37, 11.87] }, ...o, user: U[o.user], images: o.images || [photo(o.title, o._n || 0)],
});

export const items = [
  mk({ _id: 'i1', type: 'lost', title: 'Black leather wallet', category: 'Wallet', brand: 'Wildcraft', color: 'Black', dateTime: ago(30), location: 'Kannur Bus Stand', description: 'Contains ID card, two debit cards and some cash.', status: 'POTENTIAL_MATCH', user: 'u1', verification: 'verified' }),
  mk({ _id: 'i2', type: 'lost', title: 'Blue backpack', category: 'Bag', brand: 'Skybags', color: 'Blue', dateTime: ago(70), location: 'Payyambalam Beach', description: 'Laptop sleeve inside, small keychain on the zip.', status: 'UNDER_CLAIM', user: 'u1', statusNote: 'Still searching, call me', _n: 1 }),
  mk({ _id: 'i3', type: 'found', title: 'Black wallet found near bus stand', category: 'Wallet', brand: 'Wildcraft', color: 'Black', dateTime: ago(28), location: 'Kannur Bus Stand', description: 'Found on a bench near platform 2.', status: 'POTENTIAL_MATCH', user: 'u2', questions: ['Which cards are inside?', 'Is there a photo in the wallet?'], verification: 'verified', statusNote: 'Kept safe at the bus stand office' }),
  mk({ _id: 'i4', type: 'found', title: 'Silver smartphone', category: 'Phone', brand: 'Apple', color: 'Silver', dateTime: ago(20), location: 'Fort Road, Kannur', description: 'Lock screen has a beach photo.', status: 'UNDER_CLAIM', user: 'u1', questions: ['What is the lock screen photo?'], _n: 2 }),
  mk({ _id: 'i5', type: 'lost', title: 'Car keys with red tag', category: 'Keys', brand: 'Maruti', color: 'Red', dateTime: ago(50), location: 'City Centre Mall', status: 'REPORTED', user: 'u3', _n: 1 }),
  mk({ _id: 'i6', type: 'found', title: 'Spectacles case', category: 'Others', color: 'Brown', dateTime: ago(40), location: 'Town Square', description: 'Brown leather case with glasses inside.', status: 'REPORTED', user: 'u3', questions: ['What brand are the glasses?'], _n: 2 }),
  mk({ _id: 'i7', type: 'lost', title: 'Steel water bottle', category: 'Others', brand: 'Milton', color: 'Silver', dateTime: ago(300), location: 'Vimal Jyothi Campus', status: 'RECOVERED', user: 'u1', verification: 'verified' }),
  mk({ _id: 'i8', type: 'found', title: 'Student ID card', category: 'Documents', color: 'White', dateTime: ago(12), location: 'Thalassery Railway Station', status: 'REPORTED', user: 'u4', questions: ['What is the name on the card?'], verification: 'verified', _n: 1 }),
  mk({ _id: 'i9', type: 'found', title: 'Black umbrella', category: 'Others', color: 'Black', dateTime: ago(90), location: 'Library Junction', status: 'POTENTIAL_MATCH', user: 'u2', questions: ['Any marking on the handle?'] }),
  mk({ _id: 'i10', type: 'lost', title: 'Gold ring', category: 'Jewellery', color: 'Gold', dateTime: ago(60), location: 'St. Angelo Fort', description: 'Thin band with a small engraving inside.', status: 'REPORTED', user: 'u4', flags: [{ reason: 'Looks like a duplicate post' }], _n: 2 }),
  mk({ _id: 'i11', type: 'found', title: 'Blue school bag', category: 'Bag', brand: 'Skybags', color: 'Blue', dateTime: ago(66), location: 'Payyambalam Beach', description: 'Handed over at the beach police booth.', status: 'UNDER_CLAIM', user: 'u3', questions: ['What is attached to the zip?'], _n: 1 }),
  mk({ _id: 'i12', type: 'lost', title: 'Laptop charger', category: 'Electronics', brand: 'Dell', color: 'Black', dateTime: ago(110), location: 'Kannur University', status: 'REPORTED', user: 'u2' }),
  mk({ _id: 'i13', type: 'lost', title: 'Silver iPhone 13', category: 'Phone', brand: 'Apple', color: 'Silver', dateTime: ago(22), location: 'Fort Road, Kannur', description: 'Beach photo wallpaper, cracked corner.', status: 'UNDER_CLAIM', user: 'u2', _n: 2 }),
  mk({ _id: 'i14', type: 'found', title: 'Steel water bottle', category: 'Others', brand: 'Milton', color: 'Silver', dateTime: ago(290), location: 'Vimal Jyothi Campus', status: 'RECOVERED', user: 'u3', verification: 'verified' }),
];
export const byId = (id) => items.find((i) => i._id === id);
const slim = (i) => ({ _id: i._id, title: i.title, location: i.location, user: i.user._id });

const bd = (c, l, b, co, d, de) => ({ category: c, location: l, brand: b, color: co, date: d, description: de });
const mkMatch = (_id, lost, found, percentage, breakdown, claimStatus) => ({ _id, lostItem: slim(byId(lost)), foundItem: slim(byId(found)), percentage, breakdown, claimStatus, users: [], createdAt: ago(10) });
export const matches = [
  mkMatch('m1', 'i1', 'i3', 87, bd(30, 25, 15, 15, 8, 4), 'pending'),
  mkMatch('m2', 'i2', 'i11', 78, bd(30, 22, 15, 15, 10, 3), 'approved'),
  mkMatch('m3', 'i13', 'i4', 92, bd(30, 25, 15, 15, 9, 4), 'pending'),
  mkMatch('m4', 'i7', 'i14', 95, bd(30, 25, 15, 15, 10, 5), 'recovered'),
  mkMatch('m5', 'i2', 'i9', 63, bd(10, 18, 0, 10, 10, 2)),
];

const claim = (o) => ({
  reviewNote: '', handoverPlan: '', ownerConfirmed: false, finderConfirmed: false, proofImages: [], answers: [], createdAt: ago(8), ...o,
  foundItem: { _id: o.found, title: byId(o.found).title }, lostItem: { _id: o.lost, title: byId(o.lost).title },
  finder: U[byId(o.found).user._id], claimer: U[byId(o.lost).user._id], match: { _id: o.m, percentage: matches.find((x) => x._id === o.m).percentage },
});
export const claims = [
  claim({ _id: 'cl1', found: 'i3', lost: 'i1', m: 'm1', status: 'pending', proofDetails: 'Wallet has my college ID and a SBI debit card ending 4421.', answers: [{ question: 'Which cards are inside?', answer: 'SBI and HDFC debit cards' }, { question: 'Is there a photo in the wallet?', answer: 'Yes, a passport size photo' }], proofImages: [photo('Receipt', 1)] }),
  claim({ _id: 'cl2', found: 'i11', lost: 'i2', m: 'm2', status: 'approved', proofDetails: 'Laptop sleeve with a Dell sticker inside.', answers: [{ question: 'What is attached to the zip?', answer: 'A small panda keychain' }], reviewNote: 'Details match.', handoverPlan: 'Payyambalam Beach gate, 5 PM tomorrow', ownerConfirmed: false, finderConfirmed: true }),
  claim({ _id: 'cl3', found: 'i14', lost: 'i7', m: 'm4', status: 'recovered', proofDetails: 'Dent near the base and my initials scratched on the lid.', answers: [], ownerConfirmed: true, finderConfirmed: true, recoveredAt: ago(240) }),
  claim({ _id: 'cl4', found: 'i4', lost: 'i13', m: 'm3', status: 'pending', proofDetails: 'It is my phone, IMEI ends with 3092. Cracked top-left corner.', answers: [{ question: 'What is the lock screen photo?', answer: 'A sunset at Payyambalam beach' }], proofImages: [photo('IMEI box', 2)] }),
  claim({ _id: 'cl5', found: 'i9', lost: 'i2', m: 'm5', status: 'rejected', proofDetails: 'I think it is mine.', answers: [{ question: 'Any marking on the handle?', answer: 'Not sure' }], reviewNote: 'Answers did not match.' }),
];
export const myClaims = claims.filter((c) => c.claimer._id === 'u1');
export const incomingClaims = claims.filter((c) => c.finder._id === 'u1');

export const rooms = [
  { _id: 'm1', percentage: 87, lostTitle: 'Black leather wallet', foundTitle: 'Black wallet found near bus stand', other: U.u2, last: { text: 'I can meet you at the bus stand office.', createdAt: ago(1) } },
  { _id: 'm2', percentage: 78, lostTitle: 'Blue backpack', foundTitle: 'Blue school bag', other: U.u3, last: { text: 'Great, see you tomorrow at 5.', createdAt: ago(5) } },
  { _id: 'm3', percentage: 92, lostTitle: 'Silver iPhone 13', foundTitle: 'Silver smartphone', other: U.u2, last: null },
];
export const messages = {
  m1: [
    ['u1', 'Hi! I think the wallet you found is mine.', 3], ['u2', 'Hello! Can you tell me what is inside it?', 2.6],
    ['u1', 'Two debit cards, my college ID and some cash.', 2.4], ['u2', 'I can meet you at the bus stand office.', 1],
  ],
  m2: [['u3', 'I found your backpack near the beach.', 8], ['u1', 'Thank you so much! Can we meet tomorrow?', 6], ['u3', 'Great, see you tomorrow at 5.', 5]],
  m3: [],
};
export const getMessages = (id) => (messages[id] || []).map(([s, text, h], i) => ({ _id: `${id}-${i}`, match: id, sender: s, text, createdAt: ago(h) }));

export const notifications = [
  { _id: 'n1', title: 'New match found', message: 'Black leather wallet matches a found report (87%).', read: false, createdAt: ago(2), link: '/matches' },
  { _id: 'n2', title: 'Claim waiting for review', message: 'Rahul Menon claimed Silver smartphone.', read: false, createdAt: ago(4), link: '/claims' },
  { _id: 'n3', title: 'Claim approved', message: 'Your claim on Blue school bag was approved.', read: true, createdAt: ago(26), link: '/claims' },
  { _id: 'n4', title: 'New message', message: 'Meera Pillai sent you a message.', read: true, createdAt: ago(30), link: '/chat/m2' },
  { _id: 'n5', title: 'Item recovered', message: 'Steel water bottle was marked as recovered.', read: true, createdAt: ago(240), link: '/claims' },
];

export const adminUsers = [
  { ...U.u1, createdAt: ago(2000), fraudScore: 0, reports: [], isBlocked: false },
  { ...U.u2, createdAt: ago(1500), fraudScore: 1, reports: [{ by: { name: 'Meera Pillai' }, reason: 'Asked for money before returning an item' }], isBlocked: false },
  { ...U.u3, createdAt: ago(1200), fraudScore: 0, reports: [], isBlocked: false },
  { ...U.u4, createdAt: ago(800), fraudScore: 4, reports: [{ by: { name: 'Anjali Nair' }, reason: 'Fake claims on multiple items' }, { by: { name: 'Rahul Menon' }, reason: 'Suspicious messages' }], isBlocked: true },
];

export const adminStats = {
  users: 128, lost: 74, found: 61, recovered: 39, recoveryRate: 29, activeClaims: 12, flaggedItems: 3, reportedUsers: 2,
  monthly: [[2026, 5, 14, 5], [2026, 6, 22, 9], [2026, 7, 18, 8], [2026, 8, 27, 11], [2026, 9, 31, 14], [2026, 10, 23, 6]].map(([y, m, reported, recovered]) => ({ _id: { y, m }, reported, recovered })),
  byStatus: [{ _id: 'REPORTED', count: 52 }, { _id: 'POTENTIAL_MATCH', count: 24 }, { _id: 'UNDER_CLAIM', count: 20 }, { _id: 'RECOVERED', count: 39 }],
  recent: [{ _id: 'r1', item: 'Steel water bottle', claimer: 'Anjali Nair', at: ago(240) }, { _id: 'r2', item: 'House keys', claimer: 'Arjun Das', at: ago(400) }, { _id: 'r3', item: 'Gray hoodie', claimer: 'Meera Pillai', at: ago(600) }],
  byCategory: [['Wallet', 18, 14, 9], ['Phone', 15, 12, 8], ['Bag', 11, 9, 6], ['Keys', 9, 8, 7], ['Documents', 8, 7, 4], ['Electronics', 6, 5, 3], ['Jewellery', 4, 3, 1], ['Others', 3, 3, 1]].map(([_id, lost, found, recovered]) => ({ _id, lost, found, recovered })),
};
export const publicStats = { recovered: 39, reported: 135, members: 128 };
