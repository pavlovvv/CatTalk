import en from "../../other/locales/en";
import ru from "../../other/locales/ru";
import ua from "../../other/locales/ua";

export default function setTranslation(locale: string) {
  if (locale === "en") {
    return en;
  } else if (locale === "ru") {
    return ru;
  } else if (locale === "ua") {
    return ua;
  }
}
