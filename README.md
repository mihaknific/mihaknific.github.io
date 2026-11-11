# Miha Knific — Portfolio

Osebna predstavitvena spletna stran z izbranimi projekti, iskalnim arhivom in stranjo za podporo.

## Strani

- [Portfolio](https://mihaknific.github.io/)
- [Arhiv projektov](https://mihaknific.github.io/arhiv.html)
- [Podpri moje ustvarjanje](https://mihaknific.github.io/podpora.html)

Arhiv in podpora se odpreta kot drsna panela, povezavi pa sta primerni tudi za neposreden obisk in deljenje. Navigacija med sekcijami portfolia uporablja sidra, na primer `#projects` in `#contact`.

## Razvoj

Stran je statična in ne potrebuje namestitve odvisnosti. Za polno preverjanje navigacije in odložišča jo odprite prek lokalnega HTTP-strežnika. Če je Python nameščen, ga zaženite v korenski mapi projekta:

```powershell
python -m http.server 8000
```

Nato odprite `http://localhost:8000/`. Uporabite lahko tudi drug lokalni statični strežnik, na primer Live Server v VS Code. `.local/` vsebuje zasebne delovne zapiske in ni del javne objave.

## Arhiv projektov

- **Računkomat** — lokalno orodje za izdajanje računov
- **Besedomat** — orodje za obdelavo besedil
- **Spletni bralnik** — bralnik ePub in PDF z glasovnim branjem
- **UPN Generator** — generator plačilnih nalogov s QR-kodo
- **Medijski Atlas** — pregled slovenskega medijskega prostora
- **Miselni izzivi** — interaktivne kognitivne igre in testi
- **Odprta Znanost** — učna gradiva in simulacije
- **Bralnik klasikov** — slovenska književnost
- **PRIPOVEDI** — interaktivne tekstovne zgodbe
- **Finančna pot** — kalkulator finančne neodvisnosti
- **Vmes** — Firefoxova razširitev za opomnike za odmore in časovne omejitve spletnih strani
- **UPN QR API — testna stran** — samostojni tester ob projektu API; GitHub Pages stran ne gosti in ne kliče zalednega API-ja. Za celovitejše ustvarjanje plačilnih nalogov je na voljo UPN Generator.
- **Sanctissima Felis** — interaktivna spletna predstavitev Njene Vzvišene Brezbrižnosti
