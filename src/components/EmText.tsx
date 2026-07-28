/**
 * 标题内强调片段：把 text 中第一个 em 子串包上衬线斜体样式（.serif-em）。
 * em 为空或未命中时原样输出，保证任意文案都安全。
 */
export function EmText({
  text,
  em,
  emClassName = "serif-em",
}: {
  text: string;
  em?: string;
  emClassName?: string;
}) {
  if (!em) return <>{text}</>;
  const i = text.indexOf(em);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className={emClassName}>{em}</span>
      {text.slice(i + em.length)}
    </>
  );
}
