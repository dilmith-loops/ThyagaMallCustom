-- Homepage hero slides (Admin → Hero Slides)
-- For servers without SSH: import this once in phpMyAdmin (select the database → Import).
-- Equivalent to: php artisan migrate  (migration 2026_10_26_000001_create_hero_slides_table)

CREATE TABLE IF NOT EXISTS `hero_slides` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title_line1` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title_line2` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subtext` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `show_badge` tinyint(1) NOT NULL DEFAULT '1',
  `badge_top` varchar(12) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `badge_value` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `badge_bottom` varchar(12) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cta_text` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Shop Now',
  `cta_link` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '/shop',
  `box_color` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#7c3aed',
  `accent_color` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#f472b6',
  `gradient_from` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#1a0033',
  `gradient_via` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#2e0a5c',
  `gradient_to` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#5b1a8f',
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default slides (only inserted if the table is empty)
INSERT INTO `hero_slides`
  (`title_line1`, `title_line2`, `subtext`, `show_badge`, `badge_top`, `badge_value`, `badge_bottom`, `cta_text`, `cta_link`,
   `box_color`, `accent_color`, `gradient_from`, `gradient_via`, `gradient_to`, `sort_order`, `is_active`, `created_at`, `updated_at`)
SELECT * FROM (
  SELECT 'Big Savings' AS t1, 'Brighter Living' AS t2, 'Electronics, Home, Fashion, Beauty & more' AS sub, 1 AS sb, 'UP TO' AS bt, '60%' AS bv, 'OFF' AS bb, 'Shop Now' AS ct, '/shop' AS cl, '#7c3aed' AS bc, '#f472b6' AS ac, '#1a0033' AS gf, '#2e0a5c' AS gv, '#5b1a8f' AS gt, 0 AS so, 1 AS ia, NOW() AS ca, NOW() AS ua
  UNION ALL SELECT 'Smarter Devices', 'Better Everyday', 'Premium Audio, Smartwatches & Gadgets', 1, 'UP TO', '50%', 'OFF', 'Shop Now', '/shop?category=electronics', '#2563eb', '#22d3ee', '#030a2e', '#0b1f5c', '#3b0a6b', 1, 1, NOW(), NOW()
  UNION ALL SELECT 'Trending Styles', 'Modern Living', 'Designer Apparel, Fragrances & Accessories', 1, 'UP TO', '45%', 'OFF', 'Shop Now', '/shop?category=fashion', '#e11d48', '#fbbf24', '#2a0018', '#5c0a33', '#8f1a4f', 2, 1, NOW(), NOW()
  UNION ALL SELECT 'Home & Living', 'Smart Essentials', 'Cookware, Bedding, Decor & Appliances', 1, 'UP TO', '55%', 'OFF', 'Shop Now', '/shop?category=home', '#0d9488', '#a3e635', '#001f1c', '#063d3a', '#2e0a5c', 3, 1, NOW(), NOW()
  UNION ALL SELECT 'Exclusive Deals', 'Mega Savings', 'Daily Essentials & Groceries Delivered Fast', 1, 'UP TO', '40%', 'OFF', 'Shop Now', '/shop', '#f59e0b', '#fb7185', '#240046', '#4a0a3d', '#8f2a0a', 4, 1, NOW(), NOW()
) AS defaults
WHERE NOT EXISTS (SELECT 1 FROM `hero_slides`);

-- Mark the Laravel migration as run so a later `php artisan migrate` skips it
INSERT INTO `migrations` (`migration`, `batch`)
SELECT next_run.migration, next_run.batch FROM (
  SELECT '2026_10_26_000001_create_hero_slides_table' AS migration, COALESCE(MAX(`batch`), 0) + 1 AS batch FROM `migrations`
) AS next_run
WHERE NOT EXISTS (SELECT 1 FROM `migrations` WHERE `migration` = '2026_10_26_000001_create_hero_slides_table');
