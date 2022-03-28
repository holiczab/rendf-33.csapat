# Rendszerfejlesztés korszerű módszerei - 33.csapat 👨‍💻
A rendszerfejlesztés korszerű módszerei tárgy 33. csapatának github repository-ja.
## Csapattagok
| Név | Neptunkód | Szerver vagy Kliens |
| ------ | ------ | ------ |
| Holicza Barnabás | ARIAN2 | Szerver |
| Kretz Zsombor György | EMSCZY | Szerver |
| Altmann Bence | Y19WIL | Kliens |
| Molnár Dániel | OXOOBF | Kliens |

## Szerver-Kliens Architektúra
| Név | Választott technológia/programozási nyelv |
| ------ | ------ |
| Szerver | Python, Socket, Sqlite |
| Kliens | React, TypeScript |

## Beszámolók időpontjai
| Beszámoló | Mennyi idő van még hátra? |
| ------ | ------ |
| Beszámoló 1 | [2022.04.05. 10:30](https://www.tickcounter.com/countdown/3124637/beszamolo-1) |
| Beszámoló 2 | [2022.05.03. 10:30](https://www.tickcounter.com/countdown/3124638/beszamolo-2) |
| Beszámoló 3 | [2022.05.17. 10:30](https://www.tickcounter.com/countdown/3124641/beszamolo-3) |

## Mérföldkövek
### 1. Mérföldkő
- [x] A rendszer adatmodelljének megtervezése és előállítása
> - [x] Adatbázis szerkezetének kiépítése sqlite-ban
- [x] A rendszer architektúrájának megtervezése
> - [x] Python Szerver , React Kliens előállítása
- [ ] Felhasználók beléptetése (regisztráció nincs, adminisztrátor adja hozzá az embereket)
> - [x] Szerver jelszóellenőrzés kezelése
> - [ ] Kliens-Szerver felhasználó név-jelszó ellenőrzés kezelése socket kommunikációval
> - [ ] Kliens- 3 felhasználó típus (Eszközfelelős, Operátor, Karbantartó) külön oldalának kiépítése
- [x] Eszköz kategóriák felvétele, hierarchiába rendezése
> - [ ] Eszközfelelős tudjon kategóriákat felvenni/törölni
> - [ ] Szerver sql műveletek, klienstől adatok fogadásának kezelése
- [x] Eszközök rögzítése (azonosító, név, helyszín, kategóriába sorolás)
> - [ ] Eszközfelelős tudjon eszközt felvenni és törölni
> - [ ] Szerver sql műveletek, klienstől adatok fogadásának kezelése
- [x] Végzettségek felvétele és eszköz kategóriákhoz rendelése
### 2. Mérföldkő
- [ ] Eszköz kategóriához normaidők és karbantartási periódus rögzítése
- [ ] Eszköz kategóriához a karbantartásra vonatkozó instrukciók rögzítése
- [ ] Karbantartók felvétele a rendszerbe
- [ ] Végzettségek karbantartóhoz rendelése
- [ ] Rendkívüli karbantartási feladatok rögzítése a rendszerbe (eszköz, időpont, hiba leírása)
- [ ] Időszakos karbantartási feladatok automatikus generálása (utolsó karbantartás és karbantartási periódus alapján)
- [ ] Feladatok listázása, állapotok megjelenítése

### 3. Mérföldkő
- [ ] Feladatok kiosztása karbantartók számára (manuális hozzárendelés a végzettség egyeztetésével, automatikus megvalósítás opcionális)
- [ ] Az adott karbantartóhoz rendelt feladatok listázása
- [ ] Állapotok beállításának lehetősége (Elfogadva, Elutasítva, Megkezdve, Befejezve)
- [ ] Megkezdve állapotban az instrukciók megjelenítése (2.b)
