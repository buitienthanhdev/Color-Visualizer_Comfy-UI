/**
 * MATERIAL CATALOG for Architectural Visualization
 * Each material has: id, category, name (Vietnamese), nameEn, hex (representative color),
 * promptDesc (detailed English description for AI), icon
 */
window.MATERIAL_CATALOG = [
  // ── STONE (Đá) ──
  { id: 'granite_gray', category: 'stone', name: 'Đá Granite Xám', nameEn: 'Gray Granite', hex: '#8C8C8C', icon: '🪨', promptDesc: 'natural gray granite stone with visible crystalline speckled texture, polished surface with subtle light reflections' },
  { id: 'granite_black', category: 'stone', name: 'Đá Granite Đen', nameEn: 'Black Granite', hex: '#2D2D2D', icon: '🪨', promptDesc: 'deep black granite stone with fine crystalline specks, highly polished mirror-like surface' },
  { id: 'granite_pink', category: 'stone', name: 'Đá Granite Hồng', nameEn: 'Pink Granite', hex: '#C4A08A', icon: '🪨', promptDesc: 'warm pink granite stone with feldspar crystals, natural mottled pattern with rose and beige tones' },
  { id: 'limestone', category: 'stone', name: 'Đá Vôi Tự Nhiên', nameEn: 'Natural Limestone', hex: '#D4C9B0', icon: '🪨', promptDesc: 'natural cream limestone with subtle fossil patterns, matte honed surface with warm earthy undertones' },
  { id: 'sandstone', category: 'stone', name: 'Đá Cát Vàng', nameEn: 'Golden Sandstone', hex: '#D4A76A', icon: '🪨', promptDesc: 'warm golden sandstone with layered sedimentary grain patterns, rough natural cleft texture' },
  { id: 'travertine', category: 'stone', name: 'Đá Travertine', nameEn: 'Travertine', hex: '#E8DCC8', icon: '🪨', promptDesc: 'classic Italian travertine stone with natural pitted holes and wavy vein patterns, warm ivory tone with cross-cut finish' },
  { id: 'basalt', category: 'stone', name: 'Đá Basalt Đen', nameEn: 'Dark Basalt', hex: '#3D3D3D', icon: '🪨', promptDesc: 'dark volcanic basalt stone with fine-grained dense texture, matte bush-hammered surface finish' },
  { id: 'slate_gray', category: 'stone', name: 'Đá Slate Xám', nameEn: 'Gray Slate', hex: '#6B7B8D', icon: '🪨', promptDesc: 'natural gray slate stone with visible layered cleavage planes, rough riven surface with subtle blue-gray tones' },
  { id: 'slate_black', category: 'stone', name: 'Đá Slate Đen', nameEn: 'Black Slate', hex: '#333842', icon: '🪨', promptDesc: 'deep charcoal black slate with fine foliated texture, natural split face with subtle metallic shimmer' },
  { id: 'quartzite', category: 'stone', name: 'Đá Thạch Anh', nameEn: 'White Quartzite', hex: '#E8E4DE', icon: '🪨', promptDesc: 'white quartzite stone with subtle veining and sparkling quartz crystals, polished luminous surface' },

  // ── BRICK (Gạch) ──
  { id: 'brick_red', category: 'brick', name: 'Gạch Đỏ Truyền Thống', nameEn: 'Traditional Red Brick', hex: '#A0522D', icon: '🧱', promptDesc: 'classic traditional red clay brick wall with visible mortar joints, weathered terracotta texture with natural color variation' },
  { id: 'brick_orange', category: 'brick', name: 'Gạch Cam Nung', nameEn: 'Orange Fired Brick', hex: '#CC6633', icon: '🧱', promptDesc: 'warm orange fired clay brick with rustic surface texture, standard stretcher bond pattern with cream mortar joints' },
  { id: 'brick_brown', category: 'brick', name: 'Gạch Nâu Sẫm', nameEn: 'Dark Brown Brick', hex: '#6B3A2A', icon: '🧱', promptDesc: 'dark chocolate brown brick with subtle manganese flashing, smooth wirecut face with tight gray mortar joints' },
  { id: 'brick_white', category: 'brick', name: 'Gạch Trắng Hiện Đại', nameEn: 'Modern White Brick', hex: '#E8E0D8', icon: '🧱', promptDesc: 'clean modern white-washed brick wall with visible texture, painted masonry with subtle mortar lines showing through' },
  { id: 'brick_yellow', category: 'brick', name: 'Gạch Vàng London', nameEn: 'London Yellow Brick', hex: '#C8A96E', icon: '🧱', promptDesc: 'classic London yellow stock brick with warm golden tones, slightly rough surface with natural color variation and gray mortar' },
  { id: 'brick_gray', category: 'brick', name: 'Gạch Xám Công Nghiệp', nameEn: 'Industrial Gray Brick', hex: '#7A7A72', icon: '🧱', promptDesc: 'industrial gray engineering brick, smooth dense surface with minimal absorption, modern stack bond with thin dark mortar joints' },
  { id: 'brick_reclaimed', category: 'brick', name: 'Gạch Cổ Tái Chế', nameEn: 'Reclaimed Vintage Brick', hex: '#8B5742', icon: '🧱', promptDesc: 'reclaimed vintage brick with heavily weathered patina, mixed red-brown tones with lime mortar remnants and character marks' },

  // ── MARBLE (Đá Cẩm Thạch) ──
  { id: 'marble_carrara', category: 'marble', name: 'Cẩm Thạch Carrara', nameEn: 'Carrara White Marble', hex: '#F0EDE8', icon: '🏛️', promptDesc: 'premium Italian Carrara white marble with delicate soft gray veining, polished glossy surface with luminous depth' },
  { id: 'marble_calacatta', category: 'marble', name: 'Cẩm Thạch Calacatta', nameEn: 'Calacatta Gold Marble', hex: '#F5F0E6', icon: '🏛️', promptDesc: 'luxury Calacatta marble with dramatic bold gold and gray veining on bright white background, bookmatched polished slabs' },
  { id: 'marble_statuario', category: 'marble', name: 'Cẩm Thạch Statuario', nameEn: 'Statuario Marble', hex: '#F2EEE9', icon: '🏛️', promptDesc: 'prestigious Statuario marble with striking bold gray veins on pure white ground, high-gloss polished cathedral pattern' },
  { id: 'marble_nero', category: 'marble', name: 'Cẩm Thạch Nero Marquina', nameEn: 'Nero Marquina Marble', hex: '#1C1C1E', icon: '🏛️', promptDesc: 'dramatic Nero Marquina black marble with crisp white calcite veining, deep polished surface with mirror-like reflection' },
  { id: 'marble_emperador', category: 'marble', name: 'Cẩm Thạch Emperador', nameEn: 'Emperador Dark Marble', hex: '#5C3D2E', icon: '🏛️', promptDesc: 'rich Emperador dark brown marble with lighter golden-tan veining throughout, polished warm chocolate surface' },
  { id: 'marble_cream', category: 'marble', name: 'Cẩm Thạch Kem', nameEn: 'Cream Marble', hex: '#F0E6D3', icon: '🏛️', promptDesc: 'warm cream beige marble (Crema Marfil) with soft subtle veining, polished surface with honey and ivory tones' },

  // ── WOOD (Gỗ) ──
  { id: 'wood_oak', category: 'wood', name: 'Gỗ Sồi Tự Nhiên', nameEn: 'Natural Oak Wood', hex: '#C4A46C', icon: '🪵', promptDesc: 'natural oak wood with visible grain pattern and annual rings, warm honey-golden tone with satin matte finish' },
  { id: 'wood_walnut', category: 'wood', name: 'Gỗ Óc Chó', nameEn: 'Walnut Wood', hex: '#5C3A1E', icon: '🪵', promptDesc: 'rich American walnut wood with deep chocolate-brown color and dramatic swirling grain pattern, smooth oiled finish' },
  { id: 'wood_teak', category: 'wood', name: 'Gỗ Teak', nameEn: 'Teak Wood', hex: '#8B6914', icon: '🪵', promptDesc: 'premium golden-brown teak wood with straight tight grain, natural oil-rich surface with warm amber undertones' },
  { id: 'wood_pine', category: 'wood', name: 'Gỗ Thông', nameEn: 'Pine Wood', hex: '#DEB887', icon: '🪵', promptDesc: 'light natural pine wood with visible knots and soft grain, pale yellow-cream tone with subtle resin marks' },
  { id: 'wood_mahogany', category: 'wood', name: 'Gỗ Gõ Đỏ', nameEn: 'Mahogany Wood', hex: '#6B2A1A', icon: '🪵', promptDesc: 'deep reddish-brown mahogany wood with fine interlocked grain, rich lustrous polished surface with depth' },
  { id: 'wood_bamboo', category: 'wood', name: 'Tre Ép Tự Nhiên', nameEn: 'Natural Bamboo', hex: '#C8B560', icon: '🪵', promptDesc: 'natural pressed bamboo with distinctive node lines and parallel fiber texture, light golden-straw color with eco-organic feel' },
  { id: 'wood_reclaimed', category: 'wood', name: 'Gỗ Cũ Tái Chế', nameEn: 'Reclaimed Barnwood', hex: '#8B8378', icon: '🪵', promptDesc: 'weathered reclaimed barnwood planks with silver-gray patina, rough-sawn texture with nail holes and character marks' },
  { id: 'wood_ebony', category: 'wood', name: 'Gỗ Mun Đen', nameEn: 'Ebony Wood', hex: '#2C2416', icon: '🪵', promptDesc: 'luxury jet-black ebony wood with extremely fine dense grain, high-gloss polished surface with subtle dark brown streaks' },

  // ── METAL / INOX ──
  { id: 'inox_brushed', category: 'metal', name: 'Inox Xước Mờ', nameEn: 'Brushed Stainless Steel', hex: '#C0C0C0', icon: '⚙️', promptDesc: 'brushed stainless steel (inox) with fine directional hairline texture, matte satin metallic surface with subtle reflections' },
  { id: 'inox_polished', category: 'metal', name: 'Inox Bóng Gương', nameEn: 'Polished Stainless Steel', hex: '#D8D8D8', icon: '⚙️', promptDesc: 'mirror-polished stainless steel with highly reflective chrome-like surface, clean metallic finish reflecting surroundings' },
  { id: 'inox_matte', category: 'metal', name: 'Inox Mờ Mịn', nameEn: 'Matte Stainless Steel', hex: '#A8A8A8', icon: '⚙️', promptDesc: 'matte bead-blasted stainless steel with soft non-reflective surface, uniform silver-gray industrial finish' },
  { id: 'aluminum', category: 'metal', name: 'Nhôm Anod Bạc', nameEn: 'Anodized Aluminum', hex: '#B0B0B0', icon: '⚙️', promptDesc: 'anodized aluminum with smooth satin silver finish, lightweight modern metallic surface with subtle brushed texture' },
  { id: 'aluminum_black', category: 'metal', name: 'Nhôm Anod Đen', nameEn: 'Black Anodized Aluminum', hex: '#333333', icon: '⚙️', promptDesc: 'black anodized aluminum with deep matte dark finish, sleek modern metallic surface with subtle reflective quality' },
  { id: 'copper', category: 'metal', name: 'Đồng Đỏ', nameEn: 'Copper', hex: '#B87333', icon: '⚙️', promptDesc: 'warm polished copper metal with rich reddish-orange metallic luster, smooth reflective surface with natural warm glow' },
  { id: 'copper_patina', category: 'metal', name: 'Đồng Patina Xanh', nameEn: 'Patinated Copper', hex: '#4A8B6F', icon: '⚙️', promptDesc: 'aged patinated copper with natural verdigris green oxidation, weathered surface with turquoise-green organic patterns' },
  { id: 'corten', category: 'metal', name: 'Thép Corten Rỉ', nameEn: 'Corten Weathering Steel', hex: '#8B4513', icon: '⚙️', promptDesc: 'Corten weathering steel with rich rust-orange oxidized patina, rough industrial surface with warm brown-orange tones' },
  { id: 'zinc', category: 'metal', name: 'Kẽm Tấm', nameEn: 'Zinc Cladding', hex: '#9DA3A6', icon: '⚙️', promptDesc: 'zinc metal cladding panels with blue-gray matte surface, standing seam joints with natural weathered patina developing' },
  { id: 'gold_brushed', category: 'metal', name: 'Inox Mạ Vàng Xước', nameEn: 'Brushed Gold PVD', hex: '#C5A55A', icon: '⚙️', promptDesc: 'brushed gold PVD-coated stainless steel with warm champagne-gold metallic finish, fine directional hairline texture' },
  { id: 'rose_gold', category: 'metal', name: 'Inox Vàng Hồng', nameEn: 'Rose Gold PVD', hex: '#B76E79', icon: '⚙️', promptDesc: 'rose gold PVD-coated stainless steel with warm pink-copper metallic luster, elegant satin brushed finish' },

  // ── TILE (Gạch Lát) ──
  { id: 'tile_ceramic_white', category: 'tile', name: 'Gạch Men Trắng', nameEn: 'White Ceramic Tile', hex: '#F5F5F0', icon: '🔲', promptDesc: 'clean white glazed ceramic wall tile with subtle glossy reflection, uniform grid pattern with thin gray grout lines' },
  { id: 'tile_subway', category: 'tile', name: 'Gạch Subway Trắng', nameEn: 'White Subway Tile', hex: '#F0EDE8', icon: '🔲', promptDesc: 'classic white subway tile in running bond pattern, beveled edges with glossy glaze and contrasting gray grout lines' },
  { id: 'tile_mosaic', category: 'tile', name: 'Gạch Mosaic Đa Sắc', nameEn: 'Colorful Mosaic Tile', hex: '#5B8C8C', icon: '🔲', promptDesc: 'small-format mosaic tiles in mixed blue-green-teal tones, creating a shimmering handmade artisan surface pattern' },
  { id: 'tile_terracotta', category: 'tile', name: 'Gạch Đất Nung', nameEn: 'Terracotta Floor Tile', hex: '#C2622D', icon: '🔲', promptDesc: 'rustic handmade terracotta clay floor tiles with warm earthy red-orange tone, matte unglazed surface with natural variation' },
  { id: 'tile_hexagonal', category: 'tile', name: 'Gạch Lục Giác', nameEn: 'Hexagonal Tile', hex: '#E0DCD4', icon: '🔲', promptDesc: 'modern hexagonal tiles in neutral tones creating honeycomb pattern, matte porcelain surface with thin dark grout lines' },
  { id: 'tile_porcelain_wood', category: 'tile', name: 'Gạch Giả Gỗ', nameEn: 'Wood-Look Porcelain Tile', hex: '#A08060', icon: '🔲', promptDesc: 'wood-look porcelain plank tiles with realistic oak grain texture, warm brown tone in staggered plank layout' },
  { id: 'tile_cement', category: 'tile', name: 'Gạch Bông Xi Măng', nameEn: 'Cement Encaustic Tile', hex: '#8B9DAF', icon: '🔲', promptDesc: 'decorative cement encaustic tiles with intricate geometric Moroccan-style pattern, matte surface in blue-gray and white' },

  // ── CONCRETE (Bê Tông) ──
  { id: 'concrete_raw', category: 'concrete', name: 'Bê Tông Trần', nameEn: 'Raw Exposed Concrete', hex: '#9A9A92', icon: '🏗️', promptDesc: 'raw exposed concrete (béton brut) with visible formwork board marks and tie holes, industrial gray with natural imperfections' },
  { id: 'concrete_smooth', category: 'concrete', name: 'Bê Tông Mịn', nameEn: 'Smooth Fair-Faced Concrete', hex: '#B0AFA8', icon: '🏗️', promptDesc: 'smooth fair-faced architectural concrete with minimal surface texture, uniform light gray with subtle color variation' },
  { id: 'concrete_polished', category: 'concrete', name: 'Bê Tông Đánh Bóng', nameEn: 'Polished Concrete', hex: '#A0A098', icon: '🏗️', promptDesc: 'polished concrete floor/wall with exposed aggregate specks, semi-glossy smooth surface with subtle stone chips visible' },
  { id: 'concrete_stamped', category: 'concrete', name: 'Bê Tông Dập Khuôn', nameEn: 'Stamped Concrete', hex: '#B5A48C', icon: '🏗️', promptDesc: 'stamped decorative concrete with natural stone slab imprint pattern, textured surface in warm sandstone tones' },
  { id: 'microcement', category: 'concrete', name: 'Xi Măng Micro', nameEn: 'Microcement', hex: '#C8C2B8', icon: '🏗️', promptDesc: 'seamless microcement coating with ultra-smooth troweled finish, uniform warm gray with subtle cloud-like tonal variations' },

  // ── GLASS (Kính) ──
  { id: 'glass_clear', category: 'glass', name: 'Kính Trong Suốt', nameEn: 'Clear Float Glass', hex: '#C8E6F0', icon: '🪟', promptDesc: 'clear transparent float glass with high light transmission, visible reflections of sky and surroundings on surface' },
  { id: 'glass_tinted', category: 'glass', name: 'Kính Màu Xanh', nameEn: 'Blue-Tinted Glass', hex: '#5B8FA8', icon: '🪟', promptDesc: 'blue-tinted architectural glass with solar control properties, semi-reflective surface with cool blue-green hue' },
  { id: 'glass_frosted', category: 'glass', name: 'Kính Mờ', nameEn: 'Frosted Glass', hex: '#E8ECF0', icon: '🪟', promptDesc: 'acid-etched frosted glass with diffused translucent surface, soft white-milky appearance allowing light but blocking visibility' },
  { id: 'glass_mirror', category: 'glass', name: 'Kính Gương', nameEn: 'Mirror Glass', hex: '#D0D8E0', icon: '🪟', promptDesc: 'reflective mirror glass with high-fidelity environmental reflections, chrome-like surface reflecting sky and landscape' },
  { id: 'glass_smoked', category: 'glass', name: 'Kính Khói', nameEn: 'Smoked Glass', hex: '#4A4A50', icon: '🪟', promptDesc: 'dark smoked glass with deep gray-bronze tint, semi-transparent with reduced light transmission and moody appearance' },
  { id: 'glass_low_e', category: 'glass', name: 'Kính Low-E Phản Quang', nameEn: 'Low-E Reflective Glass', hex: '#8AACBC', icon: '🪟', promptDesc: 'low-emissivity coated glass with subtle green-blue reflective coating, energy-efficient curtain wall appearance' },
];

// Category metadata for UI grouping
window.MATERIAL_CATEGORIES = [
  { id: 'stone',    name: 'Đá Tự Nhiên',     nameEn: 'Natural Stone',    icon: '🪨' },
  { id: 'brick',    name: 'Gạch Xây',        nameEn: 'Brick',            icon: '🧱' },
  { id: 'marble',   name: 'Đá Cẩm Thạch',    nameEn: 'Marble',           icon: '🏛️' },
  { id: 'wood',     name: 'Gỗ',              nameEn: 'Wood',             icon: '🪵' },
  { id: 'metal',    name: 'Kim Loại / Inox',  nameEn: 'Metal / Inox',     icon: '⚙️' },
  { id: 'tile',     name: 'Gạch Lát / Ốp',   nameEn: 'Tile',             icon: '🔲' },
  { id: 'concrete', name: 'Bê Tông',          nameEn: 'Concrete',         icon: '🏗️' },
  { id: 'glass',    name: 'Kính',             nameEn: 'Glass',            icon: '🪟' },
];
