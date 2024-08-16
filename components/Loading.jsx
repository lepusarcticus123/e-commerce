import styles from "./loading.module.css";
export default function Loading() {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingtext}>
        <div className={styles.box}>
          <span className={styles.loadingtext}>L</span>
          <span class={styles.loadingtext}>O</span>
          <span class={styles.loadingtext}>A</span>
          <span class={styles.loadingtext}>D</span>
          <span class={styles.loadingtext}>I</span>
          <span class={styles.loadingtext}>N</span>
          <span class={styles.loadingtext}>G</span>
        </div>
      </div>
    </div>
  );
}
