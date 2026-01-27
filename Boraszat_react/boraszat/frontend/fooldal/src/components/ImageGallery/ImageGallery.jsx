import styles from "./ImageGallery.module.css";

export default function ImageGallery({ images }) {
  return (
    <div className={styles.gallery}>
      {images.map((img) => (
        <img key={img.src} src={img.src} alt={img.alt} loading="lazy" />
      ))}
    </div>
  );
}
