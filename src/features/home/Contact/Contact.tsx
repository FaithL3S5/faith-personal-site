import { contactHeadline } from "@/content/home";
import { email, links } from "@/content/site";
import { CopyEmail } from "../CopyEmail/CopyEmail";
import { SectionFrame } from "../SectionFrame/SectionFrame";
import styles from "./styles/Contact.module.css";

const profileLinks = [
  { label: "LinkedIn", href: links.linkedIn, text: "linkedin.com/in/muhammad-fatih-fahroji" },
  { label: "GitHub", href: links.gitHub, text: "github.com/FaithL3S5" },
];

export function Contact() {
  return (
    <SectionFrame sectionId="contact" hasBottomRule={false} contentClassName={styles.content}>
      <p className={styles.headline} data-reveal-item="">
        {contactHeadline}
      </p>
      <dl className={styles.rows} data-reveal-item="">
        <div className={`${styles.row} ${styles.emailRow}`}>
          <dt className={styles.label}>Email</dt>
          <dd className={styles.emailDetails}>
            <span className={styles.value}>{email}</span>
            <CopyEmail />
          </dd>
        </div>
        {profileLinks.map((profileLink) => (
          <div key={profileLink.label} className={`${styles.row} ${styles.linkRow}`}>
            <dt className={styles.label}>{profileLink.label}</dt>
            <dd className={styles.value}>
              <a href={profileLink.href} target="_blank" rel="noopener" className={styles.link}>
                {profileLink.text}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </SectionFrame>
  );
}
