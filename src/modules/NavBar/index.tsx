import React from "react";
// import ProfileIcon from "./ProfileIcon";
// import Menu from "./Menu";
import styles from "./NavBar.module.css";
import Back from "./elements/Back";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <div className={styles.navBar}>
      {/* {pathname === "/" ? <Menu /> : <Back />} */}
      {/* {pathname === "/" ? <ProfileIcon /> : null} */}
      {pathname.includes("training") ? <Back /> : null}
    </div>
  );
}
