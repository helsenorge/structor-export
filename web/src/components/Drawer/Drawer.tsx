import React, { forwardRef, ReactNode, useRef, Ref } from "react";

import { useTranslation } from "react-i18next";

import useOutsideClick from "../../hooks/useOutsideClick";
import IconBtn from "../IconBtn/IconBtn";

import "./Drawer.css";

type DrawerProps = {
  position: "left" | "right";
  visible: boolean;
  hide: () => void;
  title?: string;
  children?: ReactNode;
};

const Drawer = (
  props: DrawerProps,
  ref?: Ref<HTMLDivElement>,
): React.JSX.Element => {
  const { t } = useTranslation();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  useOutsideClick(drawerRef, props.hide, !props.visible);

  const open = props.visible ? "open" : "";
  const classNames = `drawer ${props.position}-drawer ${open}`;

  return (
    <>
      {props.visible && <div className="overlay" />}
      <div className={classNames} ref={ref || drawerRef}>
        <div className="drawer-header">
          <IconBtn type="x" title={t("Close (Esc)")} onClick={props.hide} />
          {props.title && <h1>{props.title}</h1>}
        </div>
        {props.children}
      </div>
    </>
  );
};

const ForwardedDrawer = forwardRef(Drawer);
export default ForwardedDrawer;
