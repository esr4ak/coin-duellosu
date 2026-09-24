# Stablex · Coin Düellosu (herkese açık site)

- `index.html` → sade oyun (pop-up ve kampanya yok)
- `kampanyali.html` → e-posta adımı ve kampanya senaryolu sürüm
- Veri her gece 00.05'te (TSİ) CoinGecko'dan otomatik güncellenir (`.github/workflows/update-market.yml`).

## Kurulum (bir kez, ~5 dk)
1. GitHub'da yeni **public** repo aç (ör. `coin-duellosu`).
2. Bu klasördeki her şeyi (gizli `.github` ve `.nojekyll` dahil) repoya yükle.
3. Settings → Secrets and variables → Actions → **New repository secret**: ad `COINGECKO_API_KEY`, değer CoinGecko anahtarın.
4. Settings → Pages → Source: **Deploy from a branch**, Branch: `main` / `(root)` → Save.
5. Actions sekmesi → "Günlük piyasa verisi" → **Run workflow** (ilk güncellemeyi hemen yapar).

Adresler: `https://<kullanıcı-adı>.github.io/coin-duellosu/` ve `.../kampanyali.html`
