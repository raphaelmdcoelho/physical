export default function Logo({ big }: { big?: boolean }) {
  return (
    <div className={`logo ${big ? 'big' : ''}`}>
      <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" />
      <span>Physcal</span>
    </div>
  );
}
