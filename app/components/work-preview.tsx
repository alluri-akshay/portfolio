import type { ReactNode } from "react";
import styles from "./selected-work.module.css";

export function WorkPreview({ children }: { children: ReactNode }) {
  return <div className={styles.preview}>
    <div className={styles.previewPlane}>{children}</div>
  </div>;
}
