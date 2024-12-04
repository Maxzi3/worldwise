import styles from "./Button.module.css";

const Button = ({ children, onclick, type }) => {
  return (
    <div onClick={onclick} className={`${styles.btn} ${styles[type]}`}>
      {children}
    </div>
  );
};

export default Button;
