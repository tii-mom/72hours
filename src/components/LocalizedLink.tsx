import { Link, type LinkProps, type To } from "react-router-dom";
import { useLocale } from "../lib/locale";
import { localizePath, stripLocaleSearch } from "../lib/routes";

function localizeTo(to: To, locale: "zh-CN" | "en-US"): To {
  if (typeof to === "string") {
    if (!to.startsWith("/")) {
      return to;
    }

    const [withoutHash, hash = ""] = to.split("#");
    const [pathname, rawSearch = ""] = withoutHash.split("?");
    const search = stripLocaleSearch(rawSearch ? `?${rawSearch}` : "");

    return `${localizePath(pathname || "/", locale)}${search}${hash ? `#${hash}` : ""}`;
  }

  if (to.pathname?.startsWith("/")) {
    return {
      ...to,
      pathname: localizePath(to.pathname, locale),
      search: stripLocaleSearch(to.search ?? ""),
    };
  }

  return to;
}

export function LocalizedLink({ to, ...props }: LinkProps) {
  const { locale } = useLocale();
  return <Link to={localizeTo(to, locale)} {...props} />;
}

export default LocalizedLink;
