export interface DressPaletteColor {
  name: string;
  hex: string;
  family: string;
}

// Ten families with fifteen distinct shades each. Names stay readable on the invitation.
const COLOR_FAMILIES: { name: string; colors: [string, string][] }[] = [
  {
    name: "Trung tính",
    colors: [
      ["Trắng tinh khôi", "#FFFFFF"], ["Trắng ngà", "#FFFFF0"],
      ["Trắng ngọc trai", "#F8F6F0"], ["Kem vani", "#FFF8E7"],
      ["Be sữa", "#F5ECE1"], ["Be cát", "#DCC9AD"],
      ["Be linen", "#E9DDCB"], ["Xám bạc", "#C0C0C0"],
      ["Xám ngọc", "#D7D9D6"], ["Xám khói", "#A9A9A9"],
      ["Xám đá", "#808080"], ["Xám than", "#36454F"],
      ["Đen tuyền", "#101010"], ["Đen mực", "#242424"],
      ["Xám nâu", "#8B8589"],
    ],
  },
  {
    name: "Nâu",
    colors: [
      ["Nâu ấm", "#8C6239"], ["Nâu chocolate", "#7B3F00"],
      ["Nâu cà phê", "#6F4E37"], ["Nâu caramel", "#AF6E4D"],
      ["Nâu hạt dẻ", "#954535"], ["Nâu mocha", "#967969"],
      ["Nâu cacao", "#5C4033"], ["Nâu đất", "#8B4513"],
      ["Nâu đồng", "#B87333"], ["Nâu cognac", "#9A463D"],
      ["Nâu quế", "#D2691E"], ["Nâu hổ phách", "#A65E2E"],
      ["Nâu taupe", "#B38B6D"], ["Nâu lạc đà", "#C19A6B"],
      ["Nâu mật ong", "#B8864B"],
    ],
  },
  {
    name: "Hồng",
    colors: [
      ["Hồng pastel", "#E8C5C8"], ["Hồng phấn", "#F4C2C2"],
      ["Hồng đào", "#FFD1DC"], ["Hồng cánh sen", "#FF69B4"],
      ["Hồng rose", "#E8ADAA"], ["Hồng bụi", "#C08081"],
      ["Hồng nude", "#D8A7A0"], ["Hồng đất", "#B76E79"],
      ["Hồng san hô", "#F88379"], ["Hồng dâu", "#FC5A8D"],
      ["Hồng mâm xôi", "#E30B5C"], ["Hồng fuchsia", "#FF00FF"],
      ["Hồng magenta", "#C71585"], ["Hồng vỏ sò", "#FFE4E1"],
      ["Hồng cherry", "#DE3163"],
    ],
  },
  {
    name: "Đỏ",
    colors: [
      ["Đỏ tươi", "#FF0000"], ["Đỏ ruby", "#E0115F"],
      ["Đỏ rượu vang", "#722F37"], ["Đỏ burgundy", "#800020"],
      ["Đỏ đô", "#8B0000"], ["Đỏ gạch", "#B22222"],
      ["Đỏ son", "#E34234"], ["Đỏ hồng ngọc", "#9B111E"],
      ["Đỏ cranberry", "#9E1B32"], ["Đỏ lựu", "#C41E3A"],
      ["Đỏ bordeaux", "#5F021F"], ["Đỏ crimson", "#DC143C"],
      ["Đỏ cam", "#FF4500"], ["Đỏ terracotta", "#C65D3B"],
      ["Đỏ coral", "#CD5B45"],
    ],
  },
  {
    name: "Cam",
    colors: [
      ["Cam tươi", "#FF8C00"], ["Cam quýt", "#F28500"],
      ["Cam đào", "#FFB07C"], ["Cam mơ", "#FBCEB1"],
      ["Cam san hô", "#FF7F50"], ["Cam bí ngô", "#FF7518"],
      ["Cam cháy", "#CC5500"], ["Cam đất", "#D98761"],
      ["Cam đồng", "#DA8A67"], ["Cam hổ phách", "#FFBF00"],
      ["Cam mật ong", "#ED9121"], ["Cam gừng", "#B06500"],
      ["Cam melon", "#FDBCB4"], ["Cam đỏ", "#FF5349"],
      ["Cam nhạt", "#FFDAB9"],
    ],
  },
  {
    name: "Vàng",
    colors: [
      ["Vàng chanh", "#FFF44F"], ["Vàng bơ", "#F3E5AB"],
      ["Vàng champagne", "#F7E7CE"], ["Vàng gold", "#FFD700"],
      ["Vàng ánh kim", "#D4AF37"], ["Vàng mù tạt", "#FFDB58"],
      ["Vàng nghệ", "#E49B0F"], ["Vàng nắng", "#FFCC33"],
      ["Vàng hoàng yến", "#FFEF00"], ["Vàng lúa", "#F5DEB3"],
      ["Vàng cát", "#ECD9B0"], ["Vàng mật", "#E6B422"],
      ["Vàng kem", "#FFFDD0"], ["Vàng pale", "#FAFAD2"],
      ["Vàng ochre", "#CC7722"],
    ],
  },
  {
    name: "Xanh lá",
    colors: [
      ["Xanh sage", "#9EAA9B"], ["Xanh olive", "#808000"],
      ["Xanh rêu", "#8A9A5B"], ["Xanh ngọc lục bảo", "#50C878"],
      ["Xanh lá rừng", "#228B22"], ["Xanh lá đậm", "#006400"],
      ["Xanh lá thông", "#01796F"], ["Xanh lá chai", "#006A4E"],
      ["Xanh mint", "#98FF98"], ["Xanh pistachio", "#93C572"],
      ["Xanh bơ", "#568203"], ["Xanh eucalyptus", "#7BA05B"],
      ["Xanh lá trà", "#D0F0C0"], ["Xanh fern", "#4F7942"],
      ["Xanh celadon", "#ACE1AF"],
    ],
  },
  {
    name: "Xanh dương",
    colors: [
      ["Xanh navy", "#000080"], ["Xanh royal", "#4169E1"],
      ["Xanh cobalt", "#0047AB"], ["Xanh biển", "#0077BE"],
      ["Xanh trời", "#87CEEB"], ["Xanh baby", "#89CFF0"],
      ["Xanh bụi", "#6699CC"], ["Xanh denim", "#1560BD"],
      ["Xanh steel", "#4682B4"], ["Xanh băng", "#D6EFF7"],
      ["Xanh teal", "#008080"], ["Xanh turquoise", "#40E0D0"],
      ["Xanh aqua", "#00FFFF"], ["Xanh petrol", "#005F6A"],
      ["Xanh midnight", "#191970"],
    ],
  },
  {
    name: "Tím",
    colors: [
      ["Tím lavender", "#E6E6FA"], ["Tím lilac", "#C8A2C8"],
      ["Tím mauve", "#E0B0FF"], ["Tím violet", "#8F00FF"],
      ["Tím hoàng gia", "#7851A9"], ["Tím mận", "#8E4585"],
      ["Tím nho", "#6F2DA8"], ["Tím aubergine", "#614051"],
      ["Tím orchid", "#DA70D6"], ["Tím thạch anh", "#9966CC"],
      ["Tím periwinkle", "#CCCCFF"], ["Tím iris", "#5A4FCF"],
      ["Tím wisteria", "#C9A0DC"], ["Tím bụi", "#A58BAF"],
      ["Tím indigo", "#4B0082"],
    ],
  },
  {
    name: "Pastel",
    colors: [
      ["Pastel hồng sương", "#F9E2E7"], ["Pastel hồng trà", "#F2D6D0"],
      ["Pastel đào sữa", "#FCE1CE"], ["Pastel mơ kem", "#F8DFC4"],
      ["Pastel vàng chanh", "#FCF4B2"], ["Pastel vàng nhạt", "#F8F0D8"],
      ["Pastel xanh mint", "#C7E9D4"], ["Pastel xanh sage", "#D5DFCF"],
      ["Pastel xanh ngọc", "#C4E8E5"], ["Pastel xanh trời", "#D0E5F5"],
      ["Pastel xanh khói", "#D9E2EC"], ["Pastel tím sương", "#E5D8ED"],
      ["Pastel tím hoa cà", "#D8C9E4"], ["Pastel xám ngọc", "#E8E8E3"],
      ["Pastel be hồng", "#E9D6CB"],
    ],
  },
];

export const DRESS_COLOR_FAMILIES = COLOR_FAMILIES.map((family) => family.name);

export const DRESS_COLOR_PALETTE: DressPaletteColor[] = COLOR_FAMILIES.flatMap((family) =>
  family.colors.map(([name, hex]) => ({ name, hex, family: family.name }))
);

export function normalizeColorSearch(value: string) {
  return value.normalize("NFD").toLowerCase().replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").trim();
}

export function swatchCheckColor(hex: string) {
  const channels = hex.slice(1).match(/.{2}/g)?.map((channel) => parseInt(channel, 16)) ?? [0, 0, 0];
  return channels[0] * 0.299 + channels[1] * 0.587 + channels[2] * 0.114 > 155 ? "#382721" : "#FFFFFF";
}
