/* eslint-disable @next/next/no-img-element */
/** The KS roundel from /images/logo.png (black artwork on transparent). */
export default function LogoMark({ size = 40 }: { size?: number }) {
  return <img src="/images/logo.png" alt="" width={size} height={size} style={{ width: size, height: size }} />;
}
