import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Dialog from '@radix-ui/react-dialog';
import { useScreenSize } from '@/hooks';
import { getSocket } from '@/utils';
import { C } from '@/constants';
import Cookies from 'js-cookie';

/* ── SVG Icons (from reference) ── */
const ProfileIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-4 min-w-4">
    <path fillRule="evenodd" d="M.87 10.336a4.13 4.13 0 0 0 0 3.328 40 40 0 0 0 1.88 3.709 40 40 0 0 0 2.238 3.479 4.12 4.12 0 0 0 2.907 1.686c1 .107 2.413.212 4.104.212s3.106-.105 4.105-.212a4.12 4.12 0 0 0 2.907-1.686c.592-.819 1.39-2 2.238-3.48a40 40 0 0 0 1.88-3.708 4.13 4.13 0 0 0 0-3.328 40 40 0 0 0-1.88-3.709 40 40 0 0 0-2.238-3.479 4.12 4.12 0 0 0-2.906-1.686c-1-.107-2.414-.212-4.105-.212s-3.106.105-4.106.212a4.12 4.12 0 0 0-2.906 1.686c-.592.819-1.39 2-2.238 3.479a40 40 0 0 0-1.88 3.709m7.965 3.615a1 1 0 1 0-1.672 1.098C8.261 16.722 10.176 17.5 12 17.5s3.739-.778 4.836-2.451a1 1 0 1 0-1.672-1.098c-.652.994-1.862 1.549-3.164 1.549-1.301 0-2.511-.555-3.164-1.549M8.5 8a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1m6 1a1 1 0 1 1 2 0v1a1 1 0 0 1-2 0z" clipRule="evenodd" className="fill-current stroke-transparent" />
  </svg>
);

const AccountDetailsIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-4 min-w-4">
    <path fillRule="evenodd" d="M3.492 20.964c1.626.14 4.318.286 8.508.286s6.883-.145 8.508-.286c1.604-.138 2.807-1.378 2.96-2.958.138-1.428.282-3.514.282-6.006s-.144-4.578-.282-6.006c-.153-1.58-1.356-2.82-2.96-2.958-1.625-.14-4.318-.286-8.508-.286s-6.882.145-8.508.286C1.888 3.174.685 4.414.532 5.994A63 63 0 0 0 .25 12c0 2.492.144 4.578.282 6.006.153 1.58 1.356 2.82 2.96 2.958M14.625 8.25c0-.483.392-.875.875-.875h4a.875.875 0 0 1 0 1.75h-4a.875.875 0 0 1-.875-.875m0 3.75c0-.483.392-.875.875-.875h4a.875.875 0 0 1 0 1.75h-4a.875.875 0 0 1-.875-.875m.875 2.875a.875.875 0 0 0 0 1.75h4a.875.875 0 0 0 0-1.75zM8 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9" clipRule="evenodd" className="fill-current stroke-transparent" />
  </svg>
);

const PreferencesIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-4 min-w-4">
    <path fillRule="evenodd" d="M9.496.72C9.835.538 10.594.25 12 .25s2.164.288 2.503.47a.87.87 0 0 1 .366.4c.1.211.276.585.466 1.03.281.661.809 1.202 1.447 1.572.639.37 1.365.552 2.08.465a26 26 0 0 1 1.125-.111.87.87 0 0 1 .53.116c.328.202.956.716 1.659 1.933s.833 2.019.845 2.403a.87.87 0 0 1-.165.517 26 26 0 0 1-.66.921c-.432.575-.637 1.297-.637 2.034s.205 1.46.637 2.034c.292.389.529.728.66.921a.87.87 0 0 1 .165.517c-.012.385-.142 1.186-.845 2.403s-1.331 1.731-1.658 1.934a.87.87 0 0 1-.53.116 26 26 0 0 1-1.126-.112c-.715-.086-1.441.096-2.08.466-.638.37-1.166.91-1.447 1.571-.19.446-.365.82-.466 1.03a.87.87 0 0 1-.366.4c-.339.183-1.098.47-2.503.47s-2.165-.287-2.504-.47a.87.87 0 0 1-.366-.4c-.1-.21-.275-.584-.465-1.029-.282-.661-.81-1.202-1.449-1.572-.638-.37-1.365-.552-2.08-.466-.48.059-.89.094-1.123.112a.87.87 0 0 1-.53-.116c-.327-.203-.956-.716-1.659-1.934S.991 15.857.98 15.472a.87.87 0 0 1 .165-.517c.131-.193.367-.53.657-.917.433-.576.639-1.3.639-2.038s-.206-1.462-.639-2.038c-.29-.386-.526-.724-.657-.916a.87.87 0 0 1-.165-.518c.012-.384.142-1.185.845-2.403s1.332-1.73 1.659-1.933a.87.87 0 0 1 .53-.116c.232.018.643.053 1.123.111.715.087 1.441-.096 2.08-.466.64-.37 1.167-.91 1.45-1.572.189-.445.363-.818.464-1.028A.87.87 0 0 1 9.496.72M7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0" clipRule="evenodd" className="fill-current stroke-transparent" />
  </svg>
);

const SecurityIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-4 min-w-4">
    <path fillRule="evenodd" d="M12 .25c-4.845 0-7.478.347-8.87.658-1.214.27-1.894 1.299-2.012 2.39A64 64 0 0 0 .75 9.9q0 .385.006.76c.066 4.522 2.362 8.742 6.24 11.116.859.526 1.747 1.012 2.586 1.37.825.35 1.668.604 2.418.604s1.593-.254 2.418-.605c.839-.357 1.727-.843 2.587-1.37 3.877-2.373 6.173-6.593 6.24-11.115q.005-.375.005-.76c0-2.69-.212-5.154-.368-6.602-.118-1.091-.798-2.12-2.012-2.39C19.478.597 16.845.25 12 .25M9.92 16.284a1.4 1.4 0 0 0-.6-.645 1.4 1.4 0 0 0-.855-.196c-.19.023-.359.04-.484.05a1.07 1.07 0 0 1-.753-.198c-.228-.173-.534-.487-.856-1.045-.323-.559-.441-.98-.478-1.265-.04-.312.082-.574.205-.75.073-.104.171-.242.286-.395.17-.226.259-.522.259-.84 0-.319-.09-.615-.26-.84-.114-.153-.212-.291-.284-.395a1.07 1.07 0 0 1-.205-.75c.036-.284.155-.706.477-1.265.323-.558.629-.872.857-1.045.25-.191.538-.216.752-.198.126.01.294.027.484.05.28.034.58-.037.855-.196.277-.16.49-.386.6-.645a14 14 0 0 1 .2-.444c.09-.195.256-.431.547-.553.264-.11.689-.219 1.334-.219s1.07.109 1.333.22c.291.12.457.357.548.552.053.114.124.269.199.444.11.259.323.484.6.645.275.16.574.23.855.195.19-.023.359-.039.485-.05.214-.018.501.007.752.198.228.174.534.487.857 1.046.322.558.44.98.477 1.264.04.313-.082.575-.205.75-.072.104-.17.243-.286.395-.17.226-.258.522-.258.84 0 .32.089.615.258.84.115.154.214.292.286.396.123.176.245.438.205.75-.036.285-.154.706-.477 1.265s-.629.872-.857 1.046c-.25.19-.538.216-.752.197-.126-.01-.295-.027-.485-.05-.28-.034-.58.037-.855.196-.277.16-.49.386-.6.645-.075.175-.146.33-.199.444a1.07 1.07 0 0 1-.548.553c-.264.11-.688.219-1.333.219s-1.07-.109-1.334-.22a1.07 1.07 0 0 1-.548-.552 14 14 0 0 1-.198-.444M12 13.18a2.181 2.181 0 1 0 0-4.363 2.181 2.181 0 0 0 0 4.363" clipRule="evenodd" className="fill-current stroke-transparent" />
  </svg>
);

const VerificationIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-4 min-w-4">
    <path fillRule="evenodd" d="M10.83 6.838c-.577-.036-1-.466-1.034-1.043a33 33 0 0 1-.048-1.927c0-.864.021-1.487.048-1.927A1.08 1.08 0 0 1 10.83.898c.306-.019.693-.033 1.17-.033.478 0 .865.014 1.17.033.577.036 1 .466 1.035 1.043.026.44.047 1.063.047 1.927s-.021 1.487-.047 1.927a1.08 1.08 0 0 1-1.034 1.043c-.306.019-.693.033-1.17.033-.478 0-.865-.014-1.171-.033M8.253 4.663a84 84 0 0 0-4.982.25C1.797 5.04.621 6.12.474 7.633.354 8.891.24 10.87.24 13.877s.113 4.985.234 6.243c.146 1.515 1.323 2.595 2.797 2.72 1.639.14 4.429.295 8.73.295 4.3 0 7.09-.156 8.728-.295 1.475-.125 2.651-1.205 2.797-2.72.121-1.258.234-3.237.234-6.243s-.113-4.986-.234-6.244c-.146-1.514-1.322-2.594-2.797-2.72a84 84 0 0 0-4.982-.25c-.008.5-.024.9-.043 1.22a2.583 2.583 0 0 1-2.441 2.454c-.339.02-.756.035-1.263.035s-.924-.015-1.262-.035a2.583 2.583 0 0 1-2.441-2.453 29 29 0 0 1-.044-1.221m1.996 7.963a2.75 2.75 0 0 1-1.22 2.285 3.84 3.84 0 0 1 2.404 2.938c.08.447-.243.835-.694.887-.615.07-1.646.145-3.243.145s-2.628-.075-3.243-.145c-.45-.052-.773-.44-.693-.887a3.84 3.84 0 0 1 2.403-2.938 2.752 2.752 0 1 1 4.286-2.286m4.754 4.003a1 1 0 1 0 0 2.002h4.003a1 1 0 1 0 0-2.002zm-1.001-2.252a1 1 0 0 1 1-1h4.004a1 1 0 1 1 0 2h-4.003a1 1 0 0 1-1.001-1m1-4.254a1 1 0 1 0 0 2.002h4.004a1 1 0 1 0 0-2.002z" clipRule="evenodd" className="fill-current stroke-transparent" />
  </svg>
);

const TransactionsIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-4 min-w-4">
    <path fillRule="evenodd" d="m16.614 3.861-2.464.042a1537 1537 0 0 0 8.958 9.338c.436.45.537 1.123.142 1.609a7.4 7.4 0 0 1-1.069 1.069c-.486.395-1.158.294-1.609-.142-1.55-1.5-5.306-5.127-9.318-8.94l-.042 2.447c-.008.52-.285 1.013-.788 1.137-.223.054-.479.09-.746.076a4.5 4.5 0 0 1-.803-.124c-.517-.124-.863-.58-.914-1.109-.227-2.346-.142-5.007.146-6.757.149-.907.869-1.56 1.777-1.698C11.65.541 14.256.387 16.594.6c.53.048.988.397 1.111.915.059.246.109.526.123.807a2.6 2.6 0 0 1-.075.747c-.123.505-.618.784-1.139.792M7.385 20.14l2.465-.042C6.03 16.077 2.393 12.31.89 10.759.455 10.31.354 9.636.75 9.15a7.4 7.4 0 0 1 1.07-1.069c.485-.395 1.158-.294 1.608.142 1.55 1.5 5.307 5.127 9.319 8.94l.041-2.447c.009-.52.285-1.013.789-1.137.223-.054.478-.09.745-.076.28.015.559.065.804.124.516.124.863.58.914 1.11.226 2.345.141 5.006-.146 6.756-.15.907-.87 1.56-1.777 1.698-1.768.268-4.373.422-6.711.209-.53-.048-.987-.397-1.11-.915a4.6 4.6 0 0 1-.124-.807 2.6 2.6 0 0 1 .076-.747c.123-.505.618-.784 1.138-.792" clipRule="evenodd" className="fill-current stroke-transparent" />
  </svg>
);

const LiveSupportIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-4 min-w-4">
    <path fillRule="evenodd" d="M3.593.497C5.295.377 8.043.25 12 .25s6.705.128 8.407.247c1.63.114 2.93 1.342 3.08 2.99.133 1.456.263 3.675.263 6.763s-.13 5.307-.263 6.763c-.15 1.648-1.45 2.876-3.08 2.99-1.637.115-4.243.237-7.962.247l-3.632 3.112c-.81.695-2.063.119-2.063-.95v-2.248a92 92 0 0 1-3.157-.16c-1.63-.115-2.93-1.343-3.08-2.991C.38 15.557.25 13.338.25 10.25s.13-5.307.263-6.763C.663 1.84 1.963.611 3.593.497m3.858 11.167a1 1 0 0 1 1.385.287C9.488 12.945 10.7 13.5 12 13.5s2.512-.555 3.164-1.549a1 1 0 1 1 1.672 1.098C15.738 14.722 13.824 15.5 12 15.5c-1.823 0-3.738-.778-4.836-2.451a1 1 0 0 1 .287-1.385" clipRule="evenodd" className="fill-current stroke-transparent" />
  </svg>
);

const HelpCenterIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-4 min-w-4">
    <path fillRule="evenodd" d="M12 23.75C5.51 23.75.25 18.49.25 12S5.51.25 12 .25 23.75 5.51 23.75 12 18.49 23.75 12 23.75m-2.5-17a2 2 0 1 1 4 0 2 2 0 0 1-4 0m3.94 3.807c-.035-.569-.399-1.011-.968-1.044A8 8 0 0 0 12 9.5h-1.75q-.437 0-.74.018c-.594.033-.99.471-1.005 1.065a17 17 0 0 0 0 .834c.015.594.411 1.031 1.004 1.065a14 14 0 0 0 .993.016L10.5 13v3.014c-.635.013-1.109.034-1.456.055-.547.034-.986.37-1.026.917Q8 17.206 8 17.5t.018.514c.04.547.479.883 1.026.917.58.035 1.51.069 2.956.069s2.376-.034 2.956-.07c.547-.033.986-.37 1.026-.916A7 7 0 0 0 16 17.5a7 7 0 0 0-.018-.514c-.04-.547-.479-.883-1.026-.917a37 37 0 0 0-1.456-.055V13c0-1.152-.028-1.93-.06-2.443" clipRule="evenodd" className="fill-current stroke-transparent" />
  </svg>
);

const LogoutIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-4 min-w-4">
    <path fillRule="evenodd" d="M7.307 13.454c-.529.024-1.13.046-1.79.063a39 39 0 0 1-.1 1.868c-.049.616-.642.933-1.154.587a18 18 0 0 1-1.889-1.498C1.44 13.64.866 12.933.521 12.424c-.361-.534-.361-1.2 0-1.733.344-.51.92-1.217 1.853-2.05.79-.705 1.42-1.181 1.889-1.498.512-.346 1.105-.03 1.155.587.037.466.074 1.082.098 1.869 1.425.036 2.57.098 3.314.147.584.038 1.075.432 1.132 1.015q.036.34.038.797-.002.456-.038.797c-.04.414-.3.733-.658.897a1.4 1.4 0 0 1-.474.118c-.4.026-.913.056-1.523.084m2.156 4.579a91 91 0 0 1-.13-3.223 3 3 0 0 1-.405.057 78 78 0 0 1-1.592.087c.033 1.32.082 2.38.131 3.198.105 1.743 1.408 3.163 3.192 3.315a55 55 0 0 0 4.005.177c.185.787.845 1.39 1.671 1.342 1.95-.112 3.897-.868 5.48-1.913a3.4 3.4 0 0 0 .738-.528l.06-.047c.299-.235.517-.548.65-.897a3.6 3.6 0 0 0 .395-1.448c.088-1.46.174-3.69.174-6.8 0-3.671-.12-6.117-.221-7.517-.094-1.31-1.076-2.383-2.418-2.526-1.15-.123-2.991-.252-5.63-.252-2.141 0-3.757.085-4.904.182-1.784.152-3.087 1.572-3.192 3.315a96 96 0 0 0-.14 3.607c.642.028 1.182.06 1.6.087q.2.014.397.055c.032-1.535.086-2.736.14-3.63.047-.796.614-1.377 1.364-1.44 1.088-.093 2.647-.176 4.735-.176q1.146 0 2.083.03c-.79.386-1.527.851-2.176 1.362-.48.378-.751.952-.801 1.56a97 97 0 0 0-.165 13.632 53 53 0 0 1-3.676-.168c-.75-.064-1.317-.645-1.365-1.441m8.59-6.152a1 1 0 1 0-2 0v2.044a1 1 0 1 0 2 0z" clipRule="evenodd" className="fill-current stroke-transparent" />
  </svg>
);

const ExternalLinkIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="ml-auto size-4">
    <path fillRule="evenodd" d="M21.095 7.895c.95.869 2.178.398 2.281-.885.041-.517.079-1.126.106-1.84.062-1.63-.045-2.695-.165-3.35A1.39 1.39 0 0 0 22.18.683c-.655-.12-1.72-.227-3.35-.165-.713.027-1.322.065-1.839.106-1.283.103-1.755 1.331-.886 2.282q.454.497 1.088 1.157a580 580 0 0 0-6.714 6.874c-.474.495-.671 1.217-.27 1.772.29.401.67.783 1.071 1.074.56.407 1.29.205 1.786-.278 1.275-1.243 3.929-3.835 6.85-6.719.45.434.84.8 1.18 1.11M11 2.5c-2.785 0-4.85.091-6.28.191A4.305 4.305 0 0 0 .69 6.72C.591 8.15.5 10.215.5 13s.091 4.85.191 6.28a4.305 4.305 0 0 0 4.029 4.028c1.43.1 3.495.192 6.28.192s4.85-.091 6.28-.192a4.305 4.305 0 0 0 4.028-4.028c.1-1.43.192-3.495.192-6.28q0-.904-.012-1.71a1.5 1.5 0 0 0-3 .044q.012.783.012 1.666c0 2.72-.09 4.715-.184 6.07a1.306 1.306 0 0 1-1.246 1.246c-1.355.095-3.35.184-6.07.184s-4.715-.09-6.07-.184a1.306 1.306 0 0 1-1.246-1.246C3.59 17.715 3.5 15.72 3.5 13s.09-4.715.184-6.07A1.306 1.306 0 0 1 4.93 5.684C6.285 5.59 8.28 5.5 11 5.5q.883 0 1.666.012a1.5 1.5 0 0 0 .043-3Q11.905 2.5 11 2.5" clipRule="evenodd" className="fill-current stroke-transparent" />
  </svg>
);

const ChevronRightIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="ml-auto size-2 min-w-2 sm:hidden text-[var(--color-foreground-primary)]">
    <path fillRule="evenodd" d="M4.292 12c0-5.102.22-8.225.41-9.978.08-.718.488-1.307 1.087-1.596.6-.29 1.317-.242 1.927.153 1.175.759 3.026 2.063 5.732 4.244 3.148 2.537 4.837 4.418 5.707 5.563a2.63 2.63 0 0 1 0 3.228c-.87 1.145-2.56 3.025-5.707 5.562-2.706 2.182-4.558 3.487-5.732 4.246-.61.394-1.327.442-1.927.152s-1.008-.878-1.086-1.596c-.191-1.753-.411-4.876-.411-9.978" clipRule="evenodd" className="fill-current stroke-transparent" />
  </svg>
);

const BackArrowIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-3">
    <path fillRule="evenodd" d="M10.483 11.82c-.089.1-.089.25 0 .35.662.744 3.358 3.775 6.782 7.58.524.583.835 1.368.482 2.068a4 4 0 0 1-.724 1.001 3.9 3.9 0 0 1-1.125.813c-.608.285-1.285.06-1.814-.353-3.684-2.883-7.321-7.016-9.296-9.397a2.94 2.94 0 0 1 0-3.775C6.762 7.725 10.4 3.593 14.085.718c.527-.411 1.202-.634 1.809-.351.34.159.733.412 1.128.815.337.345.567.69.723 1 .354.7.044 1.486-.482 2.07-3.422 3.802-6.119 6.825-6.78 7.567" clipRule="evenodd" className="fill-current stroke-transparent" />
  </svg>
);

/* ── Nav Items Config ── */
const NAV_ITEMS = [
  { to: '/account/profile', label: 'account.profile', icon: ProfileIcon },
  { to: '/account/details', label: 'account.details', icon: AccountDetailsIcon },
  { to: '/account/preferences', label: 'account.preferences', icon: PreferencesIcon },
  { to: '/account/security', label: 'account.security', icon: SecurityIcon },
  { to: '/account/verification', label: 'account.verification', icon: VerificationIcon },
  { to: '/account/transactions', label: 'account.transactions', icon: TransactionsIcon },
];

/* ── Account Sidebar Nav Link ── */
function AccountNavLink({ to, icon, label, t }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-40 flex cursor-pointer items-center gap-3 sm:gap-2.5 px-[18px] py-4 sm:py-3 font-semibold transition-all int-hover-scale ${
          isActive
            ? 'sm:bg-[var(--color-surface-selected-secondary)] sm:text-[var(--color-foreground-selected-secondary)]'
            : 'text-[var(--color-foreground-muted-3)] hover:bg-[var(--color-surface-1)] hover:text-[var(--color-foreground-primary)]'
        }`
      }
    >
      {icon}
      <span className="typ-label-medium max-sm:text-[var(--color-foreground-primary)]">{t(label)}</span>
      <div className="ml-auto flex items-center gap-4">
        {ChevronRightIcon}
      </div>
    </NavLink>
  );
}

/* ── Mobile Account Menu ── */
function MobileAccountMenu({ t, onLogout }) {
  return (
    <div className="flex flex-col items-start gap-6">
      {/* Title */}
      <h1 className="typ-display-small text-[var(--color-foreground-primary)] font-bold uppercase px-3 pb-6">
        {t('account.title')}
      </h1>

      {/* Main nav group */}
      <div className="rounded-32 bg-[var(--color-surface-1)] flex w-full flex-col p-3">
        {NAV_ITEMS.map((item) => (
          <AccountNavLink key={item.to} {...item} t={t} />
        ))}
      </div>

      {/* Support group */}
      <div className="rounded-32 bg-[var(--color-surface-1)] flex w-full flex-col p-3">
        <button
          onClick={() => {/* Open live support / Intercom */}}
          className="rounded-40 flex cursor-pointer items-center gap-3 px-[18px] py-4 font-semibold transition-all int-hover-scale text-[var(--color-foreground-muted-3)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-foreground-primary)]"
        >
          {LiveSupportIcon}
          <span className="typ-label-medium max-sm:text-[var(--color-foreground-primary)]">{t('account.liveSupport')}</span>
          {ExternalLinkIcon}
        </button>
        <a
          href="https://intercom.help/thrill/en"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-40 flex cursor-pointer items-center gap-3 px-[18px] py-4 font-semibold transition-all int-hover-scale text-[var(--color-foreground-muted-3)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-foreground-primary)]"
        >
          {HelpCenterIcon}
          <span className="typ-label-medium max-sm:text-[var(--color-foreground-primary)]">{t('account.helpCenter')}</span>
          {ExternalLinkIcon}
        </a>
      </div>

      {/* Logout group */}
      <div className="rounded-32 bg-[var(--color-surface-1)] flex w-full flex-col p-3 py-1">
        <button
          onClick={onLogout}
          className="rounded-40 flex cursor-pointer items-center gap-3 px-[18px] py-4 font-semibold transition-all int-hover-scale text-[var(--color-negative)] hover:bg-[color-mix(in_oklab,var(--color-negative)_8%,transparent)]"
        >
          {LogoutIcon}
          <span className="typ-label-medium">{t('account.logout')}</span>
          <div className="ml-auto flex items-center gap-4">
            {ChevronRightIcon}
          </div>
        </button>
      </div>
    </div>
  );
}

/* ── Desktop Sidebar ── */
function DesktopSidebar({ t, onLogout }) {
  return (
    <div className="hidden sm:block">
      <div className="typ-label-medium font-regular text-[var(--color-foreground-muted-3)] normal-case px-[18px] pt-6 pb-[18px]">
        {t('account.title')}
      </div>
      <nav className="flex w-full flex-col gap-2.5 sm:min-w-[200px]" aria-label="Account navigation">
        {/* Main nav group */}
        <div className="flex w-full flex-col gap-2.5 border-b border-[var(--color-surface-5)] mb-8 pb-8">
          {NAV_ITEMS.map((item) => (
            <AccountNavLink key={item.to} {...item} t={t} />
          ))}
        </div>

        {/* Support group */}
        <div className="flex w-full flex-col gap-2.5 border-b border-[var(--color-surface-5)] mb-8 pb-8">
          <button
            onClick={() => {/* Open live support */}}
            className="rounded-40 flex cursor-pointer items-center gap-2.5 px-[18px] py-3 font-semibold transition-all int-hover-scale text-[var(--color-foreground-muted-3)] hover:bg-[var(--color-surface-1)] hover:text-[var(--color-foreground-primary)]"
          >
            {LiveSupportIcon}
            <span className="typ-label-medium">{t('account.liveSupport')}</span>
            {ExternalLinkIcon}
          </button>
          <a
            href="https://intercom.help/thrill/en"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-40 flex cursor-pointer items-center gap-2.5 px-[18px] py-3 font-semibold transition-all int-hover-scale text-[var(--color-foreground-muted-3)] hover:bg-[var(--color-surface-1)] hover:text-[var(--color-foreground-primary)]"
          >
            {HelpCenterIcon}
            <span className="typ-label-medium">{t('account.helpCenter')}</span>
            {ExternalLinkIcon}
          </a>
        </div>

        {/* Logout */}
        <div className="flex w-full flex-col gap-2.5">
          <button
            onClick={onLogout}
            className="rounded-40 flex cursor-pointer items-center gap-2.5 px-[18px] py-3 font-semibold transition-all int-hover-scale text-[var(--color-negative)] hover:bg-[color-mix(in_oklab,var(--color-negative)_8%,transparent)]"
          >
            {LogoutIcon}
            <span className="typ-label-medium">{t('account.logout')}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

/* ── Mobile Sub-page Header (back button + title) ── */
function MobileSubpageHeader({ title, onBack }) {
  return (
    <nav className="flex w-full text-[var(--color-control-primary-foreground-active)] items-center gap-4 sm:hidden">
      <button
        className="focusable int-hover-scale-plus flex cursor-pointer items-center transition-all duration-300"
        aria-label="Back to Account Menu"
        onClick={onBack}
      >
        <div className="rounded-xl flex items-center justify-center border-none p-3 transition-[background-color] duration-150 bg-[var(--color-control-primary)] hover:bg-[var(--color-control-primary-active)]">
          {BackArrowIcon}
        </div>
      </button>
      <div className="flex min-w-0 items-center gap-3">
        <h1 className="typ-display-xsmall min-w-0 truncate font-bold uppercase text-[var(--color-control-primary-foreground-active)]">
          {title}
        </h1>
      </div>
    </nav>
  );
}

/* ── Get page title from pathname ── */
function getPageTitle(pathname, t) {
  const segment = pathname.split('/').pop();
  const keyMap = {
    profile: 'account.profile',
    details: 'account.details',
    preferences: 'account.preferences',
    security: 'account.security',
    verification: 'account.verification',
    transactions: 'account.transactions',
  };
  return t(keyMap[segment] || 'account.profile');
}

/* ── Main Account Layout ── */
export function AccountLayout() {
  const { t } = useTranslation();
  const { isMobile } = useScreenSize();
  const navigate = useNavigate();
  const location = useLocation();

  const isOnSubpage = location.pathname !== '/account';
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    const socket = getSocket();
    if (socket) {
      socket.emit(C.LOGOUT_USER);
    }
    Cookies.remove('token');
    Cookies.remove('uid');
    Cookies.remove('session');
    Cookies.remove('auth');
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  const logoutModal = (
    <Dialog.Root open={showLogoutModal} onOpenChange={(v) => !v && setShowLogoutModal(false)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-index-drawer-portal)] bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[var(--z-index-drawer-portal)] w-[min(380px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-lg)] bg-[var(--color-surface-1)] border border-[var(--color-border)] p-5 shadow-xl outline-none">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold text-[var(--color-foreground-primary)]">
              {t('account.signingOut')}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-full text-[var(--color-foreground-muted-1)] hover:bg-[var(--color-control-primary)] hover:text-[var(--color-foreground-primary)]"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </Dialog.Close>
          </div>
          <p className="text-sm text-[var(--color-foreground-muted-1)] mb-6">
            {t('account.logoutMessage')}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold bg-[var(--color-control-primary)] text-[var(--color-foreground-primary)] hover:bg-[var(--color-control-primary-active)] transition-colors cursor-pointer"
              onClick={() => setShowLogoutModal(false)}
            >
              {t('account.cancel')}
            </button>
            <button
              type="button"
              className="flex-1 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold bg-[var(--color-button-primary)] text-[var(--color-button-primary-foreground)] hover:opacity-90 transition-opacity cursor-pointer"
              onClick={handleLogoutConfirm}
            >
              {t('account.signOut')}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

  /* Mobile: show menu or sub-page */
  if (isMobile) {
    if (!isOnSubpage) {
      return (
        <>
          <div className="mx-auto w-full max-w-[var(--bl-content-max-width)] px-4 py-6">
            <MobileAccountMenu t={t} onLogout={handleLogoutClick} />
          </div>
          {logoutModal}
        </>
      );
    }

    return (
      <>
        <div className="mx-auto w-full max-w-[var(--bl-content-max-width)] px-4 py-6">
          <div className="flex w-full flex-col items-start gap-6">
            <MobileSubpageHeader
              title={getPageTitle(location.pathname, t)}
              onBack={() => navigate('/account')}
            />
            <div className="w-full">
              <Outlet />
            </div>
          </div>
        </div>
        {logoutModal}
      </>
    );
  }

  /* Desktop/Tablet: sidebar + content side by side */
  return (
    <>
      <div className="mx-auto w-full  items-start gap-[48px] px-2 py-6 sm:mt-[48px] sm:flex sm:p-0">
        <DesktopSidebar t={t} onLogout={handleLogoutClick} />
        <main className="sm:rounded-40 sm:bg-[var(--color-background-secondary)] rounded-2xl sm:w-full sm:min-w-[calc(100%-248px)] sm:p-10">
          <div className="sm:size-full">
            <Outlet />
          </div>
        </main>
      </div>
      {logoutModal}
    </>
  );
}

export default AccountLayout;

