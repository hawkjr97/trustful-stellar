import { SVGProps } from "react";
import tailwindConfig from "tailwind.config";

export const BankIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.0156 0.203125L1.51555 7.70312C0.421804 8.17188 -0.187571 9.34375 0.0546163 10.5C0.296804 11.6562 1.31243 12.5 2.49993 12.5V13.125C2.49993 14.1641 3.33587 15 4.37493 15H35.6249C36.664 15 37.4999 14.1641 37.4999 13.125V12.5C38.6874 12.5 39.7109 11.6641 39.9452 10.5C40.1796 9.33594 39.5702 8.16406 38.4843 7.70312L20.9843 0.203125C20.3593 -0.0625 19.6406 -0.0625 19.0156 0.203125ZM9.99993 17.5H4.99993V32.8359C4.95305 32.8594 4.90618 32.8906 4.8593 32.9219L1.1093 35.4219C0.195241 36.0312 -0.218821 37.1719 0.101491 38.2266C0.421804 39.2812 1.39837 40 2.49993 40H37.4999C38.6015 40 39.5702 39.2812 39.8906 38.2266C40.2109 37.1719 39.8046 36.0312 38.8827 35.4219L35.1327 32.9219C35.0859 32.8906 35.039 32.8672 34.9921 32.8359V17.5H29.9999V32.5H26.8749V17.5H21.8749V32.5H18.1249V17.5H13.1249V32.5H9.99993V17.5ZM19.9999 5C20.663 5 21.2989 5.26339 21.7677 5.73223C22.2365 6.20107 22.4999 6.83696 22.4999 7.5C22.4999 8.16304 22.2365 8.79893 21.7677 9.26777C21.2989 9.73661 20.663 10 19.9999 10C19.3369 10 18.701 9.73661 18.2322 9.26777C17.7633 8.79893 17.4999 8.16304 17.4999 7.5C17.4999 6.83696 17.7633 6.20107 18.2322 5.73223C18.701 5.26339 19.3369 5 19.9999 5Z"
        fill={props.color ?? tailwindConfig.theme.extend.colors.brandWhite}
      />
    </svg>
  );
};
