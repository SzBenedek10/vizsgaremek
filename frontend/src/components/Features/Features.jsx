import styles from "./Features.module.css";
import { Link } from "react-router-dom";

export default function Features({ items }) {
  return (
    <div className={styles.features}>
      {items.map((it, idx) => (
        <div key={idx} className={styles.featureItem}>
          {it.type === "link" ? (
            <>
              <Link to={it.to} className={styles.customLink}>{it.linkLabel}</Link>
              <p>{it.text}</p>
            </>
          ) : (
            <>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
