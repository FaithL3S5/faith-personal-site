import Image from "next/image";
import logo from "@/assets/logo.png";
import { CornerNotch } from "@/components/ui/CornerNotch/CornerNotch";
import { FactList } from "@/components/ui/FactList/FactList";
import { about } from "@/content/home";
import { fullName } from "@/content/site";
import styles from "./styles/ProfilePlate.module.css";

const languageFacts = about.languages.map((language) => ({
  label: language.name,
  value: language.level,
}));

const educationFacts = [
  { label: about.education.school, value: about.education.degree, stacksOnMobile: true },
];

export function ProfilePlate({ className }: { className?: string }) {
  return (
    <div className={className ? `${styles.plate} ${className}` : styles.plate}>
      <CornerNotch mark="triangle" isOutlined className={styles.notch} />
      <div className={styles.head}>
        <div className={styles.logoBox}>
          <Image src={logo} alt="Faith logo" sizes="7.25rem" className={styles.logo} />
        </div>
        <div className={styles.identity}>
          <span className={styles.kicker}>Profile</span>
          <p className={styles.name}>{fullName}</p>
          <p className={styles.role}>{about.profileRole}</p>
        </div>
      </div>
      <div className={styles.body}>
        <h3 className={styles.groupTitle}>Languages</h3>
        <FactList facts={languageFacts} variant="plate" hasClosingRule={false} />
        <h3 className={`${styles.groupTitle} ${styles.laterGroup}`}>Education</h3>
        <FactList facts={educationFacts} variant="plate" hasClosingRule={false} />
      </div>
    </div>
  );
}
